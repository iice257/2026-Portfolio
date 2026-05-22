import { createContext, useContext, useEffect, useRef, useState } from "react";

const HeroLockContext = createContext({
  isHeroLocked: false,
  setIsHeroLocked: () => {},
});

export const HeroLockProvider = ({ children }) => {
  const [isHeroLocked, setIsHeroLocked] = useState(false);
  const hasBeenLockedRef = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isHeroLocked) {
      hasBeenLockedRef.current = true;
      document.documentElement.setAttribute("data-hero-locked", "true");
      return;
    }

    if (
      !hasBeenLockedRef.current &&
      document.documentElement.getAttribute("data-hero-locked") === "true"
    ) {
      return;
    }

    document.documentElement.removeAttribute("data-hero-locked");
  }, [isHeroLocked]);

  return (
    <HeroLockContext.Provider value={{ isHeroLocked, setIsHeroLocked }}>
      {children}
    </HeroLockContext.Provider>
  );
};

export const useHeroLock = () => useContext(HeroLockContext);

export default HeroLockContext;
