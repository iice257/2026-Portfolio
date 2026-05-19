import { useState, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Hero from "@/components/Hero/Hero";
import Philosophy from "@/components/Philosophy/Philosophy";
import Skills from "@/components/Skills/Skills";
import Projects from "@/components/Projects/Projects";
import Work from "@/components/Work/Work";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import ProgressIndicator from "@/components/ProgressIndicator/ProgressIndicator";
import {
  getRequestedSection,
  replaceSectionUrl,
  scrollToSection,
  SECTION_IDS,
} from "../utils/sectionNavigation";

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const { orientation } = window;
    const result =
      typeof orientation === "undefined" &&
      navigator.userAgent.indexOf("IEMobile") === -1;

    setIsDesktop(result);

    // Smooth scroll clean section links while keeping them as real-looking paths.
    const handleSectionLinkClick = (e) => {
      const anchor = e.target.closest?.("a[href^='/']");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      const { pathname } = new URL(href, window.location.origin);
      const sectionId = pathname.replace(/^\/+|\/+$/g, "");

      if (!SECTION_IDS.includes(sectionId)) return;

      e.preventDefault();
      scrollToSection(sectionId);
    };

    document.addEventListener("click", handleSectionLinkClick);
    return () => document.removeEventListener("click", handleSectionLinkClick);
  }, []);

  useEffect(() => {
    const observed = [
      ...SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean),
    ];

    if (!observed.length) return undefined;

    let frameId = null;
    const updateUrlFromViewport = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        const centerY = window.innerHeight * 0.45;
        const ranked = observed
          .map((section) => {
            const rect = section.getBoundingClientRect();
            return {
              section,
              distance: Math.abs((rect.top + rect.bottom) / 2 - centerY),
              visible: rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.82,
            };
          })
          .filter((item) => item.visible)
          .sort((a, b) => a.distance - b.distance);

        const active = ranked[0]?.section;
        if (!active) return;

        if (SECTION_IDS.includes(active.id)) {
          replaceSectionUrl(active.id);
        }
      });
    };

    const observer = new IntersectionObserver(updateUrlFromViewport, {
      rootMargin: "-18% 0px -18% 0px",
      threshold: [0, 0.2, 0.45, 0.7],
    });

    observed.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateUrlFromViewport, { passive: true });
    window.addEventListener("resize", updateUrlFromViewport);

    const requestedSection = getRequestedSection();
    if (requestedSection) {
      window.requestAnimationFrame(() => {
        scrollToSection(requestedSection, { behavior: "auto", updateUrl: true });
      });
    } else {
      updateUrlFromViewport();
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
      window.removeEventListener("scroll", updateUrlFromViewport);
      window.removeEventListener("resize", updateUrlFromViewport);
    };
  }, []);

  return (
    <>
      <ProgressIndicator />

      <main id="main-content" className="relative z-10">
        <Hero />
        <Philosophy />
        <Skills />
        <Projects isDesktop={isDesktop} />
        <Work />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
