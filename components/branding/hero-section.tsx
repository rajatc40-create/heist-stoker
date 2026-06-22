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
    <section className="premium-panel premium-shadow relative overflow-hidden rounded-2xl border border-[#E7E1D6] p-5 md:p-6">
      <div className="premium-grid absolute inset-0 opacity-15" />
      <div className="relative grid gap-4">
        <div className="overflow-hidden rounded-xl border border-[#E7E1D6] bg-white">
          <img src={bannerSrc} alt="HEIST STOKER premium market banner" className="block h-auto w-full" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px] xl:items-start">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Trading Terminal</Badge>
              <Badge variant="outline">Premium Warm</Badge>
              <Badge variant="bullish">Paper Mode</Badge>
            </div>
            <div className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C98A1A]">{brand.tagline}</p>
              <p className="max-w-3xl text-sm leading-7 text-[#6B7280]">
                Scanner practice, paper trading, option review, and student learning in one cleaner premium finance desk.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {brand.pillars.map((pillar) => (
                <span key={pillar} className="rounded-lg border border-[#E7E1D6] bg-[#FBF8F2] px-3.5 py-2 text-xs font-semibold text-[#4B5563]">
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

          <div className="rounded-xl border border-[#E7E1D6] bg-[#FBF8F2] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A8475]">Market Pulse</p>
                <h2 className="mt-1 text-lg font-bold tracking-normal text-[#1F2937]">Active Watch</h2>
              </div>
              <div className="grid size-10 place-items-center rounded-xl border border-green-200 bg-green-50 text-green-600">
                <TrendingUp className="size-5" />
              </div>
            </div>
            <div className="mt-4 grid gap-2.5">
              {tape.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E1D6] bg-white p-3">
                  <div>
                    <p className="text-sm font-bold text-[#1F2937]">{item.symbol}</p>
                    <p className="mt-1 text-xs text-[#6B7280]">5m feed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#1F2937]">{item.price}</p>
                    <p className="mt-1 text-xs font-semibold text-green-600">{item.change}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#C98A1A]">
                <ShieldCheck className="size-4" />
                Education mode enabled
              </div>
              <p className="mt-2 text-xs leading-6 text-[#6B7280]">
                No real-money order placement. Use this platform for practice, review, and student learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
