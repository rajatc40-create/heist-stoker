"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceBadge } from "@/components/ui/source-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function HighMoneyFlowBoard() {
  const [items, setItems] = useState<HighMoneyFlowItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/scanners/morning-breakfast", { cache: "no-store" });
        const payload = (await response.json()) as MorningBreakfastResponse;
        setItems(payload.highMoneyFlowItems);
        setMessage(payload.message ?? null);
      } catch (caught) {
        setItems([]);
        setMessage(caught instanceof Error ? caught.message : "High Money Flow scanner unavailable");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [refreshTick]);

  return (
    <Card className="border-gold/20 bg-black/35">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>High Money Flow</CardTitle>
            <SourceBadge source="NSE Official" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Top 10 positive NIFTY 50 pre-open stocks sorted by value in lakhs. Top 4 are highlighted.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Data may be delayed. Confirm before trade.</p>
        </div>
        <Button variant="outline" onClick={() => setRefreshTick((current) => current + 1)} disabled={isLoading}>
          <RefreshCcw />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {message && !items.length ? <p className="text-sm text-muted-foreground">{message}</p> : null}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.symbol}
              className="rounded-lg border border-gold/20 bg-gradient-to-br from-gold/12 to-black/30 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gold">#{item.rank}</p>
                <p className="text-sm font-semibold text-bullish">{formatPercent(item.percentChange)}</p>
              </div>
              <h3 className="mt-3 text-2xl font-black text-white">{item.symbol}</h3>
              <p className="mt-3 text-sm text-white/75">
                Value: <span className="font-semibold text-gold">{rupeeSymbol}{formatLakhs(item.valueLakhs)} Lakhs</span>
              </p>
              <p className="mt-1 text-sm text-white/75">
                Qty: <span className="font-semibold text-white">{formatQuantity(item.finalQuantity)}</span>
              </p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>% Change</TableHead>
              <TableHead>Value ({rupeeSymbol} Lakhs)</TableHead>
              <TableHead>Final Quantity</TableHead>
              <TableHead>IEP</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={`${item.rank}-${item.symbol}`} className={item.highlighted ? "bg-gold/5" : undefined}>
                <TableCell className="font-semibold text-gold">#{item.rank}</TableCell>
                <TableCell className="font-semibold text-white">{item.symbol}</TableCell>
                <TableCell className="text-bullish">{formatPercent(item.percentChange)}</TableCell>
                <TableCell className="text-gold">{rupeeSymbol}{formatLakhs(item.valueLakhs)} Lakhs</TableCell>
                <TableCell>{formatQuantity(item.finalQuantity)}</TableCell>
                <TableCell>{item.iep.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</TableCell>
                <TableCell className="min-w-[260px] text-muted-foreground">{item.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
