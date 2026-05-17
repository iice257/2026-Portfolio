import { createContext, useContext, useState } from "react";

const TooltipContext = createContext({
  showSnowTooltip: false,
  setShowSnowTooltip: () => { },
  showNiceTooltip: false,
  setShowNiceTooltip: () => { },
  snowTooltipWasShown: false,
  setSnowTooltipWasShown: () => { },
});

export const TooltipProvider = ({ children }) => {
  const [showSnowTooltip, setShowSnowTooltip] = useState(false);
  const [showNiceTooltip, setShowNiceTooltip] = useState(false);
  const [snowTooltipWasShown, setSnowTooltipWasShown] = useState(false);

  return (
    <TooltipContext.Provider value={{
      showSnowTooltip,
      setShowSnowTooltip,
      showNiceTooltip,
      setShowNiceTooltip,
      snowTooltipWasShown,
      setSnowTooltipWasShown,
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => useContext(TooltipContext);

export default TooltipContext;
