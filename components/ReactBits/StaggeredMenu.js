import { useState, useEffect } from 'react';

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

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      onMenuClose?.();
    } else {
      setIsOpen(true);
      onMenuOpen?.();
    }
  };

  const handleItemClick = (item, index) => {
    setIsOpen(false);
    onMenuClose?.();
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

  const buttonColor = isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;

  return (
    <>
      {/* Menu Toggle Button - Fixed hamburger icon */}
      <button
        className="w-10 h-10 relative z-[100] flex items-center justify-center cursor-none"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
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

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] flex flex-col justify-center transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Navigation Items - LEFT ALIGNED */}
        <nav className="pl-6 md:pl-16 lg:pl-32">
          {items.map((item, index) => (
            <div key={index} className="border-b border-white/10 max-w-4xl">
              <a
                href={item.link}
                className={`flex items-center gap-8 py-6 text-white transition-all duration-300 cursor-none ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{
                  transitionDelay: isOpen ? `${0.1 + index * 0.05}s` : '0s',
                  fontSize: 'clamp(3rem, 6vw, 5rem)', // Bigger font
                  fontWeight: 300,
                  cursor: 'none'
                }}
                aria-label={item.ariaLabel || item.label}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item, index);
                  window.location.href = item.link;
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.fontWeight = '700';
                  e.currentTarget.style.paddingLeft = '20px'; // Slight indent on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.fontWeight = '300';
                  e.currentTarget.style.paddingLeft = '0px';
                }}
              >
                {displayItemNumbering && (
                  <span className="text-base md:text-lg font-light w-12 opacity-80" style={{ color: '#e5e5e5' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="transition-[font-weight,padding] duration-300">{item.label}</span>
              </a>
            </div>
          ))}
        </nav>

        {/* Social Links */}
        {displaySocials && socialItems.length > 0 && (
          <div className="absolute bottom-12 left-6 md:left-16 lg:left-32 flex gap-8">
            {socialItems.map((social, index) => (
              <a
                key={index}
                href={social.link}
                className={`text-sm md:text-base text-white transition-all duration-300 cursor-none ${isOpen ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                style={{ transitionDelay: isOpen ? `${0.3 + index * 0.05}s` : '0s', cursor: 'none' }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                {social.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StaggeredMenu;
