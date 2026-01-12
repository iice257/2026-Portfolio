import { createContext, useContext, useState } from "react";

const CursorContext = createContext({
  cursorText: "",
  setCursorText: () => { },
  cursorVariant: "default",
  setCursorVariant: () => { },
});

export const CursorProvider = ({ children }) => {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");

  return (
    <CursorContext.Provider value={{ cursorText, setCursorText, cursorVariant, setCursorVariant }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);

export default CursorContext;
