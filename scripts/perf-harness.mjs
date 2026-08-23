import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const baselinesDir = path.join(root, "harness", "baselines");
const runsDir = path.join(root, "harness", "runs");

const args = process.argv.slice(2);
const UPDATE = args.includes("--update-baselines");
const SELFTEST = args.includes("--selftest");
const urlArg = args.find((arg) => arg.startsWith("--url="));
const BASE_URL = urlArg ? urlArg.split("=")[1] : "http://localhost:3000";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const VIEWPORT = { width: 1440, height: 900 };
const DT = 1000 / 60;
// Sub-glyph-AA noise floor: variable-font weight easing freezes within +-0.15px
// of the pointer, which can flip an integer 'wght' unit on huge glyphs and shift
// anti-aliasing on edges. Measured run-to-run: <= ~230px on 1440x900.
// Real regressions (state, layout, color, backdrop changes) produce thousands+.
const MAX_NOISE_PIXELS = 800;

// Injected before any page script: deterministic randomness, virtual rAF/timers,
// long-task collection, frozen CSS transitions for stable screenshots.
const INIT_SCRIPT = `
(() => {
  const DT = ${DT};
  let vt = 0;
  let s = 0x1234567;
  Math.random = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const frameQueue = new Map();
  const timers = new Map();
  let nextFrameId = 1;
  let nextTimerId = 1;

  window.__vt = 0;
  window.__frameCosts = [];
  window.__longTasks = [];
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__longTasks.push(entry.duration);
    }).observe({ entryTypes: ["longtask"] });
  } catch {}

  window.requestAnimationFrame = (cb) => {
    const key = nextFrameId++;
    frameQueue.set(key, cb);
    return key;
  };
  window.cancelAnimationFrame = (key) => { frameQueue.delete(key); };

  window.setTimeout = (fn, ms = 0, ...rest) => {
    const key = nextTimerId++;
    timers.set(key, { fn, at: vt + Number(ms) || 0, rest, interval: null });
    return key;
  };
  window.setInterval = (fn, ms = 0, ...rest) => {
    const key = nextTimerId++;
    timers.set(key, { fn, at: vt + (Number(ms) || 1), rest, interval: Number(ms) || 1 });
    return key;
  };
  window.clearTimeout = window.clearInterval = (key) => { timers.delete(key); };

  const runDueTimers = () => {
    for (const [key, timer] of [...timers.entries()]) {
      if (timer.at > vt) continue;
      if (timer.interval) timer.at += timer.interval; else timers.delete(key);
      try { timer.fn(...timer.rest); } catch {}
    }
  };

  window.__pumpFrames = (count) => {
    const costs = [];
    for (let i = 0; i < count; i++) {
      vt += DT;
      window.__vt = vt;
      runDueTimers();
      const batch = [...frameQueue.entries()];
      frameQueue.clear();
      const t0 = performance.now();
      for (const [, cb] of batch) { try { cb(vt); } catch {} }
      costs.push(performance.now() - t0);
    }
    return costs;
  };

  // Pump until the cursor SVG shape + label stop changing (tweens settled),
  // so behavior snapshots never catch mid-flight interpolation.
  window.__settleCursor = (maxFrames = 240, stableNeeded = 12) => {
    const readSignal = () => {
      const outline = document.querySelector("svg path[stroke='#ffffff']");
      const pill = document.querySelector(".custom-cursor-label");
      return String((outline ? outline.getAttribute("d") : "")) + "#" + String(pill ? pill.className : "") + "|" + String(pill ? pill.textContent : "");
    };
    let last = null;
    let stable = 0;
    let frames = 0;
    const costs = [];
    while (frames < maxFrames) {
      costs.push(...window.__pumpFrames(1));
      frames += 1;
      const signal = readSignal();
      if (signal === last) {
        stable += 1;
        if (stable >= stableNeeded) break;
      } else {
        stable = 0;
        last = signal;
      }
    }
    return { frames, costs };
  };

  // Re-align virtual time to a canonical grid so every run continues from an
  // identical vt. Only ever called after FIXED pump counts - never after
  // adaptive settling - so pump history stays identical across runs.
  window.__convergeTime = (gridMs) => {
    const target = Math.ceil((vt + 1) / gridMs) * gridMs;
    const remaining = Math.max(0, Math.round((target - vt) / DT));
    return window.__pumpFrames(remaining);
  };

  // Yield once via MessageChannel so already-dispatched input events are
  // processed before we continue pumping/snapshotting.
  window.__flushInput = () => new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => { channel.port1.close(); resolve(); };
    channel.port2.postMessage(0);
  });
})();
`;

