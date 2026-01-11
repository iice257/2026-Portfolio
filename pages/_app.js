import { GoogleAnalytics } from "@next/third-parties/google";
import Meta from "@/components/Meta/Meta";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.scss";
import { GTAG } from "constants";

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Meta />
      <Component {...pageProps} />
      <GoogleAnalytics gaId={GTAG} />
    </ThemeProvider>
  );
};

export default App;
