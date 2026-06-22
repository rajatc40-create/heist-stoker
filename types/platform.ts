import type { PlatformTheme } from "@/lib/theme-options";

export type AssetClass = "Stocks" | "Indices" | "Forex" | "Crypto";
export type TradeInstrument = "FUTURES" | "OPTION";
export type OptionType = "CE" | "PE";
export type TradeSide = "BUY" | "SELL";
export type TradeStatus = "OPEN" | "CLOSED";
export type Timeframe = "1m" | "5m" | "15m" | "1H" | "4H" | "1D";

export interface MarketAsset {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  previousHigh: number;
  rsi: number;
  volume: number;
  averageVolume: number;
  changePercent: number;
  timeframe: Timeframe;
  providerSymbol?: string;
  dataSource?: "live" | "mock";
  asOf?: string;
}

export interface ScannerResult {
  id: string;
  scanner: string;
  symbol: string;
  price: number;
  rsi?: number;
  volume: number;
  changePercent: number;
  timeframe: Timeframe;
  reason: string;
  assetClass: AssetClass;
}

export interface ScannerDefinition {
  id: string;
  name: string;
  category: "Momentum" | "Liquidity" | "Breakout" | "Psychology" | "Wave Theory" | "Options";
  enabled: boolean;
  description: string;
}

export interface MorningBreakfastItem {
  rank: number;
  symbol: string;
  prevClose: number;
  iep: number;
  change: number;
  percentChange: number;
  valueLakhs: number;
  finalQuantity: number;
  morningScore: number;
  reason: string;
  highlighted?: boolean;
}

export interface HighMoneyFlowItem {
  rank: number;
  symbol: string;
  percentChange: number;
  valueLakhs: number;
  finalQuantity: number;
  iep: number;
  reason: string;
  highlighted?: boolean;
}

export interface ChartinkAlert {
  id: string;
  stock: string;
  triggerPrice: number | null;
  scanName: string;
  scanUrl: string | null;
  alertName: string | null;
  triggeredAt: string;
  receivedAt: string;
}

export interface Trade {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  instrument: TradeInstrument;
  lotSize?: number;
  optionType?: OptionType;
  strikePrice?: number;
  expiryDate?: string;
  side: TradeSide;
  entryPrice: number;
  quantity: number;
  stopLoss: number;
  target1: number;
  target2: number;
  target3: number;
  exitPrice?: number;
  status: TradeStatus;
  openedAt: string;
  closedAt?: string;
  notes?: string;
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  tradeId?: string;
  symbol: string;
  tradeNotes: string;
  mistake: string;
  lessonLearned: string;
  psychologyNotes: string;
  screenshotName?: string;
  createdAt: string;
}

export interface UserSettings {
  websiteName: string;
  theme: PlatformTheme;
  scannerRefreshSeconds: number;
  rsiPeriod: number;
  rsiOversold: number;
  rsiOverbought: number;
  youtubeLink: string;
  heroBannerMode: "green" | "dark" | "approved" | "custom";
  heroBannerCustomUrl: string;
}
