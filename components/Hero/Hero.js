import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MENULINKS } from "../../constants";
import { useHeroLock } from "../../context/HeroLockContext";
import { useTheme } from "../../context/ThemeContext";
import TextPressure from "../ReactBits/TextPressure";
import styles from "./Hero.module.scss";

const Galaxy = dynamic(() => import("../ReactBits/Galaxy"), { ssr: false });
const Waves = dynamic(() => import("../ReactBits/Waves"), { ssr: false });

const HERO_CAPABILITY_PHRASES = [
  "digital experiences",
  "mobile apps",
  "infrastructure",
  "human-centred interfaces",
  "landing pages",
  "machine learning algorithms",
  "intelligence and research systems",
  "cross-platform experiences",
  "agentic workflows",
  "design systems",
  "automation systems",
  "data dashboards",
  "vertical software architecture",
  "API integrations",
  "AI-powered tools",
];

const HERO_CAPABILITY_TRANSITION_MS = 640;
const LOCK_VIEWPORT_QUERY = "(max-width: 1023px)";
const TOOLTIP_DELAY_MS = 5000;
const TOOLTIP_VISIBLE_MS = 3200;

const LockIcon = ({ unlocked = false }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={unlocked ? "M10 14V9.7C10 5.85 12.52 3.5 16.05 3.5C18.62 3.5 20.65 4.78 21.55 6.88" : "M10 14V9.7C10 5.85 12.45 3.5 16 3.5C19.55 3.5 22 5.85 22 9.7V14"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="6.5"
      y="13.5"
      width="19"
      height="15"
      rx="3.5"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 17.8V24.2M13.25 19.35L18.75 22.65M18.75 19.35L13.25 22.65M12.8 21H19.2"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Hero = () => {
  const { setIsHeroLocked } = useHeroLock();
  const { theme } = useTheme();
  const [isLockViewport, setIsLockViewport] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [canRenderHeroBackdrop, setCanRenderHeroBackdrop] = useState(true);
  const [isHeroBackdropPaused, setIsHeroBackdropPaused] = useState(false);
  const [showUnlockTooltip, setShowUnlockTooltip] = useState(false);
  const [interactionPulse, setInteractionPulse] = useState(0);
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);
  const [previousCapabilityIndex, setPreviousCapabilityIndex] = useState(null);
  const [capabilityWidth, setCapabilityWidth] = useState(null);
  const sectionRef = useRef(null);
  const nameContainerRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const capabilitySizerRef = useRef(null);
  const isLockViewportRef = useRef(false);
  const isLockedRef = useRef(false);
  const hasUnlockedRef = useRef(false);
  const initialLockViewportRef = useRef(false);
  const tooltipTimerRef = useRef(null);
  const lockedInteractionSeenRef = useRef(false);
  const savedScrollYRef = useRef(0);

  const clearTooltipTimer = useCallback(() => {
    window.clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = null;
  }, []);

  const showTimedUnlockTooltip = useCallback(() => {
    setShowUnlockTooltip(true);
    clearTooltipTimer();
    tooltipTimerRef.current = window.setTimeout(() => {
      setShowUnlockTooltip(false);
    }, TOOLTIP_VISIBLE_MS);
  }, [clearTooltipTimer]);

  const triggerTextPressureInteraction = useCallback((x, y) => {
    window.dispatchEvent(
      new CustomEvent("portfolio:hero-locked-pointer", {
        detail: { x, y },
      })
    );
  }, []);

  const registerLockedInteraction = useCallback((x, y) => {
    triggerTextPressureInteraction(x, y);
    setInteractionPulse((value) => value + 1);

    if (lockedInteractionSeenRef.current) return;
    lockedInteractionSeenRef.current = true;
    clearTooltipTimer();

    tooltipTimerRef.current = window.setTimeout(() => {
      if (isLockedRef.current) {
        showTimedUnlockTooltip();
      }
    }, TOOLTIP_DELAY_MS);
  }, [clearTooltipTimer, showTimedUnlockTooltip, triggerTextPressureInteraction]);

  const unlockHero = useCallback(() => {
    hasUnlockedRef.current = true;
    setHasUnlocked(true);
    setIsLocked(false);
    setShowUnlockTooltip(false);
    clearTooltipTimer();
  }, [clearTooltipTimer]);

  const lockHero = useCallback(() => {
    if (!isLockViewportRef.current) return;
    setIsLocked(true);
    window.setTimeout(showTimedUnlockTooltip, TOOLTIP_DELAY_MS);
  }, [showTimedUnlockTooltip]);

  const toggleHeroLock = useCallback(() => {
    if (isLockedRef.current) {
      unlockHero();
      return;
    }

    lockHero();
  }, [lockHero, unlockHero]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(LOCK_VIEWPORT_QUERY);
    initialLockViewportRef.current = mediaQuery.matches;

    const updateLockViewport = () => {
      const matches = mediaQuery.matches;
      isLockViewportRef.current = matches;
      setIsLockViewport(matches);

      if (!matches) {
        setIsLocked(false);
        setShowUnlockTooltip(false);
        return;
      }

      if (initialLockViewportRef.current && !hasUnlockedRef.current) {
        setIsLocked(true);
      }
    };

    updateLockViewport();
    mediaQuery.addEventListener("change", updateLockViewport);

    return () => mediaQuery.removeEventListener("change", updateLockViewport);
  }, [showTimedUnlockTooltip]);

  useEffect(() => {
    isLockedRef.current = isLocked;
    setIsHeroLocked(isLocked);

    if (isLocked && isLockViewportRef.current) {
      clearTooltipTimer();
      tooltipTimerRef.current = window.setTimeout(showTimedUnlockTooltip, TOOLTIP_DELAY_MS);
    }
  }, [clearTooltipTimer, isLocked, setIsHeroLocked, showTimedUnlockTooltip]);

  useEffect(() => {
    return () => {
      clearTooltipTimer();
      window.setTimeout(() => {
        if (!document.getElementById(MENULINKS[0].ref)) {
          setIsHeroLocked(false);
        }
      }, 0);
    };
  }, [clearTooltipTimer, setIsHeroLocked]);

  useEffect(() => {
    if (!isLocked) return undefined;

    savedScrollYRef.current = window.scrollY;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const previousBody = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    const previousHtml = {
      overflow: document.documentElement.style.overflow,
      overscrollBehavior: document.documentElement.style.overscrollBehavior,
    };

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = "0";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overscrollBehavior = "none";

    const getEventPoint = (event) => {
      const touch = event.touches?.[0] || event.changedTouches?.[0];
      if (touch) return { x: touch.clientX, y: touch.clientY };
      return {
        x: Number.isFinite(event.clientX) ? event.clientX : window.innerWidth / 2,
        y: Number.isFinite(event.clientY) ? event.clientY : window.innerHeight / 2,
      };
    };

    const handleLockedIntent = (event) => {
      if (event.target?.closest?.("[data-hero-lock-control='true']")) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      const point = getEventPoint(event);
      registerLockedInteraction(point.x, point.y);
    };

    const handleLockedKeydown = (event) => {
      const scrollKeys = [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"];
      if (!scrollKeys.includes(event.key)) return;

      if (event.target?.closest?.("[data-hero-lock-control='true']")) {
        return;
      }

      event.preventDefault();
      registerLockedInteraction(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener("touchstart", handleLockedIntent, { passive: false, capture: true });
    window.addEventListener("touchmove", handleLockedIntent, { passive: false, capture: true });
    window.addEventListener("wheel", handleLockedIntent, { passive: false, capture: true });
    window.addEventListener("keydown", handleLockedKeydown, true);

    return () => {
      window.removeEventListener("touchstart", handleLockedIntent, true);
      window.removeEventListener("touchmove", handleLockedIntent, true);
      window.removeEventListener("wheel", handleLockedIntent, true);
      window.removeEventListener("keydown", handleLockedKeydown, true);

      document.documentElement.style.overflow = previousHtml.overflow;
      document.documentElement.style.overscrollBehavior = previousHtml.overscrollBehavior;
      document.body.style.overflow = previousBody.overflow;
      document.body.style.position = previousBody.position;
      document.body.style.top = previousBody.top;
      document.body.style.left = previousBody.left;
      document.body.style.right = previousBody.right;
      document.body.style.width = previousBody.width;
      document.body.style.overscrollBehavior = previousBody.overscrollBehavior;
      window.scrollTo({ top: savedScrollYRef.current, left: 0, behavior: "auto" });
    };
  }, [isLocked, registerLockedInteraction]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.18);
      },
      { threshold: [0, 0.18, 0.45] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = true;

    const syncBackdrop = () => {
      const shouldReduce = motionQuery.matches;
      const isDocumentHidden = document.visibilityState === "hidden";
      setCanRenderHeroBackdrop(!shouldReduce);
      setIsHeroBackdropPaused(!isVisible || shouldReduce || isDocumentHidden);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncBackdrop();
      },
      { rootMargin: "180px 0px", threshold: [0, 0.01] }
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

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return undefined;

    const intervalId = window.setInterval(() => {
      if (!isHeroInView || document.visibilityState === "hidden") return;

      setActiveCapabilityIndex((index) => {
        setPreviousCapabilityIndex(index);
        return (index + 1) % HERO_CAPABILITY_PHRASES.length;
      });
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [isHeroInView]);

  useEffect(() => {
    if (previousCapabilityIndex === null) return undefined;

    const timeoutId = window.setTimeout(() => {
      setPreviousCapabilityIndex(null);
    }, HERO_CAPABILITY_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [previousCapabilityIndex]);

  useEffect(() => {
    const sizer = capabilitySizerRef.current;
    if (!sizer) return undefined;

    const updateCapabilityWidth = () => {
      setCapabilityWidth(Math.ceil(sizer.getBoundingClientRect().width));
    };

    updateCapabilityWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateCapabilityWidth);
      return () => window.removeEventListener("resize", updateCapabilityWidth);
    }

    const observer = new ResizeObserver(updateCapabilityWidth);
    observer.observe(sizer);

    return () => observer.disconnect();
  }, [activeCapabilityIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.fromTo(
        nameContainerRef.current,
        { opacity: 0, y: reduceMotion ? 0 : 14 },
        { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.22 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: reduceMotion ? 0 : 8 },
          { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.18 },
          "-=0.08"
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: reduceMotion ? 0.01 : 0.16 },
          "-=0.08"
        );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (isLockedRef.current) return;

          const progress = self.progress;
          const isCompact = isLockViewportRef.current;

          gsap.set(nameContainerRef.current, {
            y: isCompact ? progress * 56 : progress * 150,
            scale: isCompact ? 1 - progress * 0.1 : 1,
            filter: isCompact ? `blur(${progress * 3}px)` : "blur(0px)",
            opacity: isCompact ? 1 - progress * 0.38 : 1 - progress * 1.2,
          });

          gsap.set(subtitleRef.current, {
            y: progress * 180,
            opacity: 1 - progress * 1.35,
          });

          gsap.set(scrollIndicatorRef.current, {
            opacity: 1 - progress * 3,
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const isLockControlVisible = isLockViewport && (isLocked || isHeroInView);

  return (
    <section
      ref={sectionRef}
      id={MENULINKS[0].ref}
      className={`${styles.heroSection} ${isLocked ? styles.heroSectionLocked : ""} ${hasUnlocked ? styles.heroSectionUnlocked : ""} relative min-h-[100dvh] lg:min-h-screen flex items-center justify-center overflow-hidden`}
      style={{ backgroundColor: "var(--bg-primary)" }}
      data-hero-locked={isLocked ? "true" : "false"}
    >
      {canRenderHeroBackdrop && theme === "dark" && (
        <div className={styles.galaxyBackdrop} aria-hidden="true">
          <Galaxy
            mouseRepulsion={false}
            mouseInteraction={false}
            density={0.54}
            glowIntensity={0.08}
            saturation={0.65}
            hueShift={0}
            twinkleIntensity={0.45}
            rotationSpeed={0}
            speed={0.08}
            pixelRatio={0.48}
            targetFps={22}
            maxPixelCount={520000}
            paused={isHeroBackdropPaused}
          />
        </div>
      )}

      {canRenderHeroBackdrop && theme === "light" && (
        <div className={styles.wavesBackdrop} aria-hidden="true">
          <Waves
            lineColor="#a4a4a4"
            backgroundColor="transparent"
            waveSpeedX={0.008}
            waveSpeedY={0.008}
            waveAmpX={28}
            waveAmpY={14}
            friction={0.72}
            tension={0.005}
            maxCursorMove={160}
            xGap={28}
            yGap={16}
            pixelRatio={0.48}
            targetFps={0}
            maxPixelCount={520000}
            mouseInteraction={!isLockViewport || isLocked}
            paused={isHeroBackdropPaused}
          />
        </div>
      )}

      {theme === "light" && <div className={styles.heroBottomFeather} aria-hidden="true" />}

      <div className="section-container-wide w-full relative z-[1]">
        <div
          ref={nameContainerRef}
          className={`${styles.heroTitleShell} ${interactionPulse ? styles.heroTitleShellPulse : ""} relative flex flex-col items-center`}
          style={{ "--pulse-index": interactionPulse }}
        >
          {isLockViewport && (
            <div
              className={`${styles.lockDock} ${isLockControlVisible ? styles.lockDockVisible : styles.lockDockHidden}`}
            >
              <button
                type="button"
                data-hero-lock-control="true"
                className={`${styles.lockButton} ${!isLocked && hasUnlocked ? styles.lockButtonUnlocked : ""}`}
                onClick={toggleHeroLock}
                aria-label={isLocked ? "Unlock page scrolling" : "Relock interactive hero"}
                aria-pressed={!isLocked}
              >
                <LockIcon unlocked={!isLocked && hasUnlocked} />
              </button>

              <div
                role="status"
                aria-live="polite"
                className={`${styles.unlockTooltip} ${showUnlockTooltip ? styles.unlockTooltipVisible : ""}`}
              >
                {isLocked ? "Unlock to scroll" : "Relock for hero interaction"}
              </div>
            </div>
          )}

          <div className={styles.nameStack} aria-label="Kingsley Aremu">
            <div className={styles.firstName}>
              <TextPressure
                text="KINGSLEY"
                fontFamily="var(--font-inter)"
                fontUrl={null}
                width={false}
                weight={true}
                italic={false}
                alpha={false}
                flex={false}
                stroke={false}
                scale={false}
                textColor="var(--fg-primary)"
                minFontSize={42}
              />
            </div>

            <div className={styles.lastName}>
              <TextPressure
                text="AREMU"
                fontFamily="var(--font-inter)"
                fontUrl={null}
                width={false}
                weight={true}
                italic={false}
                alpha={false}
                flex={false}
                stroke={false}
                scale={false}
                textColor="var(--fg-primary)"
                minFontSize={42}
              />
            </div>
          </div>
        </div>

        <div
          ref={subtitleRef}
          data-hide-when-hero-locked="true"
          className={`${styles.heroDetails} ${isLocked ? styles.heroDetailsHidden : ""} mt-8 md:mt-8 lg:mt-[-1.25rem] text-center max-w-4xl mx-auto`}
        >
          <p
            className="text-editorial font-light"
            style={{ color: "var(--fg-secondary)" }}
          >
            <span className={`${styles.heroIntroLine} block text-center`}>
              <span className={styles.heroLead}>Full-Stack Engineer</span>{" "}
              <span className={styles.heroCrafting}>crafting{" "}
              <span
                className="hero-capability-cycle"
                aria-live="off"
                style={capabilityWidth ? { width: `${capabilityWidth}px` } : undefined}
              >
                {previousCapabilityIndex !== null && (
                  <span
                    key={`previous-${previousCapabilityIndex}`}
                    className="hero-capability-cycle__item hero-capability-cycle__item--exit"
                  >
                    {HERO_CAPABILITY_PHRASES[previousCapabilityIndex]}
                  </span>
                )}
                <span
                  key={`active-${activeCapabilityIndex}`}
                  className={`hero-capability-cycle__item ${
                    previousCapabilityIndex !== null ? "hero-capability-cycle__item--enter" : "hero-capability-cycle__item--current"
                  }`}
                >
                  {HERO_CAPABILITY_PHRASES[activeCapabilityIndex]}
                </span>
                <span
                  ref={capabilitySizerRef}
                  className="hero-capability-cycle__sizer"
                  aria-hidden="true"
                >
                  {HERO_CAPABILITY_PHRASES[activeCapabilityIndex]}
                </span>
              </span>
              </span>
            </span>
            <span className={styles.heroPrecisionLine}>
              with precision, performance, and intentional design.
            </span>
          </p>

          <div className="hero-subtitle-divider" aria-hidden="true" />

          <p
            className="text-micro mt-4"
            style={{ color: "var(--fg-muted)" }}
          >
            BUILDING IN PUBLIC - LAGOS, NIGERIA
          </p>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        data-hide-when-hero-locked="true"
        className={`${styles.scrollCue} ${isLocked ? styles.scrollCueHidden : ""} absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 z-[1]`}
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="text-micro"
            style={{ color: "var(--fg-muted)" }}
          >
            SCROLL
          </span>
          <div
            className="w-px h-10 md:h-12 xl:h-16 bg-gradient-to-b from-current to-transparent"
            style={{ color: "var(--fg-muted)" }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
    </section>
  );
};

export default Hero;
