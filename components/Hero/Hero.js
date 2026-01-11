import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";

const Hero = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const subRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Reveal
      const tl = gsap.timeline({
        defaults: { ease: "cinematic", duration: 1.5 }
      });

      tl.fromTo(textRef.current,
        { yPercent: 120, autoAlpha: 0, rotateX: 20 },
        { yPercent: 0, autoAlpha: 1, rotateX: 0 }
      )
        .fromTo(subRef.current,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 1 },
          "-=1"
        );

      // Scroll Parallax
      gsap.to(textRef.current, {
        yPercent: 50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[0].ref}
      className="relative min-h-screen flex flex-col justify-end pb-32 overflow-hidden px-4 md:px-12"
    >
      <div className="absolute inset-0 bg-paper dark:bg-black opacity-100 z-[-1]" />

      <div className="max-w-[90vw]">
        {/* Eyebrow */}
        <div ref={subRef} className="flex flex-col md:flex-row gap-6 md:items-end mb-8 md:mb-12">
          <span className="text-meta tracking-[0.2em] text-neutral-500">
            (EST. 2026)
          </span>
          <span className="text-body-md text-neutral-900 dark:text-neutral-200 max-w-sm">
            Crafting digital experiences where typography is the interface and motion is the narrative.
          </span>
        </div>

        {/* Massive Headline */}
        <h1
          ref={textRef}
          className="text-kinetic-xl font-bold leading-[0.8] tracking-tighter text-black dark:text-neutral-100 whitespace-nowrap will-change-transform"
        >
          KINGSLEY<br />AREMU
        </h1>
      </div>
    </section>
  );
};

export default Hero;
