import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Meta from "@/components/Meta/Meta";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { SnowProvider, useSnow } from "../context/SnowContext";
import { TooltipProvider } from "../context/TooltipContext";
import { CursorProvider } from "../context/CursorContext";
import Header from "../components/Header/Header";
import "../styles/globals.scss";
// React Bits component styles
import "../components/ReactBits/ShuffleText.css";
import "../components/ReactBits/TextPressure.css";
import "../components/ReactBits/StaggeredMenu.css";
import { GTAG } from "../constants";

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
  const router = useRouter();
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

  // Different snow colors for different themes
  const snowColor = theme === 'dark' ? '#ffffff' : '#888888';
  const snowflakeCount = isMobileViewport ? 130 : 240;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {isFinePointer && <CustomCursor />}
      <Header />

      {/* Page wrapper with blur-in animation */}
      <motion.div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 220ms ease-out',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={router.asPath}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {isSnowing && allowMotion && isPageVisible && (
        <Snowfall
          color={snowColor}
          snowflakeCount={snowflakeCount}
          speed={[1.1, 3.4]}
          wind={[-0.45, 1.7]}
          radius={[0.45, 2.2]}
          opacity={[0.35, 0.95]}
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100dvh',
            zIndex: 9999,
            pointerEvents: 'none',
            contain: 'strict'
          }}
        />
      )}
    </>
  );
};

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <SnowProvider>
        <TooltipProvider>
          <CursorProvider>
            <Meta />
            <AppContent Component={Component} pageProps={pageProps} />
            {GTAG ? <GoogleAnalytics gaId={GTAG} /> : null}
          </CursorProvider>
        </TooltipProvider>
      </SnowProvider>
    </ThemeProvider>
  );
};

export default App;
