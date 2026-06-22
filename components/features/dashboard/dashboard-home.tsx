import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Brain,
  CalendarDays,
  CandlestickChart,
  CircleDollarSign,
  Coffee,
  Crown,
  Gauge,
  ListChecks,
  MessagesSquare,
  Newspaper,
  Radar,
  Target,
  TrendingUp,
  Youtube
} from "lucide-react";
import { AuthPanel } from "@/components/branding/auth-panel";
import { HeroSection } from "@/components/branding/hero-section";
import { AutosaveStatus } from "@/components/features/dashboard/autosave-status";
import { MarketWidgets } from "@/components/features/market/market-widgets";
import { MetricCard } from "@/components/features/market/metric-card";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";
import { brand, dashboardStats } from "@/lib/constants";

const actionCards = [
  {
    title: "Morning Breakfast",
    description: "Top 4 NSE pre-open money flow stocks with weighted Morning Score and reasons.",
    badge: "NSE Official" as const,
    cta: "Open Scanner",
    href: "/scanner",
    icon: Coffee
  },
  {
    title: "Live Market Watch",
    description: "Track NIFTY, BANKNIFTY, VIX, GIFTY direction and top gainers before your setup.",
    badge: "Yahoo Delayed" as const,
    cta: "Open Watch",
    href: "/market-watch",
    icon: Gauge
  },
  {
    title: "Paper Trading Lab",
    description: "Practice entries with stop loss, targets, lot size planning, and journal discipline.",
    badge: "Paper Mode" as const,
    cta: "Start Practice",
    href: "/demo-trading",
    icon: CandlestickChart
  },
  {
    title: "Option Strategy Tools",
    description: "Use Iron Condor, Iron Fly, and Bull Put Spread structures in education mode.",
    badge: "Manual Demo Data" as const,
    cta: "Open Tools",
    href: "/option-strategy-tools",
    icon: Target
  }
];

const workflowItems = [
  {
    title: "Scan Setups",
    description: "Find RSI, breakout, volume, and top mover setups.",
    href: "/scanner",
    icon: Radar
  },
  {
    title: "Paper Trade",
    description: "Plan entry, stop loss, targets, and open P&L.",
    href: "/demo-trading",
    icon: CandlestickChart
  },
  {
    title: "Review Journal",
    description: "Track mistakes, psychology, lessons, and execution.",
    href: "/trading-journal",
    icon: ListChecks
  }
];

const platformModules = [
  { title: "Nifty Analysis", href: "/nifty-analysis", icon: TrendingUp, detail: "NIFTY and BANKNIFTY bias" },
  { title: "Option Chain", href: "/option-chain", icon: CandlestickChart, detail: "CE and PE premium view" },
  { title: "Breakouts", href: "/breakout-stocks", icon: Target, detail: "Momentum shortlist" },
  { title: "Weekly Outlook", href: "/weekly-outlook", icon: CalendarDays, detail: "Weekly trading plan" },
  { title: "Psychology", href: "/psychology", icon: Brain, detail: "Discipline quotes" },
  { title: "Blog", href: "/blog", icon: Newspaper, detail: "Learning notes" },
  { title: "Premium", href: "/premium", icon: Crown, detail: "Student access area" },
  { title: "Community", href: "/community", icon: MessagesSquare, detail: "Telegram and WhatsApp" },
  { title: "AI Assistant", href: "/ai-assistant", icon: Bot, detail: "Planning help" }
];

export function DashboardHome() {
  return (
    <AppShell title="Command Center" subtitle="Scanner, paper trading, market watch, and student learning hub.">
      <div className="grid gap-6">
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <HeroSection />
          <AuthPanel />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {actionCards.map((card) => {
            const Icon = card.icon;

            return (
              <Card key={card.title} className="h-full border-[#334155] bg-[#111827]">
                <CardContent className="flex h-full min-h-[210px] flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid size-11 place-items-center rounded-xl border border-[#334155] bg-[#0f172a] text-[#60a5fa]">
                      <Icon className="size-5" />
                    </div>
                    <SourceBadge source={card.badge} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-50">{card.title}</p>
                    <p className="text-sm leading-6 text-slate-400">{card.description}</p>
                  </div>
                  <Button asChild className="mt-auto w-full justify-between">
                    <Link href={card.href}>
                      {card.cta}
                      <ArrowUpRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
          {dashboardStats.map((stat, index) => (
            <MetricCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              tone={index === 2 || index === 3 ? "green" : "gold"}
            />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <Card className="border-[#334155] bg-[#111827]">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Trading Desk</CardTitle>
                <p className="mt-1 text-sm text-slate-400">
                  Quick access to your daily workflow across scanners, paper trades, and option review.
                </p>
              </div>
              <Badge variant="outline">Responsive</Badge>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {workflowItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-xl border border-[#334155] bg-[#0f172a] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#3B82F6]/35 hover:bg-[#162033]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="grid size-11 place-items-center rounded-xl border border-[#334155] bg-[#111827] text-[#F59E0B]">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-50">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-[#334155] bg-[#111827]">
            <CardHeader>
              <CardTitle>HEIST STOKER Academy</CardTitle>
              <p className="mt-1 text-sm text-slate-400">Learning, video practice, and student desk routing.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href={brand.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-[#334155] bg-[#0f172a] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-red-500/35 hover:bg-[#18111a]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-xl bg-red-500 text-white">
                    <Youtube className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-50">{brand.name} YouTube</p>
                    <p className="text-xs leading-6 text-slate-400">
                      {brand.youtubeHandle} - smart money lessons and market breakdowns.
                    </p>
                  </div>
                </div>
                <div className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1E293B] px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-[#263449]">
                  <ArrowUpRight />
                  Open Channel
                </div>
              </a>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#334155] bg-[#0f172a] p-4">
                  <p className="text-xs text-slate-400">Mode</p>
                  <p className="mt-1 text-sm font-bold text-slate-50">Education</p>
                </div>
                <div className="rounded-xl border border-[#334155] bg-[#0f172a] p-4">
                  <p className="text-xs text-slate-400">Risk</p>
                  <p className="mt-1 text-sm font-bold text-slate-50">Paper Only</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {platformModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.href}
                href={module.href}
                className="premium-shadow group rounded-2xl border border-[#334155] bg-[#111827] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#3B82F6]/35 hover:bg-[#162033]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="grid size-11 place-items-center rounded-xl border border-[#334155] bg-[#0f172a] text-[#F59E0B]">
                    <Icon className="size-5" />
                  </div>
                  <ArrowUpRight className="size-4 text-slate-500 transition-colors group-hover:text-[#60a5fa]" />
                </div>
                <p className="mt-5 text-lg font-bold text-slate-50">{module.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{module.detail}</p>
              </Link>
            );
          })}
        </div>

        <MarketWidgets />

        <div className="grid gap-5 xl:grid-cols-2">
          <AutosaveStatus />
          <Card className="border-[#334155] bg-[#111827]">
            <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#334155] bg-[#0f172a] text-[#F59E0B]">
                  <CircleDollarSign className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-50">Educational trading platform</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Built for practice, teaching, journaling, and discipline. It does not place real broker orders.
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/settings">Customize Platform</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
