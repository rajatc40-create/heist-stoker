import { defaultPlatformTheme, normalizeTheme } from "@/lib/theme-options";
import type { UserSettings } from "@/types/platform";

export const heroBannerOptions = [
  {
    id: "green",
    label: "Green Banner",
    description: "Current green YouTube-style front banner.",
    src: "/brand/heist-stoker-front-banner-final-green.png"
  },
  {
    id: "dark",
    label: "Dark Banner",
    description: "Classic dark trading-room banner with gold accents.",
    src: "/brand/heist-stoker-front-banner.png"
  },
  {
    id: "approved",
    label: "Safe Green",
    description: "Balanced green banner that fits light and dark themes.",
    src: "/brand/heist-stoker-front-banner-approved-safe.png"
  }
] as const;

export type HeroBannerMode = (typeof heroBannerOptions)[number]["id"] | "custom";

export const defaultPlatformSettings: UserSettings = {
  websiteName: "HEIST STOKER",
  theme: defaultPlatformTheme,
  scannerRefreshSeconds: 30,
  rsiPeriod: 14,
  rsiOversold: 30,
  rsiOverbought: 70,
  youtubeLink: "https://www.youtube.com/@HEISTSTOKER",
  heroBannerMode: "green",
  heroBannerCustomUrl: ""
};

export function normalizeBannerMode(value: unknown): HeroBannerMode {
  if (value === "custom") {
    return "custom";
  }

  return heroBannerOptions.some((banner) => banner.id === value) ? (value as HeroBannerMode) : "green";
}

export function normalizePlatformSettings(value?: Partial<UserSettings> | null): UserSettings {
  return {
    ...defaultPlatformSettings,
    ...(value ?? {}),
    theme: normalizeTheme(value?.theme),
    heroBannerMode: normalizeBannerMode(value?.heroBannerMode),
    heroBannerCustomUrl: typeof value?.heroBannerCustomUrl === "string" ? value.heroBannerCustomUrl : ""
  };
}

export function getHeroBannerSource(settings: Pick<UserSettings, "heroBannerMode" | "heroBannerCustomUrl">) {
  if (settings.heroBannerMode === "custom" && settings.heroBannerCustomUrl) {
    return settings.heroBannerCustomUrl;
  }

  return heroBannerOptions.find((banner) => banner.id === settings.heroBannerMode)?.src ?? heroBannerOptions[0].src;
}
