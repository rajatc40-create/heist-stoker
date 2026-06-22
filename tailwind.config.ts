import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        bullish: "#19c37d",
        bearish: "#ff4b5c",
        gold: "#d8a83e",
        coal: "#050505",
        graphite: "#0c0d10",
        steel: "#15171c"
      },
      boxShadow: {
        glow: "0 0 32px rgba(216, 168, 62, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "market-grid":
          "linear-gradient(rgba(216,168,62,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(216,168,62,.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
