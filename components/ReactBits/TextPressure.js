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

  minFontSize = 24
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);
  const spanRects = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

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
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  const calculateSpans = useCallback(() => {
    if (!titleRef.current) return;

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

    const defaultSettings = `'wght' ${weight ? 100 : 400}, 'wdth' ${width ? 100 : 100}, 'ital' 0`;

    const resetSpans = () => {
      spansRef.current.forEach((span) => {
        if (!span) return;
        if (span.style.fontVariationSettings !== defaultSettings) {
          span.style.fontVariationSettings = defaultSettings;
        }
        if (alpha && span.style.opacity !== '1') {
          span.style.opacity = '1';
        }
      });
    };

    const stopAnimation = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const animate = () => {
      rafId = null;

      if (!isVisibleRef.current || document.hidden) {
        resetSpans();
        return;
      }

      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.1;

      if (titleRef.current) {
        if (spanRects.current.length !== spansRef.current.length || spanRects.current.length === 0) {
          calculateSpans();
        }

        const titleWidth = titleRef.current.offsetWidth;
        const maxDist = titleWidth / 2;
        const maxDistSq = maxDist * maxDist;

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
            return;
          }

          const d = Math.sqrt(dSq);
          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

          if (item.elem.style.fontVariationSettings !== newFontVariationSettings) {
            item.elem.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && item.elem.style.opacity !== alphaVal) {
            item.elem.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const activatePointer = (x, y) => {
      cursorRef.current.x = x;
      cursorRef.current.y = y;
      startAnimation();
    };

    const handleMouseMove = e => activatePointer(e.clientX, e.clientY);
    const handleTouchMove = e => {
      const t = e.touches[0];
      if (t) activatePointer(t.clientX, t.clientY);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        resetSpans();
      } else if (isVisibleRef.current) {
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          calculateSpans();
          startAnimation();
        } else {
          stopAnimation();
          resetSpans();
        }
      },
      { rootMargin: '160px 0px', threshold: 0.01 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopAnimation();
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [width, weight, italic, alpha, calculateSpans]);

  const styleElement = useMemo(() => {
    const css = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontUrl}');
        font-style: normal;
      }

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
