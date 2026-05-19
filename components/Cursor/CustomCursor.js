import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { gsap } from 'gsap';

const DEFAULT_CURSOR_PATH = "M5.5 3 C5.5 3 5.5 3 5.5 3 L11.5 26.5 C11.5 26.5 11.5 26.5 11.5 26.5 L16.2 17.8 C16.2 17.8 16.2 17.8 16.2 17.8 L25.5 17.8 C25.5 17.8 25.5 17.8 25.5 17.8 L5.5 3 Z";
const CLICKABLE_CURSOR_PATH = "M5.45 3.18 C5.25 2.8 5.78 2.52 6.18 2.84 L24.02 16.02 C25.82 17.36 25.16 19.18 22.78 19.18 L17.38 19.18 C16.48 19.18 15.96 19.58 15.54 20.34 L12.9 25.14 C11.72 27.28 9.96 26.66 9.5 24.28 L5.06 4.46 C4.92 3.84 5.08 3.38 5.45 3.18 Z";
const CURSOR_SIZE = 32;
const CURSOR_TIP_X = 5.5;
const CURSOR_TIP_Y = 3;

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const shapeRef = useRef(null);
  const textRef = useRef(null);
  const outlinePathRef = useRef(null);
  const fillPathRef = useRef(null);
  const fillRectRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false); // Default hidden until mouse moves
  const [isClickable, setIsClickable] = useState(false);
  const isVisibleRef = useRef(false);
  const isClickableRef = useRef(false);
  const { cursorText, setCursorText, cursorVariant, setCursorVariant, isRouteLoading } = useCursor();

  // Use GSAP's quickSetter for performance
  const xSet = useRef(null);
  const ySet = useRef(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const loadingTimelineRef = useRef(null);

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
      const cursorBoundary = e.target?.closest?.("[data-cursor-boundary='navigation']");

      if (cursorBoundary && cursorVariant === 'project') {
        setCursorText("");
        setCursorVariant("default");
      }

      const nextClickable = Boolean(clickableTarget) && cursorVariant !== 'project';

      if (isClickableRef.current !== nextClickable) {
        isClickableRef.current = nextClickable;
        setIsClickable(nextClickable);
      }

      if (xSet.current && ySet.current) {
        xSet.current(e.clientX - CURSOR_TIP_X);
        ySet.current(e.clientY - CURSOR_TIP_Y);
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
  }, [cursorVariant, setCursorText, setCursorVariant]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return;
    if (isRouteLoading) return;

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
  }, [isClickable, isRouteLoading]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return undefined;

    loadingTimelineRef.current?.kill();

    if (!isRouteLoading) {
      const targetPath = isClickableRef.current ? CLICKABLE_CURSOR_PATH : DEFAULT_CURSOR_PATH;

      gsap.to([outlinePathRef.current, fillPathRef.current], {
        attr: { d: targetPath },
        duration: 0.22,
        ease: "power3.out",
      });

      gsap.to(fillRectRef.current, {
        attr: {
          y: isClickableRef.current ? 0 : 32,
          height: isClickableRef.current ? 32 : 0,
        },
        duration: 0.24,
        ease: "power3.out",
      });

      return undefined;
    }

    loadingTimelineRef.current = gsap.timeline({
      repeat: -1,
      defaults: { overwrite: "auto" },
    });

    loadingTimelineRef.current
      .to([outlinePathRef.current, fillPathRef.current], {
        attr: { d: CLICKABLE_CURSOR_PATH },
        duration: 0.18,
        ease: "power3.inOut",
      }, 0)
      .to(fillRectRef.current, {
        attr: { y: 0, height: 32 },
        duration: 0.18,
        ease: "power3.inOut",
      }, 0)
      .to([outlinePathRef.current, fillPathRef.current], {
        attr: { d: DEFAULT_CURSOR_PATH },
        duration: 0.18,
        ease: "power3.inOut",
      }, 0.23)
      .to(fillRectRef.current, {
        attr: { y: 32, height: 0 },
        duration: 0.18,
        ease: "power3.inOut",
      }, 0.23);

    return () => {
      loadingTimelineRef.current?.kill();
      loadingTimelineRef.current = null;
    };
  }, [isRouteLoading]);

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
          width: `${CURSOR_SIZE}px`,
          height: `${CURSOR_SIZE}px`,
          mixBlendMode: 'difference' // Inverts cursor color based on background
        }}
      >
        {/* Cursor Container */}
        <div
          ref={shapeRef}
          className="relative transition-all duration-300 ease-out"
          style={{
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
            transformOrigin: "50% 50%",
            transform: isProject ? 'scale(0)' : (isMenu ? 'scale(1.2)' : 'scale(1)'),
          }}
        >
          <div
            style={{
              width: `${CURSOR_SIZE}px`,
              height: `${CURSOR_SIZE}px`,
              transformOrigin: `${CURSOR_TIP_X}px ${CURSOR_TIP_Y}px`,
            }}
          >
            <svg
              width={CURSOR_SIZE}
              height={CURSOR_SIZE}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: 'block',
                width: `${CURSOR_SIZE}px`,
                height: `${CURSOR_SIZE}px`,
                minWidth: `${CURSOR_SIZE}px`,
                minHeight: `${CURSOR_SIZE}px`,
                maxWidth: `${CURSOR_SIZE}px`,
                maxHeight: `${CURSOR_SIZE}px`,
                overflow: 'visible',
              }}
              vectorEffect="non-scaling-stroke"
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
                vectorEffect="non-scaling-stroke"
                fill="transparent"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Text - Glass Pill Style */}
      {cursorText && (
        <div
          ref={textRef}
          className={`fixed top-0 left-0 pointer-events-none z-[999999] overflow-visible transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ willChange: 'transform' }}
        >
          <div
            className="absolute left-0 top-0 bg-black/80 text-white backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              transform: 'translate(-50%, -50%)',
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
