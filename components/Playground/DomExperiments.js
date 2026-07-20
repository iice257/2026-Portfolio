import { useEffect, useState } from "react";
import Galaxy from "../ReactBits/Galaxy";
import Waves from "../ReactBits/Waves";
import SplashCursor from "../ReactBits/SplashCursor";
import InteractiveDots from "../ReactBits/InteractiveDots";
import ASCIIText from "../ReactBits/ASCIIText";
import MetallicPaint from "../ReactBits/MetallicPaint";
import TextPressure from "../ReactBits/TextPressure";
import { useCursor } from "../../context/CursorContext";

const createMetallicMask = () => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <rect width="1200" height="720" fill="#fff"/>
  <path d="M144 148h912v424H144z" rx="22" fill="#000"/>
  <path d="M206 216h788v78H206z" fill="#fff"/>
  <path d="M206 392h788v84H206z" fill="#fff"/>
  <text x="600" y="371" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="148" font-weight="900" letter-spacing="-8" fill="#fff">PLAYGROUND</text>
  <circle cx="1012" cy="182" r="18" fill="#fff"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const metallicMask = createMetallicMask();

export function GalaxyExperiment({ paused, params, qualityConfig }) {
  return (
    <div className="playground-reactbits-surface" data-playground-loop={paused ? undefined : "active"}>
      <Galaxy
        density={params.density * qualityConfig.density}
        twinkleIntensity={params.twinkle}
        repulsionStrength={params.repulsion}
        rotationSpeed={params.rotation}
        mouseInteraction
        mouseRepulsion
        saturation={0}
        hueShift={0}
        glowIntensity={0.38}
        starSpeed={0.42}
        speed={1}
        pixelRatio={qualityConfig.dpr}
        targetFps={qualityConfig.fps}
        maxPixelCount={qualityConfig.density > 0.8 ? 1200000 : 720000}
        paused={paused}
      />
    </div>
  );
}

export function WavesExperiment({ paused, params, qualityConfig, theme }) {
  const ink = theme === "dark" ? "rgba(245,245,242,.78)" : "rgba(18,18,18,.76)";

  return (
    <div className="playground-reactbits-surface" data-playground-loop={paused ? undefined : "active"}>
      <Waves
        lineColor={ink}
        backgroundColor="transparent"
        waveAmpX={params.ampX}
        waveAmpY={params.ampY}
        yGap={params.spacing}
        xGap={qualityConfig.density > 0.8 ? 8 : 11}
        tension={params.tension}
        friction={0.925}
        maxCursorMove={120}
        lineWidth={theme === "dark" ? 1 : 1.2}
        pixelRatio={qualityConfig.dpr}
        targetFps={qualityConfig.fps}
        maxPixelCount={qualityConfig.density > 0.8 ? 760000 : 520000}
        paused={paused}
        mouseInteraction
      />
    </div>
  );
}

export function CursorTrailExperiment({ paused, params, qualityConfig, theme }) {
  const isFluid = params.mode === "fluid";
  const ink = theme === "dark" ? "#f5f5f2" : "#111111";
  const background = theme === "dark" ? "#050505" : "#f2f2ee";

  if (paused) {
    return <div className="cursor-trail-placeholder" aria-label="Cursor trail paused" />;
  }

  if (isFluid) {
    return (
      <div className="playground-reactbits-surface cursor-trail-fluid" data-playground-loop="active">
        <SplashCursor
          RAINBOW_MODE={false}
          COLOR={ink}
          BACK_COLOR={{ r: 0, g: 0, b: 0 }}
          TRANSPARENT
          DYE_RESOLUTION={qualityConfig.density > 0.8 ? 1024 : 720}
          SIM_RESOLUTION={qualityConfig.density > 0.8 ? 128 : 96}
          CURL={3}
          SPLAT_RADIUS={params.radius}
          SPLAT_FORCE={params.force}
          DENSITY_DISSIPATION={params.decay}
          VELOCITY_DISSIPATION={2}
          PRESSURE={0.1}
          SHADING
        />
      </div>
    );
  }

  return (
    <InteractiveDots
      active
      className="playground-dot-field"
      backgroundColor={background}
      dotColor={ink}
      gridSpacing={Math.round(22 + params.decay * 5)}
      animationSpeed={0.005}
      trailOnMove
      removeWaveLine={false}
      pointerRadius={Math.round(params.radius * 950)}
      rippleRadius={Math.round(params.radius * 1800)}
      interactionStrength={Math.max(0.6, params.force / 5200)}
      mouseInteraction
    />
  );
}

export function ASCIITextExperiment({ params, theme }) {
  return (
    <div className="ascii-experiment" data-playground-loop="active">
      <ASCIIText
        text="PLAY"
        asciiFontSize={params.asciiFontSize}
        textFontSize={params.textFontSize}
        planeBaseHeight={params.planeBaseHeight}
        textColor={theme === "dark" ? "#fdf9f3" : "#111111"}
        enableWaves={params.enableWaves === "on"}
      />
    </div>
  );
}

