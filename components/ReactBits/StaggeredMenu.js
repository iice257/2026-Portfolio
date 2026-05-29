import Link from "next/link";
import { useCallback, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useCursor } from '../../context/CursorContext';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { useDialogFocus } from '../../utils/useDialogFocus';

const MENU_TRAIL_POINT_COUNT = 22;
const MENU_TRAIL_IDLE_DELAY = 320;
const MENU_TRAIL_HEAD_EASE = 0.48;
const MENU_TRAIL_BODY_EASE = 0.34;
const MENU_TRAIL_SETTLE_DISTANCE = 0.55;
const MENU_TRAIL_MIN_MOVE = 2.5;

const getSmoothTrailPath = (points) => {
  if (points.length < 2) return "";

  const formatPoint = (point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  const [firstPoint] = points;
  const commands = [`M ${formatPoint(firstPoint)}`];

  if (points.length === 2) {
    commands.push(`L ${formatPoint(points[1])}`);
    return commands.join(" ");
  }

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midpoint = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    };

    commands.push(`Q ${formatPoint(current)} ${formatPoint(midpoint)}`);
  }

  commands.push(`T ${formatPoint(points[points.length - 1])}`);
  return commands.join(" ");
};

/**
 * StaggeredMenu - Full-screen navigation menu with staggered animations
 */
