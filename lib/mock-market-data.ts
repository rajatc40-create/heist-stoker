import type { JournalEntry, MarketAsset, Trade, Watchlist } from "@/types/platform";

const mockDates = {
  openTrade: "2026-06-18T00:10:00.000Z",
  closedTradeOpened: "2026-06-17T19:40:00.000Z",
  closedTradeClosed: "2026-06-17T23:25:00.000Z",
  coreWatchlist: "2026-06-10T09:30:00.000Z",
  cryptoWatchlist: "2026-06-14T09:30:00.000Z",
  journalEntry: "2026-06-17T19:30:00.000Z"
};

export const mockMarketData: MarketAsset[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    assetClass: "Stocks",
    price: 2934.5,
    previousHigh: 2910.2,
    rsi: 72.4,
    volume: 11250000,
    averageVolume: 5420000,
    changePercent: 3.82,
    timeframe: "15m"
  },
  {
    symbol: "NIFTY",
    name: "Nifty 50",
    assetClass: "Indices",
    price: 24582.35,
    previousHigh: 24610.5,
    rsi: 54.2,
    volume: 824000,
    averageVolume: 762000,
    changePercent: 0.42,
    timeframe: "1H"
  },
  {
    symbol: "BANKNIFTY",
    name: "Bank Nifty",
    assetClass: "Indices",
    price: 52684.1,
    previousHigh: 52340.8,
    rsi: 76.1,
    volume: 952000,
    averageVolume: 440000,
    changePercent: 1.9,
    timeframe: "15m"
  },
  {
    symbol: "INFY",
    name: "Infosys",
    assetClass: "Stocks",
    price: 1428.2,
    previousHigh: 1478.6,
    rsi: 28.8,
    volume: 6420000,
    averageVolume: 4120000,
    changePercent: -2.4,
    timeframe: "1H"
  },
  {
    symbol: "TATASTEEL",
    name: "Tata Steel",
    assetClass: "Stocks",
    price: 164.45,
    previousHigh: 171.2,
    rsi: 24.6,
    volume: 18200000,
    averageVolume: 8150000,
    changePercent: -4.72,
    timeframe: "15m"
  },
  {
    symbol: "BTCUSDT",
    name: "Bitcoin",
    assetClass: "Crypto",
    price: 67250.4,
    previousHigh: 66880.1,
    rsi: 69.2,
    volume: 28400,
    averageVolume: 12800,
    changePercent: 2.84,
    timeframe: "4H"
  },
  {
    symbol: "ETHUSDT",
    name: "Ethereum",
    assetClass: "Crypto",
    price: 3564.8,
    previousHigh: 3610.25,
    rsi: 47.6,
    volume: 218000,
    averageVolume: 198000,
    changePercent: -0.62,
    timeframe: "1H"
  },
  {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    assetClass: "Forex",
    price: 1.0842,
    previousHigh: 1.0818,
    rsi: 71.2,
    volume: 384000,
    averageVolume: 175000,
    changePercent: 0.38,
    timeframe: "1H"
  },
  {
    symbol: "GBPUSD",
    name: "British Pound / US Dollar",
    assetClass: "Forex",
    price: 1.2631,
    previousHigh: 1.2687,
    rsi: 35.4,
    volume: 241000,
    averageVolume: 222000,
    changePercent: -0.18,
    timeframe: "1H"
  },
  {
    symbol: "USDJPY",
    name: "US Dollar / Japanese Yen",
    assetClass: "Forex",
    price: 156.72,
    previousHigh: 156.21,
    rsi: 64.7,
    volume: 302000,
    averageVolume: 143000,
    changePercent: 0.31,
    timeframe: "4H"
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    assetClass: "Stocks",
    price: 1512.25,
    previousHigh: 1536.8,
    rsi: 31.4,
    volume: 7320000,
    averageVolume: 6920000,
    changePercent: -1.12,
    timeframe: "1D"
  },
  {
    symbol: "SOLUSDT",
    name: "Solana",
    assetClass: "Crypto",
    price: 148.82,
    previousHigh: 144.1,
    rsi: 73.5,
    volume: 842000,
    averageVolume: 332000,
    changePercent: 5.24,
    timeframe: "4H"
  }
];

export const mockTrades: Trade[] = [
  {
    id: "trd-001",
    symbol: "RELIANCE",
    assetClass: "Stocks",
    instrument: "FUTURES",
    lotSize: 250,
    side: "BUY",
    entryPrice: 2868,
    quantity: 1,
    stopLoss: 2838,
    target1: 2915,
    target2: 2960,
    target3: 3010,
    status: "OPEN",
    openedAt: mockDates.openTrade,
    notes: "Breakout over previous liquidity pool."
  },
  {
    id: "trd-002",
    symbol: "BANKNIFTY",
    assetClass: "Indices",
    instrument: "OPTION",
    lotSize: 30,
    optionType: "PE",
    strikePrice: 52800,
    expiryDate: "2026-06-25",
    side: "SELL",
    entryPrice: 310,
    quantity: 1,
    stopLoss: 390,
    target1: 240,
    target2: 190,
    target3: 140,
    exitPrice: 218,
    status: "CLOSED",
    openedAt: mockDates.closedTradeOpened,
    closedAt: mockDates.closedTradeClosed,
    notes: "Rejection at supply zone."
  }
];

export const mockWatchlists: Watchlist[] = [
  {
    id: "wl-core",
    name: "Smart Money Core",
    symbols: ["NIFTY", "BANKNIFTY", "RELIANCE", "HDFCBANK"],
    createdAt: mockDates.coreWatchlist
  },
  {
    id: "wl-crypto",
    name: "Crypto Momentum",
    symbols: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    createdAt: mockDates.cryptoWatchlist
  }
];

export const mockJournalEntries: JournalEntry[] = [
  {
    id: "jnl-001",
    tradeId: "trd-002",
    symbol: "BANKNIFTY",
    tradeNotes: "Waited for rejection wick and entered after lower high.",
    mistake: "Scaled too late on target 2.",
    lessonLearned: "Pre-place partial exits before volatility expansion.",
    psychologyNotes: "Stayed patient after first fake move.",
    screenshotName: "banknifty-rejection.png",
    createdAt: mockDates.journalEntry
  }
];

export const monthlyPerformance = [
  { month: "Jan", pnl: 12500, wins: 18, losses: 9 },
  { month: "Feb", pnl: 18400, wins: 21, losses: 11 },
  { month: "Mar", pnl: -5200, wins: 13, losses: 15 },
  { month: "Apr", pnl: 22650, wins: 26, losses: 12 },
  { month: "May", pnl: 31800, wins: 29, losses: 10 },
  { month: "Jun", pnl: 17850, wins: 17, losses: 7 }
];

export const equityCurve = [
  { day: "D1", equity: 100000 },
  { day: "D5", equity: 105200 },
  { day: "D10", equity: 101600 },
  { day: "D15", equity: 112400 },
  { day: "D20", equity: 124800 },
  { day: "D25", equity: 119900 },
  { day: "D30", equity: 134250 }
];

export const youtubeVideos = [
  {
    id: "yt-001",
    title: "Liquidity Sweep Entries",
    duration: "18:42",
    views: "24K",
    topic: "Liquidity"
  },
  {
    id: "yt-002",
    title: "Decode Fear and FOMO",
    duration: "22:09",
    views: "31K",
    topic: "Psychology"
  },
  {
    id: "yt-003",
    title: "Wave Theory for Intraday Bias",
    duration: "16:18",
    views: "19K",
    topic: "Wave Theory"
  }
];
