import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { safeStorage } from "../../utils/storage";
import { PressureField } from "./CanvasExperiments";
import {
  ASCIITextExperiment,
  CursorMorphExperiment,
  CursorTrailExperiment,
  GalaxyExperiment,
  MetallicPaintExperiment,
  TextPressureExperiment,
  WavesExperiment,
} from "./DomExperiments";
import { EXPERIMENTS, getDefaultParams, QUALITY_MODES } from "./registry";
import useSystemMetrics from "./useSystemMetrics";
import styles from "./Playground.module.scss";

const ThreeExperiment = dynamic(() => import("./ThreeExperiments"), {
  ssr: false,
  loading: () => <div className={styles.loadingSurface} aria-label="Preparing WebGL experiment" />,
});
const SignalExperiment = dynamic(
  () => import("./ThreeExperiments").then((module) => module.SignalExperiment),
  { ssr: false, loading: () => <div className={styles.loadingSurface} aria-label="Preparing audio field" /> }
);

const ACTIVE_KEY = "playground.active-experiment.v1";
const QUALITY_KEY = "playground.quality.v1";
const PARAMS_KEY = "playground.params.v1";
const INSPECTOR_KEY = "playground.inspector.v1";

function readStoredJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = safeStorage.get(window.localStorage, key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeStoredParams(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(EXPERIMENTS.flatMap((experiment) => {
    const stored = raw[experiment.id];
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return [];
    const normalized = {};
    experiment.controls.forEach((control) => {
      const value = stored[control.key];
      if (control.options) {
        if (control.options.some((option) => option.value === value)) normalized[control.key] = value;
        return;
      }
      if (typeof value === "number" && Number.isFinite(value)) {
        normalized[control.key] = Math.min(control.max, Math.max(control.min, value));
      }
    });
    return [[experiment.id, normalized]];
  }));
}

function SystemPanel({ metrics, experiment, quality, setQuality }) {
  const [expanded, setExpanded] = useState(false);
  const rows = [
    ["FPS", `${metrics.fps.toFixed(0)} FPS`],
    ["Avg FPS", `${metrics.averageFps.toFixed(1)} FPS`],
    ["Frame time", `${metrics.frameTime.toFixed(1)} ms`],
    ["Renderer", experiment.renderer],
    ["Reduced motion", metrics.reducedMotion ? "Yes" : "No"],
    ["Quality tier", QUALITY_MODES[quality].label],
  ];
  if (expanded) {
    rows.push(
      ["Device pixel ratio", metrics.dpr.toFixed(2)],
      ["Animation loops", String(metrics.loopCount)],
      ["WebGL canvases", String(metrics.webglCount)]
    );
  }

  return (
    <aside className={styles.systemPanel} aria-label="Live rendering system status">
      <button type="button" onClick={() => setExpanded((value) => !value)} className={styles.systemHeading} aria-expanded={expanded}>
        <span>System</span><span aria-hidden="true">{expanded ? "-" : "+"}</span>
      </button>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      {expanded && (
        <div className={styles.qualitySelector} role="group" aria-label="Rendering quality">
          {Object.entries(QUALITY_MODES).map(([id, mode]) => (
            <button key={id} type="button" onClick={() => setQuality(id)} aria-pressed={quality === id}>{mode.label}</button>
          ))}
        </div>
      )}
    </aside>
  );
}

function ExperimentSurface({ experiment, paused, params, quality, theme, resetKey }) {
  const qualityConfig = QUALITY_MODES[quality];
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shared = { paused, params, qualityConfig, reducedMotion, theme };

  if (experiment.id === "galaxy") {
    return <GalaxyExperiment key={`${experiment.id}-${resetKey}-${quality}`} {...shared} />;
  }
  if (experiment.id === "waves") {
    return <WavesExperiment key={`${experiment.id}-${resetKey}-${quality}`} {...shared} />;
  }
  if (["refraction", "particle-type", "atlas-field"].includes(experiment.id)) {
    return <ThreeExperiment key={`${experiment.id}-${resetKey}-${quality}`} mode={experiment.id} {...shared} />;
  }
  if (experiment.id === "signal-field") {
    return <SignalExperiment key={`${experiment.id}-${resetKey}-${quality}`} {...shared} />;
  }
  if (experiment.id === "text-pressure") {
    return <TextPressureExperiment key={`${experiment.id}-${resetKey}`} params={params} theme={theme} />;
  }
  if (experiment.id === "pressure-field") {
    return <PressureField key={`${experiment.id}-${resetKey}`} paused={paused} params={params} reducedMotion={reducedMotion} quality={quality} theme={theme} />;
  }
  if (experiment.id === "cursor-trail") {
    return <CursorTrailExperiment key={`${experiment.id}-${resetKey}-${params.mode}-${quality}`} {...shared} />;
  }
  if (experiment.id === "ascii-text") {
    return <ASCIITextExperiment key={`${experiment.id}-${resetKey}`} params={params} theme={theme} />;
  }
  if (experiment.id === "metallic-paint") {
    return <MetallicPaintExperiment key={`${experiment.id}-${resetKey}`} params={params} />;
  }
  return <CursorMorphExperiment key={`${experiment.id}-${resetKey}`} params={params} />;
}

function Inspector({ experiment, params, setParams, onClose }) {
  return (
    <aside className={styles.inspector} aria-label={`${experiment.title} parameters`}>
      <header>
        <div><span>Parameters</span><strong>{experiment.index}</strong></div>
        <button type="button" onClick={onClose} aria-label="Close parameter inspector">x</button>
      </header>
      <div className={styles.inspectorControls}>
        {experiment.controls.map((control) => (
          <label key={control.key}>
            <span>
              <b>{control.label}</b>
              <output>{control.options ? control.options.find((option) => option.value === params[control.key])?.label : Number(params[control.key]).toFixed(control.step < 0.1 ? 2 : control.step < 1 ? 1 : 0)}</output>
            </span>
            {control.options ? (
              <select value={params[control.key]} onChange={(event) => setParams((current) => ({ ...current, [control.key]: event.target.value }))}>
                {control.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ) : (
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={params[control.key]}
                onChange={(event) => setParams((current) => ({ ...current, [control.key]: Number(event.target.value) }))}
              />
            )}
          </label>
        ))}
      </div>
      <p>Authored limits keep the experiment legible and the renderer stable.</p>
    </aside>
  );
}

export default function Playground() {
  const { theme, toggleTheme, setThemeMode } = useTheme();
  const [activeId, setActiveId] = useState("galaxy");
  const [quality, setQuality] = useState("balanced");
  const [paramsById, setParamsById] = useState({});
  const [paused, setPaused] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const activeIndex = Math.max(0, EXPERIMENTS.findIndex((experiment) => experiment.id === activeId));
  const experiment = EXPERIMENTS[activeIndex];
  const params = useMemo(
    () => ({ ...getDefaultParams(experiment), ...(paramsById[experiment.id] || {}) }),
    [experiment, paramsById]
  );
  const metrics = useSystemMetrics(experiment.renderer);

  useEffect(() => {
    setThemeMode("dark");
    const storedId = safeStorage.get(window.localStorage, ACTIVE_KEY);
    const requestedId = new URLSearchParams(window.location.search).get("experiment");
    if (EXPERIMENTS.some((item) => item.id === requestedId)) setActiveId(requestedId);
    else if (EXPERIMENTS.some((item) => item.id === storedId)) setActiveId(storedId);
    const storedQuality = safeStorage.get(window.localStorage, QUALITY_KEY);
    if (QUALITY_MODES[storedQuality]) setQuality(storedQuality);
    else {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lowConcurrency = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
      setQuality(reduceMotion || lowConcurrency ? "low" : "balanced");
    }
    setParamsById(normalizeStoredParams(readStoredJson(PARAMS_KEY, {})));
    setInspectorOpen(safeStorage.get(window.localStorage, INSPECTOR_KEY) === "open");
    setHydrated(true);
  }, [setThemeMode]);

  useEffect(() => {
    if (!hydrated) return;
    safeStorage.set(window.localStorage, ACTIVE_KEY, activeId);
    safeStorage.set(window.localStorage, QUALITY_KEY, quality);
    safeStorage.set(window.localStorage, PARAMS_KEY, JSON.stringify(paramsById));
    safeStorage.set(window.localStorage, INSPECTOR_KEY, inspectorOpen ? "open" : "closed");
  }, [activeId, hydrated, inspectorOpen, paramsById, quality]);

  const selectExperiment = useCallback((id) => {
    setActiveId(id);
    setPaused(false);
  }, []);
  const setParams = useCallback((updater) => {
    setParamsById((current) => {
      const currentParams = { ...getDefaultParams(experiment), ...(current[experiment.id] || {}) };
      const nextParams = typeof updater === "function" ? updater(currentParams) : updater;
      return { ...current, [experiment.id]: nextParams };
    });
  }, [experiment]);
  const resetExperiment = useCallback(() => {
    setParamsById((current) => ({ ...current, [experiment.id]: getDefaultParams(experiment) }));
    setPaused(false);
    setResetKey((key) => key + 1);
  }, [experiment]);

  useEffect(() => {
    const handleKey = (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        selectExperiment(EXPERIMENTS[(activeIndex + 1) % EXPERIMENTS.length].id);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        selectExperiment(EXPERIMENTS[(activeIndex - 1 + EXPERIMENTS.length) % EXPERIMENTS.length].id);
      }
      if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
      }
      if (event.key.toLowerCase() === "r") resetExperiment();
      if (event.key.toLowerCase() === "i") setInspectorOpen((value) => !value);
      if (event.key === "Escape" && inspectorOpen) setInspectorOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, inspectorOpen, resetExperiment, selectExperiment]);

  return (
    <main id="main-content" className={`${styles.root} playground-route`} data-playground-theme={theme}>
      <aside className={styles.indexPanel} aria-label="Playground experiment index">
        <div className={styles.brandRow}>
          <Link href="/" aria-label="Return to portfolio" data-cursor-label="Exit Playground">Effects Lab</Link>
          <span>/ playground</span>
        </div>
        <div className={styles.indexLabel}>Experiments <span>{experiment.index} / 12</span></div>
        <nav>
          <ol>
            {EXPERIMENTS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectExperiment(item.id)}
                  className={item.id === experiment.id ? styles.activeExperiment : undefined}
                  aria-current={item.id === experiment.id ? "true" : undefined}
                >
                  <span>{item.index}</span>
                  <b>{item.title}</b>
                  <small>{item.technologies[0]}</small>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.indexFooter}>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            Theme <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
          <Link href="/">Exit <span>NE</span></Link>
        </div>
      </aside>

      <section className={styles.workspace} aria-labelledby="experiment-title">
        <div className={styles.mobileBar}>
          <Link href="/" aria-label="Return to portfolio">Effects Lab</Link>
          <label>
            <span className="sr-only">Choose experiment</span>
            <select value={experiment.id} onChange={(event) => selectExperiment(event.target.value)}>
              {EXPERIMENTS.map((item) => <option value={item.id} key={item.id}>{item.index} - {item.title}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => setInspectorOpen(true)} aria-label="Open parameters">Tune</button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={experiment.id}
            className={styles.surface}
            initial={metrics.reducedMotion ? false : { opacity: 0, scale: 1.008 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={metrics.reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: metrics.reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <ExperimentSurface experiment={experiment} paused={paused} params={params} quality={quality} theme={theme} resetKey={resetKey} />
          </motion.div>
        </AnimatePresence>

        <header className={styles.experimentMeta}>
          <span>{experiment.index} / {experiment.category}</span>
          <h1 id="experiment-title">{experiment.title}</h1>
          <p>{experiment.shortDescription}</p>
          <div>
            <span>{experiment.status}</span>
            {experiment.origin?.map((origin) => (
              origin.projectUrl ? (
                <a key={`${origin.relationship}-${origin.projectName}`} href={origin.projectUrl} target={origin.projectUrl.startsWith("http") ? "_blank" : undefined} rel={origin.projectUrl.startsWith("http") ? "noreferrer" : undefined}>
                  {origin.relationship}: {origin.projectName}
                </a>
              ) : (
                <span key={`${origin.relationship}-${origin.projectName}`}>{origin.relationship}: {origin.projectName}</span>
              )
            ))}
          </div>
        </header>

        <SystemPanel metrics={metrics} experiment={experiment} quality={quality} setQuality={setQuality} />

        <div className={styles.transport} role="group" aria-label="Experiment controls">
          <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}><span>{paused ? "Play" : "II"}</span>{paused ? "Resume" : "Pause"}</button>
          <button type="button" onClick={resetExperiment}><span>Reset</span>Reset</button>
          <button type="button" onClick={() => setInspectorOpen((value) => !value)} aria-expanded={inspectorOpen}><span>Tune</span>Parameters</button>
        </div>

        <AnimatePresence>
          {inspectorOpen && (
            <motion.div className={styles.inspectorWrap} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }} transition={{ duration: metrics.reducedMotion ? 0 : 0.22 }}>
              <Inspector experiment={experiment} params={params} setParams={setParams} onClose={() => setInspectorOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {paused && <div className={styles.pausedFlag}>Paused</div>}
      </section>
    </main>
  );
}