export function MetallicPaintExperiment({ params }) {
  return (
    <div className="metallic-experiment" data-playground-loop="active">
      <MetallicPaint
        imageSrc={metallicMask}
        seed={194}
        scale={params.scale}
        liquid={params.liquid}
        refraction={params.refraction}
        contour={params.contour}
        blur={0.012}
        speed={0.22}
        brightness={1.85}
        contrast={0.74}
        angle={-8}
        fresnel={0.9}
        patternSharpness={1.08}
        waveAmplitude={0.84}
        noiseScale={0.52}
        chromaticSpread={1}
        distortion={0.52}
        lightColor="#ffffff"
        darkColor="#050505"
        tintColor="#ffffff"
      />
    </div>
  );
}

export function TextPressureExperiment({ params, theme }) {
  return (
    <div className="text-pressure-experiment" aria-label="The word Pressure changes width and weight near the pointer.">
      <TextPressure
        text="PRESSURE"
        width
        weight
        italic={false}
        flex
        scale={false}
        textColor={theme === "dark" ? "#f5f5f2" : "#111111"}
        baseWeight={params.weight}
        maxWeight={params.maxWeight}
        targetFps={params.response}
        minFontSize={44}
      />
      <span className="pressure-orbit" aria-hidden="true"><i /></span>
    </div>
  );
}

const cursorStates = [
  { id: "default", number: "01", label: "Default", helper: "Sharp / idle", type: "plain" },
  { id: "clickable", number: "02", label: "Clickable", helper: "Rounded / filled", type: "button" },
  { id: "expand", number: "03", label: "Expand", helper: "Reveal detail", cursor: "Expand" },
  { id: "drag", number: "04", label: "Drag", helper: "Hold / move", cursor: "Drag" },
  { id: "text", number: "05", label: "Text", helper: "Edit / select", type: "input" },
  { id: "loading", number: "06", label: "Loading", helper: "Route-loading pulse", type: "loading" },
  { id: "locked", number: "07", label: "Locked", helper: "Unavailable", cursor: "Locked", disabled: true },
  { id: "media", number: "08", label: "Media", helper: "Play / pause", cursor: "Play" },
];

export function CursorMorphExperiment({ params }) {
  const { setIsRouteLoading, setCursorText, setCursorVariant, requestCursorRefresh } = useCursor();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("playground:cursor-config", { detail: params }));
    requestCursorRefresh();
    return () => {
      window.dispatchEvent(new CustomEvent("playground:cursor-config", {
        detail: { morph: 0.16, roundness: 1, fill: 0.16, spin: 0.7 },
      }));
    };
  }, [params, requestCursorRefresh]);

  useEffect(() => () => {
    setIsRouteLoading(false);
    setCursorText("");
    setCursorVariant("default");
  }, [setCursorText, setCursorVariant, setIsRouteLoading]);

  const enterLoading = () => setIsRouteLoading(true);
  const leaveLoading = () => setIsRouteLoading(false);
  const toggleExpanded = () => {
    setExpanded((value) => !value);
    window.requestAnimationFrame(requestCursorRefresh);
  };

  return (
    <div className="cursor-morph-experiment" aria-label="Semantic surfaces demonstrate the portfolio cursor states.">
      <header className="cursor-lab-heading">
        <p>Move across the field</p>
        <span>Pointer, scroll and layout state all resolve through the same cursor.</span>
      </header>
      <div className="cursor-state-grid">
        {cursorStates.map((state) => {
          const content = (
            <>
              <span className="cursor-state-number">{state.number}</span>
              <span className="cursor-state-label">{state.label}</span>
              <span className="cursor-state-glyph" aria-hidden="true">
                {state.id === "default" && "NW"}
                {state.id === "clickable" && "DOT"}
                {state.id === "expand" && (expanded ? "-" : "+")}
                {state.id === "drag" && "DRAG"}
                {state.id === "text" && "I"}
                {state.id === "loading" && "LOAD"}
                {state.id === "locked" && "X"}
                {state.id === "media" && "PLAY"}
              </span>
              <span className="cursor-state-helper">{state.helper}</span>
              {state.id === "expand" && expanded && <span className="cursor-state-detail">State changed beneath the pointer.</span>}
            </>
          );

          if (state.type === "input") {
            return (
              <label key={state.id} className="cursor-state-cell is-input">
                {content}
                <input aria-label="Text cursor test" defaultValue="Edit me" />
              </label>
            );
          }
          if (state.type === "button" || state.id === "expand") {
            return (
              <button
                key={state.id}
                type="button"
                className="cursor-state-cell"
                onClick={state.id === "expand" ? toggleExpanded : undefined}
                data-clickable="true"
              >
                {content}
              </button>
            );
          }
          if (state.type === "loading") {
            return (
              <button
                key={state.id}
                type="button"
                className="cursor-state-cell"
                onPointerEnter={enterLoading}
                onPointerLeave={leaveLoading}
                onFocus={enterLoading}
                onBlur={leaveLoading}
              >
                {content}
              </button>
            );
          }
          return (
            <div
              key={state.id}
              className={`cursor-state-cell ${state.disabled ? "is-disabled" : ""}`}
              data-cursor-label={state.cursor}
              data-cursor-variant="project"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
