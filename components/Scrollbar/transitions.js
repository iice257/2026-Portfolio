export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1]
export const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1]

export const lerp = (a, b, t) => a + (b - a) * t

const cubicBezier = (x1, y1, x2, y2) => {
  const at = (a, b, t) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let lo = 0
    let hi = 1
    let t = x
    for (let i = 0; i < 24; i++) {
      if (at(x1, x2, t) < x) lo = t
      else hi = t
      t = (lo + hi) / 2
    }
    return at(y1, y2, t)
  }
}

export const resolveTransition = (config) => ({
  duration: config.duration,
  ease: cubicBezier(...config.ease),
})
