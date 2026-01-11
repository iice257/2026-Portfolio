import { useCallback, useEffect, useState, useRef } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { MENULINKS } from "../../constants";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 50);
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape" && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? "py-4" : "py-6"
          }`}
        style={{
          backgroundColor: isScrolled ? 'var(--bg-primary)' : 'transparent',
          borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
          transition: 'padding 0.3s ease, background-color 0.3s ease, border-bottom 0.3s ease',
          willChange: 'padding, background-color'
        }}
      >
        <div className="section-container flex justify-between items-center">
          <a
            href="#home"
            className="text-body-sm font-semibold tracking-wide"
            style={{ color: 'var(--fg-primary)' }}
          >
            KA
          </a>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[60]"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-px transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[3px]" : ""
                  }`}
                style={{ backgroundColor: 'var(--fg-primary)' }}
              />
              <span
                className={`w-6 h-px transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[3px]" : ""
                  }`}
                style={{ backgroundColor: 'var(--fg-primary)' }}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`menu-overlay ${isMenuOpen ? "active" : ""}`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="section-container h-full flex flex-col justify-center relative">
          {/* Back/Close button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-6 md:right-12 text-micro uppercase tracking-widest flex items-center gap-2 hover:opacity-60 transition-opacity"
            style={{ color: 'var(--fg-muted)' }}
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <nav className="space-y-6">
            {MENULINKS.map((link, i) => (
              <a
                key={link.ref}
                href={`#${link.ref}`}
                onClick={() => setIsMenuOpen(false)}
                className="menu-link block"
                style={{ transitionDelay: `${0.1 + i * 0.05}s` }}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
