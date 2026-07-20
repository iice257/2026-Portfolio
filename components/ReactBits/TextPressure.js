// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  minFontSize = 24,
  baseWeight = 100,
  maxWeight = 900,
  maxStrokeWidth = 0,
  targetFps = 60
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const spanRects = useRef([]);
  const textMetricsRef = useRef({ maxDist: 1, maxDistSq: 1 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const frameVisibilityRef = useRef(null);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    const widthFontSize = containerW / (chars.length / 2);
    const heightFontSize = containerH > 0 ? containerH * 0.78 : widthFontSize;
    let newFontSize = Math.min(widthFontSize, heightFontSize);
    newFontSize = Math.max(newFontSize, Math.min(minFontSize, heightFontSize));

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    document.fonts?.ready?.then(debouncedSetSize).catch(() => {});
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  const calculateSpans = useCallback(() => {
    if (!titleRef.current) return;

    const titleWidth = titleRef.current.getBoundingClientRect().width;
    const maxDist = Math.max(1, titleWidth / 2);
    textMetricsRef.current = {
      maxDist,
      maxDistSq: maxDist * maxDist,
    };

    spanRects.current = spansRef.current.map(span => {
      if (!span) return null;
      const rect = span.getBoundingClientRect();
      return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        elem: span
      };
    });
  }, []);

  useEffect(() => {
    const handleResize = debounce(() => {
      calculateSpans();
    }, 100);

    window.addEventListener('resize', handleResize);
    const timer = window.setTimeout(calculateSpans, 100);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateSpans, fontSize, scaleY]);

  useEffect(() => {
    let rafId = null;
    let lastFrameTime = 0;
    let lastRenderedTime = 0;
    let settledFrames = 0;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const minFrameDuration = targetFps > 0 ? 1000 / targetFps : 0;

    const defaultSettings = `'wght' ${weight ? baseWeight : 400}, 'wdth' ${width ? 100 : 100}, 'ital' 0`;

    const resetSpans = () => {
      spansRef.current.forEach((span) => {
        if (!span) return;
        if (span.style.fontVariationSettings !== defaultSettings) {
          span.style.fontVariationSettings = defaultSettings;
        }
        if (alpha && span.style.opacity !== '1') {
          span.style.opacity = '1';
        }
        if (span.style.webkitTextStrokeWidth !== '0px') {
          span.style.webkitTextStrokeWidth = '0px';
        }
      });
    };

    const stopAnimation = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const animate = (time) => {
      rafId = null;

      if (!isVisibleRef.current || document.hidden || motionQuery.matches) {
        lastFrameTime = 0;
        lastRenderedTime = 0;
        return;
      }

      if (minFrameDuration > 0 && lastRenderedTime && time - lastRenderedTime < minFrameDuration) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const delta = lastFrameTime ? Math.min(48, time - lastFrameTime) : 16.67;
      lastFrameTime = time;
      lastRenderedTime = time;
      const ease = 1 - Math.pow(0.9, delta / 16.67);

      const remainingX = cursorRef.current.x - mouseRef.current.x;
      const remainingY = cursorRef.current.y - mouseRef.current.y;
      mouseRef.current.x += remainingX * ease;
      mouseRef.current.y += remainingY * ease;

      if (titleRef.current) {
        if (spanRects.current.length !== spansRef.current.length || spanRects.current.length === 0) {
          calculateSpans();
        }

        const { maxDist, maxDistSq } = textMetricsRef.current;

        spanRects.current.forEach(item => {
          if (!item || !item.elem) return;

          const dx = mouseRef.current.x - item.x;
          const dy = mouseRef.current.y - item.y;
          const dSq = dx * dx + dy * dy;

          if (dSq > maxDistSq * 2.25) {
            if (item.elem.style.fontVariationSettings !== defaultSettings) {
              item.elem.style.fontVariationSettings = defaultSettings;
              if (alpha) item.elem.style.opacity = '1';
            }
            if (item.elem.style.webkitTextStrokeWidth !== '0px') {
              item.elem.style.webkitTextStrokeWidth = '0px';
            }
            return;
          }

          const d = Math.sqrt(dSq);
          const pressure = Math.max(0, Math.min(1, 1 - d / maxDist));
          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight
            ? Math.max(baseWeight, Math.min(maxWeight, Math.floor(getAttr(d, maxDist, 100, maxWeight))))
            : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;
          const strokeWidth = `${(maxStrokeWidth * pressure).toFixed(3)}px`;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (item.elem.style.fontVariationSettings !== newFontVariationSettings) {
            item.elem.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && item.elem.style.opacity !== alphaVal) {
            item.elem.style.opacity = alphaVal;
          }
          if (item.elem.style.webkitTextStrokeWidth !== strokeWidth) {
            item.elem.style.webkitTextStrokeColor = 'currentColor';
            item.elem.style.webkitTextStrokeWidth = strokeWidth;
          }
        });
      }

      if (Math.abs(remainingX) < 0.15 && Math.abs(remainingY) < 0.15) {
        settledFrames += 1;
      } else {
        settledFrames = 0;
      }

      if (settledFrames < 3) {
        rafId = requestAnimationFrame(animate);
      } else {
        lastFrameTime = 0;
        lastRenderedTime = 0;
      }
    };

    const startAnimation = () => {
      if (rafId === null && isVisibleRef.current && !document.hidden && !motionQuery.matches) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const activatePointer = (x, y) => {
      if (!isVisibleRef.current || document.hidden || motionQuery.matches) return;

      cursorRef.current.x = x;
      cursorRef.current.y = y;
      settledFrames = 0;
      startAnimation();
    };

    const handleMouseMove = e => activatePointer(e.clientX, e.clientY);
    const handleTouchMove = e => {
      const t = e.touches[0];
      if (t) activatePointer(t.clientX, t.clientY);
    };
    const handleLockedPointer = (event) => {
      const { x, y } = event.detail || {};
      if (Number.isFinite(x) && Number.isFinite(y)) {
        activatePointer(x, y);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (isVisibleRef.current) {
        startAnimation();
      }
    };

    const handleMotionPreferenceChange = () => {
      if (motionQuery.matches) {
        stopAnimation();
        resetSpans();
      } else if (isVisibleRef.current && !document.hidden) {
        startAnimation();
      }
    };

    if (containerRef.current) {
      const { left, top, width: rectWidth, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + rectWidth / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    const setVisibleState = (nextVisible) => {
      if (nextVisible) {
        isVisibleRef.current = true;
        settledFrames = 0;
        calculateSpans();
        startAnimation();
        return;
      }

      if (!isVisibleRef.current) return;
      isVisibleRef.current = false;
      stopAnimation();
    };

    const checkViewportVisibility = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const margin = 160;
      setVisibleState(rect.bottom >= -margin && rect.top <= window.innerHeight + margin);
    };

    const handleScroll = () => {
      if (frameVisibilityRef.current !== null) return;
      frameVisibilityRef.current = window.requestAnimationFrame(() => {
        frameVisibilityRef.current = null;
        checkViewportVisibility();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibleState(entry.isIntersecting);
      },
      { rootMargin: '160px 0px', threshold: 0.01 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    checkViewportVisibility();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('portfolio:hero-locked-pointer', handleLockedPointer);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      stopAnimation();
      if (frameVisibilityRef.current !== null) {
        window.cancelAnimationFrame(frameVisibilityRef.current);
      }
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('portfolio:hero-locked-pointer', handleLockedPointer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, [width, weight, italic, alpha, baseWeight, maxWeight, maxStrokeWidth, targetFps, calculateSpans]);

  const styleElement = useMemo(() => {
    const css = `
      ${fontUrl ? `
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
          font-display: swap;
        }
      ` : ""}

      .flex {
        display: flex;
        justify-content: space-between;
      }

      .stroke span {
        position: relative;
        color: ${textColor};
      }
      .stroke span::after {
        content: attr(data-char);
        position: absolute;
        left: 0;
        top: 0;
        color: transparent;
        z-index: -1;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: ${strokeColor};
      }

      .text-pressure-title {
        color: ${textColor};
      }
    `;

    return (
      <style dangerouslySetInnerHTML={{ __html: css }} />
    );
  }, [fontFamily, fontUrl, textColor, strokeColor]);

  const dynamicClassName = [className, flex ? 'flex' : '', stroke ? 'stroke' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center center',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
