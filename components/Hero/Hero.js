import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Profiles from "../Profiles/Profiles";
import { MENULINKS } from "../../constants";

const Hero = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 1
        }
      });

      // Initial load animation
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0 },
          "-=0.6"
        )
        .fromTo(
          sectionRef.current.querySelectorAll(".hero-reveal"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.15 },
          "-=0.4"
        );

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(headingRef.current, {
            y: progress * 100,
            opacity: 1 - progress * 0.5
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[0].ref}
      className="min-h-screen flex flex-col justify-center section-container relative"
    >
      <div className="max-w-4xl">
        {/* Eyebrow */}
        <p className="text-body-sm tracking-widest uppercase mb-6 hero-reveal" style={{ color: 'var(--fg-muted)' }}>
          Full-Stack Developer
        </p>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="text-display-2xl md:text-display-xl sm:text-display-lg font-light tracking-tight mb-8"
          style={{ color: 'var(--fg-primary)' }}
        >
          Kingsley Aremu
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-body-xl max-w-2xl mb-12 leading-relaxed"
          style={{ color: 'var(--fg-secondary)' }}
        >
          Building high-performance web and mobile applications with React, React Native, and modern JavaScript.
          Focused on craft, clarity, and shipping products that matter.
        </p>

        {/* Currently working on */}
        <p className="text-body-md mb-8 hero-reveal" style={{ color: 'var(--fg-muted)' }}>
          Currently building at <span style={{ color: 'var(--fg-primary)' }}>W3Pets</span>
        </p>

        {/* Social links */}
        <div className="hero-reveal">
          <Profiles />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hero-reveal">
        <div className="flex flex-col items-center gap-2">
          <span className="text-caption uppercase tracking-widest" style={{ color: 'var(--fg-muted)' }}>
            Scroll
          </span>
          <div
            className="w-px h-12"
            style={{
              background: 'linear-gradient(to bottom, var(--fg-muted), transparent)'
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
