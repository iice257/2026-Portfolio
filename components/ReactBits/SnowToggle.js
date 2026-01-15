import { useEffect, useState } from 'react';
import { useSnow } from '../../context/SnowContext';
import { useTooltip } from '../../context/TooltipContext';
import { useTheme } from '../../context/ThemeContext';

const SnowToggle = () => {
  const { isSnowing, setIsSnowing } = useSnow();
  const { theme } = useTheme();
  const {
    showSnowTooltip,
    setShowSnowTooltip,
    showNiceTooltip,
    setShowNiceTooltip,
    snowTooltipWasShown,
    setSnowTooltipWasShown
  } = useTooltip();

  // Show tooltip after 3 seconds if not shown before
  useEffect(() => {
    // If it was already shown in history, do nothing.
    if (snowTooltipWasShown) return;

    // Wait for everything to load
    const timer = setTimeout(() => {
      // Logic: Only show if light mode (per original design) or just show it?
      // Original said "Works better in dark mode" -> implies we are in light mode
      // Let's assume we show it if we are in light mode.
      if (theme === 'light') {
        setShowSnowTooltip(true);
        // Mark as shown so it doesn't show again this session
        setSnowTooltipWasShown(true);

        // Hide after 4 seconds
        setTimeout(() => {
          setShowSnowTooltip(false);
        }, 4000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [theme, snowTooltipWasShown, setShowSnowTooltip, setSnowTooltipWasShown]);

  const handleToggle = () => {
    setIsSnowing(!isSnowing);

    // If we're toggling ON, show "Nice!"
    if (!isSnowing) {
      // Hide the suggestion tooltip if it's there
      setShowSnowTooltip(false);

      setShowNiceTooltip(true);
      setTimeout(() => setShowNiceTooltip(false), 2000);
    }
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

      {/* Tooltip for light mode: "Works better in dark mode" */}
      {showSnowTooltip && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs whitespace-nowrap z-[100001]"
          style={{
            backgroundColor: 'var(--fg-primary)',
            color: 'var(--bg-primary)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          Works better in dark mode
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
            style={{ backgroundColor: 'var(--fg-primary)' }}
          />
        </div>
      )}

      {/* Nice! tooltip */}
      {showNiceTooltip && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs whitespace-nowrap z-[100001]"
          style={{
            backgroundColor: 'var(--fg-primary)',
            color: 'var(--bg-primary)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        >
          Nice!
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
            style={{ backgroundColor: 'var(--fg-primary)' }}
          />
        </div>
      )}
    </div>
  );
};

export default SnowToggle;
