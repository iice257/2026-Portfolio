import { useEffect, useRef } from "react"
import { useTheme } from "../../context/ThemeContext"
import { useScrollbarSettings } from "./useScrollbarSettings"
import { lerp, resolveTransition } from "./transitions"
import {
  getPoses,
  getTargetForState,
  POSE_ORDER,
} from "./poses"

const parseHexColor = (hex) => {
  const digits = hex.trim().slice(1)
  const full =
    digits.length === 3 ? [...digits].map((d) => d + d).join("") : digits
  const n = parseInt(full, 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

const mixColors = (from, to, t) =>
  `rgb(${Math.round(lerp(from[0], to[0], t))}, ${Math.round(
    lerp(from[1], to[1], t)
  )}, ${Math.round(lerp(from[2], to[2], t))})`

const getStateForScroll = (scrollY) =>
  scrollY > 0 ? "tracking" : "idle"

const getScrollFraction = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  return maxScroll > 0
    ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
    : 0
}

const getFocusDot = (dotCount) =>
  Math.round(getScrollFraction() * (dotCount - 1))

const getScrollPositionForDot = (dot, dotCount) => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const fraction = dotCount > 1 ? dot / (dotCount - 1) : 1
  return fraction * maxScroll
}

const scrollToDot = (dot, dotCount) => {
  window.scrollTo({
    top: getScrollPositionForDot(dot, dotCount),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  })
}

const scrollDownOneViewport = () => {
  window.scrollTo({
    top: window.scrollY + window.innerHeight,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  })
}

