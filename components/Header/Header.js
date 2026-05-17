import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SnowToggle from "../ReactBits/SnowToggle";
import StaggeredMenu from "../ReactBits/StaggeredMenu";
import { MENULINKS, SOCIAL_LINKS } from "../../constants";

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for direct DOM manipulation (performance)
  const kaRef = useRef(null);
  const nameRef = useRef(null);
  const progressBarRef = useRef(null);
  const isScrolledRef = useRef(false);

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

      // Logo Fade Logic (0 to 1 over first 200px)
      const logoProgress = Math.min(scrollY / 200, 1);

      if (kaRef.current) {
        kaRef.current.style.opacity = 1 - logoProgress;
      }
      if (nameRef.current) {
        nameRef.current.style.opacity = logoProgress;
      }

      // Progress Bar Logic (0 to 1 across entire page)
      const totalScroll = docHeight - winHeight;
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (item) => {
    const ref = item.link.replace('/#', '');
    if (router.pathname !== '/') {
      router.push(item.link);
    } else {
      const element = document.getElementById(ref);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Menu items for StaggeredMenu
  const menuItems = MENULINKS.map((link) => ({
    label: link.name,
    ariaLabel: `Go to ${link.name}`,
    link: `/#${link.ref}`
  }));

  const socialItems = SOCIAL_LINKS.map((social) => ({
    label: social.label || social.name.charAt(0).toUpperCase() + social.name.slice(1),
    link: social.url
  }));

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ease-in-out ${isScrolled ? 'bg-[var(--bg-primary)]' : 'bg-transparent'} py-6`}
    >
      <div className="section-container flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="relative block h-6 min-w-[140px] cursor-none"
          style={{ color: 'var(--fg-primary)' }}
        >
          {/* KA - fades out */}
          <span
            ref={kaRef}
            className="absolute left-0 top-0 text-body-sm font-semibold tracking-wide transition-opacity duration-300"
            style={{ opacity: 1 }}
          >
            KA
          </span>
          {/* Full Name - fades in */}
          <span
            ref={nameRef}
            className="absolute left-0 top-0 text-body-sm font-medium tracking-wide whitespace-nowrap transition-opacity duration-300"
            style={{ opacity: 0 }}
          >
            Kingsley Aremu
          </span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-4">
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