const FREEZE_STYLE = `
  <style>
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
      caret-color: transparent !important;
    }
  </style>
`;

const SCENARIOS = [
  { name: "home-dark-hero", theme: "dark", scrollY: 0 },
  { name: "home-light-hero", theme: "light", scrollY: 0 },
  { name: "home-dark-scrolled", theme: "dark", scrollY: 1150 },
  { name: "home-light-scrolled", theme: "light", scrollY: 1150 },
];

const stats = (values) => {
  if (!values.length) return { avg: 0, p95: 0, max: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  return {
    avg: sorted.reduce((sum, v) => sum + v, 0) / sorted.length,
    p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
    max: sorted[sorted.length - 1],
  };
};

// Drain pending input events, let any late-started cursor tween finish
// (16 frames > longest home-page morph), then re-align virtual time.
async function flushAndSettle(page) {
  await page.evaluate(() => window.__flushInput());
  await page.evaluate(() => window.__pumpFrames(16));
  await page.evaluate(() => window.__convergeTime(600));
}

async function snapshotCursorState(page, label) {
  return await page.evaluate((checkpointLabel) => {
    const read = (selector) => document.querySelector(selector);
    const pill = read(".custom-cursor-label");
    const outline = read("svg path[stroke='#ffffff']");
    const fills = document.querySelectorAll("svg path[fill='#ffffff']");
    const fillPath = fills.length ? fills[0] : null;
    const cursorHost = document.querySelector("div.fixed.top-0.left-0.z-\\[999999\\]");
    // Classify morph coarsely: transient interpolation is inherently racy
    // under CDP input, but the TARGET shape is the behavior contract.
    let morph = null;
    const rawD = outline ? outline.getAttribute("d") : null;
    if (rawD) {
      const afterC = rawD.slice(rawD.indexOf("C") + 1);
      const cx = parseFloat(afterC);
      morph = cx < 5.56 ? "default" : cx > 5.89 ? "clickable" : "transitioning";
    }
    const hostRaw = cursorHost ? cursorHost.style.transform : "";
    const hostCoords = hostRaw.match(/-?\d+(\.\d+)?/g);
    return {
      checkpoint: checkpointLabel,
      pillText: pill ? pill.textContent : null,
      pillClasses: pill ? pill.className : null,
      morph,
      fillOpacity: fillPath ? fillPath.getAttribute("opacity") : null,
      hostTransform: hostCoords ? hostCoords.slice(0, 2).map((n) => Math.round(Number(n))).join(",") : hostRaw,
    };
  }, label);
}

// Behavior comparison: discrete state fields must match exactly. The single
// exception is morph === "transitioning": a sample caught mid-tween says nothing
// about resolved behavior, so it matches anything. Wrong TARGET shapes still fail.
function behaviorLogsMatch(logA, logB) {
  if (logA.length !== logB.length) return false;
  for (let i = 0; i < logA.length; i += 1) {
    const entryA = logA[i];
    const entryB = logB[i];
    const keys = new Set([...Object.keys(entryA), ...Object.keys(entryB)]);
    for (const key of keys) {
      const valueA = entryA[key];
      const valueB = entryB[key];
      if (key === "morph" && (valueA === "transitioning" || valueB === "transitioning")) continue;
      if (JSON.stringify(valueA) !== JSON.stringify(valueB)) return false;
    }
  }
  return true;
}

async function runScenario(browser, scenario, runLabel) {
  const page = await browser.newPage();
  await page.setViewport({ ...VIEWPORT, deviceScaleFactor: 1 });

  await page.evaluateOnNewDocument(INIT_SCRIPT);
  await page.evaluateOnNewDocument(
    (theme, freezeStyle) => {
      localStorage.setItem("theme", theme);
      document.addEventListener("DOMContentLoaded", () => {
        document.head.insertAdjacentHTML("beforeend", freezeStyle);
      });
    },
    scenario.theme,
    FREEZE_STYLE
  );

  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Wait for the hero backdrop canvas to actually mount BEFORE the first
  // pumped frame, so its animation loop anchors at frame 1 in every run.
  // (A late-resolving dynamic import would otherwise mount mid-choreography
  // and shift the waves/galaxy phase for the whole run.)
  await page.waitForFunction(
    (isLight) => Boolean(
      isLight
        ? document.querySelector('[class*="wavesBackdrop"] canvas')
        : document.querySelector('[class*="galaxyBackdrop"] canvas')
    ),
    { timeout: 15000, polling: 50 },
    scenario.theme === "light"
  );

  // Switch to fully manual frames so every visual state is pump-deterministic.
  const warmupCosts = await page.evaluate(() => window.__pumpFrames(30));
  await page.evaluate(() => window.__convergeTime(600));

  const stateLog = [];
  stateLog.push(await snapshotCursorState(page, "load"));

  if (scenario.scrollY === 0) {
    // Pointer choreography across the hero name treatment.
    // Fixed pump counts everywhere: pump history must be identical across runs
    // for FPS-capped loops (waves/galaxy) to render identical final frames.
    const steps = [
      [260, 430], [420, 415], [580, 400], [720, 395], [860, 405],
      [980, 420], [1080, 430], [900, 520], [700, 545], [500, 530],
      [360, 480], [720, 620], [720, 300],
    ];
    for (const [x, y] of steps) {
      await page.mouse.move(x, y, { steps: 4 });
      await page.evaluate(() => window.__pumpFrames(16));
      await page.evaluate(() => window.__convergeTime(600));
    }
    stateLog.push(await snapshotCursorState(page, "post-sweep"));

    await page.mouse.move(1080, 430);
    await flushAndSettle(page);
    stateLog.push(await snapshotCursorState(page, "parked"));

    // Cross the header nav region to exercise interactive cursor states.
    await page.mouse.move(1180, 34, { steps: 4 });
    await flushAndSettle(page);
    stateLog.push(await snapshotCursorState(page, "header-nav"));

    await page.mouse.move(720, 430, { steps: 6 });
    await flushAndSettle(page);
    stateLog.push(await snapshotCursorState(page, "returned-center"));
  } else {
    await page.evaluate((y) => { window.scrollTo(0, y); }, scenario.scrollY);
    await new Promise((resolve) => setTimeout(resolve, 250));
    // Force all lazy media to finish decoding before we freeze the frame.
    await page.evaluate(async () => {
      const images = [...document.images];
      images.forEach((img) => { img.loading = "eager"; });
      await Promise.all(images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))));
    });
    await page.evaluate(() => window.__pumpFrames(6));
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Deep settle so scroll-triggered reveals/scrambles fully complete.
    await page.evaluate(() => window.__pumpFrames(120));
    await flushAndSettle(page);
    stateLog.push(await snapshotCursorState(page, `scrolled-${scenario.scrollY}`));
  }

  await new Promise((resolve) => setTimeout(resolve, 350));
  const frameCosts = await page.evaluate(() => {
    window.__convergeTime(600);
    return window.__pumpFrames(90);
  });
  const metricsSource = await page.evaluate(() => ({
    longTasks: window.__longTasks,
    heapMb: performance.memory ? performance.memory.usedJSHeapSize / 1048576 : null,
    virtualTime: window.__vt,
  }));

  const screenshotPath = path.join(runsDir, `${runLabel}-${scenario.name}.png`);
  await page.screenshot({ path: screenshotPath });

  const costStats = stats(frameCosts.length ? frameCosts : warmupCosts);
  await page.close();

  return {
    scenario: scenario.name,
    screenshotPath,
    stateLog,
    errors,
    metrics: {
      avgFrameMs: Number(costStats.avg.toFixed(2)),
      p95FrameMs: Number(costStats.p95.toFixed(2)),
      maxFrameMs: Number(costStats.max.toFixed(2)),
      longTaskCount: metricsSource.longTasks.length,
      longTaskTotalMs: Number(metricsSource.longTasks.reduce((sum, v) => sum + v, 0).toFixed(1)),
      heapMb: metricsSource.heapMb === null ? null : Number(metricsSource.heapMb.toFixed(1)),
      virtualTimeMs: Math.round(metricsSource.virtualTime),
    },
  };
}

