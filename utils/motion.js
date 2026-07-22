export const SYSTEM_MOTION_MS = 700;
export const SYSTEM_MOTION_SECONDS = SYSTEM_MOTION_MS / 1000;
export const SYSTEM_MOTION_EASE = [0.16, 1, 0.3, 1];

export const fadeBlurMotion = {
  initial: { opacity: 0, filter: "blur(10px)", y: 6 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  exit: { opacity: 0, filter: "blur(10px)", y: -4 },
  transition: {
    duration: SYSTEM_MOTION_SECONDS,
    ease: SYSTEM_MOTION_EASE,
  },
};
