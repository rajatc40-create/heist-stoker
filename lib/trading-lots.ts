import type { AssetClass, Trade, TradeInstrument } from "@/types/platform";

const indexLotSizes: Record<string, number> = {
  NIFTY: 65,
  BANKNIFTY: 30
};

// Training defaults for stock F&O contracts used in this workspace.
const stockLotSizes: Record<string, number> = {
  RELIANCE: 250,
  HDFCBANK: 550,
  INFY: 300,
  TATASTEEL: 4250
};

export function getDefaultLotSize(symbol: string, instrument: TradeInstrument, assetClass?: AssetClass) {
  if (instrument === "OPTION" || instrument === "FUTURES") {
    const normalized = symbol.toUpperCase();

    if (normalized in indexLotSizes) {
      return indexLotSizes[normalized];
    }

    if (assetClass === "Stocks" && normalized in stockLotSizes) {
      return stockLotSizes[normalized];
    }
  }

  return 1;
}

export function getTradeLotSize(trade: Pick<Trade, "symbol" | "instrument" | "assetClass"> & Partial<Pick<Trade, "lotSize">>) {
  return trade.lotSize ?? getDefaultLotSize(trade.symbol, trade.instrument, trade.assetClass);
}

export function getTradeUnits(
  trade: Pick<Trade, "quantity" | "symbol" | "instrument" | "assetClass"> & Partial<Pick<Trade, "lotSize">>
) {
  return trade.quantity * getTradeLotSize(trade);
}
