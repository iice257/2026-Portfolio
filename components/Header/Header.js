import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { MENULINKS } from "../../constants";

const Header = () => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Progress from 0 to 1 over the first 200px of scroll
          const progress = Math.min(currentScrollY / 200, 1);
          setScrollProgress(progress);
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

  // Handle navigation - if on subpage, go home first
  const handleNavClick = (e, ref) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (router.pathname !== '/') {
      // Navigate to home page with hash
      router.push(`/#${ref}`);
    } else {
      // Already on home, just scroll
      const element = document.getElementById(ref);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (router.pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isScrolled = scrollProgress > 0.1;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? "py-4" : "py-6"}`}
        style={{
          backgroundColor: isScrolled ? 'var(--bg-primary)' : 'transparent',
          borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
          transition: 'padding 0.3s ease, background-color 0.3s ease, border-bottom 0.3s ease',
          willChange: 'padding, background-color'
        }}
      >
        <div className="section-container flex justify-between items-center">
          {/* Logo with morph effect */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="relative overflow-hidden"
            style={{ color: 'var(--fg-primary)' }}
          >
            <span
              className="text-body-sm font-semibold tracking-wide inline-block transition-all duration-500"
              style={{
                opacity: 1 - scrollProgress,
                transform: `translateY(${scrollProgress * -100}%)`,
              }}
            >
              KA
            </span>
            <span
              className="text-body-sm font-medium tracking-wide absolute left-0 top-0 whitespace-nowrap transition-all duration-500"
              style={{
                opacity: scrollProgress,
                transform: `translateY(${(1 - scrollProgress) * 100}%)`,
              }}
            >
              Kingsley Aremu
            </span>
          </a>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Menu toggle button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[60]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`w-6 h-px transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[3px]" : ""}`}
                style={{ backgroundColor: 'var(--fg-primary)' }}
              />
              <span
                className={`w-6 h-px transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`}
                style={{ backgroundColor: 'var(--fg-primary)' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu overlay */}
      <div
        className={`menu-overlay ${isMenuOpen ? "active" : ""}`}
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="section-container h-full flex flex-col justify-center">
          <nav className="space-y-6">
            {MENULINKS.map((link, i) => (
              <a
                key={link.ref}
                href={`/#${link.ref}`}
                onClick={(e) => handleNavClick(e, link.ref)}
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

