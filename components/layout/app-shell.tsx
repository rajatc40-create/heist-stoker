import type { ReactNode } from "react";
import { Bell, Radio, Search } from "lucide-react";
import { BrandMark } from "@/components/branding/brand-mark";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <MobileNav />
        <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-[#334155] bg-[#0f172a]/92 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
          <div className="flex items-center gap-4">
            <BrandMark compact className="lg:hidden" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-normal text-slate-50 md:text-[28px]">{title}</h2>
                <Badge variant="bullish">
                  <Radio className="mr-1 size-3" />
                  Live Feed
                </Badge>
                <Badge variant="outline">Paper Mode</Badge>
              </div>
              {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 md:w-auto">
            <div className="relative min-w-0 flex-1 md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-11 rounded-xl border-[#334155] bg-[#111827] pl-9 text-slate-50 placeholder:text-slate-400"
                placeholder="Search symbol, setup, scanner"
              />
            </div>
            <Button size="icon" variant="outline" aria-label="Notifications" className="rounded-xl">
              <Bell />
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-6 lg:p-7">
          {children}
          <div className="mt-8 rounded-2xl border border-[#334155] bg-[#111827] px-5 py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-50">HEIST STOKER</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#F59E0B]">Decode Smart Money</p>
              </div>
              <p className="max-w-3xl text-sm text-slate-400">
                HEIST STOKER is for education, scanner practice and paper trading. This is not investment advice. Confirm with your own analysis before trading.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
