import { useEffect, useRef } from "react";
import {
  layoutNextLineRange,
  materializeLineRange,
  prepareWithSegments,
} from "@chenglou/pretext";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function useCanvasSurface(drawFactory, dependencies) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;

    let cleanupDraw = () => {};
    let resizeFrame = 0;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      cleanupDraw();
      cleanupDraw = drawFactory(canvas, rect, dpr) || (() => {});
    };
    const scheduleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    };
    const observer = new ResizeObserver(scheduleResize);
    observer.observe(host);
    resize();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
      cleanupDraw();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return canvasRef;
}

const PRESSURE_COPY = "Creative Engineer. Interfaces That Respond. Type, Motion and Systems. Frontend Interactions shaped by attention, constraint and play. Kingsley Aremu builds responsive visual systems where every movement leaves a trace.";

export function PressureField({ paused, params, reducedMotion, quality, theme }) {
  const pointerRef = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });
  const canvasRef = useCanvasSurface((canvas, rect, dpr) => {
    const context = canvas.getContext("2d");
    const fontSize = clamp(rect.width / 24, 25, 54);
    const lineHeight = fontSize * 1.08;
    const font = `400 ${fontSize}px Inter, sans-serif`;
    const prepared = prepareWithSegments(PRESSURE_COPY, font, { letterSpacing: -1.2 });
    let animationFrame = 0;
    let last = 0;

    const setPointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointerRef.current.tx = event.clientX - bounds.left;
      pointerRef.current.ty = event.clientY - bounds.top;
    };
    const clearPointer = () => {
      pointerRef.current.tx = rect.width * 0.52;
      pointerRef.current.ty = rect.height * 0.5;
    };

    const render = (time) => {
      animationFrame = 0;
      if (document.hidden || paused) return;
      const interval = quality === "low" ? 50 : 25;
      if (time - last < interval) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      last = time;
      const pointer = pointerRef.current;
      const recovery = reducedMotion ? 1 : params.recovery;
      pointer.x += (pointer.tx - pointer.x) * recovery;
      pointer.y += (pointer.ty - pointer.y) * recovery;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.font = font;
      context.textBaseline = "alphabetic";
      const channel = theme === "dark" ? 255 : 18;
      context.fillStyle = `rgba(${channel},${channel},${channel},.88)`;
      context.strokeStyle = `rgba(${channel},${channel},${channel},.22)`;
      context.lineWidth = 1;

      const pad = clamp(rect.width * 0.055, 24, 78);
      const radius = reducedMotion ? 0 : params.radius;
      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = Math.max(100, (rect.height - lineHeight * 6) / 2);
      let lineIndex = 0;
      while (y < rect.height - 48) {
        const vertical = Math.abs(pointer.y - y);
        const intersects = vertical < radius;
        const chord = intersects ? Math.sqrt(Math.max(0, radius * radius - vertical * vertical)) : 0;
        const modeStrength = params.mode === "compression" ? 1.18 : params.mode === "flow" ? 0.66 : 0.92;
        const indentation = chord * params.strength * modeStrength;
        const fromLeft = pointer.x < rect.width / 2;
        const left = pad + (fromLeft ? indentation : 0);
        const right = pad + (!fromLeft ? indentation : 0);
        const available = Math.max(120, rect.width - left - right);
        const range = layoutNextLineRange(prepared, cursor, available);
        if (!range) break;
        const line = materializeLineRange(prepared, range);
        const proximity = clamp(1 - vertical / Math.max(1, radius), 0, 1);
        const waveAmount = params.mode === "flow" ? 16 : params.mode === "compression" ? 3 : 9;
        const wave = reducedMotion ? 0 : Math.sin(time * 0.0015 + lineIndex * 0.85) * proximity * waveAmount;
        context.save();
        context.translate(left + wave * (fromLeft ? -1 : 1), y);
        const compression = params.mode === "compression" ? 0.16 : params.mode === "flow" ? 0.035 : 0.09;
        context.scale(1 - proximity * params.strength * compression, 1 + proximity * (params.mode === "elastic" ? 0.07 : 0.025));
        context.globalAlpha = 0.48 + (1 - proximity) * 0.4;
        context.fillText(line.text, 0, 0);
        context.restore();
        cursor = range.end;
        y += lineHeight;
        lineIndex += 1;
      }

      if (radius > 0) {
        context.setLineDash([3, 5]);
        context.beginPath();
        context.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);
        context.fillStyle = theme === "dark" ? "#fff" : "#111";
        context.beginPath();
        context.arc(pointer.x, pointer.y, 2.5, 0, Math.PI * 2);
        context.fill();
      }
      animationFrame = requestAnimationFrame(render);
    };
    const handleVisibility = () => {
      if (!document.hidden && !paused && !animationFrame) animationFrame = requestAnimationFrame(render);
    };

    pointerRef.current = { x: rect.width * 0.52, y: rect.height * 0.5, tx: rect.width * 0.52, ty: rect.height * 0.5 };
    canvas.addEventListener("pointermove", setPointer);
    canvas.addEventListener("pointerleave", clearPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    if (!paused) canvas.dataset.playgroundLoop = "active";
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("pointermove", setPointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      delete canvas.dataset.playgroundLoop;
    };
  }, [paused, params.radius, params.strength, params.recovery, params.mode, reducedMotion, quality, theme]);

  return <canvas ref={canvasRef} className="playground-canvas" aria-label="Multiline typography bends and reflows around pointer pressure." />;
}
