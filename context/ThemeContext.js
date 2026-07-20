import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { safeStorage } from "../utils/storage";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => { },
  setThemeMode: () => { },
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

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      safeStorage.set(window.localStorage, "theme", nextTheme);
      return nextTheme;
    });
  }, []);

  const setThemeMode = useCallback((nextTheme) => {
    if (nextTheme !== "dark" && nextTheme !== "light") return;
    setTheme(nextTheme);
    safeStorage.set(window.localStorage, "theme", nextTheme);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setThemeMode }),
    [theme, toggleTheme, setThemeMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
