import Link from "next/link";
import { useCallback, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCursor } from '../../context/CursorContext';
import { useTheme } from '../../context/ThemeContext';
import { useBodyScrollLock } from '../../utils/useBodyScrollLock';
import { useDialogFocus } from '../../utils/useDialogFocus';
import InteractiveDots from './InteractiveDots';

const MENU_INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, [data-clickable="true"]';

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
  const [menuCursorLabel, setMenuCursorLabel] = useState("Click");
  const hasShownNiceRef = useRef(false);
  const niceTimerRef = useRef(null);
  const { setCursorText, setCursorVariant, requestCursorRefresh } = useCursor();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useDialogFocus(isOpen);
  const overlayId = "site-menu-overlay";
  const menuForeground = theme === "light" ? "#0a0a0a" : "#fafafa";
  const menuMuted = theme === "light" ? "rgba(10, 10, 10, 0.52)" : "rgba(250, 250, 250, 0.55)";
  const menuBorder = theme === "light" ? "rgba(10, 10, 10, 0.18)" : "rgba(250, 250, 250, 0.2)";
  const menuBackground = theme === "light" ? "#f7f7f4" : "#050505";
  const menuDotColor = theme === "light" ? "#151515" : "#f5f5f5";

  const setOverlayRefs = useCallback((node) => {
    overlayRef.current = node;
  }, [overlayRef]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setCursorText("");
    setCursorVariant('default');
    onMenuClose?.();
  }, [onMenuClose, setCursorText, setCursorVariant]);

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      setIsOpen(true);
      setMenuCursorLabel("Click");
      setCursorVariant('menu');
      onMenuOpen?.();
    }
  };

  const handleMenuSurfaceClick = (event) => {
    if (event.target.closest?.(MENU_INTERACTIVE_SELECTOR)) return;
    if (hasShownNiceRef.current) return;

    hasShownNiceRef.current = true;
    setMenuCursorLabel("Nice");
    window.clearTimeout(niceTimerRef.current);
    niceTimerRef.current = window.setTimeout(() => {
      setMenuCursorLabel("Click");
      requestCursorRefresh();
    }, 3000);
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
    if (!isOpen) return undefined;
    requestCursorRefresh();
    return () => {
      window.clearTimeout(niceTimerRef.current);
    };
  }, [isOpen, requestCursorRefresh]);

  useEffect(() => {
    if (!isOpen) return;
    requestCursorRefresh();
  }, [isOpen, menuCursorLabel, requestCursorRefresh]);

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
      data-menu-cursor-surface="true"
      data-menu-cursor-label={menuCursorLabel}
      onClickCapture={handleMenuSurfaceClick}
      className={`site-menu-panel fixed inset-0 z-[99999] flex flex-col items-start overflow-y-auto py-0 transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{
        backgroundColor: menuBackground,
        color: 'var(--fg-primary)',
        '--menu-fg': menuForeground,
        '--menu-muted': menuMuted,
        '--menu-border': menuBorder,
      }}
    >
      <InteractiveDots
        active={isOpen}
        backgroundColor={menuBackground}
        dotColor={menuDotColor}
        gridSpacing={theme === "light" ? 28 : 30}
        animationSpeed={0.004}
        removeWaveLine
        trailOnMove
        trailInterval={24}
        trailMinDistance={6}
        className="site-menu-dots"
      />

      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
        className={`site-menu-close homepage-menu-close fixed z-[100001] h-10 w-10 flex items-center justify-center transition-all duration-300 cursor-none ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        style={{ cursor: 'none' }}
      >
        <span className="absolute h-[2px] w-6 rotate-45" style={{ backgroundColor: 'var(--menu-fg)' }} />
        <span className="absolute h-[2px] w-6 -rotate-45" style={{ backgroundColor: 'var(--menu-fg)' }} />
      </button>

      {/* Navigation Items - LEFT ALIGNED */}
      <nav aria-label="Primary navigation" className="site-menu-nav min-h-[calc(100dvh-2rem)] pl-6 md:pl-[3.75rem] pr-6 pt-20 xs:pt-24 md:pt-9 pb-7 flex flex-col justify-between items-start gap-5 xs:gap-6 md:gap-7 w-full">
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
        <div className="site-menu-socials relative z-[1] mt-auto flex flex-wrap gap-x-5 gap-y-3 sm:gap-8 pl-6 md:pl-[3.75rem] pr-6 pb-8 md:pb-12">
          {socialItems.map((social, index) => {
            const opensNewTab = /^https?:\/\//i.test(social.link);

            return (
              <a
                key={social.link}
                href={social.link}
                tabIndex={isOpen ? 0 : -1}
                className={`relative text-sm md:text-base transition-all duration-500 cursor-none group ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                style={{
                  transitionDelay: isOpen ? `${0.3 + index * 0.05}s` : '0s',
                  color: 'var(--menu-fg)',
                  cursor: 'none',
                }}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noopener noreferrer" : undefined}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
