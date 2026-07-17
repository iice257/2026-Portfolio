export const PORTFOLIO_GALAXY_CONFIG = {
  mouseRepulsion: false,
  mouseInteraction: false,
  density: 0.2,
  glowIntensity: 0.2,
  saturation: 0,
  hueShift: 140,
  twinkleIntensity: 0.5,
  rotationSpeed: 0,
  repulsionStrength: 2,
  autoCenterRepulsion: 0,
  starSpeed: 0.5,
  speed: 0.1,
  pixelRatio: 0.8,
  targetFps: 20,
  maxPixelCount: 900000,
};

const PORTFOLIO_WAVES_BASE_CONFIG = {
  backgroundColor: "transparent",
  waveSpeedX: 0.008,
  waveSpeedY: 0.008,
  waveAmpX: 28,
  waveAmpY: 14,
  friction: 0.72,
  tension: 0.005,
  maxCursorMove: 160,
  xGap: 28,
  yGap: 16,
  lineWidth: 1.35,
  pixelRatio: 0.8,
  targetFps: 20,
  maxPixelCount: 900000,
  mouseInteraction: false,
};

export const PORTFOLIO_WAVES_CONFIG = {
  ...PORTFOLIO_WAVES_BASE_CONFIG,
  lineColor: "#858585",
};

export const PORTFOLIO_WAVES_THEME_CONFIG = {
  light: PORTFOLIO_WAVES_CONFIG,
  dark: {
    ...PORTFOLIO_WAVES_BASE_CONFIG,
    lineColor: "#b5b5b5",
    lineWidth: 1.55,
  },
};
