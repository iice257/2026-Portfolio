import { useEffect, useRef, useState } from 'react';
import { useCursor } from '../../context/CursorContext';
import { gsap } from 'gsap';

const DEFAULT_CURSOR_PATH = "M5.5 3 C5.5 3 5.5 3 5.5 3 L11.5 26.5 C11.5 26.5 11.5 26.5 11.5 26.5 L16.2 17.8 C16.2 17.8 16.2 17.8 16.2 17.8 L25.5 17.8 C25.5 17.8 25.5 17.8 25.5 17.8 L5.5 3 Z";
const CLICKABLE_CURSOR_PATH = "M5.5 3 C5.95 3.3 6.2 3.45 6.55 3.72 L24.65 17.05 C25.65 17.8 25.2 18.55 23.95 18.55 L16.75 18.55 C16.2 18.55 15.9 18.8 15.65 19.25 L12.2 25.65 C11.65 26.65 10.95 26.35 10.65 25.15 L5.5 3 Z";
const CURSOR_SIZE = 32;
const CURSOR_TIP_X = 5.5;
const CURSOR_TIP_Y = 3;
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, [data-clickable="true"]';
const LABEL_SELECTOR = "[data-cursor-label]";
const BRIDGE_SELECTOR = "[data-cursor-bridge='true']";
const CURSOR_GROUP_SELECTOR = "[data-cursor-group]";
const PREVIEW_LABEL_PATTERN = /^click to (open|close)$/i;
const INTERACTIVE_BRIDGE_RADIUS = 38;
const WELCOME_VISIT_KEY = "portfolio.cursor.welcomed";
const WELCOME_TOOLTIP_MS = 5000;
const DEFAULT_LAB_CONFIG = { morph: 0.16, roundness: 1, fill: 0.16, spin: 0.7 };

