import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnow } from '../../context/SnowContext';
import { useTheme } from '../../context/ThemeContext';

const TOOLTIP_EXIT_MS = 180;
const SNOW_OFF_EXIT_MS = 400;

const TooltipBubble = ({ children, phase, exitDuration = TOOLTIP_EXIT_MS }) => (
  <div
    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs whitespace-nowrap z-[100001]"
    style={{
      backgroundColor: 'var(--fg-primary)',
      color: 'var(--bg-primary)',
      borderRadius: '4px',
      pointerEvents: 'none',
      opacity: phase === 'visible' ? 1 : 0,
      transform: `translateX(-50%) scale(${phase === 'visible' ? 1 : 0.94})`,
      transformOrigin: 'top center',
      transition: `opacity ${exitDuration}ms ease, transform ${exitDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    }}
  >
    {children}
    <div
      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
      style={{ backgroundColor: 'var(--fg-primary)' }}
    />
  </div>
);

const SnowToggle = () => {
  const { isSnowing, toggleSnow } = useSnow();
  const { theme } = useTheme();
  const [tooltipText, setTooltipText] = useState("click for snow");
  const [isTooltipMounted, setIsTooltipMounted] = useState(false);
  const [tooltipPhase, setTooltipPhase] = useState("hidden");
  const [tooltipExitDuration, setTooltipExitDuration] = useState(TOOLTIP_EXIT_MS);
  const hideTooltipTimerRef = useRef(null);
  const unmountTooltipTimerRef = useRef(null);
  const enterFrameRef = useRef(null);
  const tooltipMountedRef = useRef(false);
  const tooltipPhaseRef = useRef("hidden");
  const clickedSnowInLightRef = useRef(false);

  const clearTooltipTimer = useCallback(() => {
    window.clearTimeout(hideTooltipTimerRef.current);
    hideTooltipTimerRef.current = null;
    window.clearTimeout(unmountTooltipTimerRef.current);
    unmountTooltipTimerRef.current = null;
    window.cancelAnimationFrame(enterFrameRef.current);
    enterFrameRef.current = null;
  }, []);

  const hideTooltip = useCallback((exitDuration = TOOLTIP_EXIT_MS) => {
    window.clearTimeout(hideTooltipTimerRef.current);
    hideTooltipTimerRef.current = null;
    window.clearTimeout(unmountTooltipTimerRef.current);
    unmountTooltipTimerRef.current = null;
    window.cancelAnimationFrame(enterFrameRef.current);
    enterFrameRef.current = null;

    if (!tooltipMountedRef.current) return;

    setTooltipExitDuration(exitDuration);
    tooltipPhaseRef.current = "exit";
    setTooltipPhase("exit");
    unmountTooltipTimerRef.current = window.setTimeout(() => {
      tooltipMountedRef.current = false;
      tooltipPhaseRef.current = "hidden";
      setIsTooltipMounted(false);
      setTooltipPhase("hidden");
      unmountTooltipTimerRef.current = null;
    }, exitDuration);
  }, []);

  const showTooltip = useCallback((text, duration) => {
    clearTooltipTimer();
    const shouldAnimateIn = !tooltipMountedRef.current || tooltipPhaseRef.current === "hidden";

    setTooltipText(text);
    setTooltipExitDuration(TOOLTIP_EXIT_MS);

    if (shouldAnimateIn) {
      tooltipMountedRef.current = true;
      tooltipPhaseRef.current = "enter";
      setIsTooltipMounted(true);
      setTooltipPhase("enter");

      enterFrameRef.current = window.requestAnimationFrame(() => {
        tooltipPhaseRef.current = "visible";
        setTooltipPhase("visible");
        enterFrameRef.current = null;
      });
    } else {
      tooltipPhaseRef.current = "visible";
      setTooltipPhase("visible");
    }

    hideTooltipTimerRef.current = window.setTimeout(() => {
      hideTooltip();
      hideTooltipTimerRef.current = null;
    }, duration);
  }, [clearTooltipTimer, hideTooltip]);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    showTooltip(isTouch ? "tap for snow" : "click for snow", 5000);

    return () => {
      clearTooltipTimer();
    };
  }, [clearTooltipTimer, showTooltip]);

  useEffect(() => {
    if (theme === "dark" && clickedSnowInLightRef.current) {
      clickedSnowInLightRef.current = false;
      showTooltip("nice!", 3000);
    }
  }, [showTooltip, theme]);

  const handleToggle = () => {
    const isTurningOff = isSnowing;
    toggleSnow();

    if (isTurningOff) {
      clickedSnowInLightRef.current = false;
      hideTooltip(SNOW_OFF_EXIT_MS);
      return;
    }

    if (theme === "dark") {
      clickedSnowInLightRef.current = false;
      showTooltip("nice!", 3000);
      return;
    }

    clickedSnowInLightRef.current = true;
    showTooltip("looks better in light mode", 3000);
  };

  return (
    <div className="relative z-[60]">
      <button
        onClick={handleToggle}
        className="relative group p-2 hover:bg-[var(--fg-secondary)]/10 rounded-full transition-colors duration-300"
        aria-label="Toggle snow effect"
        style={{ color: 'var(--fg-primary)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 ${isSnowing ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
        >
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="m20 20-4.75-4.75" />
          <path d="m4 4 4.75 4.75" />
          <path d="m4 20 4.75-4.75" />
          <path d="m20 4-4.75 4.75" />
        </svg>
      </button>

      {isTooltipMounted && (
        <TooltipBubble phase={tooltipPhase} exitDuration={tooltipExitDuration}>
          {tooltipText}
        </TooltipBubble>
      )}
    </div>
  );
};

export default SnowToggle;
