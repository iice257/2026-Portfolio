// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { addPointerMoveListener, addTouchMoveListener } from '../../utils/pointerBus';

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

// ---------------------------------------------------------------------------
// Shared multi-instance scheduler.
//
// N TextPressure instances (hero renders two) share one pointer-bus
// subscription, one scroll/visibility/motion listener set and ONE rAF loop.
// All per-instance state lives in a "word" record and the per-word math is
// identical to the original single-instance implementation; only where and
// when it runs changed.
// ---------------------------------------------------------------------------

const registry = new Set();
let shared = null;

const scheduleSharedFrame = () => {
  if (shared.raf === null) {
    shared.raf = requestAnimationFrame(sharedTick);
  }
};

const sharedTick = (time) => {
  shared.raf = null;
  let anyWordWantsMore = false;
  registry.forEach((word) => {
    if (word.tick(time)) anyWordWantsMore = true;
  });
  if (anyWordWantsMore) scheduleSharedFrame();
};

const ensureShared = () => {
  if (shared) return;

  const state = {
    motionQuery: window.matchMedia('(prefers-reduced-motion: reduce)'),
    raf: null,
    scrollFrame: null,
  };
  shared = state;

  const handlePointer = (x, y) => {
    registry.forEach((word) => word.activate(x, y));
  };
  const unMove = addPointerMoveListener((event) => handlePointer(event.clientX, event.clientY));
  const unTouch = addTouchMoveListener((event) => {
    const touch = event.touches[0];
    if (touch) handlePointer(touch.clientX, touch.clientY);
  });
  const handleLockedPointer = (event) => {
    const { x, y } = event.detail || {};
    if (Number.isFinite(x) && Number.isFinite(y)) handlePointer(x, y);
  };
  window.addEventListener('portfolio:hero-locked-pointer', handleLockedPointer);

  const handleScroll = () => {
    if (state.scrollFrame !== null) return;
    state.scrollFrame = requestAnimationFrame(() => {
      state.scrollFrame = null;
      registry.forEach((word) => word.checkViewportVisibility());
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  const handleVisibilityChange = () => {
    registry.forEach((word) => word.onVisibilityChange());
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const handleMotionPreferenceChange = () => {
    registry.forEach((word) => word.onMotionPreferenceChange(state.motionQuery.matches));
  };
  state.motionQuery.addEventListener('change', handleMotionPreferenceChange);

  state.dispose = () => {
    unMove();
    unTouch();
    window.removeEventListener('portfolio:hero-locked-pointer', handleLockedPointer);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    state.motionQuery.removeEventListener('change', handleMotionPreferenceChange);
    if (state.raf !== null) {
      cancelAnimationFrame(state.raf);
      state.raf = null;
    }
    if (state.scrollFrame !== null) {
      cancelAnimationFrame(state.scrollFrame);
      state.scrollFrame = null;
    }
  };
};

const registerWord = (word) => {
  ensureShared();
  registry.add(word);
};

const unregisterWord = (word) => {
  registry.delete(word);
  if (registry.size === 0 && shared) {
    shared.dispose();
    shared = null;
  }
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
  targetFps = 60,
  paused = false
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
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

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
    const minFrameDuration = targetFps > 0 ? 1000 / targetFps : 0;
    const defaultSettings = `'wght' ${weight ? baseWeight : 400}, 'wdth' ${width ? 100 : 100}, 'ital' 0`;

    let lastFrameTime = 0;
    let lastRenderedTime = 0;
    let settledFrames = 0;

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

    const word = {
      // Returns true when the word wants another frame (shared loop keeps going).
      tick(time) {
        if (!isVisibleRef.current || document.hidden || shared.motionQuery.matches || pausedRef.current) {
          lastFrameTime = 0;
          lastRenderedTime = 0;
          return false;
        }

        if (minFrameDuration > 0 && lastRenderedTime && time - lastRenderedTime < minFrameDuration) {
          return true;
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
          return true;
        }
        lastFrameTime = 0;
        lastRenderedTime = 0;
        return false;
      },

      activate(x, y) {
        if (!isVisibleRef.current || document.hidden || shared.motionQuery.matches || pausedRef.current) return;

        cursorRef.current.x = x;
        cursorRef.current.y = y;
        settledFrames = 0;
        scheduleSharedFrame();
      },

      onVisibilityChange() {
        if (document.hidden) {
          lastFrameTime = 0;
          lastRenderedTime = 0;
        } else if (isVisibleRef.current) {
          scheduleSharedFrame();
        }
      },

      onMotionPreferenceChange(reduced) {
        if (reduced) {
          lastFrameTime = 0;
          lastRenderedTime = 0;
          resetSpans();
        } else if (isVisibleRef.current && !document.hidden) {
          scheduleSharedFrame();
        }
      },

      setVisible(nextVisible) {
        if (nextVisible) {
          isVisibleRef.current = true;
          settledFrames = 0;
          calculateSpans();
          scheduleSharedFrame();
          return;
        }
        if (!isVisibleRef.current) return;
        isVisibleRef.current = false;
      },

      checkViewportVisibility() {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const margin = 160;
        word.setVisible(rect.bottom >= -margin && rect.top <= window.innerHeight + margin);
      },
    };

    if (containerRef.current) {
      const { left, top, width: rectWidth, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + rectWidth / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    registerWord(word);

    const observer = new IntersectionObserver(
      ([entry]) => {
        word.setVisible(entry.isIntersecting);
      },
      { rootMargin: '160px 0px', threshold: 0.01 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    word.checkViewportVisibility();

    return () => {
      if (frameVisibilityRef.current !== null) {
        window.cancelAnimationFrame(frameVisibilityRef.current);
        frameVisibilityRef.current = null;
      }
      observer.disconnect();
      unregisterWord(word);
      lastFrameTime = 0;
      lastRenderedTime = 0;
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

      .text-pressure-title.flex {
        display: flex;
        justify-content: space-between;
      }

      .text-pressure-title.stroke span {
        position: relative;
        color: ${textColor};
      }
      .text-pressure-title.stroke span::after {
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
