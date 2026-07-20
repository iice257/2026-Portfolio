import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Meta from "@/components/Meta/Meta";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { SnowProvider, useSnow } from "../context/SnowContext";
import { TooltipProvider } from "../context/TooltipContext";
import { CursorProvider, useCursor } from "../context/CursorContext";
import { HeroLockProvider, useHeroLock } from "../context/HeroLockContext";
import Header from "../components/Header/Header";
import "../styles/globals.scss";
// React Bits component styles
import "../components/ReactBits/ShuffleText.css";
import "../components/ReactBits/TextPressure.css";
import "../components/ReactBits/StaggeredMenu.css";
import "../components/ReactBits/Galaxy.css";
import "../components/ReactBits/Waves.css";
import "../components/ReactBits/MetallicPaint.css";
import { GTAG } from "../constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  preload: true,
});

const CustomCursor = dynamic(() => import("../components/Cursor/CustomCursor"), {
  ssr: false,
});

const Snowfall = dynamic(() => import("react-snowfall"), {
  ssr: false,
});

// Inner component to access snow and theme context
const AppContent = ({ Component, pageProps }) => {
  const { isSnowing } = useSnow();
  const { theme } = useTheme();
  const { isHeroLocked, setIsHeroLocked } = useHeroLock();
  const { setIsRouteLoading } = useCursor();
  const router = useRouter();
  const isPlayground = router.pathname === "/playground";
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [allowMotion, setAllowMotion] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Page blur-in effect on load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateCapabilities = () => {
      setIsFinePointer(pointerQuery.matches);
      setIsMobileViewport(mobileQuery.matches);
      setAllowMotion(!motionQuery.matches);
    };

    updateCapabilities();
    pointerQuery.addEventListener("change", updateCapabilities);
    mobileQuery.addEventListener("change", updateCapabilities);
    motionQuery.addEventListener("change", updateCapabilities);

    return () => {
      pointerQuery.removeEventListener("change", updateCapabilities);
      mobileQuery.removeEventListener("change", updateCapabilities);
      motionQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  useEffect(() => {
    const updatePageVisibility = () => {
      setIsPageVisible(document.visibilityState !== "hidden");
    };

    updatePageVisibility();
    document.addEventListener("visibilitychange", updatePageVisibility);

    return () => document.removeEventListener("visibilitychange", updatePageVisibility);
  }, []);

  useEffect(() => {
    const handleRouteStart = () => setIsRouteLoading(true);
    const handleRouteDone = () => {
      setIsRouteLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router.events, setIsRouteLoading]);

  useEffect(() => {
    if (router.pathname === "/") return;
    setIsHeroLocked(false);
    document.documentElement.removeAttribute("data-hero-locked");
  }, [router.pathname, setIsHeroLocked]);

  // Different snow colors for different themes
  const snowColor = theme === 'dark' ? '#ffffff' : '#303030';
  const snowflakeCount = isMobileViewport ? 110 : 190;
  const skipToContent = () => {
    const main = document.getElementById("main-content");
    if (!main) return;

    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: "start" });
  };

  return (
    <div className={`${inter.variable} ${ibmPlexMono.variable} app-shell`}>
      <button type="button" onClick={skipToContent} className="skip-link">
        Skip to content
      </button>
      <div id="site-portal-root" />
      {isFinePointer && <CustomCursor />}
      {!isPlayground && <Header />}

      {/* Page wrapper with blur-in animation */}
      <motion.div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 160ms ease-out',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.asPath}
            initial={allowMotion ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={allowMotion ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
            transition={{ duration: allowMotion ? 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {isSnowing && allowMotion && isPageVisible && !isHeroLocked && !isPlayground && (
        <Snowfall
          key={`${theme}-${isMobileViewport ? "mobile" : "desktop"}`}
          color={snowColor}
          snowflakeCount={snowflakeCount}
          speed={[1.1, 3.4]}
          wind={[-0.45, 1.7]}
          radius={[0.45, 2.2]}
          opacity={[0.42, 0.9]}
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 10000,
            pointerEvents: 'none',
            contain: 'strict'
          }}
        />
      )}
    </div>
  );
};

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <SnowProvider>
        <TooltipProvider>
          <CursorProvider>
            <HeroLockProvider>
              <Meta />
              <AppContent Component={Component} pageProps={pageProps} />
              {GTAG ? <GoogleAnalytics gaId={GTAG} /> : null}
            </HeroLockProvider>
          </CursorProvider>
        </TooltipProvider>
      </SnowProvider>
    </ThemeProvider>
  );
};

export default App;
