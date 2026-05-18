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

    // Smooth scroll to anchor links
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest?.("a[href^='#']");
      const href = anchor?.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  useEffect(() => {
    const sectionHashes = new Map([
      ["skills", "#skills"],
      ["projects", "#projects"],
      ["experience", "#experience"],
      ["contact", "#contact"],
    ]);

    const normalSections = [
      document.getElementById("home"),
      document.querySelector("[data-normal-url='true']"),
      document.querySelector("footer"),
    ].filter(Boolean);

    const observed = [
      ...Array.from(sectionHashes.keys()).map((id) => document.getElementById(id)).filter(Boolean),
      ...normalSections,
    ];

    if (!observed.length) return undefined;

    const setUrlHash = (hash) => {
      const nextUrl = hash ? `${window.location.pathname}${hash}` : window.location.pathname;
      if (`${window.location.pathname}${window.location.hash}` !== nextUrl) {
        window.history.replaceState(null, "", nextUrl);
      }
    };

    let frameId = null;
    const updateUrlFromViewport = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
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

        setUrlHash(sectionHashes.get(active.id) || "");
      });
    };

    const observer = new IntersectionObserver(updateUrlFromViewport, {
      rootMargin: "-18% 0px -18% 0px",
      threshold: [0, 0.2, 0.45, 0.7],
    });

    observed.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateUrlFromViewport, { passive: true });
    window.addEventListener("resize", updateUrlFromViewport);
    updateUrlFromViewport();

    return () => {
      window.cancelAnimationFrame(frameId);
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
