import type { MarketAsset, Trade } from "@/types/platform";

export interface BrokerAdapter {
  id: string;
  name: string;
  connect: () => Promise<{ connected: boolean; message: string }>;
  getQuotes: (symbols: string[]) => Promise<MarketAsset[]>;
  placePaperTrade?: (trade: Trade) => Promise<{ accepted: boolean; brokerOrderId?: string }>;
}

export interface MarketDataProvider {
  id: string;
  name: string;
  fetchMarketSnapshot: (symbols: string[]) => Promise<MarketAsset[]>;
}
