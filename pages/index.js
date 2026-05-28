import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Hero from "@/components/Hero/Hero";
import ProgressIndicator from "@/components/ProgressIndicator/ProgressIndicator";
import { useHeroLock } from "../context/HeroLockContext";
import {
  getRequestedSection,
  replaceSectionUrl,
  scrollToSection,
  SECTION_IDS,
} from "../utils/sectionNavigation";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

const Philosophy = dynamic(() => import("@/components/Philosophy/Philosophy"));
const Skills = dynamic(() => import("@/components/Skills/Skills"));
const Projects = dynamic(() => import("@/components/Projects/Projects"));
const Work = dynamic(() => import("@/components/Work/Work"));
const Contact = dynamic(() => import("@/components/Contact/Contact"));
const Footer = dynamic(() => import("@/components/Footer/Footer"));

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(true);
  const { isHeroLocked } = useHeroLock();
  const lockedContentProps = isHeroLocked
    ? { "aria-hidden": "true", inert: "" }
    : {};

  useEffect(() => {
    const desktopQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointerMode = () => setIsDesktop(desktopQuery.matches);

    updatePointerMode();
    desktopQuery.addEventListener("change", updatePointerMode);

    // Smooth scroll clean section links while keeping them as real-looking paths.
    const handleSectionLinkClick = (e) => {
      const anchor = e.target.closest?.("a[href^='/']");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const { pathname, hash } = new URL(href, window.location.origin);
      const sectionId = hash.replace(/^#/, "") || pathname.replace(/^\/+|\/+$/g, "");

      if (!SECTION_IDS.includes(sectionId)) return;
      if (sectionId === "projects") return;

      e.preventDefault();
      scrollToSection(sectionId);
    };

    document.addEventListener("click", handleSectionLinkClick);
    return () => {
      desktopQuery.removeEventListener("change", updatePointerMode);
      document.removeEventListener("click", handleSectionLinkClick);
    };
  }, []);

  useEffect(() => {
    let frameId = null;
    const updateUrlFromViewport = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        const observed = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
        if (!observed.length) return;

        const probeY = window.innerHeight * 0.45;
        const measured = observed.map((section) => {
          const rect = section.getBoundingClientRect();
          return {
            section,
            rect,
            distance: Math.abs(rect.top - probeY),
          };
        });
        const containing = measured
          .filter(({ rect }) => rect.top <= probeY && rect.bottom > probeY)
          .sort((a, b) => b.rect.top - a.rect.top);
        const nearest = measured
          .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight)
          .sort((a, b) => a.distance - b.distance);

        const active = containing[0]?.section || nearest[0]?.section;
        if (!active) return;

        if (SECTION_IDS.includes(active.id)) {
          replaceSectionUrl(active.id);
        }
      });
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateUrlFromViewport) : null;
    resizeObserver?.observe(document.body);

    window.addEventListener("scroll", updateUrlFromViewport, { passive: true });
    window.addEventListener("resize", updateUrlFromViewport);

    const requestedSection = getRequestedSection();
    if (requestedSection) {
      let attempts = 0;
      const scrollWhenReady = () => {
        attempts += 1;
        if (document.getElementById(requestedSection)) {
          window.requestAnimationFrame(() => {
            scrollToSection(requestedSection, { behavior: "auto", updateUrl: true });
            updateUrlFromViewport();
          });
          return;
        }

        if (attempts < 60) {
          window.setTimeout(scrollWhenReady, 80);
        }
      };

      scrollWhenReady();
    } else {
      updateUrlFromViewport();
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", updateUrlFromViewport);
      window.removeEventListener("resize", updateUrlFromViewport);
    };
  }, []);

  return (
    <>
      <ProgressIndicator />

      <main id="main-content" className="relative z-10">
        <Hero />
        <div
          className={`site-unlocked-content ${isHeroLocked ? "site-unlocked-content--hidden" : ""}`}
          data-hide-when-hero-locked="true"
          {...lockedContentProps}
        >
          <Philosophy />
          <Skills />
          <Projects isDesktop={isDesktop} />
          <Work />
          <Contact />
        </div>
      </main>

      <div
        className={`site-unlocked-content ${isHeroLocked ? "site-unlocked-content--hidden" : ""}`}
        data-hide-when-hero-locked="true"
        {...lockedContentProps}
      >
        <Footer />
      </div>
    </>
  );
}
