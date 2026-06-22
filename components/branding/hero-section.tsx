"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CandlestickChart, Play, Radar, ShieldCheck, TrendingUp } from "lucide-react";
import {
  platformSettingsChangedEvent,
  platformSettingsKey
} from "@/components/providers/theme-hydrator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/constants";
import { defaultPlatformSettings, getHeroBannerSource, normalizePlatformSettings } from "@/lib/platform-settings";

export function HeroSection() {
  const [bannerSrc, setBannerSrc] = useState(getHeroBannerSource(defaultPlatformSettings));
  const tape = [
    { symbol: "BTCUSDT", price: "64,631", change: "+0.28%" },
    { symbol: "NIFTY", price: "23,485", change: "+0.42%" },
    { symbol: "ETHUSDT", price: "1,754", change: "+0.31%" }
  ];

  useEffect(() => {
    function syncBanner() {
      try {
        const raw = localStorage.getItem(platformSettingsKey);
        const nextSettings = normalizePlatformSettings(raw ? JSON.parse(raw) : undefined);
        setBannerSrc(getHeroBannerSource(nextSettings));
      } catch {
        setBannerSrc(getHeroBannerSource(defaultPlatformSettings));
      }
    }

    syncBanner();
    window.addEventListener(platformSettingsChangedEvent, syncBanner);
    window.addEventListener("storage", syncBanner);

    return () => {
      window.removeEventListener(platformSettingsChangedEvent, syncBanner);
      window.removeEventListener("storage", syncBanner);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#080a0d] p-5 shadow-glow md:p-7">
      <div className="absolute inset-0 market-grid bg-market-grid opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="relative grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-lg border border-gold/25 bg-[#073f38] xl:col-span-2">
          <img src={bannerSrc} alt="HEIST STOKER YouTube channel banner" className="block h-auto w-full" />
        </div>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Paper Trading Lab</Badge>
            <Badge variant="outline">Live/Delayed Market Feed</Badge>
            <Badge variant="bullish">Student Ready</Badge>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-gold">{brand.tagline}</p>
          <h1 className="mt-3 text-balance text-4xl font-black tracking-normal md:text-6xl">
            <span className="brand-word-primary">HEIST</span>{" "}
            <span className="brand-word-accent">STOKER</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/78 md:text-lg">
            A professional trading classroom for scanner practice, demo trades, risk planning,
            watchlists, and daily trade journaling.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {brand.pillars.map((pillar) => (
              <span
                key={pillar}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/76"
              >
                {pillar}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/scanner">
                <Radar />
                Open Scanner
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/demo-trading">
                <CandlestickChart />
                Demo Trade
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/youtube">
                <Play />
                YouTube Lessons
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Market Pulse</p>
              <h2 className="mt-1 text-xl font-bold tracking-normal text-white">Active Watch</h2>
            </div>
            <div className="grid size-10 place-items-center rounded-md border border-bullish/30 bg-bullish/10 text-bullish">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {tape.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between gap-3 rounded-md border border-white/8 bg-white/[0.03] p-3"
              >
                <div>
                  <p className="text-sm font-bold text-white">{item.symbol}</p>
                  <p className="text-xs text-muted-foreground">5m feed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{item.price}</p>
                  <p className="text-xs font-semibold text-bullish">{item.change}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border border-gold/25 bg-gold/10 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gold">
              <ShieldCheck className="size-4" />
              Education mode enabled
            </div>
            <p className="mt-2 text-xs leading-5 text-white/65">
              No real-money order placement. Use this platform for practice, review, and student learning.
            </p>
          </div>
          <Button asChild className="mt-4 w-full" variant="bullish">
            <Link href="/trading-journal">
              <ArrowRight />
              Review Journal
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
