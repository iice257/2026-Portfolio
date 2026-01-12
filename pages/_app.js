import { GoogleAnalytics } from "@next/third-parties/google";
import { useState, useEffect } from "react";
import Meta from "@/components/Meta/Meta";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { SnowProvider, useSnow } from "../context/SnowContext";
import { TooltipProvider } from "../context/TooltipContext";
import Snowfall from "react-snowfall";
import "../styles/globals.scss";
// React Bits component styles
import "../components/ReactBits/ShuffleText.css";
import "../components/ReactBits/TextPressure.css";
import "../components/ReactBits/CardSwap.css";
import "../components/ReactBits/FlowingMenu.css";
import "../components/ReactBits/StaggeredMenu.css";
import { GTAG } from "constants";

// Inner component to access snow and theme context
const AppContent = ({ Component, pageProps }) => {
  const { isSnowing } = useSnow();
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Page blur-in effect on load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Different snow colors for different themes
  const snowColor = theme === 'dark' ? '#ffffff' : '#888888';

  return (
    <>
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
          snowflakeCount={150}
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
          <Meta />
          <AppContent Component={Component} pageProps={pageProps} />
          <GoogleAnalytics gaId={GTAG} />
        </TooltipProvider>
      </SnowProvider>
    </ThemeProvider>
  );
};

export default App;
