import { createContext, useContext, useMemo, useState } from "react";

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

  const value = useMemo(() => ({
      showSnowTooltip,
      setShowSnowTooltip,
      showNiceTooltip,
      setShowNiceTooltip,
      snowTooltipWasShown,
      setSnowTooltipWasShown,
  }), [showNiceTooltip, showSnowTooltip, snowTooltipWasShown]);

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => useContext(TooltipContext);

export default TooltipContext;