const interpolateCursorPath = (fromPath, toPath, amount) => {
  const fromNumbers = fromPath.match(/-?\d*\.?\d+/g)?.map(Number) || [];
  let index = 0;
  return toPath.replace(/-?\d*\.?\d+/g, (match) => {
    const from = fromNumbers[index] ?? Number(match);
    const to = Number(match);
    index += 1;
    return String(from + (to - from) * Math.max(0, Math.min(1, amount)));
  });
};

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
  const [welcomeText, setWelcomeText] = useState("");
  const [labConfig, setLabConfig] = useState(DEFAULT_LAB_CONFIG);
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
  const welcomeTimerRef = useRef(null);
  const welcomeStartedRef = useRef(false);
  const resolvedStateRef = useRef({ text: "", variant: "default", clickable: false });

  useEffect(() => {
    cursorTextRef.current = cursorText;
  }, [cursorText]);

  useEffect(() => {
    cursorVariantRef.current = cursorVariant;
  }, [cursorVariant]);

  useEffect(() => {
    const handleLabConfig = (event) => {
      const detail = event.detail || {};
      setLabConfig({
        morph: Number.isFinite(detail.morph) ? detail.morph : DEFAULT_LAB_CONFIG.morph,
        roundness: Number.isFinite(detail.roundness) ? detail.roundness : DEFAULT_LAB_CONFIG.roundness,
        fill: Number.isFinite(detail.fill) ? detail.fill : DEFAULT_LAB_CONFIG.fill,
        spin: Number.isFinite(detail.spin) ? detail.spin : DEFAULT_LAB_CONFIG.spin,
      });
    };
    window.addEventListener("playground:cursor-config", handleLabConfig);
    return () => window.removeEventListener("playground:cursor-config", handleLabConfig);
  }, []);

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
      cursorTextRef.current = nextText;
      cursorVariantRef.current = nextVariant;
      setCursorText(nextText);
      setCursorVariant(nextVariant);
    };

    const isUsableInteractive = (element) => {
      if (!element?.matches?.(INTERACTIVE_SELECTOR)) return false;
      if (element.matches("[disabled], [aria-disabled='true']")) return false;
      return true;
    };

    const findNearbyInteractive = (x, y, bridgeRoot) => {
      if (!bridgeRoot) return null;

      const interactives = bridgeRoot.querySelectorAll(INTERACTIVE_SELECTOR);
      let nearest = null;
      let nearestDistanceSq = INTERACTIVE_BRIDGE_RADIUS * INTERACTIVE_BRIDGE_RADIUS;

      for (let index = 0; index < interactives.length; index += 1) {
        const interactive = interactives[index];
        if (!isUsableInteractive(interactive)) continue;

        const rect = interactive.getBoundingClientRect();
        const dx = Math.max(rect.left - x, 0, x - rect.right);
        const dy = Math.max(rect.top - y, 0, y - rect.bottom);
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq <= nearestDistanceSq) {
          nearest = interactive;
          nearestDistanceSq = distanceSq;
        }
      }

      return nearest;
    };

    const isBridgedClickableGap = (target, point, labeledTarget) => {
      const buttonGroup = target.closest?.("[data-cursor-group='buttons']");
      const bridgeRoot = buttonGroup || target.closest?.(BRIDGE_SELECTOR) || labeledTarget?.closest?.(BRIDGE_SELECTOR);
      if (!bridgeRoot) return false;
      return Boolean(findNearbyInteractive(point.x, point.y, bridgeRoot));
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
      const labeledTarget = target.closest(LABEL_SELECTOR);
      const cursorGroup = target.closest(CURSOR_GROUP_SELECTOR);
      const buttonGroup = target.closest("[data-cursor-group='buttons']");
      const cardGroup = target.closest("[data-cursor-group='cards']");
      const menuSurface = target.closest("[data-menu-cursor-surface='true']");

      if (interactiveLabel) {
        return {
          text: interactiveLabel,
          variant: interactiveTarget.getAttribute("data-cursor-variant") || "project",
          clickable: false,
        };
      }

      if (interactiveTarget && labeledTarget && labeledTarget !== interactiveTarget) {
        return { text: "", variant: "default", clickable: true };
      }

      if (interactiveTarget) {
        return { text: "", variant: "default", clickable: true };
      }

      if (buttonGroup && findNearbyInteractive(point.x, point.y, buttonGroup)) {
        return { text: "", variant: "default", clickable: true };
      }

      if (isBridgedClickableGap(target, point, labeledTarget)) {
        return { text: "", variant: "default", clickable: true };
      }

      if (labeledTarget) {
        const bridgeRoot = labeledTarget.closest?.(BRIDGE_SELECTOR);
        const bridgedInteractive = bridgeRoot ? findNearbyInteractive(point.x, point.y, bridgeRoot) : null;
        if (bridgedInteractive) {
          return { text: "", variant: "default", clickable: true };
        }

        return {
          text: labeledTarget.getAttribute("data-cursor-label") || "",
          variant: labeledTarget.getAttribute("data-cursor-variant") || "project",
          clickable: false,
        };
      }

      if (cardGroup) {
        const text = cardGroup.getAttribute("data-cursor-label") || cursorGroup?.getAttribute("data-cursor-label") || "";
        if (text) {
          return {
            text,
            variant: cardGroup.getAttribute("data-cursor-variant") || "project",
            clickable: false,
          };
        }
      }

      if (resolvedStateRef.current.clickable) {
        const bridgeRoot = target.closest?.(BRIDGE_SELECTOR);
        if (bridgeRoot && findNearbyInteractive(point.x, point.y, bridgeRoot)) {
          return { text: "", variant: "default", clickable: true };
        }
      }

      if (menuSurface) {
        return {
          text: menuSurface.getAttribute("data-menu-cursor-label") || "Click",
          variant: "menu",
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

    const startWelcomeTooltip = () => {
      if (welcomeStartedRef.current) return;
      welcomeStartedRef.current = true;

      let hasVisited = false;
      try {
        hasVisited = window.localStorage.getItem(WELCOME_VISIT_KEY) === "true";
        window.localStorage.setItem(WELCOME_VISIT_KEY, "true");
      } catch {
        hasVisited = true;
      }

      setWelcomeText(hasVisited ? "Welcome back!" : "Welcome! Have a great time");
      window.clearTimeout(welcomeTimerRef.current);
      welcomeTimerRef.current = window.setTimeout(() => {
        setWelcomeText("");
      }, WELCOME_TOOLTIP_MS);
    };

    const onMouseMove = (e) => {
      // Ensure visible on movement
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
      startWelcomeTooltip();
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
    document.addEventListener('pointerover', scheduleCursorRefresh, true);
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
      document.removeEventListener('pointerover', scheduleCursorRefresh, true);
      document.removeEventListener('pointerup', scheduleCursorRefresh);
      document.removeEventListener('transitionend', scheduleCursorRefresh, true);
      document.removeEventListener('animationend', scheduleCursorRefresh, true);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (refreshFrameRef.current) {
        window.cancelAnimationFrame(refreshFrameRef.current);
      }
      window.clearTimeout(welcomeTimerRef.current);
    };
  }, [setCursorText, setCursorVariant]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return;
    if (isRouteLoading) return;

    const shouldUseClickableShape = isClickable || Boolean(cursorText);
    const targetPath = shouldUseClickableShape
      ? interpolateCursorPath(DEFAULT_CURSOR_PATH, CLICKABLE_CURSOR_PATH, labConfig.roundness)
      : DEFAULT_CURSOR_PATH;

    gsap.to([outlinePathRef.current, fillPathRef.current], {
      attr: { d: targetPath },
      duration: labConfig.morph,
      ease: "power1.out",
      overwrite: "auto",
    });

    gsap.to(fillRectRef.current, {
      attr: {
        y: 0,
        height: 32,
      },
      duration: 0.01,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(fillPathRef.current, {
      opacity: shouldUseClickableShape ? 1 : 0,
      duration: labConfig.fill,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [cursorText, isClickable, isRouteLoading, labConfig]);

  useEffect(() => {
    if (!outlinePathRef.current || !fillPathRef.current || !fillRectRef.current) return undefined;

    const outlinePath = outlinePathRef.current;
    const fillPath = fillPathRef.current;
    const fillRect = fillRectRef.current;
    const shape = shapeRef.current;

    loadingTimelineRef.current?.kill();

    if (!isRouteLoading) {
      const shouldUseClickableShape = isClickableRef.current || Boolean(cursorTextRef.current);
      const targetPath = shouldUseClickableShape
        ? interpolateCursorPath(DEFAULT_CURSOR_PATH, CLICKABLE_CURSOR_PATH, labConfig.roundness)
        : DEFAULT_CURSOR_PATH;

      gsap.to(fillPath, {
        opacity: shouldUseClickableShape ? 1 : 0,
        duration: labConfig.fill,
        ease: "power2.out",
      });

      gsap.to([outlinePath, fillPath], {
        attr: { d: targetPath },
        duration: labConfig.morph,
        ease: "power1.out",
        overwrite: "auto",
      });

      gsap.to(fillRect, {
        attr: {
          y: 0,
          height: 32,
        },
        duration: 0.01,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(shape, {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: labConfig.morph,
        ease: "power2.out",
        overwrite: "auto",
      });

      return undefined;
    }

    gsap.set([outlinePath, fillPath], {
      attr: { d: interpolateCursorPath(DEFAULT_CURSOR_PATH, CLICKABLE_CURSOR_PATH, labConfig.roundness) },
    });

    gsap.set(fillRect, {
      attr: { y: 0, height: 32 },
    });

    loadingTimelineRef.current = gsap.timeline({
      repeat: -1,
      defaults: { overwrite: "auto" },
    });

    loadingTimelineRef.current
      .set(fillPath, { opacity: 1 })
      .to(shape, {
        rotationY: 360,
        transformPerspective: 320,
        duration: labConfig.spin,
        ease: "none",
      }, 0)
      .to(fillPath, {
        opacity: 0.5,
        duration: labConfig.spin * 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      }, 0);

    return () => {
      loadingTimelineRef.current?.kill();
      loadingTimelineRef.current = null;
      gsap.set(shape, { scale: 1, rotate: 0, rotationY: 0, opacity: 1 });
      gsap.set(fillPath, { opacity: isClickableRef.current || Boolean(cursorTextRef.current) ? 1 : 0 });
    };
  }, [isRouteLoading, labConfig]);

  useEffect(() => {
    if ((!cursorText && !welcomeText) || !textRef.current) return;

    gsap.set(textRef.current, {
      x: lastPointerRef.current.x,
      y: lastPointerRef.current.y,
    });
  }, [cursorText, welcomeText]);

  // Theme colors
  const isMenu = cursorVariant === 'menu';
  const effectiveCursorText = cursorText || (isMenu ? "" : welcomeText);
  const hasCursorLabel = Boolean(effectiveCursorText);
  const cursorLabelKind = welcomeText && !cursorText ? "standard" : getCursorLabelKind(cursorText);

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
                opacity="0"
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
          {effectiveCursorText || " "}
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
