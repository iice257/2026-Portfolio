import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { gsap } from 'gsap';

const DEFAULT_CURSOR_PATH = "M5.5 3 C5.5 3 5.5 3 5.5 3 L11.5 26.5 C11.5 26.5 11.5 26.5 11.5 26.5 L16.2 17.8 C16.2 17.8 16.2 17.8 16.2 17.8 L25.5 17.8 C25.5 17.8 25.5 17.8 25.5 17.8 L5.5 3 Z";
const CLICKABLE_CURSOR_PATH = "M5.45 3.18 C5.25 2.8 5.78 2.52 6.18 2.84 L24.02 16.02 C25.82 17.36 25.16 19.18 22.78 19.18 L17.38 19.18 C16.48 19.18 15.96 19.58 15.54 20.34 L12.9 25.14 C11.72 27.28 9.96 26.66 9.5 24.28 L5.06 4.46 C4.92 3.84 5.08 3.38 5.45 3.18 Z";
const CURSOR_SIZE = 32;
const CURSOR_TIP_X = 5.5;
const CURSOR_TIP_Y = 3;
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, [data-clickable="true"]';
const LABEL_SELECTOR = "[data-cursor-label]";
const PREVIEW_LABEL_PATTERN = /^click to (open|close)$/i;
const INTERACTIVE_BRIDGE_RADIUS = 14;
const INTERACTIVE_BRIDGE_OFFSETS = [
  [0, 0],
  [INTERACTIVE_BRIDGE_RADIUS, 0],
  [-INTERACTIVE_BRIDGE_RADIUS, 0],
  [0, INTERACTIVE_BRIDGE_RADIUS],
  [0, -INTERACTIVE_BRIDGE_RADIUS],
  [INTERACTIVE_BRIDGE_RADIUS, INTERACTIVE_BRIDGE_RADIUS],
  [-INTERACTIVE_BRIDGE_RADIUS, INTERACTIVE_BRIDGE_RADIUS],
  [INTERACTIVE_BRIDGE_RADIUS, -INTERACTIVE_BRIDGE_RADIUS],
  [-INTERACTIVE_BRIDGE_RADIUS, -INTERACTIVE_BRIDGE_RADIUS],
];

