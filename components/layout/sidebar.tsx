"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube } from "lucide-react";
import { BrandMark } from "@/components/branding/brand-mark";
import { Badge } from "@/components/ui/badge";
import { navigationItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[286px] shrink-0 border-r border-[#334155] bg-[#0b1220]/95 p-4 backdrop-blur-xl lg:block">
      <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1 scrollbar-thin">
        <BrandMark />
        <nav className="mt-6 grid gap-1.5">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-11 items-center gap-3 rounded-xl border border-transparent px-3.5 text-sm font-semibold text-slate-400 transition-all duration-200 hover:border-[#334155] hover:bg-[#111827] hover:text-slate-50",
                  active && "border-[#3B82F6]/35 bg-[#172554] text-slate-50 shadow-[0_14px_30px_rgba(37,99,235,0.16)]"
                )}
              >
                <div
                  className={cn(
                    "grid size-8 place-items-center rounded-lg border border-[#334155]/60 bg-[#111827] transition-colors group-hover:border-[#3B82F6]/35 group-hover:bg-[#172554]",
                    active && "border-[#3B82F6]/45 bg-[#1d4ed8]/15 text-[#60a5fa]"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="text-[10px] text-slate-500">{index + 1}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-2xl border border-[#334155] bg-[#111827] p-5">
          <Badge variant="outline">Paper Mode</Badge>
          <p className="mt-3 text-sm font-semibold text-slate-50">No real money trading</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Broker adapters are isolated for future Zerodha, Upstox, Angel One, Binance, TradingView,
            and MT5 connectivity.
          </p>
        </div>
        <Link
          href="/youtube"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-[#334155] bg-[#111827] p-4 text-sm font-semibold text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/35 hover:bg-[#18111a]"
        >
          <div className="grid size-9 place-items-center rounded-md bg-red-500 text-white">
            <Youtube className="size-4" />
          </div>
          <span className="min-w-0 flex-1">YouTube Academy</span>
        </Link>
      </div>
    </aside>
  );
}
