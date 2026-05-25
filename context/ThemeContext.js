import { createContext, useContext, useEffect, useState } from "react";
import { safeStorage } from "../utils/storage";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = safeStorage.get(window.localStorage, "theme");

    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");
    return undefined;
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      safeStorage.set(window.localStorage, "theme", nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
