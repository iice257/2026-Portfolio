import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SnowToggle from "../ReactBits/SnowToggle";
import StaggeredMenu from "../ReactBits/StaggeredMenu";
import { MENULINKS, SOCIAL_LINKS } from "../../constants";

const Header = () => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
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

  const handleLogoClick = (e) => {
    e.preventDefault();

    if (router.pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle menu item navigation
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

  const isScrolled = scrollProgress > 0.1;

  // Menu items for StaggeredMenu
  const menuItems = MENULINKS.map((link) => ({
    label: link.name,
    ariaLabel: `Go to ${link.name}`,
    link: `/#${link.ref}`
  }));

  // Social items for StaggeredMenu
  const socialItems = SOCIAL_LINKS.map((social) => ({
    label: social.name.charAt(0).toUpperCase() + social.name.slice(1),
    link: social.url
  }));

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        padding: isScrolled ? '12px 0' : '24px 0',
        backgroundColor: isScrolled ? 'var(--bg-primary)' : 'transparent',
        borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        transition: 'padding 0.3s ease, background-color 0.3s ease, border-bottom 0.3s ease',
        willChange: 'padding, background-color'
      }}
    >
      <div className="section-container flex justify-between items-center">
        {/* Logo with FADE effect on scroll */}
        <a
          href="/"
          onClick={handleLogoClick}
          className="relative block"
          style={{
            color: 'var(--fg-primary)',
            minWidth: '140px',
            height: '24px',
            cursor: 'none'
          }}
        >
          {/* KA - fades out on scroll */}
          <span
            className="text-body-sm font-semibold tracking-wide absolute left-0 top-0 transition-opacity duration-500 block"
            style={{
              opacity: 1 - scrollProgress,
              pointerEvents: 'none'
            }}
          >
            KA
          </span>
          {/* Full name - fades in on scroll */}
          <span
            className="text-body-sm font-medium tracking-wide whitespace-nowrap absolute left-0 top-0 transition-opacity duration-500 block"
            style={{
              opacity: scrollProgress,
              pointerEvents: 'none'
            }}
          >
            Kingsley Aremu
          </span>
        </a>

        {/* Right side controls */}
        <div className="flex items-center gap-3 relative z-50">
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
            colors={['#000000', '#000000']}
            onItemClick={handleNavClick}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
