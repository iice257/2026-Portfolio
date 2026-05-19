import Link from "next/link";
import { useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCursor } from '../../context/CursorContext';

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
  const [mounted, setMounted] = useState(false);

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const buttonColor = isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;

  const MenuOverlay = (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-start overflow-y-auto py-16 md:py-20 transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{ backgroundColor: '#000000' }}
    >
      <button
        type="button"
        onClick={toggleMenu}
        aria-label="Close menu"
        className={`homepage-menu-close fixed z-[100001] h-10 w-10 flex items-center justify-center transition-all duration-300 cursor-none ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        style={{ cursor: 'none' }}
      >
        <span className="absolute h-[2px] w-6 rotate-45 bg-white" />
        <span className="absolute h-[2px] w-6 -rotate-45 bg-white" />
      </button>

      {/* Navigation Items - LEFT ALIGNED */}
      <nav className="min-h-[calc(100svh-8rem)] md:min-h-full pl-6 md:pl-16 lg:pl-32 pr-6 pb-24 md:pb-16 flex flex-col justify-center items-start w-full">
        {items.map((item, index) => {
          const renderLabelContent = () => (
            <>
              <span>{item.label}</span>
              {item.opensPage && (
                <span
                  aria-hidden="true"
                  className="mt-[0.16em] inline-block text-[0.36em] leading-none opacity-70 transition-transform duration-500 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              )}
            </>
          );

          return (
          <div key={index} className="border-b border-white/20 w-auto max-w-4xl">
            <Link
              href={item.link}
              className={`group relative flex items-center gap-5 md:gap-8 py-3.5 md:py-5 text-white transition-all duration-500 cursor-none ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{
                transitionDelay: isOpen ? `${0.1 + index * 0.05}s` : '0s',
                fontSize: 'clamp(2.45rem, 4.25vw, 3.85rem)',
                fontWeight: 300, // Reduced weight for elegance
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
                  className="relative z-10 text-base md:text-lg font-light w-12 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: '#ffffff' }}
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
                <span className="absolute top-0 left-0 flex items-start gap-2 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0 text-white/50">
                  {renderLabelContent()}
                </span>
              </span>

              {/* Underline line - absolute to the link container */}
              <span
                className="absolute z-0 left-20 right-0 h-[2px] bg-white transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ bottom: '1.35rem' }} // Adjust based on padding
              />
            </Link>
          </div>
          );
        })}
      </nav>

      {/* Social Links */}
      {displaySocials && socialItems.length > 0 && (
        <div className="absolute bottom-12 left-6 md:left-16 lg:left-32 flex gap-8">
          {socialItems.map((social, index) => (
            <a
              key={index}
              href={social.link}
              className={`relative text-sm md:text-base text-white transition-all duration-500 cursor-none group ${isOpen ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{ transitionDelay: isOpen ? `${0.3 + index * 0.05}s` : '0s', cursor: 'none' }}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              {social.label}
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Menu Toggle Button - Fixed hamburger icon */}
      <button
        className={`w-10 h-10 relative z-[100000] flex items-center justify-center cursor-none transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        onClick={toggleMenu}
        aria-label="Open menu"
        aria-hidden={isOpen}
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
      {mounted && createPortal(MenuOverlay, document.body)}
    </>
  );
};

export default StaggeredMenu;
