// Single-subscription pointer stream shared by every motion system
// (TextPressure, CustomCursor, Waves). One window listener per event type
// regardless of how many consumers exist; handlers run in subscription order
// and receive the native event, preserving per-consumer semantics exactly.

const moveHandlers = new Set();
const touchHandlers = new Set();
let moveInstalled = false;
let touchInstalled = false;

const dispatchMove = (event) => {
  moveHandlers.forEach((handler) => handler(event));
};

const dispatchTouch = (event) => {
  touchHandlers.forEach((handler) => handler(event));
};

export function addPointerMoveListener(handler) {
  if (!moveInstalled) {
    window.addEventListener("mousemove", dispatchMove, { passive: true });
    moveInstalled = true;
  }
  moveHandlers.add(handler);
  return () => {
    moveHandlers.delete(handler);
    if (moveHandlers.size === 0 && moveInstalled) {
      window.removeEventListener("mousemove", dispatchMove);
      moveInstalled = false;
    }
  };
}

export function addTouchMoveListener(handler) {
  if (!touchInstalled) {
    window.addEventListener("touchmove", dispatchTouch, { passive: true });
    touchInstalled = true;
  }
  touchHandlers.add(handler);
  return () => {
    touchHandlers.delete(handler);
    if (touchHandlers.size === 0 && touchInstalled) {
      window.removeEventListener("touchmove", dispatchTouch);
      touchInstalled = false;
    }
  };
}
