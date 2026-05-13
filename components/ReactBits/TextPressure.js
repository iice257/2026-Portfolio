// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

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
  // Cache for span positions
  const spanRects = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

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

  // Calculate span positions outside loop
  const calculateSpans = useCallback(() => {
    if (!titleRef.current) return;

    // Get title rect
    const titleRect = titleRef.current.getBoundingClientRect();

    // Get all span rects and store them relative to viewport (or just raw)
    // Since we only need centers for distance, just store centers.
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

  // Recalculate on resize or when width/height/content changes (debounced by setSize)
  useEffect(() => {
    // We hook into setSize's effect or add a new one. 
    // setSize runs on resize. We should also run calculateSpans there, but after layout settles.
    // simpler: call calculateSpans in the animation loop ONLY if a flag is set? No.
    // Just run it periodically or on resize.

    const handleResize = debounce(() => {
      calculateSpans();
    }, 100);

    window.addEventListener('resize', handleResize);
    // Initial calc
    setTimeout(calculateSpans, 100); // delay to allow layout

    return () => window.removeEventListener('resize', handleResize);
  }, [calculateSpans, fontSize, scaleY]); // Re-run if font/scale changes

  useEffect(() => {
    let rafId;
    const animate = () => {
      // Improved smoothing (lerp factor 0.1)
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.1;

      if (titleRef.current) {
        // Double check cache
        if (spanRects.current.length !== spansRef.current.length || spanRects.current.length === 0) {
          calculateSpans();
        }

        const titleRect = titleRef.current.getBoundingClientRect(); // Still needed for container relative check
        const maxDist = titleRect.width / 2;
        // Check if mouse is hovering the title container to add extra weight
        const isHovering =
          mouseRef.current.x >= titleRect.left &&
          mouseRef.current.x <= titleRect.right &&
          mouseRef.current.y >= titleRect.top &&
          mouseRef.current.y <= titleRect.bottom;

        spanRects.current.forEach(item => {
          if (!item || !item.elem) return;

          // Squared distance check (faster than sqrt)
          const dx = mouseRef.current.x - item.x;
          const dy = mouseRef.current.y - item.y;
          const dSq = dx * dx + dy * dy;
          const maxDistSq = maxDist * maxDist;

          // Optimization: If distance squared is too large, reset to default and skip calculation
          // Using 1.5x maxDist for cutoff
          if (dSq > maxDistSq * 2.25) {
            const defaultSettings = `'wght' ${weight ? 100 : 400}, 'wdth' ${width ? 100 : 100}, 'ital' 0`;
            if (item.elem.style.fontVariationSettings !== defaultSettings) {
              item.elem.style.fontVariationSettings = defaultSettings;
              if (alpha) item.elem.style.opacity = '1';
            }
            return;
          }

          // Compute actual distance only if needed for getAttr logic which likely expects linear distance
          // We can optimize getAttr too or just sqrt here since we filtered most points.
          const d = Math.sqrt(dSq);

          // Original logic: width changes with distance
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

    animate();
    return () => cancelAnimationFrame(rafId);
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