const getCursorLabelKind = (text) => (
  PREVIEW_LABEL_PATTERN.test((text || "").trim()) ? "preview" : "standard"
);

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
  const cursorTextRef = useRef(cursorText);
  const cursorVariantRef = useRef(cursorVariant);

  // Use GSAP's quickSetter for performance
  const xSet = useRef(null);
  const ySet = useRef(null);
  const lastPointerRef = useRef({ x: 0, y: 0, hasPointer: false });
  const loadingTimelineRef = useRef(null);
  const refreshFrameRef = useRef(null);
  const resolvedStateRef = useRef({ text: "", variant: "default", clickable: false });

  useEffect(() => {
    cursorTextRef.current = cursorText;
  }, [cursorText]);

  useEffect(() => {
    cursorVariantRef.current = cursorVariant;
  }, [cursorVariant]);

  useEffect(() => {
    // Setup quickSetters
    xSet.current = gsap.quickSetter(cursorRef.current, "x", "px");
    ySet.current = gsap.quickSetter(cursorRef.current, "y", "px");

    const applyClickableState = (nextClickable) => {
      if (isClickableRef.current === nextClickable) return;
      isClickableRef.current = nextClickable;
      setIsClickable(nextClickable);
    };

    const applyCursorContext = (nextText, nextVariant) => {
      if (cursorTextRef.current !== nextText) {
        cursorTextRef.current = nextText;
        setCursorText(nextText);
      }

      if (cursorVariantRef.current !== nextVariant) {
        cursorVariantRef.current = nextVariant;
        setCursorVariant(nextVariant);
      }
    };

    const isUsableInteractive = (element) => {
      if (!element?.matches?.(INTERACTIVE_SELECTOR)) return false;
      if (element.matches("[disabled], [aria-disabled='true']")) return false;
      return true;
    };

    const findNearbyInteractive = (x, y, labeledTarget) => {
      if (!resolvedStateRef.current.clickable || !labeledTarget) return null;

      for (const [offsetX, offsetY] of INTERACTIVE_BRIDGE_OFFSETS) {
        const sampleX = Math.min(window.innerWidth - 1, Math.max(0, x + offsetX));
        const sampleY = Math.min(window.innerHeight - 1, Math.max(0, y + offsetY));
        const stack = document.elementsFromPoint(sampleX, sampleY);
        const nearby = stack.find((element) => {
          const interactive = element.closest?.(INTERACTIVE_SELECTOR);
          return interactive && isUsableInteractive(interactive) && labeledTarget.contains(interactive);
        });

        if (nearby) return nearby.closest(INTERACTIVE_SELECTOR);
      }

      return null;
    };

    const resolveCursorState = (target, point = lastPointerRef.current) => {
      if (!target?.closest) {
        return { text: "", variant: "default", clickable: false };
      }

      const cursorBoundary = target.closest("[data-cursor-boundary='navigation']");
      if (cursorBoundary && cursorVariantRef.current === "project") {
        return { text: "", variant: "default", clickable: false };
      }

      const interactiveTarget = target.closest(INTERACTIVE_SELECTOR);
      const interactiveLabel = interactiveTarget?.getAttribute?.("data-cursor-label");

      if (interactiveLabel) {
        return {
          text: interactiveLabel,
          variant: interactiveTarget.getAttribute("data-cursor-variant") || "project",
          clickable: false,
        };
      }

      const labeledTarget = target.closest(LABEL_SELECTOR);

      if (interactiveTarget && labeledTarget && labeledTarget !== interactiveTarget) {
        return { text: "", variant: "default", clickable: true };
      }

      if (interactiveTarget) {
        return { text: "", variant: "default", clickable: true };
      }

      if (labeledTarget) {
        const bridgedInteractive = findNearbyInteractive(point.x, point.y, labeledTarget);
        if (bridgedInteractive) {
          return { text: "", variant: "default", clickable: true };
        }

        return {
          text: labeledTarget.getAttribute("data-cursor-label") || "",
          variant: labeledTarget.getAttribute("data-cursor-variant") || "project",
          clickable: false,
        };
      }

      return { text: "", variant: "default", clickable: false };
    };

    const updateCursorFromPoint = (targetOverride) => {
      if (!lastPointerRef.current.hasPointer && !targetOverride) return;

      const { x, y } = lastPointerRef.current;
      const target = targetOverride || document.elementFromPoint(x, y);
      const nextState = resolveCursorState(target, { x, y, hasPointer: true });

      resolvedStateRef.current = nextState;
      applyCursorContext(nextState.text, nextState.variant);
      applyClickableState(nextState.clickable);

      if (xSet.current && ySet.current) {
        xSet.current(x - CURSOR_TIP_X);
        ySet.current(y - CURSOR_TIP_Y);
      }
      if (textRef.current) {
        gsap.set(textRef.current, { x, y });
      }
    };

    const scheduleCursorRefresh = () => {
      if (refreshFrameRef.current) return;
      refreshFrameRef.current = window.requestAnimationFrame(() => {
        refreshFrameRef.current = null;
        updateCursorFromPoint();
      });
    };

    const clearCursorState = () => {
      isClickableRef.current = false;
      resolvedStateRef.current = { text: "", variant: "default", clickable: false };
      setIsClickable(false);
      applyCursorContext("", "default");
    };

    const onMouseMove = (e) => {
      // Ensure visible on movement
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      lastPointerRef.current = { x: e.clientX, y: e.clientY, hasPointer: true };
      updateCursorFromPoint(e.target);
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      isClickableRef.current = false;
      resolvedStateRef.current = { text: "", variant: "default", clickable: false };
      setIsVisible(false);
      setIsClickable(false);
      applyCursorContext("", "default");
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
      scheduleCursorRefresh();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', scheduleCursorRefresh, true);
    window.addEventListener('resize', scheduleCursorRefresh);
    window.addEventListener('portfolio:cursor-refresh', scheduleCursorRefresh);
    window.addEventListener('portfolio:cursor-clear', clearCursorState);
    document.addEventListener('focusin', scheduleCursorRefresh);
    document.addEventListener('pointerup', scheduleCursorRefresh);
    document.addEventListener('transitionend', scheduleCursorRefresh, true);
    document.addEventListener('animationend', scheduleCursorRefresh, true);
    document.addEventListener('mouseleave', onMouseLeave); // document leave covers window exit mostly
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', scheduleCursorRefresh, true);
      window.removeEventListener('resize', scheduleCursorRefresh);
      window.removeEventListener('portfolio:cursor-refresh', scheduleCursorRefresh);
      window.removeEventListener('portfolio:cursor-clear', clearCursorState);
      document.removeEventListener('focusin', scheduleCursorRefresh);
      document.removeEventListener('pointerup', scheduleCursorRefresh);
      document.removeEventListener('transitionend', scheduleCursorRefresh, true);
      document.removeEventListener('animationend', scheduleCursorRefresh, true);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (refreshFrameRef.current) {
        window.cancelAnimationFrame(refreshFrameRef.current);
      }
    };
  }, [setCursorText, setCursorVariant]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return;
    if (isRouteLoading) return;

    const shouldUseClickableShape = isClickable || Boolean(cursorText);
    const targetPath = shouldUseClickableShape ? CLICKABLE_CURSOR_PATH : DEFAULT_CURSOR_PATH;

    gsap.to([outlinePathRef.current, fillPathRef.current], {
      attr: { d: targetPath },
      duration: 0.28,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(fillRectRef.current, {
      attr: {
        y: shouldUseClickableShape ? 0 : 32,
        height: shouldUseClickableShape ? 32 : 0,
      },
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [cursorText, isClickable, isRouteLoading]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return undefined;

    const outlinePath = outlinePathRef.current;
    const fillPath = fillPathRef.current;
    const fillRect = fillRectRef.current;

    loadingTimelineRef.current?.kill();

    if (!isRouteLoading) {
      const shouldUseClickableShape = isClickableRef.current || Boolean(cursorTextRef.current);
      const targetPath = shouldUseClickableShape ? CLICKABLE_CURSOR_PATH : DEFAULT_CURSOR_PATH;

      gsap.to(fillPath, {
        opacity: 1,
        duration: 0.16,
        ease: "power2.out",
      });

      gsap.to([outlinePath, fillPath], {
        attr: { d: targetPath },
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(fillRect, {
        attr: {
          y: shouldUseClickableShape ? 0 : 32,
          height: shouldUseClickableShape ? 32 : 0,
        },
        duration: 0.24,
        ease: "power3.out",
        overwrite: "auto",
      });

      return undefined;
    }

    gsap.set([outlinePath, fillPath], {
      attr: { d: CLICKABLE_CURSOR_PATH },
    });

    gsap.set(fillRect, {
      attr: { y: 0, height: 32 },
    });

    loadingTimelineRef.current = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { overwrite: "auto" },
    });

    loadingTimelineRef.current.to(fillPath, {
      opacity: 0.38,
      duration: 0.42,
      ease: "power2.inOut",
    });

    return () => {
      loadingTimelineRef.current?.kill();
      loadingTimelineRef.current = null;
      gsap.set(fillPath, { opacity: 1 });
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
  const hasCursorLabel = Boolean(cursorText);
  const isMenu = cursorVariant === 'menu';
  const cursorLabelKind = getCursorLabelKind(cursorText);

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
          className="relative"
          style={{
            width: `${CURSOR_SIZE}px`,
            height: `${CURSOR_SIZE}px`,
            transformOrigin: "50% 50%",
            transform: hasCursorLabel ? 'scale(0.18)' : (isMenu ? 'scale(1.2)' : 'scale(1)'),
            opacity: hasCursorLabel ? 0 : 1,
            transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 130ms ease",
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
      <div
        ref={textRef}
        className={`fixed top-0 left-0 pointer-events-none z-[999999] overflow-visible ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ willChange: 'transform' }}
        aria-hidden={!hasCursorLabel}
      >
        <div
          className={`custom-cursor-label absolute left-0 top-0 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap is-${cursorLabelKind} ${hasCursorLabel ? 'is-visible' : 'is-hidden'}`}
        >
          {cursorText || " "}
        </div>
      </div>

      <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none;
        }

        .custom-cursor-label {
          background-color: rgba(0, 0, 0, 0.86);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #fff;
          transition:
            background-color 0.34s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.34s cubic-bezier(0.16, 1, 0.3, 1),
            color 0.34s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.14s ease,
            transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .custom-cursor-label.is-hidden {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.92);
        }

        .custom-cursor-label.is-visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        [data-theme="light"] .custom-cursor-label.is-standard {
          background-color: rgba(255, 255, 255, 0.9);
          border-color: rgba(0, 0, 0, 0.16);
          color: #050505;
        }

        .custom-cursor-label.is-preview {
          background-color: rgba(255, 255, 255, 0.92);
          border-color: rgba(0, 0, 0, 0.18);
          color: #050505;
        }

        [data-theme="light"] .custom-cursor-label.is-preview {
          background-color: rgba(0, 0, 0, 0.88);
          border-color: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

      `}</style>
    </>
  );
};

export default CustomCursor;
