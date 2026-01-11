import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";

const Hero = () => {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial load animation
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        }
      });

      // Animate name with stagger effect on each letter
      const nameChars = nameRef.current.querySelectorAll('.char');
      tl.fromTo(
        nameChars,
        {
          y: 200,
          opacity: 0,
          rotationX: -90
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.03,
        }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.4"
        );

      // Pin the hero section and create parallax effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: false,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Parallax on name - moves slower
          gsap.set(nameRef.current, {
            y: progress * 150,
            opacity: 1 - progress * 1.2,
          });

          // Subtitle moves faster
          gsap.set(subtitleRef.current, {
            y: progress * 250,
            opacity: 1 - progress * 1.5,
          });

          // Scroll indicator fades quickly
          gsap.set(scrollIndicatorRef.current, {
            opacity: 1 - progress * 3,
          });
        }
      });

      // Tracking animation on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "50% top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Tighten letter spacing as you scroll
          nameRef.current.style.letterSpacing = `${-0.04 + (progress * -0.02)}em`;
        }
      });

    });

    return () => ctx.revert();
  }, []);

  // Split text into characters for animation
  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ transformOrigin: 'bottom' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[0].ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container-wide w-full">
        {/* Oversized name - viewport breaking */}
        <div className="relative">
          <h1
            ref={nameRef}
            className="text-hero font-extralight text-center"
            style={{
              color: 'var(--fg-primary)',
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            {splitText('KINGSLEY')}
            <br />
            {splitText('AREMU')}
          </h1>
        </div>

        {/* Subtitle - editorial style */}
        <div
          ref={subtitleRef}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <p
            className="text-editorial font-light"
            style={{ color: 'var(--fg-secondary)' }}
          >
            Full-Stack Developer crafting digital experiences with precision,
            performance, and intentional design.
          </p>

          {/* Micro text for contrast */}
          <p
            className="text-micro mt-8"
            style={{ color: 'var(--fg-muted)' }}
          >
            Currently building at W3Pets — Lagos, Nigeria
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="text-micro"
            style={{ color: 'var(--fg-muted)' }}
          >
            SCROLL
          </span>
          <div
            className="w-px h-16 bg-gradient-to-b from-current to-transparent"
            style={{ color: 'var(--fg-muted)' }}
          />
        </div>
      </div>

      {/* Background texture (optional) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
    </section>
  );
};

export default Hero;
