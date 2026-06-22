"use client";

import { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockMarketData } from "@/lib/mock-market-data";
import { formatPercent } from "@/lib/utils";
import { useTradingStore } from "@/store/trading-store";

export function WatchlistManager() {
  const { watchlists, createWatchlist, addSymbolToWatchlist, removeSymbolFromWatchlist } = useTradingStore();
  const [newWatchlistName, setNewWatchlistName] = useState("Intraday Liquidity");
  const [symbolInputs, setSymbolInputs] = useState<Record<string, string>>({});

  return (
    <div className="grid gap-4">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <CardTitle>Create Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="watchlist-name">Watchlist Name</Label>
            <Input
              id="watchlist-name"
              value={newWatchlistName}
              onChange={(event) => setNewWatchlistName(event.target.value)}
            />
          </div>
          <Button
            className="sm:self-end"
            onClick={() => {
              if (newWatchlistName.trim()) {
                createWatchlist(newWatchlistName.trim());
                setNewWatchlistName("");
              }
            }}
          >
            <Plus />
            Create
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {watchlists.map((watchlist) => (
          <Card key={watchlist.id} className="border-white/10 bg-black/35">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Star className="size-4 text-gold" />
                  {watchlist.name}
                </CardTitle>
                <Badge variant="secondary">{watchlist.symbols.length} symbols</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add symbol"
                  value={symbolInputs[watchlist.id] ?? ""}
                  onChange={(event) =>
                    setSymbolInputs((current) => ({ ...current, [watchlist.id]: event.target.value.toUpperCase() }))
                  }
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const symbol = symbolInputs[watchlist.id]?.trim();
                    if (symbol) {
                      addSymbolToWatchlist(watchlist.id, symbol);
                      setSymbolInputs((current) => ({ ...current, [watchlist.id]: "" }));
                    }
                  }}
                >
                  <Plus />
                  Add
                </Button>
              </div>

              <div className="grid gap-2">
                {watchlist.symbols.map((symbol) => {
                  const asset = mockMarketData.find((item) => item.symbol === symbol);
                  return (
                    <div
                      key={symbol}
                      className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset ? `${asset.assetClass} • ${asset.price.toLocaleString()}` : "Custom symbol"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {asset && (
                          <Badge variant={asset.changePercent >= 0 ? "bullish" : "bearish"}>
                            {formatPercent(asset.changePercent)}
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${symbol}`}
                          onClick={() => removeSymbolFromWatchlist(watchlist.id, symbol)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
