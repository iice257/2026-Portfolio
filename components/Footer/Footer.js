import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CONTACT_LINKS, MENULINKS } from "../../constants";
import ShuffleText from "../ReactBits/ShuffleText";
import { useTheme } from "../../context/ThemeContext";
import { getSectionHref, scrollToSection, SECTION_IDS } from "../../utils/sectionNavigation";

const Galaxy = dynamic(() => import("../ReactBits/Galaxy"), { ssr: false });
const Waves = dynamic(() => import("../ReactBits/Waves"), { ssr: false });

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [canRenderFooterBackdrop, setCanRenderFooterBackdrop] = useState(false);
  const navLinks = MENULINKS.filter((link) => link.ref !== "home");
  const directOrder = ["twitter", "mail", "github", "linkedin"];
  const directLinks = [...CONTACT_LINKS].sort((a, b) => (
    directOrder.indexOf(a.name) - directOrder.indexOf(b.name)
  ));

  const handleSectionClick = (event, sectionId) => {
    if (typeof window === "undefined") return;

    const currentPathSection = window.location.pathname.replace(/^\/+|\/+$/g, "");
    const isHomeSurface = window.location.pathname === "/" || (
      SECTION_IDS.includes(currentPathSection) &&
      Boolean(document.getElementById(currentPathSection))
    );
    if (!isHomeSurface) return;

    event.preventDefault();
    scrollToSection(sectionId);
  };

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;

    const syncBackdrop = () => {
      setCanRenderFooterBackdrop(
        isVisible &&
        !motionQuery.matches &&
        document.visibilityState !== "hidden"
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncBackdrop();
      },
      { rootMargin: "260px 0px", threshold: [0, 0.01] }
    );

    observer.observe(footer);
    syncBackdrop();

    motionQuery.addEventListener("change", syncBackdrop);
    document.addEventListener("visibilitychange", syncBackdrop);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", syncBackdrop);
      document.removeEventListener("visibilitychange", syncBackdrop);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden pt-20 md:pt-28 pb-8"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {canRenderFooterBackdrop && theme === "dark" && (
        <div className="footer-effect footer-effect-galaxy" aria-hidden="true">
          <Galaxy
            mouseRepulsion={false}
            mouseInteraction={false}
            density={0.46}
            glowIntensity={0.07}
            saturation={0.42}
            hueShift={0}
            twinkleIntensity={0.32}
            rotationSpeed={0}
            speed={0.045}
            pixelRatio={0.38}
            targetFps={18}
            maxPixelCount={240000}
          />
        </div>
      )}

      {canRenderFooterBackdrop && theme === "light" && (
        <div className="footer-effect footer-effect-waves" aria-hidden="true">
          <Waves
            lineColor="#8f8f8f"
            backgroundColor="transparent"
            waveSpeedX={0.004}
            waveSpeedY={0.004}
            waveAmpX={18}
            waveAmpY={9}
            friction={0.76}
            tension={0.004}
            maxCursorMove={70}
            xGap={36}
            yGap={22}
            pixelRatio={0.38}
            targetFps={18}
            maxPixelCount={220000}
            mouseInteraction={false}
          />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--fg-primary), transparent)" }}
      />

      <div className="section-container relative z-[1]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
              hit me up
            </p>
            <h2
              className="text-display-lg md:text-display-xl font-light leading-[0.95] max-w-4xl"
              style={{ color: "var(--fg-primary)" }}
            >
              <span className="block">
                <ShuffleText text="Let's get" duration={0.45} shuffleTimes={4} textAlign="left" />
              </span>
              <span className="block">
                <ShuffleText text="busy..." duration={0.45} shuffleTimes={4} textAlign="left" />
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <nav aria-label="Footer navigation">
              <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                Index
              </p>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.ref}>
                    <Link
                      href={link.ref === "projects" ? "/projects" : getSectionHref(link.ref)}
                      className="text-body-lg link-underline inline-flex items-center gap-2"
                      style={{ color: "var(--fg-primary)" }}
                      onClick={(event) => {
                        if (link.ref !== "projects") handleSectionClick(event, link.ref);
                      }}
                    >
                      <span>{link.name}</span>
                      {link.ref === "projects" && <span aria-hidden="true">↗</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-micro mb-5" style={{ color: "var(--fg-muted)" }}>
                Direct
              </p>
              <ul className="space-y-3">
                {directLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="text-body-lg link-underline"
                      style={{ color: "var(--fg-primary)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 pt-7 border-t flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-body-sm" style={{ color: "var(--fg-muted)" }}>
            &copy; {currentYear} KA
          </p>
          <p className="text-body-sm" style={{ color: "var(--fg-muted)" }}>
            Full-Stack Engineer.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
