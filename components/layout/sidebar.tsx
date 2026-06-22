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
    <aside className="hidden h-screen w-[286px] shrink-0 border-r border-[#DDD5C6] bg-[#ECE5D9] p-4 lg:block">
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
                  "group flex h-11 items-center gap-3 rounded-xl border border-transparent px-3.5 text-sm font-semibold text-[#4B5563] transition-all duration-200 hover:border-[#D8CFBF] hover:bg-white hover:text-[#1F2937]",
                  active && "border-[#D8CFBF] bg-white text-[#315ECA] shadow-sm"
                )}
              >
                <div
                  className={cn(
                    "grid size-8 place-items-center rounded-lg border border-[#DDD5C6] bg-[#F7F3EA] transition-colors",
                    active && "border-[#C7D5F9] bg-[#EEF3FF] text-[#315ECA]"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="text-[10px] text-[#9A9486]">{index + 1}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 rounded-2xl border border-[#DDD5C6] bg-[#F7F3EA] p-5">
          <Badge variant="outline">Paper Mode</Badge>
          <p className="mt-3 text-sm font-semibold text-[#1F2937]">No real money trading</p>
          <p className="mt-1 text-xs leading-5 text-[#6B7280]">
            Broker adapters are isolated for future Zerodha, Upstox, Angel One, Binance, TradingView,
            and MT5 connectivity.
          </p>
        </div>
        <Link
          href="/youtube"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E6D7D7] bg-[#FFF6F6] p-4 text-sm font-semibold text-[#1F2937] transition-all duration-200 hover:bg-white"
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
