"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CandlestickChart, Play, Radar, ShieldCheck, TrendingUp } from "lucide-react";
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
    <section className="premium-panel premium-shadow relative overflow-hidden rounded-2xl border border-[#334155] p-5 md:p-6">
      <div className="premium-grid absolute inset-0 opacity-20" />
      <div className="relative grid gap-5">
        <div className="overflow-hidden rounded-2xl border border-[#334155] bg-[#0b1220]">
          <img src={bannerSrc} alt="HEIST STOKER premium market banner" className="block h-auto w-full" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Trading Terminal</Badge>
              <Badge variant="outline">Webull Style</Badge>
              <Badge variant="bullish">Paper Mode</Badge>
            </div>
            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F59E0B]">{brand.tagline}</p>
              <p className="max-w-3xl text-base leading-7 text-slate-300">
                Scanner practice, paper trading, option review, and student learning in one cleaner terminal-style desk.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {brand.pillars.map((pillar) => (
                <span
                  key={pillar}
                  className="rounded-lg border border-[#334155] bg-[#111827] px-3.5 py-2 text-xs font-semibold text-slate-300"
                >
                  {pillar}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/scanner">
                  <Radar />
                  Open Scanner
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/demo-trading">
                  <CandlestickChart />
                  Paper Trading Lab
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/youtube">
                  <Play />
                  YouTube Lessons
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#334155] bg-[#111827] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Market Pulse</p>
                <h2 className="mt-2 text-xl font-bold tracking-normal text-slate-50">Active Watch</h2>
              </div>
              <div className="grid size-10 place-items-center rounded-xl border border-bullish/30 bg-bullish/10 text-bullish">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {tape.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#334155] bg-[#0f172a] p-4"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-50">{item.symbol}</p>
                    <p className="mt-1 text-xs text-slate-400">5m feed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-50">{item.price}</p>
                    <p className="mt-1 text-xs font-semibold text-bullish">{item.change}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-[#334155] bg-[#0f172a] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F59E0B]">
                <ShieldCheck className="size-4" />
                Education mode enabled
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                No real-money order placement. Use this platform for practice, review, and student learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
