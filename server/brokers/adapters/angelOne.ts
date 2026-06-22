import { mockMarketData } from "@/lib/mock-market-data";
import type { BrokerAdapter } from "@/server/brokers/types";

export const angelOneAdapter: BrokerAdapter = {
  id: "angel-one",
  name: "Angel One",
  async connect() {
    return { connected: false, message: "Angel One SmartAPI credentials are not configured yet." };
  },
  async getQuotes(symbols) {
    return mockMarketData.filter((asset) => symbols.includes(asset.symbol));
  }
};
