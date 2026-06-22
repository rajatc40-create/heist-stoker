import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  CalendarDays,
  CandlestickChart,
  Crown,
  Gauge,
  Home,
  LineChart,
  ListChecks,
  MessagesSquare,
  MonitorCog,
  Newspaper,
  PlaySquare,
  Settings,
  ShieldCheck,
  Star,
  Table2,
  Target,
  TrendingUp
} from "lucide-react";
import type { ScannerDefinition } from "@/types/platform";

export const brand = {
  name: "HEIST STOKER",
  tagline: "DECODE SMART MONEY",
  pillars: ["Liquidity", "Psychology", "Wave Theory"],
  youtubeHandle: "@HEISTSTOKER",
  youtubeUrl: "https://www.youtube.com/@HEISTSTOKER",
  youtubeVideosUrl: "https://www.youtube.com/@HEISTSTOKER/videos"
};

export const navigationItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/nifty-analysis", label: "Nifty Analysis", icon: TrendingUp },
  { href: "/option-chain", label: "Option Chain", icon: Table2 },
  { href: "/option-strategy-tools", label: "Strategy Tools", icon: Target },
  { href: "/scanner", label: "Scanner", icon: Gauge },
  { href: "/breakout-stocks", label: "Breakouts", icon: Target },
  { href: "/demo-trading", label: "Demo Trading", icon: CandlestickChart },
  { href: "/market-watch", label: "Market Watch", icon: Activity },
  { href: "/weekly-outlook", label: "Weekly Outlook", icon: CalendarDays },
  { href: "/psychology", label: "Psychology", icon: Brain },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/youtube", label: "YouTube", icon: PlaySquare },
  { href: "/premium", label: "Premium", icon: Crown },
  { href: "/community", label: "Community", icon: MessagesSquare },
  { href: "/economic-calendar", label: "Calendar", icon: CalendarDays },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/trading-journal", label: "Trading Journal", icon: ListChecks },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: MonitorCog }
];

export const availableScanners: ScannerDefinition[] = [
  {
    id: "rsi-oversold",
    name: "RSI Oversold",
    category: "Momentum",
    enabled: true,
    description: "RSI period 14 with RSI below 30."
  },
  {
    id: "rsi-overbought",
    name: "RSI Overbought",
    category: "Momentum",
    enabled: true,
    description: "RSI period 14 with RSI above 70."
  },
  {
    id: "top-gainers",
    name: "Top Gainers",
    category: "Momentum",
    enabled: true,
    description: "Assets ranked by strongest positive percentage move."
  },
  {
    id: "top-losers",
    name: "Top Losers",
    category: "Momentum",
    enabled: true,
    description: "Assets ranked by strongest negative percentage move."
  },
  {
    id: "volume-spike",
    name: "Volume Spike",
    category: "Liquidity",
    enabled: true,
    description: "Current volume greater than 2x average volume."
  },
  {
    id: "breakout",
    name: "Breakout Scanner",
    category: "Breakout",
    enabled: true,
    description: "Current price above previous high."
  },
  {
    id: "rsi-4",
    name: "RSI 4 Scanner",
    category: "Momentum",
    enabled: false,
    description: "Future ultra-short RSI model placeholder."
  },
  {
    id: "ema-34",
    name: "EMA 34 Scanner",
    category: "Momentum",
    enabled: false,
    description: "Future EMA 34 trend model placeholder."
  },
  {
    id: "pdh",
    name: "PDH Scanner",
    category: "Liquidity",
    enabled: false,
    description: "Previous day high interaction placeholder."
  },
  {
    id: "pdl",
    name: "PDL Scanner",
    category: "Liquidity",
    enabled: false,
    description: "Previous day low interaction placeholder."
  },
  {
    id: "liquidity-sweep",
    name: "Liquidity Sweep Scanner",
    category: "Liquidity",
    enabled: false,
    description: "Future stop-run and sweep model placeholder."
  },
  {
    id: "hh-ll",
    name: "HH LL Scanner",
    category: "Wave Theory",
    enabled: false,
    description: "Higher-high and lower-low structure placeholder."
  },
  {
    id: "smart-money",
    name: "Smart Money Scanner",
    category: "Psychology",
    enabled: false,
    description: "Future institutional behavior model placeholder."
  },
  {
    id: "wave-theory",
    name: "Wave Theory Scanner",
    category: "Wave Theory",
    enabled: false,
    description: "Impulse and correction sequence placeholder."
  },
  {
    id: "option-selling",
    name: "Option Selling Scanner",
    category: "Options",
    enabled: true,
    description: "Education mode scanner for option selling structures, premium decay, and risk-defined ideas."
  },
  {
    id: "morning-breakfast",
    name: "Morning Breakfast",
    category: "Momentum",
    enabled: true,
    description: "Official NSE pre-open NIFTY 50 top 4 positive movers ranked after settlement."
  }
];

export const integrationTargets = [
  "Yahoo Finance",
  "Alpha Vantage",
  "Twelve Data",
  "TradingView",
  "Zerodha",
  "Upstox",
  "Angel One",
  "Binance",
  "MT5"
];

export const dashboardStats = [
  { label: "Total Trades", value: "148", icon: BarChart3 },
  { label: "Win Rate", value: "62.8%", icon: ShieldCheck },
  { label: "Profit/Loss", value: "+Rs 84,250", icon: LineChart },
  { label: "Today's P&L", value: "+Rs 7,850", icon: Activity },
  { label: "Open Trades", value: "6", icon: CandlestickChart },
  { label: "Closed Trades", value: "142", icon: ListChecks }
];
