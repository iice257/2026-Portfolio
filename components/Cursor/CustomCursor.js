import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { gsap } from 'gsap';

const DEFAULT_CURSOR_PATH = "M5.5 3 C5.5 3 5.5 3 5.5 3 L11.5 26.5 C11.5 26.5 11.5 26.5 11.5 26.5 L16.2 17.8 C16.2 17.8 16.2 17.8 16.2 17.8 L25.5 17.8 C25.5 17.8 25.5 17.8 25.5 17.8 L5.5 3 Z";
const CLICKABLE_CURSOR_PATH = "M5.5 3 C5.95 3.3 6.2 3.45 6.55 3.72 L24.65 17.05 C25.65 17.8 25.2 18.55 23.95 18.55 L16.75 18.55 C16.2 18.55 15.9 18.8 15.65 19.25 L12.2 25.65 C11.65 26.65 10.95 26.35 10.65 25.15 L5.5 3 Z";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const outlinePathRef = useRef(null);
  const fillPathRef = useRef(null);
  const fillRectRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // Default hidden until mouse moves
  const [isClickable, setIsClickable] = useState(false);
  const isVisibleRef = useRef(false);
  const isClickableRef = useRef(false);
  const { cursorText, cursorVariant } = useCursor();

  // Use GSAP's quickSetter for performance
  const xSet = useRef(null);
  const ySet = useRef(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Setup quickSetters
    xSet.current = gsap.quickSetter(cursorRef.current, "x", "px");
    ySet.current = gsap.quickSetter(cursorRef.current, "y", "px");

    const onMouseMove = (e) => {
      // Ensure visible on movement
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      const clickableTarget = e.target?.closest?.(
        'a, button, [role="button"], input, textarea, select, summary, [data-clickable="true"]'
      );
      const nextClickable = Boolean(clickableTarget) && cursorVariant !== 'project';

      if (isClickableRef.current !== nextClickable) {
        isClickableRef.current = nextClickable;
        setIsClickable(nextClickable);
      }

      if (xSet.current && ySet.current) {
        xSet.current(e.clientX);
        ySet.current(e.clientY);
      }
      if (textRef.current) {
        gsap.set(textRef.current, { x: e.clientX, y: e.clientY });
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      isClickableRef.current = false;
      setIsVisible(false);
      setIsClickable(false);
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave); // document leave covers window exit mostly
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [cursorVariant]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return;

    const targetPath = isClickable ? CLICKABLE_CURSOR_PATH : DEFAULT_CURSOR_PATH;

    gsap.to([outlinePathRef.current, fillPathRef.current], {
      attr: { d: targetPath },
      duration: 0.34,
      ease: "power3.out",
    });

    gsap.to(fillRectRef.current, {
      attr: {
        y: isClickable ? 0 : 32,
        height: isClickable ? 32 : 0,
      },
      duration: 0.38,
      ease: "power3.out",
    });
  }, [isClickable]);

  useEffect(() => {
    if (!cursorText || !textRef.current) return;

    gsap.set(textRef.current, {
      x: lastPointerRef.current.x,
      y: lastPointerRef.current.y,
    });
  }, [cursorText]);

  // Theme colors
  const isProject = cursorVariant === 'project';
  const isMenu = cursorVariant === 'menu';

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          willChange: 'transform',
          mixBlendMode: 'difference' // Inverts cursor color based on background
        }}
      >
        {/* Cursor Container */}
        <div
          className="relative transition-all duration-300 ease-out"
          style={{
            transform: isProject ? 'scale(0)' : (isMenu ? 'scale(1.2)' : 'scale(1)'),
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <clipPath id="custom-cursor-fill">
                <rect ref={fillRectRef} x="0" y="32" width="32" height="0" />
              </clipPath>
            </defs>
            <path
              ref={fillPathRef}
              d={DEFAULT_CURSOR_PATH}
              fill="#ffffff"
              stroke="none"
              clipPath="url(#custom-cursor-fill)"
            />
            <path
              ref={outlinePathRef}
              d={DEFAULT_CURSOR_PATH}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="transparent"
            />
          </svg>
        </div>
      </div>

      {/* Floating Text - Glass Pill Style */}
      {cursorText && (
        <div
          ref={textRef}
          className={`fixed top-0 left-0 pointer-events-none z-[999999] flex items-center justify-center overflow-visible transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ willChange: 'transform' }}
        >
          <div
            className="absolute left-8 top-8 bg-black/80 text-white backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {cursorText}
          </div>
        </div>
      )}

      <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
