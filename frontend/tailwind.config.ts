import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // NYU brand color (PRD 4.3 / TRD 1) — use bg-nyu-violet / text-nyu-violet / border-nyu-violet
        // (key must stay kebab-case: Tailwind uses the literal key as the utility suffix)
        "nyu-violet": "#57068C",

        // Design tokens carried over from the Stitch-generated screens (documents/vionest/ui/*.html)
        "on-surface-variant": "#4c4451",
        "surface-container": "#edeeef",
        "surface-bright": "#f8f9fa",
        "secondary-fixed-dim": "#c8c6c5",
        "surface-container-low": "#f3f4f5",
        "primary-fixed-dim": "#e0b6ff",
        "on-secondary-fixed-variant": "#474746",
        "on-secondary": "#ffffff",
        "tertiary-fixed-dim": "#f8ba7f",
        "tertiary-fixed": "#ffdcbf",
        "on-tertiary-container": "#d0965f",
        "primary-fixed": "#f2daff",
        primary: "#39005f",
        "on-surface": "#191c1d",
        "on-secondary-fixed": "#1b1c1c",
        "secondary-container": "#e2dfde",
        "on-background": "#191c1d",
        "on-primary": "#ffffff",
        error: "#ba1a1a",
        "on-primary-container": "#c985ff",
        outline: "#7e7383",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "inverse-primary": "#e0b6ff",
        "surface-tint": "#803db5",
        "surface-dim": "#d9dadb",
        background: "#f8f9fa",
        "inverse-on-surface": "#f0f1f2",
        "surface-variant": "#e1e3e4",
        "surface-container-highest": "#e1e3e4",
        "on-tertiary": "#ffffff",
        "on-primary-fixed-variant": "#66209b",
        "on-primary-fixed": "#2e004e",
        "inverse-surface": "#2e3132",
        "secondary-fixed": "#e5e2e1",
        secondary: "#5f5e5e",
        "on-secondary-container": "#636262",
        "surface-container-high": "#e7e8e9",
        "tertiary-container": "#562f00",
        "on-tertiary-fixed-variant": "#673d0c",
        tertiary: "#381c00",
        surface: "#f8f9fa",
        "primary-container": "#57068c",
        "outline-variant": "#cfc2d3",
        "on-tertiary-fixed": "#2d1600",
        "surface-container-lowest": "#ffffff",
        "on-error": "#ffffff",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "margin-desktop": "2rem",
        "margin-mobile": "1rem",
        "container-max": "1280px",
        gutter: "1.5rem",
        // enables pb-safe / p-safe etc. for iOS safe-area insets (used in bottom nav bars)
        safe: "env(safe-area-inset-bottom)",
      },
      fontFamily: {
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "label-caps": ["Inter"],
        "display-price": ["Inter"],
        "label-sm": ["Inter"],
        "headline-sm": ["Inter"],
        "headline-md": ["Inter"],
      },
      fontSize: {
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        "display-price": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "headline-sm": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
      },
      // SSO mock screens (auth/): background patterns from the Stitch source, expressed
      // as Tailwind utilities (`bg-watermark`, `bg-nyu-diagonal`) instead of raw <style> blocks.
      backgroundImage: {
        watermark:
          "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)",
        "nyu-diagonal":
          "linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.03) 48%, rgba(255,255,255,0.03) 52%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.03) 48%, rgba(255,255,255,0.03) 52%, transparent 52%)",
      },
      keyframes: {
        pulseGlow: {
          from: { boxShadow: "0 0 0 0 rgba(87, 6, 140, 0.2)" },
          to: { boxShadow: "0 0 0 10px rgba(87, 6, 140, 0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite alternate",
      },
    },
  },
  plugins: [],
} satisfies Config;
