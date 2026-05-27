import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnow } from '../../context/SnowContext';
import { useTheme } from '../../context/ThemeContext';
import { useTooltip } from '../../context/TooltipContext';

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
  const {
    showNiceTooltip,
    setShowNiceTooltip,
    setShowSnowTooltip,
    setSnowTooltipWasShown,
  } = useTooltip();
  const [tooltipText, setTooltipText] = useState("click for snow");
  const [isTooltipMounted, setIsTooltipMounted] = useState(false);
  const [tooltipPhase, setTooltipPhase] = useState("hidden");
  const [tooltipExitDuration, setTooltipExitDuration] = useState(TOOLTIP_EXIT_MS);
  const hideTooltipTimerRef = useRef(null);
  const unmountTooltipTimerRef = useRef(null);
  const enterFrameRef = useRef(null);
  const tooltipMountedRef = useRef(false);
  const tooltipPhaseRef = useRef("hidden");
  const stickyTooltipRef = useRef(false);

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

  useEffect(() => () => clearTooltipTimer(), [clearTooltipTimer]);

  useEffect(() => {
    if (showNiceTooltip) {
      stickyTooltipRef.current = true;
      showTooltip("nice!", 3000);
      setShowNiceTooltip(false);
      setSnowTooltipWasShown(false);
    }
  }, [setShowNiceTooltip, setSnowTooltipWasShown, showNiceTooltip, showTooltip]);

  const handleToggle = () => {
    const isTurningOff = isSnowing;
    toggleSnow();

    if (isTurningOff) {
      stickyTooltipRef.current = false;
      setShowSnowTooltip(false);
      setSnowTooltipWasShown(false);
      hideTooltip(SNOW_OFF_EXIT_MS);
      return;
    }

    if (theme === "dark") {
      stickyTooltipRef.current = true;
      setShowSnowTooltip(false);
      setSnowTooltipWasShown(false);
      showTooltip("nice!", 3000);
      return;
    }

    stickyTooltipRef.current = true;
    setShowSnowTooltip(true);
    setSnowTooltipWasShown(true);
    showTooltip("looks better in dark mode", 3000);
  };

  const handleHint = () => {
    if (isSnowing || stickyTooltipRef.current) return;
    showTooltip("click for snow", 1600);
  };

  return (
    <div className="relative z-[60]">
      <button
        onClick={handleToggle}
        onMouseEnter={handleHint}
        onFocus={handleHint}
        className="relative group p-2 hover:bg-[var(--fg-secondary)]/10 rounded-full transition-colors duration-300"
        aria-label={`${isSnowing ? "Disable" : "Enable"} snow effect`}
        aria-pressed={isSnowing}
        style={{ color: 'var(--fg-primary)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 ${isSnowing ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
        >
          <path d="m10 20-1.25-2.5L6 18" />
          <path d="M10 4 8.75 6.5 6 6" />
          <path d="m14 20 1.25-2.5L18 18" />
          <path d="m14 4 1.25 2.5L18 6" />
          <path d="m17 21-3-6h-4" />
          <path d="m17 3-3 6 1.5 3" />
          <path d="M2 12h6.5L10 9" />
          <path d="m20 10-1.5 2 1.5 2" />
          <path d="M22 12h-6.5L14 15" />
          <path d="m4 10 1.5 2L4 14" />
          <path d="m7 21 3-6-1.5-3" />
          <path d="m7 3 3 6h4" />
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
