"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpDown,
  Copy,
  Layers,
  LineChart,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  Target,
  Trash2,
  WalletCards,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLiveMarketData } from "@/lib/hooks/use-live-market-data";
import { getDefaultLotSize, getTradeLotSize, getTradeUnits } from "@/lib/trading-lots";
import { cn, formatCurrency, formatPercent, getDurationLabel } from "@/lib/utils";
import {
  calculateRiskReward,
  calculateTradePnl,
  defaultTradeDraft,
  useTradingStore
} from "@/store/trading-store";
import type { AssetClass, MarketAsset, OptionType, Trade, TradeInstrument, TradeSide } from "@/types/platform";

type TradeDraft = typeof defaultTradeDraft;
type OrderMode = "MARKET" | "LIMIT";
type ProductType = "INTRADAY" | "DELIVERY";
type TradeContract = Pick<Trade, "symbol" | "entryPrice"> &
  Partial<Pick<Trade, "instrument" | "optionType" | "strikePrice" | "expiryDate">>;

interface OptionChainRow {
  strike: number;
  cePremium: number;
  pePremium: number;
  ceOi: number;
  peOi: number;
  ceChange: number;
  peChange: number;
}

interface OptionSellingLeg {
  optionType: OptionType;
  side: TradeSide;
  strike: number;
  premium: number;
  label: string;
}

interface OptionSellingPreset {
  id: string;
  title: string;
  summary: string;
  estimatedCredit: number;
  legs: OptionSellingLeg[];
}

const virtualCapital = 1000000;
const selectClassName = "h-10 rounded-md border bg-black/30 px-3 text-sm text-white";
const baseSymbols = ["NIFTY", "BANKNIFTY", "RELIANCE", "HDFCBANK", "INFY", "TATASTEEL", "BTCUSDT", "ETHUSDT"];

