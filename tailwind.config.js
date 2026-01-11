const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fafafa",
      black: "#050505", // True dark, not pitch black
      neutral: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
        950: "#0a0a0a",
      },
      accent: {
        DEFAULT: "#2a2a2a", // Minimalist accent
      },
    },
    fontFamily: {
      sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      display: ["var(--font-inter)", "system-ui", "sans-serif"],
    },
    extend: {
      fontSize: {
        // Massive Kinetic Series
        "kinetic-base": ["clamp(3rem, 8vw, 10rem)", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "kinetic-lg": ["clamp(4rem, 12vw, 16rem)", { lineHeight: "0.8", letterSpacing: "-0.05em" }],
        "kinetic-xl": ["clamp(5rem, 18vw, 24rem)", { lineHeight: "0.75", letterSpacing: "-0.06em" }],

        // Editorial Series
        "display-2xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.5" }],
        "body-md": ["1rem", { lineHeight: "1.5" }],
        "meta": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.1em", textTransform: "uppercase" }],
      },
      transitionTimingFunction: {
        "cinematic": "cubic-bezier(0.19, 1, 0.22, 1)", // Expo.easeOut equivalent
        "scrape": "cubic-bezier(0.87, 0, 0.13, 1)", // Heavy friction
      },
      spacing: {
        "screen-w": "100vw",
        "screen-h": "100vh",
      }
    },
  },
  plugins: [],
};
