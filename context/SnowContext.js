import { createContext, useContext, useState, useEffect } from "react";

const SnowContext = createContext({
  isSnowing: false,
  toggleSnow: () => { },
});

export const SnowProvider = ({ children }) => {
  const [isSnowing, setIsSnowing] = useState(false);

  // Persist snow preference in sessionStorage (not localStorage - only for current session)
  useEffect(() => {
    const saved = sessionStorage.getItem("isSnowing");
    if (saved === "true") {
      setIsSnowing(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("isSnowing", isSnowing);
  }, [isSnowing]);

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
