"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CandlestickChart, Play, Radar, ShieldCheck, TrendingUp } from "lucide-react";
import { platformSettingsChangedEvent, platformSettingsKey } from "@/components/providers/theme-hydrator";
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
    <section className="premium-panel premium-shadow relative overflow-hidden rounded-[28px] border border-white/10 p-6 md:p-8">
      <div className="premium-grid absolute inset-0 opacity-30" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="absolute -left-10 top-0 h-56 w-56 rounded-full bg-[#1F5E44]/20 blur-3xl" />
      <div className="absolute right-0 top-12 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative grid gap-8 2xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="grid gap-7">
          <div className="overflow-hidden rounded-[24px] border border-gold/20 bg-[#0d1512]">
            <img src={bannerSrc} alt="HEIST STOKER premium market banner" className="block h-auto w-full" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Premium Dashboard</Badge>
                <Badge variant="outline">TradingView Inspired</Badge>
                <Badge variant="bullish">Paper Mode Ready</Badge>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-gold">{brand.tagline}</p>
              <h1 className="mt-4 text-balance text-4xl font-black tracking-normal text-white md:text-6xl xl:text-7xl">
                <span className="brand-word-primary">HEIST</span>{" "}
                <span className="brand-word-accent">STOKER</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                Premium command center for scanner practice, paper trades, market routines, and student learning with a
                cleaner institutional-style desk.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {brand.pillars.map((pillar) => (
                  <span
                    key={pillar}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/76"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/scanner">
                    <Radar />
                    Open Scanner
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/demo-trading">
                    <CandlestickChart />
                    Paper Trading Lab
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

            <div className="rounded-[24px] border border-white/10 bg-black/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Market Pulse</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-normal text-white">Active Watch</h2>
                </div>
                <div className="grid size-11 place-items-center rounded-2xl border border-bullish/30 bg-bullish/10 text-bullish">
                  <TrendingUp className="size-5" />
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {tape.map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{item.symbol}</p>
                      <p className="mt-1 text-xs text-muted-foreground">5m feed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{item.price}</p>
                      <p className="mt-1 text-xs font-semibold text-bullish">{item.change}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gold">
                  <ShieldCheck className="size-4" />
                  Education mode enabled
                </div>
                <p className="mt-2 text-xs leading-6 text-white/65">
                  No real-money order placement. Use this platform for practice, review, and student learning.
                </p>
              </div>
              <Button asChild className="mt-5 w-full" variant="bullish">
                <Link href="/trading-journal">
                  <ArrowRight />
                  Review Journal
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Premium Session Tape</p>
          <div className="mt-4 grid gap-3">
            {[
              "Morning Breakfast shortlist ready for review",
              "NIFTY and BANKNIFTY bias desk connected",
              "Paper trading and journal workflow active"
            ].map((line) => (
              <div key={line} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
