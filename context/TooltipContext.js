import { createContext, useContext, useState, useEffect } from "react";

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

  // Check localStorage on client-side mount only (avoids hydration mismatch)
  useEffect(() => {
    const stored = localStorage.getItem('snowTooltipShown');
    if (stored === 'true') {
      setSnowTooltipWasShown(true);
    }
  }, []);

  // Save to localStorage when tooltip is shown
  const handleSetSnowTooltipWasShown = (value) => {
    setSnowTooltipWasShown(value);
    localStorage.setItem('snowTooltipShown', value.toString());
  };

  return (
    <TooltipContext.Provider value={{
      showSnowTooltip,
      setShowSnowTooltip,
      showNiceTooltip,
      setShowNiceTooltip,
      snowTooltipWasShown,
      setSnowTooltipWasShown: handleSetSnowTooltipWasShown,
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => useContext(TooltipContext);

export default TooltipContext;
