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
import BackgroundShapes from "@/components/BackgroundShapes/BackgroundShapes";

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

  return (
    <>
      <BackgroundShapes />
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
