/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: "#00ff46",
        "neon-dim": "rgba(0,255,70,0.15)",
        dark: {
          900: "#030303",
          800: "#0a0a0a",
          700: "#111111",
          600: "#1a1a1a",
        },
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "Share Tech Mono", "monospace"],
        display: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,255,70,0.4)",
        "neon-sm": "0 0 10px rgba(0,255,70,0.3)",
      },
    },
  },
  plugins: [],
};