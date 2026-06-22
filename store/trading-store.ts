"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockJournalEntries, mockTrades, mockWatchlists } from "@/lib/mock-market-data";
import { getDefaultLotSize, getTradeUnits } from "@/lib/trading-lots";
import type { AssetClass, JournalEntry, Trade, Watchlist } from "@/types/platform";

export type NewTradeInput = Omit<Trade, "id" | "status" | "openedAt" | "closedAt" | "exitPrice">;
type TradeUpdate = Partial<Omit<Trade, "id">>;

interface TradingState {
  trades: Trade[];
  watchlists: Watchlist[];
  journalEntries: JournalEntry[];
  lastSavedAt: string | null;
  hasHydrated: boolean;
  addTrade: (trade: NewTradeInput) => void;
  updateTrade: (id: string, patch: TradeUpdate) => void;
  deleteTrade: (id: string) => void;
  duplicateTrade: (id: string) => void;
  closeTrade: (id: string, exitPrice?: number) => void;
  createWatchlist: (name: string) => void;
  addSymbolToWatchlist: (watchlistId: string, symbol: string) => void;
  removeSymbolFromWatchlist: (watchlistId: string, symbol: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  replaceSavedData: (data: Partial<Pick<TradingState, "trades" | "watchlists" | "journalEntries">>) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function savedNow() {
  return new Date().toISOString();
}

function normalizeTrade(trade: Trade): Trade {
  return {
    ...trade,
    instrument: trade.instrument ?? "FUTURES",
    lotSize: trade.lotSize ?? getDefaultLotSize(trade.symbol, trade.instrument ?? "FUTURES", trade.assetClass)
  };
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      trades: mockTrades,
      watchlists: mockWatchlists,
      journalEntries: mockJournalEntries,
      lastSavedAt: null,
      hasHydrated: false,

      addTrade: (trade) =>
        set((state) => ({
          trades: [
            {
              ...trade,
              id: createId("trd"),
              status: "OPEN",
              openedAt: savedNow()
            },
            ...state.trades
          ],
          lastSavedAt: savedNow()
        })),

      updateTrade: (id, patch) =>
        set((state) => ({
          trades: state.trades.map((trade) => (trade.id === id ? { ...trade, ...patch } : trade)),
          lastSavedAt: savedNow()
        })),

      deleteTrade: (id) =>
        set((state) => ({
          trades: state.trades.filter((trade) => trade.id !== id),
          lastSavedAt: savedNow()
        })),

      duplicateTrade: (id) => {
        const source = get().trades.find((trade) => trade.id === id);
        if (!source) {
          return;
        }

        const duplicated: Trade = {
          ...source,
          id: createId("trd"),
          status: "OPEN",
          openedAt: savedNow(),
          closedAt: undefined,
          exitPrice: undefined,
          notes: source.notes ? `${source.notes} (duplicate)` : "Duplicated paper trade"
        };

        set((state) => ({ trades: [duplicated, ...state.trades], lastSavedAt: savedNow() }));
      },

      closeTrade: (id, exitPrice) =>
        set((state) => ({
          trades: state.trades.map((trade) =>
            trade.id === id
              ? {
                  ...trade,
                  status: "CLOSED",
                  exitPrice: exitPrice ?? trade.target1,
                  closedAt: savedNow()
                }
              : trade
          ),
          lastSavedAt: savedNow()
        })),

      createWatchlist: (name) =>
        set((state) => ({
          watchlists: [
            ...state.watchlists,
            {
              id: createId("wl"),
              name,
              symbols: [],
              createdAt: savedNow()
            }
          ],
          lastSavedAt: savedNow()
        })),

      addSymbolToWatchlist: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((watchlist) =>
            watchlist.id === watchlistId && !watchlist.symbols.includes(symbol.toUpperCase())
              ? { ...watchlist, symbols: [...watchlist.symbols, symbol.toUpperCase()] }
              : watchlist
          ),
          lastSavedAt: savedNow()
        })),

      removeSymbolFromWatchlist: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((watchlist) =>
            watchlist.id === watchlistId
              ? { ...watchlist, symbols: watchlist.symbols.filter((item) => item !== symbol) }
              : watchlist
          ),
          lastSavedAt: savedNow()
        })),

      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [
            {
              ...entry,
              id: createId("jnl"),
              createdAt: savedNow()
            },
            ...state.journalEntries
          ],
          lastSavedAt: savedNow()
        })),

      replaceSavedData: (data) =>
        set((state) => ({
          trades: data.trades?.map(normalizeTrade) ?? state.trades,
          watchlists: data.watchlists ?? state.watchlists,
          journalEntries: data.journalEntries ?? state.journalEntries,
          lastSavedAt: savedNow()
        })),

      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: "heist-stoker-trading-data",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<TradingState>;
        return {
          ...state,
          trades: state.trades?.map(normalizeTrade)
        };
      },
      partialize: (state) => ({
        trades: state.trades,
        watchlists: state.watchlists,
        journalEntries: state.journalEntries,
        lastSavedAt: state.lastSavedAt
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export function calculateTradePnl(trade: Trade, currentPrice?: number) {
  const mark = trade.status === "CLOSED" ? trade.exitPrice ?? trade.entryPrice : currentPrice ?? trade.target1;
  const gross = trade.side === "BUY" ? mark - trade.entryPrice : trade.entryPrice - mark;
  return gross * getTradeUnits(trade);
}

export function calculateRiskReward(trade: Pick<Trade, "side" | "entryPrice" | "stopLoss" | "target1">) {
  const risk =
    trade.side === "BUY"
      ? Math.abs(trade.entryPrice - trade.stopLoss)
      : Math.abs(trade.stopLoss - trade.entryPrice);
  const reward =
    trade.side === "BUY"
      ? Math.abs(trade.target1 - trade.entryPrice)
      : Math.abs(trade.entryPrice - trade.target1);

  if (risk === 0) {
    return 0;
  }

  return reward / risk;
}

export const defaultTradeDraft: NewTradeInput = {
  symbol: "NIFTY",
  assetClass: "Indices" as AssetClass,
  instrument: "FUTURES",
  lotSize: getDefaultLotSize("NIFTY", "FUTURES", "Indices"),
  side: "BUY",
  entryPrice: 24580,
  quantity: 1,
  stopLoss: 24480,
  target1: 24700,
  target2: 24850,
  target3: 25000,
  notes: "Paper trade setup"
};