export default function Scrollbar() {
  const svgRef = useRef(null)
  const leftWingRef = useRef(null)
  const rightWingRef = useRef(null)
  const pieceRefs = useRef([])
  const hitRefs = useRef([])
  const arrowHitRef = useRef(null)

  const anim = useRef({
    current: 0,
    target: 0,
    rafId: null,
    lastTime: 0,
    state: "idle",
  })
  const didEnter = useRef(false)
  const bobTime = useRef(0)

  const { theme } = useTheme()
  const { settings, dotCount } = useScrollbarSettings(theme)

  useEffect(() => {
    document.documentElement.classList.add("sbc-active")
    return () => {
      document.documentElement.classList.remove("sbc-active")
    }
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    const leftWing = leftWingRef.current
    const rightWing = rightWingRef.current
    const pieces = pieceRefs.current
      .slice(0, dotCount)
      .filter((el) => el !== null)
    const hits = hitRefs.current
      .slice(0, dotCount)
      .filter((h) => h !== null)
    const arrowHit = arrowHitRef.current
    if (
      !svg ||
      !leftWing ||
      !rightWing ||
      !arrowHit ||
      pieces.length < dotCount ||
      hits.length < dotCount
    )
      return undefined

    const a = anim.current
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const canHover = window.matchMedia("(hover: hover)")

    const transitions = [
      resolveTransition(settings.timing.compressed),
      resolveTransition(settings.timing.extended),
      resolveTransition(settings.timing.split),
      resolveTransition(settings.timing.tracking),
    ]

    const geometry = {
      arrowLength: settings.arrow.arrowLength,
      wingSpread: settings.arrow.wingSpread,
      lineLength: settings.line.length,
      dotCount,
    }
    let poses = getPoses(svg.getBoundingClientRect(), geometry)

    const getExtensionLength = (dot, focusDot) =>
      settings.tracking.maxExtension *
      settings.tracking.extensionFalloff ** Math.abs(dot - focusDot)

    const placeHitAreas = () => {
      const spacing = settings.line.length / dotCount
      hits.forEach((el, i) => {
        const [x, y1, , y2] = poses.split.pieces[i]
        el.setAttribute(
          "x",
          String(x - settings.tracking.maxExtension - settings.tracking.hitPadding)
        )
        el.setAttribute("y", String((y1 + y2) / 2 - spacing / 2))
        el.setAttribute(
          "width",
          String(settings.tracking.maxExtension + 2 * settings.tracking.hitPadding)
        )
        el.setAttribute("height", String(spacing))
      })

      const [, , verticalAxis, bottomY] = poses.idle.leftWing
      const arrowHitTop =
        bottomY - settings.arrow.arrowLength - settings.arrow.bobAmplitude - settings.arrow.hitPadding
      const arrowHitBottom = bottomY + settings.arrow.bobAmplitude + settings.arrow.hitPadding
      arrowHit.setAttribute(
        "x",
        String(verticalAxis - settings.arrow.wingSpread - settings.arrow.hitPadding)
      )
      arrowHit.setAttribute("y", String(arrowHitTop))
      arrowHit.setAttribute(
        "width",
        String(2 * (settings.arrow.wingSpread + settings.arrow.hitPadding))
      )
      arrowHit.setAttribute("height", String(arrowHitBottom - arrowHitTop))
    }

    const dotColor = parseHexColor(settings.appearance.dotColor)
    const dotHoverColor = parseHexColor(settings.appearance.hoverColor)

    let hoveredDot = null
    let arrowHovered = false
    const applyHoverColors = () => {
      const arrowStroke = arrowHovered ? "var(--dot-hover-color)" : ""
      leftWing.style.stroke = arrowStroke
      rightWing.style.stroke = arrowStroke
      pieces.forEach((el, i) => {
        el.style.stroke = arrowHovered
          ? arrowStroke
          : hoveredDot === null
            ? ""
            : mixColors(
                dotColor,
                dotHoverColor,
                settings.tracking.colorFalloff ** Math.abs(i - hoveredDot)
              )
      })
    }

    const extensions = new Float64Array(dotCount)
    const advanceExtensions = (dt) => {
      const focusDot = getFocusDot(dotCount)
      const alpha = reduceMotion.matches
        ? 1
        : 1 - Math.exp(-dt / settings.tracking.smoothingTau)
      let settled = true
      for (let i = 0; i < dotCount; i++) {
        const targetLength = getExtensionLength(i, focusDot)
        const frameLength = extensions[i] + (targetLength - extensions[i]) * alpha
        if (Math.abs(targetLength - frameLength) < 0.05) {
          extensions[i] = targetLength
        } else {
          extensions[i] = frameLength
          settled = false
        }
      }
      return settled
    }

    const setLine = (el, f, g, s, extendLeft = 0, offsetY = 0) => {
      el.setAttribute("x1", String(lerp(f[0], g[0], s) - extendLeft))
      el.setAttribute("y1", String(lerp(f[1], g[1], s) + offsetY))
      el.setAttribute("x2", String(lerp(f[2], g[2], s)))
      el.setAttribute("y2", String(lerp(f[3], g[3], s) + offsetY))
    }

    const applyGeometry = (t) => {
      const segment = Math.min(Math.max(Math.floor(t), 0), transitions.length - 1)
      const from = poses[POSE_ORDER[segment]]
      const to = poses[POSE_ORDER[segment + 1]]
      const local = transitions[segment].ease(t - segment)
      const trackingExtensionScale = segment === transitions.length - 1 ? local : 0
      const idleBobScale = segment === 0 ? 1 - local : 0
      const bobOffset =
        idleBobScale *
        settings.arrow.bobAmplitude *
        Math.sin((2 * Math.PI * bobTime.current) / settings.arrow.bobPeriod)
      setLine(leftWing, from.leftWing, to.leftWing, local, 0, bobOffset)
      setLine(rightWing, from.rightWing, to.rightWing, local, 0, bobOffset)
      pieces.forEach((el, i) =>
        setLine(
          el,
          from.pieces[i],
          to.pieces[i],
          local,
          trackingExtensionScale * extensions[i],
          bobOffset
        )
      )
    }

    const syncState = () => {
      const next = getStateForScroll(window.scrollY)
      if (next !== a.state) {
        a.state = next
        svg.dataset.state = next
        if (next !== "tracking" && hoveredDot !== null) {
          hoveredDot = null
          applyHoverColors()
        }
        if (next !== "idle" && arrowHovered) {
          arrowHovered = false
          applyHoverColors()
        }
      }
    }

    const advance = (dt) => {
      if (reduceMotion.matches) {
        a.current = a.target
        return
      }
      let remaining = dt
      while (remaining > 0 && a.current !== a.target) {
        const dir = a.target > a.current ? 1 : -1
        const segment =
          dir > 0
            ? Math.min(Math.floor(a.current), transitions.length - 1)
            : Math.max(Math.ceil(a.current) - 1, 0)
        const boundary = dir > 0 ? segment + 1 : segment
        const stop =
          dir > 0 ? Math.min(a.target, boundary) : Math.max(a.target, boundary)
        const { duration } = transitions[segment]
        const timeToStop = Math.abs(stop - a.current) * duration
        if (timeToStop <= remaining) {
          a.current = stop
          remaining -= timeToStop
        } else {
          a.current += (remaining / duration) * dir
          remaining = 0
        }
      }
    }

    const step = (now) => {
      const dt = Math.min((now - a.lastTime) / 1000, 0.1)
      a.lastTime = now
      advance(dt)
      const extensionsSettled = advanceExtensions(dt)
      if (!reduceMotion.matches) bobTime.current += dt
      applyGeometry(a.current)
      const bobbing = a.current === 0 && !reduceMotion.matches
      if (a.current === a.target && extensionsSettled && !bobbing) {
        a.rafId = null
        return
      }
      a.rafId = requestAnimationFrame(step)
    }

    const kick = () => {
      if (a.rafId === null) {
        a.lastTime = performance.now()
        a.rafId = requestAnimationFrame(step)
      }
    }

    const onScroll = () => {
      syncState()
      a.target = getTargetForState(a.state)
      kick()
    }

    syncState()
    a.target = getTargetForState(a.state)
    if (!didEnter.current) {
      a.current = reduceMotion.matches ? a.target : Math.max(a.target - 1, 0)
      didEnter.current = true
    }
    const mountFocusDot = getFocusDot(dotCount)
    for (let i = 0; i < dotCount; i++) {
      extensions[i] = getExtensionLength(i, mountFocusDot)
    }
    applyGeometry(a.current)
    placeHitAreas()
    kick()

    const resizeObserver = new ResizeObserver(() => {
      poses = getPoses(svg.getBoundingClientRect(), geometry)
      applyGeometry(a.current)
      placeHitAreas()
    })
    resizeObserver.observe(svg)

    const hoverHandlers = hits.map((el, i) => {
      const enter = () => {
        if (!canHover.matches) return
        hoveredDot = i
        applyHoverColors()
      }
      const leave = () => {
        if (hoveredDot !== i) return
        hoveredDot = null
        applyHoverColors()
      }
      el.addEventListener("mouseenter", enter)
      el.addEventListener("mouseleave", leave)
      return { el, enter, leave }
    })

    const arrowEnter = () => {
      if (!canHover.matches) return
      arrowHovered = true
      applyHoverColors()
    }
    const arrowLeave = () => {
      arrowHovered = false
      applyHoverColors()
    }
    arrowHit.addEventListener("mouseenter", arrowEnter)
    arrowHit.addEventListener("mouseleave", arrowLeave)

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      hoverHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter)
        el.removeEventListener("mouseleave", leave)
      })
      arrowHit.removeEventListener("mouseenter", arrowEnter)
      arrowHit.removeEventListener("mouseleave", arrowLeave)
      window.removeEventListener("scroll", onScroll)
      resizeObserver.disconnect()
      if (a.rafId !== null) cancelAnimationFrame(a.rafId)
      a.rafId = null
    }
  }, [settings, dotCount])

  return (
    <svg
      ref={svgRef}
      className="scrollbar"
      data-state="idle"
      aria-hidden="true"
      style={
        {
          "--dot-color": settings.appearance.dotColor,
          "--dot-hover-color": settings.appearance.hoverColor,
          "--stroke-width": settings.appearance.strokeWidth,
        }
      }
    >
      <line ref={leftWingRef} />
      <line ref={rightWingRef} />
      {Array.from({ length: dotCount }, (_, i) => (
        <line
          key={i}
          ref={(el) => {
            pieceRefs.current[i] = el
          }}
        />
      ))}
      {Array.from({ length: dotCount }, (_, i) => (
        <rect
          key={i}
          className="hit-area"
          ref={(el) => {
            hitRefs.current[i] = el
          }}
          onClick={() => scrollToDot(i, dotCount)}
        />
      ))}
      <rect
        ref={arrowHitRef}
        className="arrow-hit"
        onClick={scrollDownOneViewport}
      />
    </svg>
  )
}
