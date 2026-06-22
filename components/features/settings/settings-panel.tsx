"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ImagePlus, RotateCcw, Save } from "lucide-react";
import { DataSafetyPanel } from "@/components/features/settings/data-safety-panel";
import {
  applyPlatformTheme,
  platformSettingsChangedEvent,
  platformSettingsKey,
  themeChangedEvent
} from "@/components/providers/theme-hydrator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  defaultPlatformSettings,
  getHeroBannerSource,
  heroBannerOptions,
  normalizePlatformSettings
} from "@/lib/platform-settings";
import { defaultPlatformTheme, normalizeTheme, themeOptions, type PlatformTheme } from "@/lib/theme-options";
import type { UserSettings } from "@/types/platform";

export function SettingsPanel() {
  const [settings, setSettings] = useState<UserSettings>(defaultPlatformSettings);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(platformSettingsKey);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings) as Partial<UserSettings>;
        const nextSettings = normalizePlatformSettings(parsedSettings);
        setSettings(nextSettings);
        applyPlatformTheme(nextSettings.theme);
      } else {
        applyPlatformTheme(defaultPlatformSettings.theme);
      }
    } catch {
      setSettings(defaultPlatformSettings);
      applyPlatformTheme(defaultPlatformSettings.theme);
    }
  }, []);

  function saveSettings() {
    const now = new Date().toISOString();
    localStorage.setItem(platformSettingsKey, JSON.stringify({ ...settings, savedAt: now }));
    applyPlatformTheme(settings.theme);
    window.dispatchEvent(new CustomEvent(themeChangedEvent, { detail: settings.theme }));
    window.dispatchEvent(new CustomEvent(platformSettingsChangedEvent, { detail: settings }));
    setSavedAt(now);
  }

  function updateTheme(theme: PlatformTheme) {
    const nextSettings = { ...settings, theme };
    const now = new Date().toISOString();
    setSettings(nextSettings);
    localStorage.setItem(platformSettingsKey, JSON.stringify({ ...nextSettings, savedAt: now }));
    applyPlatformTheme(theme);
    window.dispatchEvent(new CustomEvent(themeChangedEvent, { detail: theme }));
    window.dispatchEvent(new CustomEvent(platformSettingsChangedEvent, { detail: nextSettings }));
    setSavedAt(now);
  }

  function setBannerMode(mode: UserSettings["heroBannerMode"]) {
    setSettings((current) => ({
      ...current,
      heroBannerMode: mode,
      heroBannerCustomUrl: mode === "custom" ? current.heroBannerCustomUrl : current.heroBannerCustomUrl
    }));
  }

  function uploadBanner(file: File | null) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setSettings((current) => ({
        ...current,
        heroBannerMode: "custom",
        heroBannerCustomUrl: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-4">
      <Card className="max-w-3xl border-gold/20 bg-black/35">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="Website Name">
            <Input
              className="brand-field-text"
              value={settings.websiteName}
              onChange={(event) => setSettings((current) => ({ ...current, websiteName: event.target.value }))}
            />
          </Field>
          <Field label="Theme">
            <select
              className="h-10 rounded-md border bg-black/30 px-3 text-sm text-white"
              value={settings.theme}
              onChange={(event) => updateTheme(normalizeTheme(event.target.value))}
            >
              {themeOptions.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-3 md:grid-cols-2">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateTheme(theme.id)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  settings.theme === theme.id
                    ? "border-gold/50 bg-gold/10"
                    : "border-white/10 bg-white/[0.03] hover:border-gold/30"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">{theme.name}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{theme.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {theme.swatches.map((swatch) => (
                      <span
                        key={swatch}
                        className="size-5 rounded-full border border-white/20"
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberField
              label="Scanner Settings"
              value={settings.scannerRefreshSeconds}
              onChange={(value) => setSettings((current) => ({ ...current, scannerRefreshSeconds: value }))}
            />
            <NumberField
              label="RSI Settings"
              value={settings.rsiPeriod}
              onChange={(value) => setSettings((current) => ({ ...current, rsiPeriod: value }))}
            />
            <NumberField
              label="RSI Oversold"
              value={settings.rsiOversold}
              onChange={(value) => setSettings((current) => ({ ...current, rsiOversold: value }))}
            />
            <NumberField
              label="RSI Overbought"
              value={settings.rsiOverbought}
              onChange={(value) => setSettings((current) => ({ ...current, rsiOverbought: value }))}
            />
          </div>
          <Field label="YouTube Link">
            <Input
              value={settings.youtubeLink}
              onChange={(event) => setSettings((current) => ({ ...current, youtubeLink: event.target.value }))}
            />
          </Field>
          <div className="grid gap-3">
            <div>
              <Label>Front Page Banner</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Current banner safe rahega, aur aap yahin se YouTube-style banner kabhi bhi change kar sakte ho.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {heroBannerOptions.map((banner) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setBannerMode(banner.id)}
                  className={`overflow-hidden rounded-lg border text-left transition-colors ${
                    settings.heroBannerMode === banner.id
                      ? "border-gold/50 bg-gold/10"
                      : "border-white/10 bg-white/[0.03] hover:border-gold/30"
                  }`}
                >
                  <img src={banner.src} alt={banner.label} className="aspect-[16/4] w-full object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-bold text-white">{banner.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{banner.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">Custom Banner Upload</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Apna image upload karo aur front page par direct use karo.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => setSettings((current) => ({ ...current, heroBannerMode: "green", heroBannerCustomUrl: "" }))}>
                  <RotateCcw />
                  Use Default
                </Button>
              </div>
              <Field label="Upload Image">
                <Input type="file" accept="image/*" onChange={(event) => uploadBanner(event.target.files?.[0] ?? null)} />
              </Field>
              <Field label="Custom Banner URL">
                <Input
                  placeholder="https://... or keep uploaded image"
                  value={settings.heroBannerCustomUrl}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      heroBannerMode: event.target.value ? "custom" : current.heroBannerMode,
                      heroBannerCustomUrl: event.target.value
                    }))
                  }
                />
              </Field>
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
                <img
                  src={getHeroBannerSource(settings)}
                  alt="Front page banner preview"
                  className="aspect-[16/4] w-full object-cover"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Best result ke liye wide banner image use karo, YouTube banner style me.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="w-full md:w-fit" onClick={saveSettings}>
              <Save />
              Save Settings
            </Button>
            {savedAt && (
              <p className="text-xs text-muted-foreground">
                Saved <ClientTime value={savedAt} format="time" />
              </p>
            )}
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <ImagePlus className="size-4" />
              Banner changes front page par save hone ke baad dikhengi.
            </div>
          </div>
        </CardContent>
      </Card>

      <DataSafetyPanel />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <Input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </Field>
  );
}
