import { mockMarketData } from "@/lib/mock-market-data";
import type { BrokerAdapter } from "@/server/brokers/types";

export const mt5Adapter: BrokerAdapter = {
  id: "mt5",
  name: "MetaTrader 5",
  async connect() {
    return { connected: false, message: "MT5 bridge URL is not configured yet." };
  },
  async getQuotes(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