function comparePng(aPath, bPath, diffPath) {
  const a = PNG.sync.read(fs.readFileSync(aPath));
  const b = PNG.sync.read(fs.readFileSync(bPath));
  if (a.width !== b.width || a.height !== b.height) {
    return { mismatchedPixels: -1, totalPixels: a.width * a.height };
  }
  const diff = new PNG({ width: a.width, height: b.height });
  const mismatchedPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
  });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return { mismatchedPixels, totalPixels: a.width * a.height };
}

async function captureAll(runLabel) {
  fs.mkdirSync(runsDir, { recursive: true });
  const executablePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (!executablePath) throw new Error("No Chrome/Edge installation found");

    const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: [
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
    ],
  });

  try {
    const results = [];
    for (const scenario of SCENARIOS) {
      process.stdout.write(`  running ${runLabel}/${scenario.name}…\n`);
      results.push(await runScenario(browser, scenario, runLabel));
    }
    return results;
  } finally {
    await browser.close();
  }
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(runsDir, file), JSON.stringify(data, null, 2));
}

let failures = 0;

if (SELFTEST) {
  console.log("Self-test: two independent runs must produce identical pixels and behavior logs.");
  const runA = await captureAll("a");
  const runB = await captureAll("b");
  for (const resultA of runA) {
    const resultB = runB.find((item) => item.scenario === resultA.scenario);
    const { mismatchedPixels } = comparePng(
      resultA.screenshotPath,
      resultB.screenshotPath,
      path.join(runsDir, `selftest-${resultA.scenario}-diff.png`)
    );
    const statesMatch = JSON.stringify(resultA.stateLog) === JSON.stringify(resultB.stateLog);
    console.log(
      `${mismatchedPixels === 0 && statesMatch ? "PASS" : "FAIL"} ${resultA.scenario}: ` +
      `${mismatchedPixels} px diff, behavior log ${statesMatch ? "identical" : "DIFFERS"}`
    );
    if (mismatchedPixels !== 0 || !statesMatch) failures += 1;
  }
  writeJson("selftest-metrics-a.json", runA.map(({ scenario, metrics }) => ({ scenario, metrics })));
  writeJson("selftest-metrics-b.json", runB.map(({ scenario, metrics }) => ({ scenario, metrics })));
  writeJson("selftest-states-a.json", runA.map(({ scenario, stateLog }) => ({ scenario, stateLog })));
  writeJson("selftest-states-b.json", runB.map(({ scenario, stateLog }) => ({ scenario, stateLog })));
} else {
  console.log(`Running harness against ${BASE_URL}`);
  const current = await captureAll("current");
  const report = [];

  for (const result of current) {
    const baselinePath = path.join(baselinesDir, `${result.scenario}.png`);
    const baselineStatesPath = path.join(baselinesDir, `${result.scenario}.states.json`);

    if (UPDATE) {
      fs.mkdirSync(baselinesDir, { recursive: true });
      fs.copyFileSync(result.screenshotPath, baselinePath);
      fs.writeFileSync(baselineStatesPath, JSON.stringify(result.stateLog, null, 2));
      report.push({ scenario: result.scenario, status: "baseline-updated", metrics: result.metrics });
      continue;
    }

    if (!fs.existsSync(baselinePath)) {
      report.push({ scenario: result.scenario, status: "no-baseline", metrics: result.metrics });
      failures += 1;
      continue;
    }

    const { mismatchedPixels, totalPixels } = comparePng(
      baselinePath,
      result.screenshotPath,
      path.join(runsDir, `${result.scenario}-diff.png`)
    );
    const baselineStates = JSON.parse(fs.readFileSync(baselineStatesPath, "utf8"));
    const statesIdentical = behaviorLogsMatch(baselineStates, result.stateLog);

    const pixelsOk = mismatchedPixels >= 0 && mismatchedPixels <= MAX_NOISE_PIXELS;
    const passed = pixelsOk && statesIdentical && result.errors.length === 0;
    if (!passed) failures += 1;

    report.push({
      scenario: result.scenario,
      status: passed ? "PASS" : "FAIL",
      mismatchedPixels,
      noiseCeiling: MAX_NOISE_PIXELS,
      behaviorLogMatchesBaseline: statesIdentical,
      pageErrors: result.errors,
      metrics: result.metrics,
    });
  }

  writeJson("report.json", report);
  console.table(report.map(({ scenario, status, mismatchedPixels, behaviorLogMatchesBaseline, metrics }) => ({
    scenario,
    status,
    pxDiff: mismatchedPixels ?? "-",
    behavior: behaviorLogMatchesBaseline === undefined ? "-" : (behaviorLogMatchesBaseline ? "ok" : "DIFF"),
    avgFrameMs: metrics.avgFrameMs,
    p95FrameMs: metrics.p95FrameMs,
    longTasks: metrics.longTaskCount,
  })));
}

process.exit(failures > 0 ? 1 : 0);
