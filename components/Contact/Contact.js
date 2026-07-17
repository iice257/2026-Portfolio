import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { CONTACT_LINKS, MENULINKS } from "../../constants";
import { useTheme } from "../../context/ThemeContext";
import { PORTFOLIO_WAVES_THEME_CONFIG } from "../ReactBits/galaxyConfig";

const Waves = dynamic(() => import("../ReactBits/Waves"), { ssr: false });

const Contact = () => {
  const sectionRef = useRef(null);
  const { theme } = useTheme();
  const [canRenderContactBackdrop, setCanRenderContactBackdrop] = useState(true);
  const [isContactBackdropPaused, setIsContactBackdropPaused] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current.querySelectorAll(".contact-reveal");

      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;

    const syncBackdrop = () => {
      const shouldReduce = motionQuery.matches;
      const isDocumentHidden = document.visibilityState === "hidden";
      setCanRenderContactBackdrop(!shouldReduce);
      setIsContactBackdropPaused(!isVisible || shouldReduce || isDocumentHidden);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncBackdrop();
      },
      { rootMargin: "260px 0px", threshold: [0, 0.01] }
    );

    observer.observe(section);
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
    <section
      ref={sectionRef}
      id={MENULINKS[4].ref}
      className="relative overflow-hidden section-spacing-lg"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {canRenderContactBackdrop && (
        <div className="contact-effect contact-effect-waves" aria-hidden="true">
          <Waves
            {...(PORTFOLIO_WAVES_THEME_CONFIG[theme] || PORTFOLIO_WAVES_THEME_CONFIG.light)}
            pixelRatio={0.72}
            targetFps={24}
            maxPixelCount={850000}
            paused={isContactBackdropPaused}
          />
        </div>
      )}

      <div className="contact-top-feather" aria-hidden="true" />

      <div className="section-container relative z-[2]">
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-caption uppercase tracking-widest mb-4 contact-reveal"
            style={{ color: "var(--fg-muted)" }}
          >
            Get in Touch
          </p>

          <h2
            className="contact-title text-display-lg md:text-display-xl font-light mb-8 contact-reveal"
            style={{ color: "var(--fg-primary)" }}
          >
            <span className="block">We&apos;re gonna build amazing things,</span>
            <span className="block">together.</span>
          </h2>

          <p
            className="text-body-xl mb-12 contact-reveal"
            style={{ color: "var(--fg-secondary)" }}
          >
            I&apos;m always open. Really.
          </p>

          <a href={CONTACT_LINKS[0].url} className="btn btn-primary contact-primary-cta contact-reveal">
            Send an Email
          </a>

          <p
            className="text-body-sm mt-8 contact-reveal"
            style={{ color: "var(--fg-muted)" }}
          >
            or reach out on{" "}
            {CONTACT_LINKS.slice(1).map((link, index) => (
              <span key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                  style={{ color: "var(--fg-primary)" }}
                >
                  {link.label}
                </a>
                {index < CONTACT_LINKS.length - 2 ? " / " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
