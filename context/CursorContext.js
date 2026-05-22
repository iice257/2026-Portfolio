import { createContext, useContext, useCallback, useState } from "react";

export const requestCursorRefresh = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("portfolio:cursor-refresh"));
};

const CursorContext = createContext({
  cursorText: "",
  setCursorText: () => { },
  cursorVariant: "default",
  setCursorVariant: () => { },
  isRouteLoading: false,
  setIsRouteLoading: () => { },
  requestCursorRefresh: () => { },
});

export const CursorProvider = ({ children }) => {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const refreshCursor = useCallback(() => requestCursorRefresh(), []);

  return (
    <CursorContext.Provider value={{
      cursorText,
      setCursorText,
      cursorVariant,
      setCursorVariant,
      isRouteLoading,
      setIsRouteLoading,
      requestCursorRefresh: refreshCursor,
    }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);

export default CursorContext;
