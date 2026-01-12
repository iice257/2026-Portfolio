import { useSnow } from "../../context/SnowContext";
import { useTheme } from "../../context/ThemeContext";
import { useTooltip } from "../../context/TooltipContext";
import { useEffect } from "react";

/**
 * SnowToggle - Simple snowflake icon button that toggles the snow effect
 */
const SnowToggle = () => {
  const { isSnowing, toggleSnow } = useSnow();
  const { theme } = useTheme();
  const { showSnowTooltip, setShowSnowTooltip, setSnowTooltipWasShown, setShowNiceTooltip, showNiceTooltip } = useTooltip();

  const handleClick = () => {
    toggleSnow();

    // Show tooltip in light mode when activating snow
    if (!isSnowing && theme === 'light') {
      setShowNiceTooltip(false); // Hide "Nice!" tooltip if visible
      setShowSnowTooltip(true);
      setSnowTooltipWasShown(true);
    }
  };

  // Hide tooltip after 3 seconds
  useEffect(() => {
    if (showSnowTooltip) {
      const timer = setTimeout(() => setShowSnowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSnowTooltip, setShowSnowTooltip]);

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="w-10 h-10 border transition-colors duration-200"
        style={{
          borderColor: 'var(--border)',
          borderRadius: 0,
          backgroundColor: isSnowing ? 'var(--fg-primary)' : 'transparent',
          color: isSnowing ? 'var(--bg-primary)' : 'var(--fg-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
        aria-label={isSnowing ? "Stop snow" : "Make it snow"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: 'block', flexShrink: 0 }}
        >
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
          <line x1="12" y1="2" x2="9" y2="5" />
          <line x1="12" y1="2" x2="15" y2="5" />
          <line x1="12" y1="22" x2="9" y2="19" />
          <line x1="12" y1="22" x2="15" y2="19" />
          <line x1="2" y1="12" x2="5" y2="9" />
          <line x1="2" y1="12" x2="5" y2="15" />
          <line x1="22" y1="12" x2="19" y2="9" />
          <line x1="22" y1="12" x2="19" y2="15" />
        </svg>
      </button>

      {/* Tooltip for light mode */}
      {showSnowTooltip && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs whitespace-nowrap z-50"
          style={{
            backgroundColor: 'var(--fg-primary)',
            color: 'var(--bg-primary)',
          }}
        >
          Works better in dark mode
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
            style={{ backgroundColor: 'var(--fg-primary)' }}
          />
        </div>
      )}

      {/* Nice! tooltip - now shown on Snow button */}
      {showNiceTooltip && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs whitespace-nowrap z-50"
          style={{
            backgroundColor: 'var(--fg-primary)',
            color: 'var(--bg-primary)',
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
