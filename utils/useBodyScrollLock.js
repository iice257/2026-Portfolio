import { useEffect } from "react";

let lockCount = 0;
let previousScrollY = 0;
let previousStyles = null;

const shouldUseTouchLock = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
};

export const lockBodyScroll = () => {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return () => {};
  }

  const { body, documentElement } = document;
  const useTouchLock = shouldUseTouchLock();

  if (lockCount === 0) {
    previousScrollY = window.scrollY;
    previousStyles = {
      body: {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overscrollBehavior: body.style.overscrollBehavior,
      },
      html: {
        overflow: documentElement.style.overflow,
        overscrollBehavior: documentElement.style.overscrollBehavior,
      },
    };

    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    if (useTouchLock) {
      body.style.position = "fixed";
      body.style.top = `-${previousScrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    }
  }

  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount !== 0 || !previousStyles) return;

    body.style.overflow = previousStyles.body.overflow;
    body.style.position = previousStyles.body.position;
    body.style.top = previousStyles.body.top;
    body.style.left = previousStyles.body.left;
    body.style.right = previousStyles.body.right;
    body.style.width = previousStyles.body.width;
    body.style.overscrollBehavior = previousStyles.body.overscrollBehavior;
    documentElement.style.overflow = previousStyles.html.overflow;
    documentElement.style.overscrollBehavior = previousStyles.html.overscrollBehavior;

    if (useTouchLock) {
      window.scrollTo({ top: previousScrollY, left: 0, behavior: "auto" });
    }

    previousStyles = null;
  };
};

export const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return undefined;
    return lockBodyScroll();
  }, [isLocked]);
};
