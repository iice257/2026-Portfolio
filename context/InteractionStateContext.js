import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useHeroLock } from "./HeroLockContext";

const VISIT_KEY = "portfolio.cursor.welcomed";
const GREETING_DURATION_MS = 5000;

export const INTERACTION_STATES = Object.freeze({
  FIRST_VISIT: "first-visit-greeting",
  WELCOME_BACK: "welcome-back-greeting",
  READY: "ready",
  LOCKED: "locked",
});

const InteractionStateContext = createContext({
  interactionState: INTERACTION_STATES.READY,
  greetingText: "",
});

export const InteractionStateProvider = ({ children }) => {
  const { isHeroLocked } = useHeroLock();
  const [greetingState, setGreetingState] = useState(null);
  const [greetingComplete, setGreetingComplete] = useState(false);

  useEffect(() => {
    let hasVisited = true;
    try {
      hasVisited = window.localStorage.getItem(VISIT_KEY) === "true";
      window.localStorage.setItem(VISIT_KEY, "true");
    } catch {
      // Storage can be unavailable in private or restricted browsing contexts.
    }

    setGreetingState(hasVisited ? INTERACTION_STATES.WELCOME_BACK : INTERACTION_STATES.FIRST_VISIT);
    const timer = window.setTimeout(() => setGreetingComplete(true), GREETING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const interactionState = !greetingComplete && greetingState
    ? greetingState
    : isHeroLocked
      ? INTERACTION_STATES.LOCKED
      : INTERACTION_STATES.READY;

  const greetingText = interactionState === INTERACTION_STATES.FIRST_VISIT
    ? "Welcome! Have a great time"
    : interactionState === INTERACTION_STATES.WELCOME_BACK
      ? "Welcome back!"
      : "";

  const value = useMemo(
    () => ({ interactionState, greetingText }),
    [interactionState, greetingText]
  );

  return (
    <InteractionStateContext.Provider value={value}>
      {children}
    </InteractionStateContext.Provider>
  );
};

export const useInteractionState = () => useContext(InteractionStateContext);

export default InteractionStateContext;
