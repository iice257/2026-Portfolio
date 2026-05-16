import { useCallback, useEffect, useRef, useState } from 'react';
import { useSnow } from '../../context/SnowContext';
import { useTheme } from '../../context/ThemeContext';

const TooltipBubble = ({ children }) => (
  <div
    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs whitespace-nowrap z-[100001]"
    style={{
      backgroundColor: 'var(--fg-primary)',
      color: 'var(--bg-primary)',
      borderRadius: '4px',
      pointerEvents: 'none',
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
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const hideTooltipTimerRef = useRef(null);
  const clickedSnowInLightRef = useRef(false);

  const clearTooltipTimer = useCallback(() => {
    window.clearTimeout(hideTooltipTimerRef.current);
    hideTooltipTimerRef.current = null;
  }, []);

  const showTooltip = useCallback((text, duration) => {
    clearTooltipTimer();
    setTooltipText(text);
    setIsTooltipVisible(true);

    hideTooltipTimerRef.current = window.setTimeout(() => {
      setIsTooltipVisible(false);
      hideTooltipTimerRef.current = null;
    }, duration);
  }, [clearTooltipTimer]);

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
    toggleSnow();

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

      {isTooltipVisible && (
        <TooltipBubble>{tooltipText}</TooltipBubble>
      )}
    </div>
  );
};

export default SnowToggle;
