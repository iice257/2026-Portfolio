import { GoogleAnalytics } from "@next/third-parties/google";
import { useState, useEffect } from "react";
import Meta from "@/components/Meta/Meta";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { SnowProvider, useSnow } from "../context/SnowContext";
import { TooltipProvider } from "../context/TooltipContext";
import { CursorProvider } from "../context/CursorContext";
import CustomCursor from "../components/Cursor/CustomCursor";
import Header from "../components/Header/Header";
import Snowfall from "react-snowfall";
import "../styles/globals.scss";
// React Bits component styles
import "../components/ReactBits/ShuffleText.css";
import "../components/ReactBits/TextPressure.css";
import "../components/ReactBits/CardSwap.css";
import "../components/ReactBits/FlowingMenu.css";
import "../components/ReactBits/StaggeredMenu.css";
import { GTAG } from "../constants";

// Inner component to access snow and theme context
const AppContent = ({ Component, pageProps }) => {
  const { isSnowing } = useSnow();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  // Page blur-in effect on load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const updateCapabilities = () => {
      setIsFinePointer(pointerQuery.matches);
      setIsMobileViewport(mobileQuery.matches);
    };

    updateCapabilities();
    pointerQuery.addEventListener("change", updateCapabilities);
    mobileQuery.addEventListener("change", updateCapabilities);

    return () => {
      pointerQuery.removeEventListener("change", updateCapabilities);
      mobileQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  // Different snow colors for different themes
  const snowColor = theme === 'dark' ? '#ffffff' : '#888888';
  const snowflakeCount = isMobileViewport ? 90 : 150;

  return (
    <>
      {isFinePointer && <CustomCursor />}
      <Header />

      {/* Page wrapper with blur-in animation */}
      <div
        style={{
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
          opacity: isLoaded ? 1 : 0,
          transition: 'filter 850ms ease-out, opacity 850ms ease-out',
        }}
      >
        <Component {...pageProps} />
      </div>

      {isSnowing && (
        <Snowfall
          color={snowColor}
          snowflakeCount={snowflakeCount}
          speed={[1.5, 4.0]}
          wind={[-0.5, 2.0]}
          radius={[0.5, 2.5]}
          opacity={[0.4, 1.0]}
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none'
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
            <GoogleAnalytics gaId={GTAG} />
          </CursorProvider>
        </TooltipProvider>
      </SnowProvider>
    </ThemeProvider>
  );
};

export default App;