const StaggeredMenu = ({
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  onMenuOpen,
  onMenuClose,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCursorVariant } = useCursor();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useDialogFocus(isOpen);
  const menuSurfaceRef = useRef(null);
  const trailRef = useRef(null);
  const trailLineRef = useRef(null);
  const trailGradientRef = useRef(null);
  const trailFrameRef = useRef(null);
  const trailFadeTimerRef = useRef(null);
  const trailClearTimerRef = useRef(null);
  const trailPointsRef = useRef([]);
  const trailHasPointerRef = useRef(false);
  const trailTargetRef = useRef({ x: 0, y: 0 });
  const trailIsDrawingRef = useRef(false);
  const trailIsVisibleRef = useRef(false);
  const trailLastMoveTimeRef = useRef(0);
  const overlayId = "site-menu-overlay";
  const menuForeground = theme === "light" ? "#0a0a0a" : "#fafafa";
  const menuMuted = theme === "light" ? "rgba(10, 10, 10, 0.52)" : "rgba(250, 250, 250, 0.55)";
  const menuBorder = theme === "light" ? "rgba(10, 10, 10, 0.18)" : "rgba(250, 250, 250, 0.2)";

  const setOverlayRefs = useCallback((node) => {
    overlayRef.current = node;
    menuSurfaceRef.current = node;
  }, [overlayRef]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setCursorVariant('default');
    onMenuClose?.();
  }, [onMenuClose, setCursorVariant]);

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
      setCursorVariant('menu');
      onMenuOpen?.();
    }
  };

  const handleItemClick = (item, index) => {
    closeMenu();
    onItemClick?.(item, index);
  };

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu, isOpen]);

  useEffect(() => {
    const menuSurface = menuSurfaceRef.current;
    const trail = trailRef.current;
    const trailLine = trailLineRef.current;
    const trailGradient = trailGradientRef.current;
    if (!isOpen || !menuSurface || !trail || !trailLine || !trailGradient) {
      return undefined;
    }

    const shouldReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shouldReduce) return undefined;

    const setTrailActive = (value) => {
      trail.classList.toggle("is-active", value);
    };

    const clearTrail = () => {
      trailLine.setAttribute("d", "");
      trailHasPointerRef.current = false;
      trailPointsRef.current = [];
    };

    const renderTrail = () => {
      const points = trailPointsRef.current;
      const target = trailTargetRef.current;
      const now = performance.now();

      if (points.length === 0) {
        trailFrameRef.current = null;
        return;
      }

      if (trailIsDrawingRef.current && now - trailLastMoveTimeRef.current > MENU_TRAIL_IDLE_DELAY) {
        trailIsDrawingRef.current = false;
      }

      let maxDrift = 0;
      let span = 0;

      points.forEach((point, index) => {
        const leader = index === 0 ? target : points[index - 1];
        const ease = index === 0
          ? MENU_TRAIL_HEAD_EASE
          : Math.max(0.26, MENU_TRAIL_BODY_EASE - index * 0.0016);
        const dx = leader.x - point.x;
        const dy = leader.y - point.y;

        point.x += dx * ease;
        point.y += dy * ease;

        const drift = Math.hypot(dx, dy);
        const pointSpan = Math.hypot(target.x - point.x, target.y - point.y);
        maxDrift = Math.max(maxDrift, drift);
        span = Math.max(span, pointSpan);
      });

      const pathPoints = [...points].reverse();
      const tail = pathPoints[0];
      const head = pathPoints[pathPoints.length - 1];

      trailLine.setAttribute("d", span > 0.3 ? getSmoothTrailPath(pathPoints) : "");

      if (tail && head) {
        trailGradient.setAttribute("x1", tail.x.toFixed(1));
        trailGradient.setAttribute("y1", tail.y.toFixed(1));
        trailGradient.setAttribute("x2", head.x.toFixed(1));
        trailGradient.setAttribute("y2", head.y.toFixed(1));
      }

      const shouldKeepAnimating = trailIsDrawingRef.current
        || maxDrift > MENU_TRAIL_SETTLE_DISTANCE
        || span > MENU_TRAIL_SETTLE_DISTANCE;

      if (shouldKeepAnimating) {
        trailFrameRef.current = window.requestAnimationFrame(renderTrail);
        return;
      }

      trailFrameRef.current = null;

      if (trailIsVisibleRef.current) {
        trailIsVisibleRef.current = false;
        setTrailActive(false);
        window.clearTimeout(trailClearTimerRef.current);
        trailClearTimerRef.current = window.setTimeout(clearTrail, 900);
      }
    };

    const ensureTrailFrame = () => {
      if (trailFrameRef.current === null) {
        trailFrameRef.current = window.requestAnimationFrame(renderTrail);
      }
    };

    const handlePointerMove = (event) => {
      const rect = menuSurface.getBoundingClientRect();
      const nextPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const previousTarget = trailTargetRef.current;
      const movedDistance = Math.hypot(
        nextPoint.x - previousTarget.x,
        nextPoint.y - previousTarget.y
      );

      if (trailHasPointerRef.current && movedDistance < MENU_TRAIL_MIN_MOVE) {
        return;
      }

      trailTargetRef.current = nextPoint;
      trailIsDrawingRef.current = true;
      trailLastMoveTimeRef.current = performance.now();

      if (!trailHasPointerRef.current) {
        trailPointsRef.current = Array.from(
          { length: MENU_TRAIL_POINT_COUNT },
          () => ({ ...nextPoint })
        );
        trailHasPointerRef.current = true;
      }

      trailIsVisibleRef.current = true;
      setTrailActive(true);
      window.clearTimeout(trailFadeTimerRef.current);
      window.clearTimeout(trailClearTimerRef.current);
      trailFadeTimerRef.current = window.setTimeout(() => {
        trailIsDrawingRef.current = false;
        ensureTrailFrame();
      }, MENU_TRAIL_IDLE_DELAY);
      ensureTrailFrame();
    };

    const handlePointerLeave = () => {
      window.clearTimeout(trailFadeTimerRef.current);
      trailIsDrawingRef.current = false;
      ensureTrailFrame();
    };

    menuSurface.addEventListener("pointermove", handlePointerMove, { passive: true });
    menuSurface.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      menuSurface.removeEventListener("pointermove", handlePointerMove);
      menuSurface.removeEventListener("pointerleave", handlePointerLeave);
      window.clearTimeout(trailFadeTimerRef.current);
      window.clearTimeout(trailClearTimerRef.current);
      if (trailFrameRef.current !== null) {
        window.cancelAnimationFrame(trailFrameRef.current);
        trailFrameRef.current = null;
      }
      trail.classList.remove("is-active");
      trailHasPointerRef.current = false;
      trailIsDrawingRef.current = false;
      trailIsVisibleRef.current = false;
      trailPointsRef.current = [];
      trailLine.setAttribute("d", "");
    };
  }, [isOpen]);

  const buttonColor = isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;
  const portalTarget = mounted ? document.getElementById("site-portal-root") || document.body : null;

  const MenuOverlay = (
    <div
      ref={setOverlayRefs}
      id={overlayId}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!isOpen}
      tabIndex={-1}
      className={`fixed inset-0 z-[99999] flex flex-col items-start overflow-y-auto py-0 transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--fg-primary)',
        '--menu-fg': menuForeground,
        '--menu-muted': menuMuted,
        '--menu-border': menuBorder,
        '--menu-trail-color': menuForeground,
      }}
    >
      <div ref={trailRef} className="menu-mouse-trail" aria-hidden="true">
        <svg className="menu-mouse-trail__svg">
          <defs>
            <linearGradient ref={trailGradientRef} id="menu-mouse-trail-gradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="20%" stopColor="currentColor" stopOpacity="0.08" />
              <stop offset="66%" stopColor="currentColor" stopOpacity="0.42" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.94" />
            </linearGradient>
          </defs>
          <path ref={trailLineRef} className="menu-mouse-trail__line" d="" />
        </svg>
      </div>

      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
        className={`homepage-menu-close fixed z-[100001] h-10 w-10 flex items-center justify-center transition-all duration-300 cursor-none ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        style={{ cursor: 'none' }}
      >
        <span className="absolute h-[2px] w-6 rotate-45" style={{ backgroundColor: 'var(--menu-fg)' }} />
        <span className="absolute h-[2px] w-6 -rotate-45" style={{ backgroundColor: 'var(--menu-fg)' }} />
      </button>

      {/* Navigation Items - LEFT ALIGNED */}
      <nav aria-label="Primary navigation" className="min-h-[calc(100dvh-2rem)] pl-6 md:pl-[3.75rem] pr-6 pt-20 xs:pt-24 md:pt-9 pb-7 flex flex-col justify-between items-start gap-5 xs:gap-6 md:gap-7 w-full">
        {items.map((item, index) => {
          const renderLabelContent = () => (
            <>
              <span>{item.label}</span>
              {item.opensPage && (
                <span
                  aria-hidden="true"
                  className="mt-[0.16em] inline-block text-[0.36em] leading-none opacity-70 transition-transform duration-500 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  {"\u2197"}
                </span>
              )}
            </>
          );

          return (
          <div key={item.label} className="relative z-[1] border-b w-auto max-w-4xl" style={{ borderColor: 'var(--menu-border)' }}>
            <Link
              href={item.link}
              tabIndex={isOpen ? 0 : -1}
              className={`group relative flex items-center gap-4 xs:gap-5 md:gap-8 py-4 xs:py-5 md:py-5 transition-all duration-500 cursor-none ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{
                transitionDelay: isOpen ? `${0.1 + index * 0.05}s` : '0s',
                fontSize: 'var(--site-menu-item-size, clamp(2.45rem, 4.25vw, 3.85rem))',
                fontWeight: 300, // Reduced weight for elegance
                color: 'var(--menu-fg)',
                cursor: 'none'
              }}
              aria-label={item.ariaLabel || item.label}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item, index);
              }}
            >
              {/* Number */}
              {displayItemNumbering && (
                <span
                  className="relative z-10 text-sm xs:text-base md:text-lg font-light w-9 xs:w-10 md:w-12 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: 'var(--menu-fg)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}

              {/* Label Container */}
              <span
                className="relative z-10 block h-[1.24em] overflow-hidden pb-[0.04em] leading-[1.12]"
              >
                <span className="flex items-start gap-2 transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
                  {renderLabelContent()}
                </span>
                <span
                  className="absolute top-0 left-0 flex items-start gap-2 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"
                  style={{ color: 'var(--menu-muted)' }}
                >
                  {renderLabelContent()}
                </span>
              </span>

              {/* Underline line - absolute to the link container */}
              <span
                className="absolute z-0 left-20 right-0 h-[2px] transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ bottom: '1.35rem', backgroundColor: 'var(--menu-fg)' }} // Adjust based on padding
              />
            </Link>
          </div>
          );
        })}
      </nav>

      {/* Social Links */}
      {displaySocials && socialItems.length > 0 && (
        <div className="relative z-[1] mt-auto flex flex-wrap gap-x-5 gap-y-3 sm:gap-8 pl-6 md:pl-[3.75rem] pr-6 pb-8 md:pb-12">
          {socialItems.map((social, index) => {
            const opensNewTab = /^https?:\/\//i.test(social.link);

            return (
              <a
                key={social.link}
                href={social.link}
                tabIndex={isOpen ? 0 : -1}
                className={`relative text-sm md:text-base transition-all duration-500 cursor-none group ${isOpen ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                style={{
                  transitionDelay: isOpen ? `${0.3 + index * 0.05}s` : '0s',
                  color: 'var(--menu-fg)',
                  cursor: 'none',
                }}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noopener noreferrer" : undefined}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                {social.label}
                <span className="absolute left-0 bottom-0 w-full h-[1px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ backgroundColor: 'var(--menu-fg)' }} />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Menu Toggle Button - Fixed hamburger icon */}
      <button
        type="button"
        className={`w-10 h-10 relative z-[100000] flex items-center justify-center cursor-none transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        onClick={toggleMenu}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls={overlayId}
        aria-haspopup="dialog"
        tabIndex={isOpen ? -1 : 0}
        style={{ cursor: 'none' }}
      >
        <div className="w-6 h-4 relative flex flex-col justify-between pointer-events-none">
          <span
            className="absolute w-full h-[2px] transition-all duration-300 ease-out"
            style={{
              backgroundColor: buttonColor,
              top: isOpen ? '50%' : '0',
              transform: isOpen ? 'translateY(-50%) rotate(45deg)' : 'translateY(0) rotate(0deg)',
            }}
          />
          <span
            className="absolute w-full h-[2px] transition-all duration-300 ease-out"
            style={{
              backgroundColor: buttonColor,
              bottom: isOpen ? '50%' : '0',
              transform: isOpen ? 'translateY(50%) rotate(-45deg)' : 'translateY(0) rotate(0deg)',
            }}
          />
        </div>
      </button>

      {/* Render Menu Overlay via Portal */}
      {portalTarget && createPortal(MenuOverlay, portalTarget)}
    </>
  );
};

export default StaggeredMenu;
