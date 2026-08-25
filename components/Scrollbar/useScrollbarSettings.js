import { EASE_IN_OUT_CUBIC, EASE_OUT_CUBIC } from "./transitions"

export function useScrollbarSettings(theme = "dark") {
  const settings = {
    arrow: {
      arrowLength: 28,
      wingSpread: 8,
      bobAmplitude: 3,
      bobPeriod: 2,
      hitPadding: 10,
    },
    line: {
      length: 400,
      dotSpacing: 10,
    },
    tracking: {
      maxExtension: 50,
      extensionFalloff: 0.6,
      colorFalloff: 0.3,
      smoothingTau: 0.05,
      hitPadding: 10,
    },
    timing: {
      compressed: { type: "easing", duration: 0.15, ease: EASE_OUT_CUBIC },
      extended: { type: "easing", duration: 0.35, ease: EASE_IN_OUT_CUBIC },
      split: { type: "easing", duration: 0.2, ease: EASE_OUT_CUBIC },
      tracking: { type: "easing", duration: 0.2, ease: EASE_OUT_CUBIC },
    },
    appearance: {
      dotColor: "#a6a6a6",
      hoverColor: theme === "dark" ? "#fafafa" : "#171717",
      strokeWidth: 4,
    },
  }
  const dotCount = Math.max(
    1,
    Math.round(settings.line.length / settings.line.dotSpacing)
  )
  return { settings, dotCount }
}
