import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const isVisibleElement = (element) => {
  if (!element) return false;
  if (element.closest("[aria-hidden='true'], [inert]")) return false;

  const rects = element.getClientRects();
  return rects.length > 0;
};

const getFocusableElements = (root) => (
  Array.from(root?.querySelectorAll(FOCUSABLE_SELECTOR) || []).filter(isVisibleElement)
);

export const useDialogFocus = (isOpen) => {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return undefined;

    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    previouslyFocusedRef.current = document.activeElement;

    const focusFirstElement = () => {
      const [firstFocusable] = getFocusableElements(dialog);
      (firstFocusable || dialog).focus?.({ preventScroll: true });
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements(dialog);
      if (!focusableElements.length) {
        event.preventDefault();
        dialog.focus?.({ preventScroll: true });
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    const frameId = window.requestAnimationFrame(focusFirstElement);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("keydown", handleKeyDown);

      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus?.({ preventScroll: true });
      }
    };
  }, [isOpen]);

  return dialogRef;
};
