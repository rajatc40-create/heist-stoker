"use client";

import { useEffect, useState } from "react";
import { Coffee, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { SourceBadge } from "@/components/ui/source-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { HighMoneyFlowItem, MorningBreakfastItem } from "@/types/platform";

interface MorningBreakfastResponse {
  items: MorningBreakfastItem[];
  highMoneyFlowItems: HighMoneyFlowItem[];
  updatedAt: string;
  source: "nse-official";
  message?: string;
}

const rupeeSymbol = "\u20B9";

function formatLakhs(value: number) {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatQuantity(value: number) {
  return value.toLocaleString("en-IN");
}

function formatSigned(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

export function MorningBreakfastBoard() {
  const [items, setItems] = useState<MorningBreakfastItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/scanners/morning-breakfast", { cache: "no-store" });
        const payload = (await response.json()) as MorningBreakfastResponse;
        setItems(payload.items);
        setUpdatedAt(payload.updatedAt);
        setMessage(payload.message ?? null);
      } catch (caught) {
        setItems([]);
        setMessage(caught instanceof Error ? caught.message : "Morning Breakfast scanner unavailable");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
    const interval = window.setInterval(() => setRefreshTick((current) => current + 1), 300000);

    return () => window.clearInterval(interval);
  }, [refreshTick]);

  return (
    <Card className="border-emerald-500/20 bg-black text-white">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Coffee className="size-5 text-emerald-400" />
            <CardTitle className="text-xl font-black tracking-normal text-emerald-50">MORNING BREAKFAST</CardTitle>
            <SourceBadge source="NSE Official" />
          </div>
          <p className="mt-2 text-sm text-white/65">
            HEIST STOKER official NSE pre-open scanner using weighted Morning Score for top NIFTY 50 candidates.
          </p>
          <p className="mt-1 text-xs text-white/45">Data may be delayed. Confirm before trade.</p>
        </div>
        <Button variant="outline" onClick={() => setRefreshTick((current) => current + 1)} disabled={isLoading}>
          <RefreshCcw />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
          <p className="text-white/72">
            Last refresh: <ClientTime value={updatedAt} format="time" fallback="waiting for NSE" />
          </p>
          <p className="text-white/52">Ranking = Change 30% + Value 50% + Quantity 20%</p>
        </div>

        {message && !items.length ? (
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">{message}</div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.symbol}
              className="rounded-xl border border-emerald-500/20 bg-[#07110b] p-4 shadow-[0_0_0_1px_rgba(34,197,94,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">#{item.rank}</p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight text-emerald-50">{item.symbol}</h3>
                </div>
                <Badge variant="bullish">{formatPercent(item.percentChange)}</Badge>
              </div>

              <div className="mt-5 grid gap-2 text-sm">
                <DataLine label="Prev Close" value={formatCurrency(item.prevClose)} />
                <DataLine label="IEP" value={formatCurrency(item.iep)} />
                <DataLine label="Change" value={formatSigned(item.change)} tone="positive" />
                <DataLine label="% Change" value={formatPercent(item.percentChange)} tone="positive" />
                <DataLine label="Value" value={`${rupeeSymbol}${formatLakhs(item.valueLakhs)} Lakhs`} tone="positive" />
                <DataLine label="Final Quantity" value={formatQuantity(item.finalQuantity)} />
                <DataLine label="Morning Score" value={item.morningScore.toFixed(2)} tone="positive" />
              </div>

              <p className="mt-4 text-xs leading-5 text-white/65">{item.reason}</p>
            </div>
          ))}
        </div>

        {!!items.length && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Prev Close</TableHead>
                <TableHead>IEP</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>% Change</TableHead>
                <TableHead>Value ({rupeeSymbol} Lakhs)</TableHead>
                <TableHead>Final Quantity</TableHead>
                <TableHead>Morning Score</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={`${item.rank}-${item.symbol}`} className="text-white/82">
                  <TableCell className="font-semibold text-emerald-400">#{item.rank}</TableCell>
                  <TableCell className="font-semibold text-white">{item.symbol}</TableCell>
                  <TableCell>{formatCurrency(item.prevClose)}</TableCell>
                  <TableCell>{formatCurrency(item.iep)}</TableCell>
                  <TableCell className="text-emerald-400">{formatSigned(item.change)}</TableCell>
                  <TableCell className="text-emerald-400">{formatPercent(item.percentChange)}</TableCell>
                  <TableCell className="text-emerald-400">{rupeeSymbol}{formatLakhs(item.valueLakhs)} Lakhs</TableCell>
                  <TableCell>{formatQuantity(item.finalQuantity)}</TableCell>
                  <TableCell className="text-emerald-400">{item.morningScore.toFixed(2)}</TableCell>
                  <TableCell className="min-w-[280px] text-white/70">{item.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function DataLine({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive";
}) {
  return (
    <div className="flex items-center justify-between rounded-md bg-black/30 px-3 py-2">
      <span className="text-white/65">{label}</span>
      <span className={tone === "positive" ? "font-semibold text-emerald-400" : "font-semibold text-emerald-50"}>
        {value}
      </span>
    </div>
  );
}
