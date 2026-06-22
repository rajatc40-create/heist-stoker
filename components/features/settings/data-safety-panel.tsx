"use client";

import { ChangeEvent, useRef, useState } from "react";
import { DatabaseBackup, Download, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { useTradingStore } from "@/store/trading-store";
import type { JournalEntry, Trade, Watchlist } from "@/types/platform";

interface BackupPayload {
  app: "HEIST STOKER";
  version: 1;
  exportedAt: string;
  trades: Trade[];
  watchlists: Watchlist[];
  journalEntries: JournalEntry[];
}

export function DataSafetyPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trades, watchlists, journalEntries, lastSavedAt, hasHydrated, replaceSavedData } = useTradingStore();
  const [importMessage, setImportMessage] = useState<string | null>(null);

  function exportBackup() {
    const payload: BackupPayload = {
      app: "HEIST STOKER",
      version: 1,
      exportedAt: new Date().toISOString(),
      trades,
      watchlists,
      journalEntries
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `heist-stoker-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const payload = JSON.parse(await file.text()) as Partial<BackupPayload>;
      replaceSavedData({
        trades: Array.isArray(payload.trades) ? payload.trades : undefined,
        watchlists: Array.isArray(payload.watchlists) ? payload.watchlists : undefined,
        journalEntries: Array.isArray(payload.journalEntries) ? payload.journalEntries : undefined
      });
      setImportMessage("Backup imported and saved in this browser.");
    } catch {
      setImportMessage("Backup file could not be imported.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <Card className="max-w-3xl border-bullish/20 bg-black/35">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>Data Safety</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Autosave protects paper trades, watchlists, and journal entries.</p>
        </div>
        <Badge variant={hasHydrated ? "bullish" : "outline"}>
          <ShieldCheck className="mr-1 size-3" />
          {hasHydrated ? "Autosave On" : "Loading Save"}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          <SaveMetric label="Trades" value={trades.length.toString()} />
          <SaveMetric label="Watchlists" value={watchlists.length.toString()} />
          <SaveMetric label="Journal Entries" value={journalEntries.length.toString()} />
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Last browser save</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {lastSavedAt ? <ClientTime value={lastSavedAt} /> : "No manual trade/watchlist/journal save yet"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={exportBackup}>
                <Download />
                Export Backup
              </Button>
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload />
                Import Backup
              </Button>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="application/json" className="sr-only" onChange={importBackup} />
          {importMessage && <p className="mt-3 text-xs text-gold">{importMessage}</p>}
        </div>

        <div className="flex gap-3 rounded-md border border-gold/25 bg-gold/10 p-4">
          <DatabaseBackup className="mt-0.5 size-5 shrink-0 text-gold" />
          <p className="text-sm leading-6 text-white/72">
            This saves in the same browser on this computer. For extra safety during power cuts, click
            Export Backup at the end of each day and keep the downloaded JSON file.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SaveMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
