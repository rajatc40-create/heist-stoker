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
    <aside className="hidden h-screen w-[292px] shrink-0 border-r border-white/10 bg-[#0d1310]/90 p-4 backdrop-blur-xl lg:block">
      <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1 scrollbar-thin">
        <BrandMark />
        <nav className="mt-6 grid gap-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1F5E44]/22 hover:text-white",
                  active && "border border-gold/35 bg-gold/10 text-gold shadow-[0_12px_30px_rgba(212,175,55,0.08)]"
                )}
              >
                <div className={cn("grid size-8 place-items-center rounded-xl border border-transparent bg-white/[0.03] transition-colors group-hover:border-[#1F5E44]/30 group-hover:bg-[#1F5E44]/20", active && "border-gold/25 bg-gold/10")}>
                  <Icon className="size-4" />
                </div>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="text-[10px] text-muted-foreground">{index + 1}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <Badge>Paper Mode</Badge>
          <p className="mt-3 text-sm font-semibold text-white">No real money trading</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Broker adapters are isolated for future Zerodha, Upstox, Angel One, Binance, TradingView,
            and MT5 connectivity.
          </p>
        </div>
        <Link
          href="/youtube"
          className="mt-4 flex items-center gap-3 rounded-[24px] border border-red-500/25 bg-red-500/10 p-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/15"
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
