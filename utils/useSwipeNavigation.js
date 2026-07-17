import { useMemo, useRef } from "react";

const SWIPE_THRESHOLD_PX = 48;
const SWIPE_DIRECTION_RATIO = 1.15;

export const useSwipeNavigation = ({ enabled = true, onNavigate, onSwipe }) => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);

  return useMemo(() => {
    if (!enabled) {
      return {};
    }

    const resetTouch = () => {
      touchStartRef.current = null;
      touchMoveRef.current = null;
    };

    return {
      onTouchStart: (event) => {
        const touch = event.touches?.[0];
        if (!touch) return;

        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
      },
      onTouchMove: (event) => {
        const touch = event.touches?.[0];
        if (!touch) return;

        touchMoveRef.current = { x: touch.clientX, y: touch.clientY };
      },
      onTouchCancel: resetTouch,
      onTouchEnd: () => {
        const start = touchStartRef.current;
        const end = touchMoveRef.current;
        resetTouch();

        if (!start || !end || typeof onNavigate !== "function") return;

        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX < SWIPE_THRESHOLD_PX || absX < absY * SWIPE_DIRECTION_RATIO) {
          return;
        }

        const direction = deltaX > 0 ? -1 : 1;
        onSwipe?.({ direction, deltaX, deltaY });
        onNavigate(direction);
      },
    };
  }, [enabled, onNavigate, onSwipe]);
};
