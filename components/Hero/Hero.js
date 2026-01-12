import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";
import TextPressure from "../ReactBits/TextPressure";

const Hero = () => {
  const sectionRef = useRef(null);
  const nameContainerRef = useRef(null);
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

      // Animate the name container
      tl.fromTo(
        nameContainerRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2 }
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

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          gsap.set(nameContainerRef.current, {
            y: progress * 150,
            opacity: 1 - progress * 1.2,
          });

          gsap.set(subtitleRef.current, {
            y: progress * 250,
            opacity: 1 - progress * 1.5,
          });

          gsap.set(scrollIndicatorRef.current, {
            opacity: 1 - progress * 3,
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container-wide w-full">
        {/* Name with TextPressure effect - CENTERED */}
        <div
          ref={nameContainerRef}
          className="relative flex flex-col items-center gap-8"
        >
          {/* First name */}
          <div style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '800px', margin: '0 auto', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <TextPressure
              text="KINGSLEY"
              fontFamily="Inter"
              fontUrl="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZNhiJ-Ek-_EeAmM.woff2"
              width={false}
              weight={true}
              italic={false}
              alpha={false}
              flex={false}
              stroke={false}
              scale={false}
              textColor="var(--fg-primary)"
              minFontSize={56}
            />
          </div>


          {/* Last name */}
          <div style={{ position: 'relative', height: '120px', width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            <TextPressure
              text="AREMU"
              fontFamily="Inter"
              fontUrl="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZNhiJ-Ek-_EeAmM.woff2"
              width={false}
              weight={true}
              italic={false}
              alpha={false}
              flex={false}
              stroke={false}
              scale={false}
              textColor="var(--fg-primary)"
              minFontSize={56}
            />
          </div>
        </div>

        {/* Subtitle - editorial style */}
        <div
          ref={subtitleRef}
          className="mt-24 text-center max-w-2xl mx-auto"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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

      {/* Background texture */}
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
