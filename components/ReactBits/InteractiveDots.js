import { useCallback, useEffect, useRef } from "react";

const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return { r: 102, g: 102, b: 102 };

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
};

const InteractiveDots = ({
  active = true,
  backgroundColor = "#050505",
  dotColor = "#f5f5f5",
  gridSpacing = 30,
  animationSpeed = 0.005,
  removeWaveLine = true,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const ripplesRef = useRef([]);
  const dotsRef = useRef([]);
  const colorRef = useRef(hexToRgb(dotColor));

  useEffect(() => {
    colorRef.current = hexToRgb(dotColor);
  }, [dotColor]);

  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    const dots = [];

    for (let x = gridSpacing / 2; x < width; x += gridSpacing) {
      for (let y = gridSpacing / 2; y < height; y += gridSpacing) {
        dots.push({
          x,
          y,
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    dotsRef.current = dots;
  }, [gridSpacing]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    initializeDots();
  }, [initializeDots]);

  const updatePointer = useCallback((event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom,
    };
  }, []);

  const addRipple = useCallback((event) => {
    updatePointer(event);
    if (!pointerRef.current.active) return;

    ripplesRef.current.push({
      x: pointerRef.current.x,
      y: pointerRef.current.y,
      time: performance.now(),
      intensity: 2,
    });
    ripplesRef.current = ripplesRef.current.slice(-6);
  }, [updatePointer]);

  const getPointerInfluence = (x, y) => {
    if (!pointerRef.current.active) return 0;

    const dx = x - pointerRef.current.x;
    const dy = y - pointerRef.current.y;
    const distance = Math.hypot(dx, dy);
    return Math.max(0, 1 - distance / 150);
  };

  const getRippleInfluence = (x, y, now) => {
    let influence = 0;

    ripplesRef.current.forEach((ripple) => {
      const age = now - ripple.time;
      const maxAge = 3000;
      if (age >= maxAge) return;

      const distance = Math.hypot(x - ripple.x, y - ripple.y);
      const radius = (age / maxAge) * 300;
      const width = 60;

      if (Math.abs(distance - radius) < width) {
        influence += (1 - age / maxAge) * ripple.intensity * (1 - Math.abs(distance - radius) / width);
      }
    });

    return Math.min(influence, 2);
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += animationSpeed;
    const now = performance.now();
    const { width, height } = canvas.getBoundingClientRect();
    const { r, g, b } = colorRef.current;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    ripplesRef.current = ripplesRef.current.filter((ripple) => now - ripple.time < 3000);

    dotsRef.current.forEach((dot) => {
      const influence = getPointerInfluence(dot.originalX, dot.originalY)
        + getRippleInfluence(dot.originalX, dot.originalY, now);
      const size = 1.7 + influence * 5.2 + Math.sin(timeRef.current + dot.phase) * 0.35;
      const opacity = Math.max(
        0.18,
        0.38 + influence * 0.36 + Math.abs(Math.sin(timeRef.current * 0.45 + dot.phase)) * 0.09
      );

      ctx.beginPath();
      ctx.arc(dot.originalX, dot.originalY, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.fill();
    });

    if (!removeWaveLine) {
      ripplesRef.current.forEach((ripple) => {
        const age = now - ripple.time;
        const progress = age / 3000;
        const alpha = (1 - progress) * 0.22 * ripple.intensity;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = 1.4;
        ctx.arc(ripple.x, ripple.y, progress * 300, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, [animationSpeed, backgroundColor, removeWaveLine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !active) return undefined;

    const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resizeCanvas();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerdown", addRipple, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    if (!shouldReduce) {
      animationFrameRef.current = window.requestAnimationFrame(animate);
    } else {
      const ctx = canvas.getContext("2d");
      const { width, height } = canvas.getBoundingClientRect();
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", addRipple);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      timeRef.current = 0;
      ripplesRef.current = [];
      dotsRef.current = [];
      pointerRef.current.active = false;
    };
  }, [active, addRipple, animate, backgroundColor, resizeCanvas, updatePointer]);

  return (
    <div ref={containerRef} className={`interactive-dots ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="interactive-dots__canvas" />
    </div>
  );
};

export default InteractiveDots;
