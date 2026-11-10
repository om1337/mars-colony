import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dust: {
          950: "#0a0806",
          900: "#14100c",
          850: "#1a1510",
          800: "#221c16",
          700: "#2e261e",
          600: "#3d3429",
          500: "#5c4f3f",
          400: "#8a7a64",
          300: "#b5a48c",
          200: "#d4c4ac",
          100: "#ebe0d0",
          50: "#f7f1e8",
        },
        rust: {
          DEFAULT: "#c45c26",
          bright: "#e06a2e",
          dim: "#8a3f1a",
        },
        copper: {
          DEFAULT: "#b87333",
          light: "#d4956a",
        },
        signal: {
          DEFAULT: "#4a9e6f",
          bright: "#5cb882",
          dim: "#2d6b4a",
        },
        warn: {
          DEFAULT: "#d4a017",
          bright: "#e8b82a",
        },
        danger: {
          DEFAULT: "#c73e1d",
          bright: "#e04a28",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(196, 92, 38, 0.15)",
        panel: "0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
        "slide-in": "slideIn 0.35s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
