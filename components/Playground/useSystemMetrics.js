import { useEffect, useRef, useState } from "react";

const initialMetrics = {
  fps: 0,
  averageFps: 0,
  frameTime: 0,
  dpr: 1,
  reducedMotion: false,
  loopCount: 0,
  webglCount: 0,
};

export default function useSystemMetrics(activeRenderer) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const samplesRef = useRef([]);

  useEffect(() => {
    let animationFrame = 0;
    let previous = performance.now();
    let elapsed = 0;
    let frames = 0;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = (now) => {
      const delta = Math.max(0.1, now - previous);
      previous = now;
      elapsed += delta;
      frames += 1;

      if (elapsed >= 500) {
        const fps = (frames * 1000) / elapsed;
        const samples = [...samplesRef.current, fps].slice(-16);
        samplesRef.current = samples;
        const averageFps = samples.reduce((sum, sample) => sum + sample, 0) / samples.length;

        setMetrics({
          fps,
          averageFps,
          frameTime: 1000 / Math.max(1, fps),
          dpr: window.devicePixelRatio || 1,
          reducedMotion: motionQuery.matches,
          loopCount: document.querySelectorAll('[data-playground-loop="active"]').length + 1,
          webglCount: document.querySelectorAll("canvas[data-playground-webgl]").length,
        });
        frames = 0;
        elapsed = 0;
      }

      animationFrame = window.requestAnimationFrame(measure);
    };

    const handleMotionChange = () => {
      setMetrics((current) => ({ ...current, reducedMotion: motionQuery.matches }));
    };

    motionQuery.addEventListener("change", handleMotionChange);
    animationFrame = window.requestAnimationFrame(measure);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [activeRenderer]);

  return metrics;
}
