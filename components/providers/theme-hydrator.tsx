"use client";

import { useEffect } from "react";
import { normalizePlatformSettings } from "@/lib/platform-settings";
import { defaultPlatformTheme, normalizeTheme, type PlatformTheme } from "@/lib/theme-options";

export const platformSettingsKey = "heist-stoker-platform-settings";
export const themeChangedEvent = "heist-stoker-theme-changed";
export const platformSettingsChangedEvent = "heist-stoker-settings-changed";

export function applyPlatformTheme(theme: PlatformTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "dark-gold" ? "dark" : "light";
}

export function readSavedTheme() {
  try {
    const savedSettings = localStorage.getItem(platformSettingsKey);
    if (!savedSettings) {
      return defaultPlatformTheme;
    }

    return normalizeTheme(normalizePlatformSettings(JSON.parse(savedSettings)).theme);
  } catch {
    return defaultPlatformTheme;
  }
}

export function ThemeHydrator() {
  useEffect(() => {
    applyPlatformTheme(readSavedTheme());

    function handleThemeChanged(event: Event) {
      const theme = normalizeTheme((event as CustomEvent<PlatformTheme>).detail);
      applyPlatformTheme(theme);
    }

    function handleStorage() {
      applyPlatformTheme(readSavedTheme());
    }

    window.addEventListener(themeChangedEvent, handleThemeChanged);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(themeChangedEvent, handleThemeChanged);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
