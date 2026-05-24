import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SnowToggle from "../ReactBits/SnowToggle";
import StaggeredMenu from "../ReactBits/StaggeredMenu";
import { MENULINKS, SOCIAL_LINKS } from "../../constants";
import { useHeroLock } from "../../context/HeroLockContext";
import { getSectionHref, scrollToSection } from "../../utils/sectionNavigation";

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isHeroLocked } = useHeroLock();

  // Refs for direct DOM manipulation (performance)
  const logoLeadingRef = useRef(null);
  const logoTrailingRef = useRef(null);
  const progressBarRef = useRef(null);
  const isScrolledRef = useRef(false);
  const logoWidthsRef = useRef({ leading: 0, trailing: 0 });

  useEffect(() => {
    let frameId = null;

    const updateHeader = () => {
      frameId = null;
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const nextIsScrolled = scrollY > 50;
      if (isScrolledRef.current !== nextIsScrolled) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      // 2. Direct DOM updates for continuous animations (No re-renders)

      // Logo wordmark reveal: closed at top, open after 5% page scroll.
      const totalScroll = docHeight - winHeight;
      const pageScrollProgress = totalScroll > 0 ? scrollY / totalScroll : 0;
      const logoProgress = pageScrollProgress > 0.05 ? 1 : 0;

      const leadingLetters = logoLeadingRef.current;
      const trailingLetters = logoTrailingRef.current;
      if (leadingLetters && trailingLetters) {
        if (!logoWidthsRef.current.leading || !logoWidthsRef.current.trailing) {
          logoWidthsRef.current = {
            leading: leadingLetters.scrollWidth,
            trailing: trailingLetters.scrollWidth,
          };
        }

        leadingLetters.style.width = `${logoWidthsRef.current.leading * logoProgress}px`;
        trailingLetters.style.width = `${logoWidthsRef.current.trailing * logoProgress}px`;
        leadingLetters.style.opacity = logoProgress;
        trailingLetters.style.opacity = logoProgress;
      }

      // Progress Bar Logic (0 to 1 across entire page)
      if (progressBarRef.current && totalScroll > 0) {
        const progress = Math.min(scrollY / totalScroll, 1);
        progressBarRef.current.style.width = `${progress * 100}%`;
      }
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateHeader);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateHeader();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const handleLogoClick = (e) => {
    // If on home, scroll to top instead of navigating
    if (router.pathname === '/') {
      e.preventDefault();
      scrollToSection("home");
    }
  };

  const handleNavClick = (item) => {
    if (item.opensPage) {
      router.push(item.link);
      return;
    }

    const ref = item.sectionRef;
    if (router.pathname !== '/') {
      router.push(item.link);
      return;
    }

    scrollToSection(ref);
  };

  // Menu items for StaggeredMenu
  const menuItems = MENULINKS.map((link) => ({
    label: link.name,
    ariaLabel: link.ref === "projects" ? "Open Projects page" : `Go to ${link.name}`,
    link: getSectionHref(link.ref),
    sectionRef: link.ref,
    opensPage: link.ref === "projects",
  }));

  const socialItems = SOCIAL_LINKS.map((social) => ({
    label: social.label || social.name.charAt(0).toUpperCase() + social.name.slice(1),
    link: social.url
  }));

  return (
    <header
      data-cursor-boundary="navigation"
      aria-hidden={isHeroLocked}
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-200 ease-out ${isHeroLocked ? 'pointer-events-none -translate-y-3 opacity-0' : 'translate-y-0 opacity-100'} ${isScrolled ? 'bg-[var(--bg-primary)]' : 'bg-transparent'} py-4 md:py-6`}
      style={isHeroLocked ? { opacity: 0, transform: "translateY(-0.75rem)", pointerEvents: "none" } : undefined}
    >
      <div className="section-container flex justify-between items-center gap-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          aria-label="Kingsley Aremu"
          tabIndex={isHeroLocked ? -1 : 0}
          className="relative block h-6 min-w-[90px] sm:min-w-[140px] cursor-none"
          style={{ color: 'var(--fg-primary)' }}
        >
          <span className="inline-flex h-6 items-center whitespace-nowrap text-body-sm font-medium tracking-wide">
            <span className="font-semibold">K</span>
            <span
              ref={logoLeadingRef}
              aria-hidden="true"
              className="inline-block overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200 ease-out"
              style={{ width: 0, opacity: 0 }}
            >
              ingsley&nbsp;
            </span>
            <span className="font-semibold">A</span>
            <span
              ref={logoTrailingRef}
              aria-hidden="true"
              className="inline-block overflow-hidden whitespace-nowrap transition-[opacity,width] duration-200 ease-out"
              style={{ width: 0, opacity: 0 }}
            >
              remu
            </span>
          </span>
        </Link>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <SnowToggle />
          <StaggeredMenu
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="var(--fg-primary)"
            openMenuButtonColor="#ffffff"
            changeMenuColorOnOpen={true}
            onItemClick={handleNavClick}
          />
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--fg-primary)] transition-all duration-100 ease-out z-50"
        style={{ width: '0%' }}
      />
    </header>
  );
};

export default Header;
