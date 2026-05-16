import { createContext, useContext, useState } from "react";

const TooltipContext = createContext({
  showSnowTooltip: false,
  setShowSnowTooltip: () => { },
  showNiceTooltip: false,
  setShowNiceTooltip: () => { },
});

export const TooltipProvider = ({ children }) => {
  const [showSnowTooltip, setShowSnowTooltip] = useState(false);
  const [showNiceTooltip, setShowNiceTooltip] = useState(false);

  return (
    <TooltipContext.Provider value={{
      showSnowTooltip,
      setShowSnowTooltip,
      showNiceTooltip,
      setShowNiceTooltip,
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => useContext(TooltipContext);

export default TooltipContext;
