import { createContext, useContext, useState } from "react";

const CursorContext = createContext({
  cursorText: "",
  setCursorText: () => { },
  cursorVariant: "default",
  setCursorVariant: () => { },
  isRouteLoading: false,
  setIsRouteLoading: () => { },
});

export const CursorProvider = ({ children }) => {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  return (
    <CursorContext.Provider value={{
      cursorText,
      setCursorText,
      cursorVariant,
      setCursorVariant,
      isRouteLoading,
      setIsRouteLoading,
    }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);

export default CursorContext;
