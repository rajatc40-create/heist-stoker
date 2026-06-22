export const themeOptions = [
  {
    id: "emerald-light",
    name: "Deep Emerald",
    description: "Dark green, ivory, and gold combination for HEIST STOKER.",
    swatches: ["#063b2d", "#f5fff7", "#d8a83e"]
  },
  {
    id: "solar-cream",
    name: "Solar Cream",
    description: "Warm cream and gold base for an astrology-friendly finance look.",
    swatches: ["#f8f1dd", "#fffaf0", "#b88712"]
  },
  {
    id: "saffron-light",
    name: "Saffron Light",
    description: "Bright saffron and ivory base with Indian-market energy.",
    swatches: ["#fff4d6", "#ffffff", "#e28a12"]
  },
  {
    id: "sky-white",
    name: "Sky White",
    description: "Clean white and blue fintech style.",
    swatches: ["#eef7ff", "#ffffff", "#2477c8"]
  },
  {
    id: "dark-gold",
    name: "Old Dark Gold",
    description: "Previous dark trading-room theme with black base and gold accents.",
    swatches: ["#050506", "#14100a", "#d8a83e"]
  }
] as const;

export type PlatformTheme = (typeof themeOptions)[number]["id"];

export const defaultPlatformTheme: PlatformTheme = "emerald-light";

export function normalizeTheme(value: unknown): PlatformTheme {
  if (value === "Dark Gold" || value === "Midnight" || value === "Terminal") {
    return defaultPlatformTheme;
  }

  return themeOptions.some((theme) => theme.id === value) ? (value as PlatformTheme) : defaultPlatformTheme;
}
