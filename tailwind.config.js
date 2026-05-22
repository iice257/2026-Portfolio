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
      black: "#0a0a0a",
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
        light: "#6366f1",
        DEFAULT: "#4f46e5",
        dark: "#4338ca",
      },
    },
    fontFamily: {
      sans: ["var(--font-inter)", "Arial", "system-ui", "sans-serif"],
      mono: ["var(--font-ibm-plex-mono)", "monospace"],
    },
    extend: {
      fontSize: {
        // Dramatic oversized scale
        "hero": ["clamp(4rem, 15vw, 20rem)", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "massive": ["clamp(3rem, 12vw, 16rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "giant": ["clamp(2.5rem, 10vw, 12rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "huge": ["clamp(2rem, 8vw, 10rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],

        // Editorial display sizes
        "display-2xl": ["clamp(3.5rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(3rem, 6vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(2rem, 4vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2" }],

        // Body text
        "editorial": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.6", letterSpacing: "-0.01em" }],
        "body-xl": ["1.25rem", { lineHeight: "1.6" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],

        // Micro text for contrast
        "caption": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.1em" }],
        "micro": ["0.625rem", { lineHeight: "1.2", letterSpacing: "0.1em" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      spacing: {
        "section": "clamp(8rem, 20vh, 16rem)",
        "section-lg": "clamp(12rem, 30vh, 24rem)",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
        "smooth-in": "cubic-bezier(0.32, 0, 0.67, 0)",
        "smooth-out": "cubic-bezier(0.33, 1, 0.68, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1000": "1000ms",
        "1200": "1200ms",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "tracking-in": "trackingIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(80px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        trackingIn: {
          "0%": { letterSpacing: "-0.5em", opacity: "0" },
          "40%": { opacity: "0.6" },
          "100%": { letterSpacing: "-0.02em", opacity: "1" },
        },
      },
      aspectRatio: {
        "4/5": "4 / 5",
        "3/4": "3 / 4",
        "2/3": "2 / 3",
      },
    },
  },
  plugins: [],
};
