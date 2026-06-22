"use client";

import Link from "next/link";
import { DatabaseBackup, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { useTradingStore } from "@/store/trading-store";

export function AutosaveStatus() {
  const { hasHydrated, lastSavedAt, trades, watchlists, journalEntries } = useTradingStore();

  return (
    <Card className="border-bullish/20 bg-bullish/10">
      <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-md border border-bullish/30 bg-black/35 text-bullish">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-white">Autosave protection</p>
              <Badge variant={hasHydrated ? "bullish" : "outline"}>{hasHydrated ? "On" : "Loading"}</Badge>
            </div>
            <p className="mt-1 text-sm leading-6 text-white/68">
              {trades.length} trades, {watchlists.length} watchlists, and {journalEntries.length} journal entries are saved in this browser.
              {lastSavedAt ? (
                <>
                  {" "}
                  Last saved <ClientTime value={lastSavedAt} format="time" />.
                </>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/settings">
            <DatabaseBackup />
            Export Backup
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
