import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CONTACT_LINKS, MENULINKS } from "../../constants";
import { PORTFOLIO_GALAXY_CONFIG } from "../ReactBits/galaxyConfig";
import ShuffleText from "../ReactBits/ShuffleText";
import { useTheme } from "../../context/ThemeContext";
import { getSectionHref, scrollToSection, SECTION_IDS } from "../../utils/sectionNavigation";

const Galaxy = dynamic(() => import("../ReactBits/Galaxy"), { ssr: false });

const Footer = () => {
  const footerRef = useRef(null);
  const trailRef = useRef(null);
  const trailFrameRef = useRef(null);
  const trailFadeTimerRef = useRef(null);
  const trailPointRef = useRef({ x: 0, y: 0 });
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const [canRenderFooterBackdrop, setCanRenderFooterBackdrop] = useState(true);
  const [isFooterBackdropPaused, setIsFooterBackdropPaused] = useState(true);
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
      const shouldReduce = motionQuery.matches;
      const isDocumentHidden = document.visibilityState === "hidden";
      setCanRenderFooterBackdrop(!shouldReduce);
      setIsFooterBackdropPaused(!isVisible || shouldReduce || isDocumentHidden);
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

  useEffect(() => {
    const footer = footerRef.current;
    const trail = trailRef.current;
    if (!footer || !trail || theme !== "light" || !canRenderFooterBackdrop) {
      return undefined;
    }

    const renderTrail = () => {
      trailFrameRef.current = null;
      trail.style.setProperty("--trail-x", `${trailPointRef.current.x}px`);
      trail.style.setProperty("--trail-y", `${trailPointRef.current.y}px`);
      trail.classList.add("is-active");
    };

    const handlePointerMove = (event) => {
      const rect = footer.getBoundingClientRect();
      trailPointRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      if (trailFrameRef.current === null) {
        trailFrameRef.current = window.requestAnimationFrame(renderTrail);
      }

      window.clearTimeout(trailFadeTimerRef.current);
      trailFadeTimerRef.current = window.setTimeout(() => {
        trail.classList.remove("is-active");
      }, 180);
    };

    const handlePointerLeave = () => {
      window.clearTimeout(trailFadeTimerRef.current);
      trail.classList.remove("is-active");
    };

    footer.addEventListener("pointermove", handlePointerMove, { passive: true });
    footer.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
      window.clearTimeout(trailFadeTimerRef.current);
      if (trailFrameRef.current !== null) {
        window.cancelAnimationFrame(trailFrameRef.current);
        trailFrameRef.current = null;
      }
      trail.classList.remove("is-active");
    };
  }, [theme, canRenderFooterBackdrop]);

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
            {...PORTFOLIO_GALAXY_CONFIG}
            mouseInteraction={false}
            paused={isFooterBackdropPaused}
          />
        </div>
      )}

      {canRenderFooterBackdrop && theme === "light" && (
        <div ref={trailRef} className="footer-shooting-star-trail" aria-hidden="true" />
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