export function DemoTradingModule() {
  const { trades, addTrade, updateTrade, deleteTrade, duplicateTrade, closeTrade } = useTradingStore();
  const [draft, setDraft] = useState<TradeDraft>(defaultTradeDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderMode, setOrderMode] = useState<OrderMode>("MARKET");
  const [productType, setProductType] = useState<ProductType>("INTRADAY");
  const activeInstrument = getTradeInstrument(draft);
  const openTrades = useMemo(() => trades.filter((trade) => trade.status === "OPEN"), [trades]);
  const symbols = useMemo(
    () =>
      Array.from(
        new Set(
          [...baseSymbols, ...trades.map((trade) => trade.symbol), draft.symbol]
            .filter(Boolean)
            .map((symbol) => symbol.toUpperCase())
        )
      ),
    [draft.symbol, trades]
  );
  const { assets, source, liveCount, fallbackCount, updatedAt, isLoading, refresh, priceBySymbol } = useLiveMarketData(
    symbols,
    12000
  );
  const openPnl = openTrades.reduce((total, trade) => total + calculateTradePnl(trade, getTradeMark(trade)), 0);
  const closedPnl = trades
    .filter((trade) => trade.status === "CLOSED")
    .reduce((total, trade) => total + calculateTradePnl(trade), 0);
  const marginUsed = openTrades.reduce((total, trade) => total + getMarginRequired(trade), 0);
  const availableFunds = virtualCapital + closedPnl + openPnl - marginUsed;
  const riskReward = useMemo(() => calculateRiskReward(draft), [draft]);
  const selectedAsset = assets.find((asset) => asset.symbol === draft.symbol.toUpperCase());
  const selectedUnderlying = getMarketPrice(draft.symbol) ?? selectedAsset?.price ?? draft.entryPrice;
  const optionChain = useMemo(
    () => buildOptionChain(draft.symbol, selectedUnderlying),
    [draft.symbol, selectedUnderlying]
  );
  const optionSellingPresets = useMemo(
    () => buildOptionSellingPresets(optionChain, selectedUnderlying),
    [optionChain, selectedUnderlying]
  );
  const draftMark = getTradeMark(draft);
  const estimatedMargin = getMarginRequired(draft);
  const draftLotSize = getDefaultLotSize(draft.symbol, activeInstrument, draft.assetClass);
  const draftUnits = draft.quantity * draftLotSize;

  useEffect(() => {
    setDraft((current) =>
      current.lotSize === draftLotSize
        ? current
        : {
            ...current,
            lotSize: draftLotSize
          }
    );
  }, [draftLotSize]);

  function saveTrade() {
    const nextDraft = normalizeDraftForSave(draft);

    if (editingId) {
      updateTrade(editingId, nextDraft);
      setEditingId(null);
    } else {
      addTrade(nextDraft);
    }

    setDraft(createFreshDraft(getTradeInstrument(nextDraft), getMarketPrice(nextDraft.symbol)));
  }

  function editTrade(trade: Trade) {
    setEditingId(trade.id);
    setDraft({
      symbol: trade.symbol,
      assetClass: trade.assetClass,
      instrument: getTradeInstrument(trade),
      optionType: trade.optionType,
      strikePrice: trade.strikePrice,
      expiryDate: trade.expiryDate,
      side: trade.side,
      entryPrice: trade.entryPrice,
      quantity: trade.quantity,
      lotSize: trade.lotSize ?? getTradeLotSize(trade),
      stopLoss: trade.stopLoss,
      target1: trade.target1,
      target2: trade.target2,
      target3: trade.target3,
      notes: trade.notes ?? ""
    });
  }

  function selectAsset(asset: MarketAsset) {
    setEditingId(null);
    setDraft((current) => {
      const entryPrice = Number(asset.price.toFixed(2));
      const side = current.side ?? "BUY";
      const levels = buildPriceLevels(entryPrice, side, "FUTURES");

      return {
        ...current,
        symbol: asset.symbol,
        assetClass: asset.assetClass,
        instrument: "FUTURES",
        lotSize: getDefaultLotSize(asset.symbol, "FUTURES", asset.assetClass),
        optionType: undefined,
        strikePrice: undefined,
        expiryDate: undefined,
        entryPrice,
        quantity: 1,
        stopLoss: levels.stopLoss,
        target1: levels.target1,
        target2: levels.target2,
        target3: levels.target3,
        notes: `${asset.symbol} futures paper setup`
      };
    });
  }

  function changeInstrument(instrument: TradeInstrument) {
    setEditingId(null);
    setDraft((current) => {
      if (instrument === "OPTION") {
        return createFreshDraft("OPTION", selectedUnderlying, current);
      }

      return createFreshDraft("FUTURES", getMarketPrice(current.symbol), current);
    });
  }

  function selectOptionLeg(row: OptionChainRow, optionType: OptionType, side: TradeSide) {
    const premium = optionType === "CE" ? row.cePremium : row.pePremium;
    const levels = buildPriceLevels(premium, side, "OPTION");

    setEditingId(null);
    setDraft((current) => ({
      ...current,
      symbol: draft.symbol,
      assetClass: "Indices",
      instrument: "OPTION",
      lotSize: getDefaultLotSize(draft.symbol, "OPTION", "Indices"),
      optionType,
      strikePrice: row.strike,
      expiryDate: current.expiryDate || getDefaultExpiryDate(),
      side,
      entryPrice: premium,
      quantity: current.instrument === "OPTION" ? current.quantity : 1,
      stopLoss: levels.stopLoss,
      target1: levels.target1,
      target2: levels.target2,
      target3: levels.target3,
      notes: `${draft.symbol} ${row.strike} ${optionType} ${side} paper option setup`
    }));
  }

  function quickFuturesSide(side: TradeSide) {
    const entryPrice = Number(selectedUnderlying.toFixed(2));
    const levels = buildPriceLevels(entryPrice, side, "FUTURES");

    setDraft((current) => ({
      ...current,
      instrument: "FUTURES",
      lotSize: getDefaultLotSize(current.symbol, "FUTURES", current.assetClass),
      optionType: undefined,
      strikePrice: undefined,
      expiryDate: undefined,
      side,
      entryPrice,
      stopLoss: levels.stopLoss,
      target1: levels.target1,
      target2: levels.target2,
      target3: levels.target3,
      notes: `${current.symbol} futures ${side} setup`
    }));
  }

  function createOptionSellingTrade(leg: OptionSellingLeg, strategyTitle: string): TradeDraft {
    const levels = buildPriceLevels(leg.premium, leg.side, "OPTION");

    return {
      ...defaultTradeDraft,
      symbol: draft.symbol,
      assetClass: "Indices",
      instrument: "OPTION",
      lotSize: getDefaultLotSize(draft.symbol, "OPTION", "Indices"),
      optionType: leg.optionType,
      strikePrice: leg.strike,
      expiryDate: draft.expiryDate || getDefaultExpiryDate(),
      side: leg.side,
      entryPrice: leg.premium,
      quantity: draft.quantity,
      stopLoss: levels.stopLoss,
      target1: levels.target1,
      target2: levels.target2,
      target3: levels.target3,
      notes: `${strategyTitle}: ${leg.label}`
    };
  }

  function previewOptionSellingPreset(preset: OptionSellingPreset) {
    setEditingId(null);
    setDraft(createOptionSellingTrade(preset.legs[0], preset.title));
  }

  function placeOptionSellingPreset(preset: OptionSellingPreset) {
    const basket = preset.legs.map((leg) => normalizeDraftForSave(createOptionSellingTrade(leg, preset.title)));
    basket.forEach((trade) => addTrade(trade));
    setEditingId(null);
    setDraft(createOptionSellingTrade(preset.legs[0], preset.title));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-5">
        <AccountMetric icon={<WalletCards />} label="Virtual Capital" value={formatCurrency(virtualCapital)} />
        <AccountMetric
          icon={<Activity />}
          label="Available"
          value={formatCurrency(availableFunds)}
          tone={availableFunds >= 0 ? "profit" : "loss"}
        />
        <AccountMetric icon={<Layers />} label="Margin Used" value={formatCurrency(marginUsed)} />
        <AccountMetric
          icon={<LineChart />}
          label="Open P&L"
          value={formatCurrency(openPnl)}
          tone={openPnl >= 0 ? "profit" : "loss"}
        />
        <AccountMetric icon={<ShieldCheck />} label="Mode" value="Paper Only" tone="gold" />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_390px]">
        <Card className="border-white/10 bg-black/35">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Market Watch</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Click any symbol to load ticket.</p>
              </div>
              <Button size="icon" variant="ghost" aria-label="Refresh prices" onClick={() => void refresh()} disabled={isLoading}>
                <RefreshCw />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs">
              <span className="text-muted-foreground">
                Feed / {liveCount} live / {fallbackCount} practice
              </span>
              <Badge variant={source === "yahoo-chart" ? "bullish" : "outline"}>
                {source === "yahoo-chart" ? "Live/Delayed" : "Practice Feed"}
              </Badge>
            </div>
            <div className="space-y-2">
              {assets.slice(0, 8).map((asset) => (
                <button
                  key={asset.symbol}
                  type="button"
                  className={cn(
                    "w-full rounded-md border p-3 text-left transition-colors",
                    draft.symbol === asset.symbol
                      ? "border-gold/50 bg-gold/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  )}
                  onClick={() => selectAsset(asset)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{asset.price.toLocaleString()}</p>
                      <p className={asset.changePercent >= 0 ? "text-xs text-bullish" : "text-xs text-bearish"}>
                        {formatPercent(asset.changePercent)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Bid {getBidAsk(asset.price).bid.toLocaleString()}</span>
                    <span className="text-right">Ask {getBidAsk(asset.price).ask.toLocaleString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-white/10 bg-black/35">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Practice Terminal</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Watchlist, option chain, order ticket, and positions in one training screen.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-white/[0.03] p-1">
                  <InstrumentButton
                    active={activeInstrument === "FUTURES"}
                    label="Futures"
                    helper="F&O"
                    onClick={() => changeInstrument("FUTURES")}
                  />
                  <InstrumentButton
                    active={activeInstrument === "OPTION"}
                    label="Options"
                    helper="CE/PE"
                    onClick={() => changeInstrument("OPTION")}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-4">
                <TerminalStat label="Selected" value={draft.symbol} />
                <TerminalStat label="Underlying" value={selectedUnderlying.toLocaleString()} />
                <TerminalStat label="Bid / Ask" value={`${getBidAsk(selectedUnderlying).bid} / ${getBidAsk(selectedUnderlying).ask}`} />
                <TerminalStat label="Updated" value={updatedAt ? <ClientTime value={updatedAt} format="time" /> : "--"} />
              </div>

              {activeInstrument === "OPTION" ? (
                <div className="space-y-3">
                  <div className="grid gap-3 xl:grid-cols-2">
                    {optionSellingPresets.map((preset) => (
                      <div key={preset.id} className="rounded-md border border-gold/20 bg-gold/5 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{preset.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{preset.summary}</p>
                          </div>
                          <Badge variant="outline">{formatCurrency(preset.estimatedCredit)} credit</Badge>
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                          {preset.legs.map((leg) => (
                            <div key={`${preset.id}-${leg.optionType}-${leg.strike}-${leg.side}`} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2">
                              <span>
                                {leg.side} {leg.optionType} {leg.strike.toLocaleString()}
                              </span>
                              <span>@ {leg.premium.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => previewOptionSellingPreset(preset)}>
                            Preview
                          </Button>
                          <Button size="sm" onClick={() => placeOptionSellingPreset(preset)}>
                            Place Basket
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md border border-white/10 bg-white/[0.03]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
                      <div>
                        <p className="font-semibold text-white">Options Chain</p>
                        <p className="text-xs text-muted-foreground">
                          Single-leg aur option selling basket dono yahin se manage karo.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{draft.quantity} lot</Badge>
                        <Badge variant="default">Expiry {draft.expiryDate || getDefaultExpiryDate()}</Badge>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CE LTP</TableHead>
                          <TableHead>CE OI</TableHead>
                          <TableHead>Strike</TableHead>
                          <TableHead>PE OI</TableHead>
                          <TableHead>PE LTP</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {optionChain.map((row) => (
                          <TableRow key={row.strike}>
                            <TableCell>
                              <p className="font-semibold text-bullish">{row.cePremium.toLocaleString()}</p>
                              <p className={row.ceChange >= 0 ? "text-xs text-bullish" : "text-xs text-bearish"}>
                                {formatPercent(row.ceChange)}
                              </p>
                            </TableCell>
                            <TableCell>{row.ceOi.toLocaleString()}</TableCell>
                            <TableCell>
                              <button
                                type="button"
                                className={cn(
                                  "rounded-md border px-3 py-1 font-semibold",
                                  row.strike === (draft.strikePrice ?? getDefaultStrike(draft.symbol))
                                    ? "border-gold/50 bg-gold/10 text-gold"
                                    : "border-white/10 text-white"
                                )}
                                onClick={() => selectOptionLeg(row, draft.optionType ?? "CE", draft.side)}
                              >
                                {row.strike.toLocaleString()}
                              </button>
                            </TableCell>
                            <TableCell>{row.peOi.toLocaleString()}</TableCell>
                            <TableCell>
                              <p className="font-semibold text-bearish">{row.pePremium.toLocaleString()}</p>
                              <p className={row.peChange >= 0 ? "text-xs text-bullish" : "text-xs text-bearish"}>
                                {formatPercent(row.peChange)}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex min-w-[190px] flex-wrap gap-1">
                                <Button size="sm" variant="bullish" onClick={() => selectOptionLeg(row, "CE", "BUY")}>
                                  Buy CE
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => selectOptionLeg(row, "PE", "BUY")}>
                                  Buy PE
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => selectOptionLeg(row, "CE", "SELL")}>
                                  Sell CE
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => selectOptionLeg(row, "PE", "SELL")}>
                                  Sell PE
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-3">
                  <FuturesContractCard
                    title={`${draft.symbol} Futures`}
                    price={selectedUnderlying}
                    side="BUY"
                    onClick={() => quickFuturesSide("BUY")}
                  />
                  <FuturesContractCard
                    title={`${draft.symbol} Futures`}
                    price={selectedUnderlying}
                    side="SELL"
                    onClick={() => quickFuturesSide("SELL")}
                  />
                  <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <ArrowUpDown className="size-4 text-gold" />
                      Market Depth
                    </div>
                    <div className="mt-4 grid gap-2 text-sm">
                      <DepthRow label="Best Bid" value={getBidAsk(selectedUnderlying).bid} tone="profit" />
                      <DepthRow label="Best Ask" value={getBidAsk(selectedUnderlying).ask} tone="loss" />
                      <DepthRow label="Spread" value={(getBidAsk(selectedUnderlying).ask - getBidAsk(selectedUnderlying).bid).toFixed(2)} />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/35">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Live Positions</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Open paper positions with live/delayed P&L.</p>
                </div>
                <Badge variant="bullish">
                  <Activity className="mr-1 size-3" />
                  {openTrades.length} Open
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {openTrades.length ? (
                <div className="grid gap-3 lg:grid-cols-2">
                  {openTrades.map((trade) => {
                    const mark = getTradeMark(trade);
                    const pnl = calculateTradePnl(trade, mark);
                    const rr = calculateRiskReward(trade);

                    return (
                      <div key={trade.id} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-white">{trade.symbol}</p>
                              <Badge variant={getTradeInstrument(trade) === "OPTION" ? "bearish" : "default"}>
                                {getContractLabel(trade)}
                              </Badge>
                              <Badge variant={trade.side === "BUY" ? "bullish" : "bearish"}>{trade.side}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{trade.assetClass}</p>
                          </div>
                          <p className={cn("text-lg font-bold", pnl >= 0 ? "text-bullish" : "text-bearish")}>
                            {formatCurrency(pnl)}
                          </p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                          <LivePoint label="Entry" value={trade.entryPrice.toLocaleString()} />
                          <LivePoint label="Live" value={mark?.toLocaleString() ?? "-"} />
                          <LivePoint label="RR" value={`${rr.toFixed(2)}R`} />
                          <LivePoint label="Duration" value={<DurationLabel trade={trade} />} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-5 text-sm text-muted-foreground">
                  No open paper position. Select a futures contract or CE/PE leg and place a practice trade.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-gold/20 bg-black/35">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{editingId ? "Modify Order" : "Order Ticket"}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Virtual money only. No real broker order.</p>
              </div>
              <Badge variant={activeInstrument === "OPTION" ? "bearish" : "default"}>
                {activeInstrument === "OPTION" ? "Options" : "Futures"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <SegmentButton active={orderMode === "MARKET"} onClick={() => setOrderMode("MARKET")}>
                Market
              </SegmentButton>
              <SegmentButton active={orderMode === "LIMIT"} onClick={() => setOrderMode("LIMIT")}>
                Limit
              </SegmentButton>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SegmentButton active={productType === "INTRADAY"} onClick={() => setProductType("INTRADAY")}>
                Intraday
              </SegmentButton>
              <SegmentButton active={productType === "DELIVERY"} onClick={() => setProductType("DELIVERY")}>
                Carry
              </SegmentButton>
            </div>

            {activeInstrument === "OPTION" ? (
              <div className="rounded-md border border-bearish/30 bg-bearish/8 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Target className="size-4 text-bearish" />
                    Option Contract
                  </div>
                  <Badge variant={draft.optionType === "CE" ? "bullish" : "bearish"}>{draft.optionType ?? "CE"}</Badge>
                </div>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="CE / PE">
                      <select
                        className={selectClassName}
                        value={draft.optionType ?? "CE"}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, optionType: event.target.value as OptionType }))
                        }
                      >
                        <option value="CE">CE</option>
                        <option value="PE">PE</option>
                      </select>
                    </Field>
                    <NumberField
                      label="Strike"
                      value={draft.strikePrice ?? getDefaultStrike(draft.symbol)}
                      onChange={(value) => setDraft((current) => ({ ...current, strikePrice: value }))}
                    />
                  </div>
                  <Field label="Expiry">
                    <Input
                      type="date"
                      value={draft.expiryDate ?? ""}
                      onChange={(event) => setDraft((current) => ({ ...current, expiryDate: event.target.value }))}
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            <div className="grid gap-3">
              <Field label="Symbol">
                <Input
                  value={draft.symbol}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, symbol: event.target.value.toUpperCase() }))
                  }
                />
              </Field>
              <Field label="Asset Class">
                <select
                  className={selectClassName}
                  value={draft.assetClass}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, assetClass: event.target.value as AssetClass }))
                  }
                >
                  <option>Stocks</option>
                  <option>Indices</option>
                  <option>Forex</option>
                  <option>Crypto</option>
                </select>
              </Field>
              <Field label="Side">
                <select
                  className={selectClassName}
                  value={draft.side}
                  onChange={(event) => {
                    const side = event.target.value as TradeSide;
                    const levels = buildPriceLevels(draft.entryPrice, side, activeInstrument);
                    setDraft((current) => ({ ...current, side, ...levels }));
                  }}
                >
                  <option>BUY</option>
                  <option>SELL</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label={activeInstrument === "OPTION" ? "Premium" : "Price"}
                  value={draft.entryPrice}
                  onChange={(value) => setDraftValue("entryPrice", value)}
                />
                <NumberField label="Lots" value={draft.quantity} onChange={(value) => setDraftValue("quantity", value)} />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (draftMark) {
                    setDraftValue("entryPrice", Number(draftMark.toFixed(2)));
                  }
                }}
              >
                <Activity />
                Use Live Price
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Stop Loss" value={draft.stopLoss} onChange={(value) => setDraftValue("stopLoss", value)} />
                <NumberField label="Target 1" value={draft.target1} onChange={(value) => setDraftValue("target1", value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Target 2" value={draft.target2} onChange={(value) => setDraftValue("target2", value)} />
                <NumberField label="Target 3" value={draft.target3} onChange={(value) => setDraftValue("target3", value)} />
              </div>
              <Field label="Notes">
                <Textarea
                  value={draft.notes}
                  onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <OrderStat label="Live/Mark" value={draftMark?.toLocaleString() ?? "-"} />
              <OrderStat label="Req. Margin" value={formatCurrency(estimatedMargin)} />
              <OrderStat label="Lot Size" value={draftLotSize.toLocaleString()} />
              <OrderStat label="Total Units" value={draftUnits.toLocaleString()} />
              <OrderStat label="Risk Reward" value={`${riskReward.toFixed(2)}R`} />
              <OrderStat label="Product" value={productType} />
            </div>

            <div className="rounded-md border border-gold/25 bg-gold/8 p-3 text-xs text-muted-foreground">
              Education mode: this is a paper simulator. Use it for practice, review, and student learning only.
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="w-full" onClick={saveTrade}>
                <Save />
                {editingId ? "Save" : draft.side === "BUY" ? "Buy Paper" : "Sell Paper"}
              </Button>
              <Button className="w-full" variant="secondary" onClick={() => void refresh()} disabled={isLoading}>
                <RefreshCw />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Order Book</CardTitle>
            <Badge variant="outline">{trades.length} trades</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Live/Exit</TableHead>
                <TableHead>Lots</TableHead>
                <TableHead>SL</TableHead>
                <TableHead>T1/T2/T3</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>RR</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => {
                const mark = getTradeMark(trade);
                const pnl = calculateTradePnl(trade, mark);
                const rr = calculateRiskReward(trade);

                return (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <p className="font-semibold text-white">{trade.symbol}</p>
                      <p className="text-xs text-muted-foreground">{trade.assetClass}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-white">{getTradeInstrument(trade)}</p>
                      <p className="text-xs text-muted-foreground">{getContractLabel(trade)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.side === "BUY" ? "bullish" : "bearish"}>{trade.side}</Badge>
                    </TableCell>
                    <TableCell>{trade.entryPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      {trade.status === "CLOSED"
                        ? (trade.exitPrice ?? trade.entryPrice).toLocaleString()
                        : mark?.toLocaleString() ?? "-"}
                    </TableCell>
                    <TableCell>
                      <p>{trade.quantity}</p>
                      <p className="text-xs text-muted-foreground">
                        x {getTradeLotSize(trade)} = {getTradeUnits(trade)}
                      </p>
                    </TableCell>
                    <TableCell>{trade.stopLoss.toLocaleString()}</TableCell>
                    <TableCell>
                      {trade.target1.toLocaleString()} / {trade.target2.toLocaleString()} /{" "}
                      {trade.target3.toLocaleString()}
                    </TableCell>
                    <TableCell className={pnl >= 0 ? "text-bullish" : "text-bearish"}>{formatCurrency(pnl)}</TableCell>
                    <TableCell>{rr.toFixed(2)}R</TableCell>
                    <TableCell>
                      <DurationLabel trade={trade} />
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-[176px] gap-1">
                        <Button size="icon" variant="ghost" aria-label="Edit trade" onClick={() => editTrade(trade)}>
                          <Pencil />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Duplicate trade"
                          onClick={() => duplicateTrade(trade.id)}
                        >
                          <Copy />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Close trade"
                          onClick={() => closeTrade(trade.id, mark)}
                          disabled={trade.status === "CLOSED"}
                        >
                          <XCircle />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete trade"
                          onClick={() => deleteTrade(trade.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  function setDraftValue(
    key: keyof Pick<TradeDraft, "entryPrice" | "quantity" | "stopLoss" | "target1" | "target2" | "target3">,
    value: number
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function getMarketPrice(symbol: string) {
    return priceBySymbol.get(symbol.toUpperCase()) ?? assets.find((asset) => asset.symbol === symbol.toUpperCase())?.price;
  }

  function getTradeMark(trade: TradeContract) {
    const underlying = getMarketPrice(trade.symbol);

    if (getTradeInstrument(trade) === "OPTION") {
      return getEstimatedOptionPremium(trade, underlying);
    }

    return underlying;
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field label={label}>
      <Input type="number" value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.target.value))} />
    </Field>
  );
}

function InstrumentButton({
  active,
  label,
  helper,
  onClick
}: {
  active: boolean;
  label: string;
  helper: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md px-3 py-2 text-left transition-colors",
        active ? "bg-gold text-black" : "text-muted-foreground hover:bg-white/8 hover:text-white"
      )}
      onClick={onClick}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className="block text-xs">{helper}</span>
    </button>
  );
}

function SegmentButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 rounded-md border px-3 text-sm font-semibold transition-colors",
        active ? "border-gold/50 bg-gold text-black" : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-white"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function AccountMetric({
  icon,
  label,
  value,
  tone = "neutral"
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "neutral" | "profit" | "loss" | "gold";
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <span
          className={cn(
            "[&_svg]:size-4",
            tone === "profit" && "text-bullish",
            tone === "loss" && "text-bearish",
            tone === "gold" && "text-gold",
            tone === "neutral" && "text-muted-foreground"
          )}
        >
          {icon}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 text-lg font-bold",
          tone === "profit" && "text-bullish",
          tone === "loss" && "text-bearish",
          tone === "gold" && "text-gold",
          tone === "neutral" && "text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function TerminalStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function OrderStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function FuturesContractCard({
  title,
  price,
  side,
  onClick
}: {
  title: string;
  price: number;
  side: TradeSide;
  onClick: () => void;
}) {
  const levels = buildPriceLevels(price, side, "FUTURES");

  return (
    <button
      type="button"
      className="rounded-md border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-gold/40 hover:bg-gold/8"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-xs text-muted-foreground">Virtual contract</p>
        </div>
        <Badge variant={side === "BUY" ? "bullish" : "bearish"}>{side}</Badge>
      </div>
      <p className="mt-4 text-2xl font-bold text-white">{price.toLocaleString()}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <span>SL {levels.stopLoss.toLocaleString()}</span>
        <span>T1 {levels.target1.toLocaleString()}</span>
        <span>T2 {levels.target2.toLocaleString()}</span>
      </div>
    </button>
  );
}

function DepthRow({ label, value, tone = "neutral" }: { label: string; value: ReactNode; tone?: "neutral" | "profit" | "loss" }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-semibold", tone === "profit" && "text-bullish", tone === "loss" && "text-bearish")}>
        {value}
      </span>
    </div>
  );
}

function LivePoint({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function DurationLabel({ trade }: { trade: Pick<Trade, "openedAt" | "closedAt"> }) {
  const [duration, setDuration] = useState("--");

  useEffect(() => {
    function updateDuration() {
      setDuration(getDurationLabel(trade.openedAt, trade.closedAt));
    }

    updateDuration();

    if (trade.closedAt) {
      return;
    }

    const interval = window.setInterval(updateDuration, 60000);
    return () => window.clearInterval(interval);
  }, [trade.closedAt, trade.openedAt]);

  return <span suppressHydrationWarning>{duration}</span>;
}

function getTradeInstrument(trade: Partial<Pick<Trade, "instrument">>): TradeInstrument {
  return trade.instrument ?? "FUTURES";
}

function getContractLabel(trade: TradeContract) {
  if (getTradeInstrument(trade) !== "OPTION") {
    return "FUT";
  }

  const optionType = trade.optionType ?? "CE";
  const strike = trade.strikePrice ? trade.strikePrice.toLocaleString() : "Strike";
  const expiry = trade.expiryDate ? ` / ${trade.expiryDate}` : "";
  return `${optionType} ${strike}${expiry}`;
}

function getEstimatedOptionPremium(trade: TradeContract, underlyingPrice?: number) {
  if (!underlyingPrice) {
    return undefined;
  }

  const strike = trade.strikePrice ?? getDefaultStrike(trade.symbol);
  const intrinsic = (trade.optionType ?? "CE") === "CE" ? underlyingPrice - strike : strike - underlyingPrice;
  const estimate = trade.entryPrice + intrinsic * 0.35;
  return Math.max(1, Number(estimate.toFixed(2)));
}

function getMarginRequired(
  trade: TradeContract & Pick<Trade, "assetClass" | "instrument" | "lotSize" | "quantity" | "side">
) {
  const instrument = getTradeInstrument(trade);
  const notional = Math.abs(trade.entryPrice * getTradeUnits(trade));

  if (instrument === "OPTION") {
    return trade.side === "BUY" ? notional : notional * 2.5;
  }

  return notional * 0.15;
}

function normalizeDraftForSave(draft: TradeDraft): TradeDraft {
  if (getTradeInstrument(draft) === "OPTION") {
    return {
      ...draft,
      assetClass: draft.assetClass,
      instrument: "OPTION",
      lotSize: draft.lotSize ?? getDefaultLotSize(draft.symbol, "OPTION", draft.assetClass),
      optionType: draft.optionType ?? "CE",
      strikePrice: draft.strikePrice ?? getDefaultStrike(draft.symbol),
      expiryDate: draft.expiryDate || getDefaultExpiryDate()
    };
  }

  return {
    ...draft,
    instrument: "FUTURES",
    lotSize: draft.lotSize ?? getDefaultLotSize(draft.symbol, "FUTURES", draft.assetClass),
    optionType: undefined,
    strikePrice: undefined,
    expiryDate: undefined
  };
}

function createFreshDraft(instrument: TradeInstrument, livePrice?: number, current?: TradeDraft): TradeDraft {
  if (instrument === "OPTION") {
    const symbol = current?.symbol ?? defaultTradeDraft.symbol;
    const strike = current?.strikePrice ?? getDefaultStrike(symbol);
    const entryPrice = current?.instrument === "OPTION" ? current.entryPrice : 120;
    const side = current?.side ?? "BUY";
    const levels = buildPriceLevels(entryPrice, side, "OPTION");

    return {
      ...defaultTradeDraft,
      ...(current ?? {}),
      assetClass: "Indices",
      instrument: "OPTION",
      lotSize: getDefaultLotSize(symbol, "OPTION", "Indices"),
      optionType: current?.optionType ?? "CE",
      strikePrice: strike,
      expiryDate: current?.expiryDate || getDefaultExpiryDate(),
      entryPrice,
      quantity: current?.instrument === "OPTION" ? current.quantity : 1,
      stopLoss: levels.stopLoss,
      target1: levels.target1,
      target2: levels.target2,
      target3: levels.target3,
      notes: current?.notes || "CE/PE paper option setup"
    };
  }

  const side = current?.side ?? "BUY";
  const entryPrice = Number((livePrice ?? defaultTradeDraft.entryPrice).toFixed(2));
  const levels = buildPriceLevels(entryPrice, side, "FUTURES");

  return {
    ...defaultTradeDraft,
    ...(current ?? {}),
    instrument: "FUTURES",
    lotSize: getDefaultLotSize(current?.symbol ?? defaultTradeDraft.symbol, "FUTURES", current?.assetClass ?? defaultTradeDraft.assetClass),
    optionType: undefined,
    strikePrice: undefined,
    expiryDate: undefined,
    entryPrice: current?.instrument === "OPTION" ? entryPrice : current?.entryPrice ?? entryPrice,
    quantity: current?.instrument === "OPTION" ? defaultTradeDraft.quantity : current?.quantity ?? defaultTradeDraft.quantity,
    stopLoss: current?.instrument === "OPTION" ? levels.stopLoss : current?.stopLoss ?? levels.stopLoss,
    target1: current?.instrument === "OPTION" ? levels.target1 : current?.target1 ?? levels.target1,
    target2: current?.instrument === "OPTION" ? levels.target2 : current?.target2 ?? levels.target2,
    target3: current?.instrument === "OPTION" ? levels.target3 : current?.target3 ?? levels.target3,
    notes: current?.notes || "Futures paper trade setup"
  };
}

function buildOptionChain(symbol: string, underlyingPrice: number): OptionChainRow[] {
  const step = symbol.toUpperCase().includes("BANKNIFTY") ? 100 : 50;
  const center = Math.round(underlyingPrice / step) * step;

  return [-2, -1, 0, 1, 2].map((offset) => {
    const strike = center + offset * step;
    const ceIntrinsic = Math.max(0, underlyingPrice - strike);
    const peIntrinsic = Math.max(0, strike - underlyingPrice);
    const timeValue = Math.max(20, Math.round(underlyingPrice * 0.004 + Math.abs(offset) * 12));
    const cePremium = Math.max(5, Math.round(ceIntrinsic * 0.65 + timeValue));
    const pePremium = Math.max(5, Math.round(peIntrinsic * 0.65 + timeValue));

    return {
      strike,
      cePremium,
      pePremium,
      ceOi: 120000 + Math.abs(offset) * 24000 + (offset < 0 ? 18000 : 0),
      peOi: 118000 + Math.abs(offset) * 22000 + (offset > 0 ? 16000 : 0),
      ceChange: Number(((underlyingPrice - strike) / underlyingPrice * 100).toFixed(2)),
      peChange: Number(((strike - underlyingPrice) / underlyingPrice * 100).toFixed(2))
    };
  });
}

function buildOptionSellingPresets(optionChain: OptionChainRow[], underlyingPrice: number): OptionSellingPreset[] {
  if (!optionChain.length) {
    return [];
  }

  const atmIndex = optionChain.reduce((bestIndex, row, index, rows) => {
    const bestDistance = Math.abs(rows[bestIndex].strike - underlyingPrice);
    const currentDistance = Math.abs(row.strike - underlyingPrice);
    return currentDistance < bestDistance ? index : bestIndex;
  }, 0);

  const atm = optionChain[atmIndex];
  const nearPut = optionChain[Math.max(0, atmIndex - 1)] ?? atm;
  const farPut = optionChain[Math.max(0, atmIndex - 2)] ?? nearPut;
  const nearCall = optionChain[Math.min(optionChain.length - 1, atmIndex + 1)] ?? atm;
  const farCall = optionChain[Math.min(optionChain.length - 1, atmIndex + 2)] ?? nearCall;

  return [
    {
      id: "short-straddle",
      title: "Short Straddle",
      summary: "ATM CE aur PE sell karke premium decay practice karo.",
      estimatedCredit: atm.cePremium + atm.pePremium,
      legs: [
        { optionType: "CE", side: "SELL", strike: atm.strike, premium: atm.cePremium, label: "ATM call short" },
        { optionType: "PE", side: "SELL", strike: atm.strike, premium: atm.pePremium, label: "ATM put short" }
      ]
    },
    {
      id: "short-strangle",
      title: "Short Strangle",
      summary: "OTM CE aur OTM PE sell karke wider range build karo.",
      estimatedCredit: nearCall.cePremium + nearPut.pePremium,
      legs: [
        { optionType: "CE", side: "SELL", strike: nearCall.strike, premium: nearCall.cePremium, label: "OTM call short" },
        { optionType: "PE", side: "SELL", strike: nearPut.strike, premium: nearPut.pePremium, label: "OTM put short" }
      ]
    },
    {
      id: "bear-call-spread",
      title: "Bear Call Spread",
      summary: "Call selling ke saath upper hedge auto add hota hai.",
      estimatedCredit: Math.max(0, atm.cePremium - nearCall.cePremium),
      legs: [
        { optionType: "CE", side: "SELL", strike: atm.strike, premium: atm.cePremium, label: "Short CE" },
        { optionType: "CE", side: "BUY", strike: nearCall.strike, premium: nearCall.cePremium, label: "Hedge CE buy" }
      ]
    },
    {
      id: "bull-put-spread",
      title: "Bull Put Spread",
      summary: "Put selling ke saath downside hedge bhi ready milega.",
      estimatedCredit: Math.max(0, atm.pePremium - nearPut.pePremium),
      legs: [
        { optionType: "PE", side: "SELL", strike: atm.strike, premium: atm.pePremium, label: "Short PE" },
        { optionType: "PE", side: "BUY", strike: nearPut.strike, premium: nearPut.pePremium, label: "Hedge PE buy" }
      ]
    },
    {
      id: "hedged-strangle",
      title: "Hedged Strangle",
      summary: "Sell call, buy higher call hedge, aur sell put ek saath place karo.",
      estimatedCredit: Math.max(0, nearCall.cePremium + nearPut.pePremium - farCall.cePremium),
      legs: [
        { optionType: "CE", side: "SELL", strike: nearCall.strike, premium: nearCall.cePremium, label: "Short CE" },
        { optionType: "CE", side: "BUY", strike: farCall.strike, premium: farCall.cePremium, label: "CE hedge buy" },
        { optionType: "PE", side: "SELL", strike: nearPut.strike, premium: nearPut.pePremium, label: "Short PE" }
      ]
    },
    {
      id: "iron-condor",
      title: "Iron Condor",
      summary: "Both side premium sell with call-put hedges for defined risk practice.",
      estimatedCredit: Math.max(0, nearCall.cePremium + nearPut.pePremium - farCall.cePremium - farPut.pePremium),
      legs: [
        { optionType: "CE", side: "SELL", strike: nearCall.strike, premium: nearCall.cePremium, label: "Short CE" },
        { optionType: "CE", side: "BUY", strike: farCall.strike, premium: farCall.cePremium, label: "Far CE hedge" },
        { optionType: "PE", side: "SELL", strike: nearPut.strike, premium: nearPut.pePremium, label: "Short PE" },
        { optionType: "PE", side: "BUY", strike: farPut.strike, premium: farPut.pePremium, label: "Far PE hedge" }
      ]
    }
  ];
}

function buildPriceLevels(entryPrice: number, side: TradeSide, instrument: TradeInstrument) {
  const risk = instrument === "OPTION" ? Math.max(6, entryPrice * 0.25) : Math.max(8, entryPrice * 0.004);
  const round = (value: number) => Number(Math.max(1, value).toFixed(2));

  if (side === "BUY") {
    return {
      stopLoss: round(entryPrice - risk),
      target1: round(entryPrice + risk * 1.2),
      target2: round(entryPrice + risk * 2),
      target3: round(entryPrice + risk * 3)
    };
  }

  return {
    stopLoss: round(entryPrice + risk),
    target1: round(entryPrice - risk * 1.2),
    target2: round(entryPrice - risk * 2),
    target3: round(entryPrice - risk * 3)
  };
}

function getBidAsk(price: number) {
  const spread = price > 1000 ? 0.5 : 0.05;
  return {
    bid: Number((price - spread).toFixed(2)),
    ask: Number((price + spread).toFixed(2))
  };
}

function getDefaultStrike(symbol: string) {
  const normalized = symbol.toUpperCase();

  if (normalized.includes("BANKNIFTY")) {
    return 52800;
  }

  if (normalized.includes("NIFTY")) {
    return 24500;
  }

  return 1000;
}

function getDefaultExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}
