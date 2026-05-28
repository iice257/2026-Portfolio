import { createContext, useCallback, useContext, useMemo, useState } from "react";

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
  const value = useMemo(() => ({
    cursorText,
    setCursorText,
    cursorVariant,
    setCursorVariant,
    isRouteLoading,
    setIsRouteLoading,
    requestCursorRefresh: refreshCursor,
  }), [cursorText, cursorVariant, isRouteLoading, refreshCursor]);

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);

export default CursorContext;
