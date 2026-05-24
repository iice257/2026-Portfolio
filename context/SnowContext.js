import { createContext, useContext, useState, useEffect } from "react";
import { safeStorage } from "../utils/storage";

const SnowContext = createContext({
  isSnowing: false,
  toggleSnow: () => { },
});

export const SnowProvider = ({ children }) => {
  const [isSnowing, setIsSnowing] = useState(false);
  const [hasLoadedSnowPreference, setHasLoadedSnowPreference] = useState(false);

  // Persist snow preference in sessionStorage (not localStorage - only for current session)
  useEffect(() => {
    const saved = safeStorage.get(window.sessionStorage, "isSnowing");
    if (saved !== null) {
      setIsSnowing(saved === "true");
      setHasLoadedSnowPreference(true);
      return;
    }

    setIsSnowing(window.matchMedia("(max-width: 767px)").matches);
    setHasLoadedSnowPreference(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedSnowPreference) return;

    safeStorage.set(window.sessionStorage, "isSnowing", isSnowing);
  }, [hasLoadedSnowPreference, isSnowing]);

  const toggleSnow = () => setIsSnowing((prev) => !prev);

  return (
    <SnowContext.Provider value={{ isSnowing, toggleSnow }}>
      {children}
    </SnowContext.Provider>
  );
};

export const useSnow = () => {
  const context = useContext(SnowContext);
  if (!context) {
    throw new Error("useSnow must be used within a SnowProvider");
  }
  return context;
};

export default SnowContext;
