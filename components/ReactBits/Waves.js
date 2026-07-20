import { useEffect, useRef } from "react";

class Grad {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dot2(x, y) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ];
    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
      247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
      57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
      74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229,
      122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102,
      143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89,
      18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198,
      173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118,
      126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
      28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221,
      153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110,
      79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
      242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235,
      249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84,
      204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222,
      114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed) {
    let seeded = seed;
    if (seeded > 0 && seeded < 1) seeded *= 65536;
    seeded = Math.floor(seeded);
    if (seeded < 256) seeded |= seeded << 8;

    for (let i = 0; i < 256; i += 1) {
      const value = i & 1 ? this.p[i] ^ (seeded & 255) : this.p[i] ^ ((seeded >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = value;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[value % 12];
    }
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  perlin2(x, y) {
    let xIndex = Math.floor(x);
    let yIndex = Math.floor(y);
    let xValue = x - xIndex;
    let yValue = y - yIndex;
    xIndex &= 255;
    yIndex &= 255;

    const n00 = this.gradP[xIndex + this.perm[yIndex]].dot2(xValue, yValue);
    const n01 = this.gradP[xIndex + this.perm[yIndex + 1]].dot2(xValue, yValue - 1);
    const n10 = this.gradP[xIndex + 1 + this.perm[yIndex]].dot2(xValue - 1, yValue);
    const n11 = this.gradP[xIndex + 1 + this.perm[yIndex + 1]].dot2(xValue - 1, yValue - 1);
    const u = this.fade(xValue);

    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(yValue));
  }
}

export default function Waves({
  lineColor = "black",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  lineWidth = 1,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  pixelRatio = 0.55,
  targetFps = 24,
  maxPixelCount = 520000,
  paused = false,
  mouseInteraction = true,
  style = {},
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const boundingRef = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const noiseRef = useRef(new Noise(Math.random()));
  const linesRef = useRef([]);
  const mouseRef = useRef({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const configRef = useRef({
    lineColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
    lineWidth,
  });
  const frameIdRef = useRef(null);
  const resizeFrameRef = useRef(null);
  const pausedRef = useRef(paused);
  const resumeRef = useRef(() => {});
  const stopRef = useRef(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      stopRef.current();
    } else if (document.visibilityState !== "hidden") {
      resumeRef.current();
    }
  }, [paused]);

  useEffect(() => {
    configRef.current = {
      lineColor,
      waveSpeedX,
      waveSpeedY,
      waveAmpX,
      waveAmpY,
      friction,
      tension,
      maxCursorMove,
      xGap,
      yGap,
      lineWidth,
    };
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove, xGap, yGap, lineWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    ctxRef.current = canvas.getContext("2d");

    function setSize() {
      boundingRef.current = container.getBoundingClientRect();
      const width = Math.max(1, boundingRef.current.width);
      const height = Math.max(1, boundingRef.current.height);
      const requestedScale = Math.max(0.3, Math.min(pixelRatio, window.devicePixelRatio || 1));
      const pixelBudgetScale = Math.sqrt(maxPixelCount / (width * height));
      const scale = Math.min(requestedScale, Number.isFinite(pixelBudgetScale) ? pixelBudgetScale : requestedScale);

      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctxRef.current?.setTransform(scale, 0, 0, scale, 0, 0);
    }

    function setLines() {
      const { width, height } = boundingRef.current;
      linesRef.current = [];
      const outerWidth = width + 200;
      const outerHeight = height + 30;
      const { xGap: lineXGap, yGap: lineYGap } = configRef.current;
      const totalLines = Math.ceil(outerWidth / lineXGap);
      const totalPoints = Math.ceil(outerHeight / lineYGap);
      const xStart = (width - lineXGap * totalLines) / 2;
      const yStart = (height - lineYGap * totalPoints) / 2;

      for (let i = 0; i <= totalLines; i += 1) {
        const points = [];
        for (let j = 0; j <= totalPoints; j += 1) {
          points.push({
            x: xStart + lineXGap * i,
            y: yStart + lineYGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        linesRef.current.push(points);
      }
    }

    function movePoints(time) {
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const noise = noiseRef.current;
      const {
        waveSpeedX: speedX,
        waveSpeedY: speedY,
        waveAmpX: ampX,
        waveAmpY: ampY,
        friction: physicsFriction,
        tension: physicsTension,
        maxCursorMove: maxMove,
      } = configRef.current;

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const points = lines[lineIndex];
        for (let pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
          const point = points[pointIndex];
          const move = noise.perlin2((point.x + time * speedX) * 0.002, (point.y + time * speedY) * 0.0015) * 12;
          point.wave.x = Math.cos(move) * ampX;
          point.wave.y = Math.sin(move) * ampY;

          if (mouseInteraction) {
            const dx = point.x - mouse.sx;
            const dy = point.y - mouse.sy;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(175, mouse.vs);

            if (distance < influence) {
              const strength = 1 - distance / influence;
              const force = Math.cos(distance * 0.001) * strength;
              point.cursor.vx += Math.cos(mouse.a) * force * influence * mouse.vs * 0.00065;
              point.cursor.vy += Math.sin(mouse.a) * force * influence * mouse.vs * 0.00065;
            }
          }

          if (mouseInteraction) {
            point.cursor.vx += (0 - point.cursor.x) * physicsTension;
            point.cursor.vy += (0 - point.cursor.y) * physicsTension;
            point.cursor.vx *= physicsFriction;
            point.cursor.vy *= physicsFriction;
            point.cursor.x += point.cursor.vx * 2;
            point.cursor.y += point.cursor.vy * 2;
            point.cursor.x = Math.min(maxMove, Math.max(-maxMove, point.cursor.x));
            point.cursor.y = Math.min(maxMove, Math.max(-maxMove, point.cursor.y));
          }
        }
      }
    }

    function drawLines() {
      const { width, height } = boundingRef.current;
      const ctx = ctxRef.current;
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = configRef.current.lineColor;
      ctx.lineWidth = configRef.current.lineWidth;

      const lines = linesRef.current;
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const points = lines[lineIndex];
        const firstPoint = points[0];
        ctx.moveTo(
          Math.round((firstPoint.x + firstPoint.wave.x) * 10) / 10,
          Math.round((firstPoint.y + firstPoint.wave.y) * 10) / 10
        );

        for (let index = 0; index < points.length; index += 1) {
          const sourcePoint = points[index];
          const isLast = index === points.length - 1;
          const cursorX = !isLast && mouseInteraction ? sourcePoint.cursor.x : 0;
          const cursorY = !isLast && mouseInteraction ? sourcePoint.cursor.y : 0;
          const x = Math.round((sourcePoint.x + sourcePoint.wave.x + cursorX) * 10) / 10;
          const y = Math.round((sourcePoint.y + sourcePoint.wave.y + cursorY) * 10) / 10;
          ctx.lineTo(x, y);
          if (isLast) ctx.moveTo(x, y);
        }
      }

      ctx.stroke();
    }

    let lastFrameTime = 0;

    function stopLoop() {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
      delete canvas.dataset.playgroundLoop;
    }

    function startLoop() {
      if (!frameIdRef.current && !pausedRef.current && document.visibilityState !== "hidden") {
        canvas.dataset.playgroundLoop = "active";
        frameIdRef.current = requestAnimationFrame(animate);
      }
    }

    function animate(time) {
      frameIdRef.current = null;

      if (pausedRef.current || document.visibilityState === "hidden") {
        return;
      }

      if (targetFps > 0 && time - lastFrameTime < 1000 / targetFps) {
        startLoop();
        return;
      }

      lastFrameTime = time;

      if (mouseInteraction) {
        const mouse = mouseRef.current;
        mouse.sx += (mouse.x - mouse.sx) * 0.1;
        mouse.sy += (mouse.y - mouse.sy) * 0.1;

        const dx = mouse.x - mouse.lx;
        const dy = mouse.y - mouse.ly;
        const velocity = Math.hypot(dx, dy);
        mouse.v = velocity;
        mouse.vs += (velocity - mouse.vs) * 0.1;
        mouse.vs = Math.min(100, mouse.vs);
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.a = Math.atan2(dy, dx);

        container.style.setProperty("--x", `${mouse.sx}px`);
        container.style.setProperty("--y", `${mouse.sy}px`);
      }

      movePoints(time);
      drawLines();
      startLoop();
    }

    function rebuild() {
      setSize();
      setLines();
    }

    function scheduleRebuild() {
      if (resizeFrameRef.current !== null) return;
      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        rebuild();
      });
    }

    function updatePointer(clientX, clientY) {
      if (pausedRef.current || document.visibilityState === "hidden") return;

      const mouse = mouseRef.current;
      const bounds = boundingRef.current;
      mouse.x = clientX - bounds.left;
      mouse.y = clientY - bounds.top;

      if (!mouse.set) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
        mouse.lx = mouse.x;
        mouse.ly = mouse.y;
        mouse.set = true;
      }
    }

    function handleMouseMove(event) {
      updatePointer(event.clientX, event.clientY);
    }

    function handleTouchMove(event) {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    }

    rebuild();
    if (!mouseInteraction) {
      mouseRef.current.x = -10000;
      mouseRef.current.y = -10000;
      mouseRef.current.sx = -10000;
      mouseRef.current.sy = -10000;
      mouseRef.current.lx = -10000;
      mouseRef.current.ly = -10000;
      mouseRef.current.set = true;
    }
    resumeRef.current = startLoop;
    stopRef.current = stopLoop;
    startLoop();
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleRebuild);
    resizeObserver?.observe(container);
    window.addEventListener("resize", scheduleRebuild);
    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        stopLoop();
      } else {
        startLoop();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleRebuild);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
      }
      stopLoop();
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
        resizeFrameRef.current = null;
      }
      resumeRef.current = () => {};
      stopRef.current = () => {};
    };
  }, [pixelRatio, targetFps, maxPixelCount, mouseInteraction]);

  return (
    <div
      ref={containerRef}
      className={`waves ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor,
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="waves-canvas" />
    </div>
  );
}
