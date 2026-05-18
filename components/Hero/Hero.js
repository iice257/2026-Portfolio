import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";
import { useTheme } from "../../context/ThemeContext";
import TextPressure from "../ReactBits/TextPressure";

const ASCIIText = dynamic(() => import("../ReactBits/ASCIIText"), {
  ssr: false,
});

const Hero = () => {
  const { theme } = useTheme();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [showMobileAscii, setShowMobileAscii] = useState(false);
  const sectionRef = useRef(null);
  const nameContainerRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileViewport = () => {
      isMobileRef.current = mediaQuery.matches;
      setIsMobileViewport(mediaQuery.matches);
    };

    updateMobileViewport();
    mediaQuery.addEventListener("change", updateMobileViewport);

    return () => mediaQuery.removeEventListener("change", updateMobileViewport);
  }, []);

  useEffect(() => {
    if (!isMobileViewport || !sectionRef.current) {
      setShowMobileAscii(false);
      return undefined;
    }

    let idleId = null;
    let timeoutId = null;
    let isHeroInView = false;

    const clearMountTimers = () => {
      if (typeof window.cancelIdleCallback === "function" && idleId !== null) {
        window.cancelIdleCallback(idleId);
      }
      window.clearTimeout(timeoutId);
      idleId = null;
      timeoutId = null;
    };

    const deferAsciiMount = () => {
      clearMountTimers();
      const mount = () => setShowMobileAscii(true);
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(mount, { timeout: 900 });
      } else {
        timeoutId = window.setTimeout(mount, 450);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInView = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden) {
          deferAsciiMount();
          return;
        }

        clearMountTimers();
        setShowMobileAscii(false);
      },
      { rootMargin: "120px 0px", threshold: 0.01 }
    );

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearMountTimers();
        setShowMobileAscii(false);
      } else if (isHeroInView) {
        deferAsciiMount();
      }
    };

    observer.observe(sectionRef.current);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearMountTimers();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMobileViewport]);

  useEffect(() => {
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
          const isMobile = isMobileRef.current;

          gsap.set(nameContainerRef.current, {
            y: isMobile ? progress * 72 : progress * 150,
            scale: isMobile ? 1 - progress * 0.18 : 1,
            filter: isMobile ? `blur(${progress * 8}px)` : "blur(0px)",
            opacity: isMobile ? 1 - progress * 0.55 : 1 - progress * 1.2,
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
      className="relative min-h-[112svh] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="section-container-wide w-full">
        {/* Name with TextPressure effect - CENTERED */}
        <div
          ref={nameContainerRef}
          className="relative flex flex-col items-center gap-8"
        >
          <div className="md:hidden relative w-full h-[34vh] min-h-[18rem] max-h-[24rem]" aria-label="Kingsley Aremu">
            {showMobileAscii && (
              <ASCIIText
                text="Kingsley_Aremu"
                enableWaves={true}
                asciiFontSize={7}
                textFontSize={130}
                planeBaseHeight={8}
                textColor={theme === "dark" ? "#fdf9f3" : "#0a0a0a"}
              />
            )}
          </div>

          <div className="hidden md:flex w-full flex-col items-center gap-8">
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
        </div>

        {/* Subtitle - editorial style */}
        <div
          ref={subtitleRef}
          className="hidden md:block mt-24 text-center max-w-2xl mx-auto"
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
        className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2"
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
