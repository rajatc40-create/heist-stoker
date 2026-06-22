import { mockMarketData } from "@/lib/mock-market-data";
import type { AssetClass } from "@/types/platform";

interface SymbolMapping {
  symbol: string;
  providerSymbol: string;
  assetClass: AssetClass;
  name: string;
}

const explicitMappings: SymbolMapping[] = [
  { symbol: "NIFTY", providerSymbol: "^NSEI", assetClass: "Indices", name: "Nifty 50" },
  { symbol: "BANKNIFTY", providerSymbol: "^NSEBANK", assetClass: "Indices", name: "Bank Nifty" },
  { symbol: "BTCUSDT", providerSymbol: "BTC-USD", assetClass: "Crypto", name: "Bitcoin" },
  { symbol: "ETHUSDT", providerSymbol: "ETH-USD", assetClass: "Crypto", name: "Ethereum" },
  { symbol: "SOLUSDT", providerSymbol: "SOL-USD", assetClass: "Crypto", name: "Solana" },
  { symbol: "EURUSD", providerSymbol: "EURUSD=X", assetClass: "Forex", name: "Euro / US Dollar" },
  { symbol: "GBPUSD", providerSymbol: "GBPUSD=X", assetClass: "Forex", name: "British Pound / US Dollar" },
  { symbol: "USDJPY", providerSymbol: "JPY=X", assetClass: "Forex", name: "US Dollar / Japanese Yen" }
];

export const defaultMarketSymbols = mockMarketData.map((asset) => asset.symbol);

export function resolveYahooSymbol(symbol: string): SymbolMapping {
  const normalized = symbol.trim().toUpperCase();
  const explicit = explicitMappings.find((item) => item.symbol === normalized);

  if (explicit) {
    return explicit;
  }

  const mock = mockMarketData.find((asset) => asset.symbol === normalized);
  const assetClass = mock?.assetClass ?? "Stocks";

  return {
    symbol: normalized,
    providerSymbol: assetClass === "Stocks" ? `${normalized}.NS` : normalized,
    assetClass,
    name: mock?.name ?? normalized
  };
}
