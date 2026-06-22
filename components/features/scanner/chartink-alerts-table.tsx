"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, RefreshCcw, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { SourceBadge } from "@/components/ui/source-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ChartinkAlert } from "@/types/platform";

interface ChartinkAlertsResponse {
  alerts: ChartinkAlert[];
  updatedAt: string;
}

export function ChartinkAlertsTable() {
  const [alerts, setAlerts] = useState<ChartinkAlert[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const latestAlertId = alerts[0]?.id;
  const latestTriggeredAt = alerts[0]?.triggeredAt;
  const headline = useMemo(() => {
    if (!alerts.length) {
      return "Waiting for Chartink alerts";
    }

    return `${alerts.length} recent alerts`;
  }, [alerts.length]);

  async function loadAlerts() {
    try {
      const response = await fetch("/api/chartink-alerts?limit=50", { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Chartink feed returned ${response.status}`);
      }

      const payload = (await response.json()) as ChartinkAlertsResponse;
      setAlerts(payload.alerts);
      setLastUpdatedAt(payload.updatedAt);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chartink live alerts unavailable");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadAlerts();
    const interval = window.setInterval(() => void loadAlerts(), 4000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Card className="border-gold/20 bg-black/35">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>
              <span className="brand-inline">HEIST STOKER</span> Chartink Alerts
            </CardTitle>
            <SourceBadge source="Chartink Alert" />
            <Badge variant={error ? "bearish" : "bullish"}>
              <Radio className="mr-1 size-3" />
              {error ? "Disconnected" : "Live"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {headline}
            {latestTriggeredAt ? (
              <>
                {" "}
                - latest <ClientTime value={latestTriggeredAt} format="time" />
              </>
            ) : null}
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadAlerts()} disabled={isLoading}>
          <RefreshCcw />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-sm text-bearish">{error}</p>}
        <p className="mb-3 text-xs text-muted-foreground">Data may be delayed. Confirm before trade.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stock</TableHead>
              <TableHead>Trigger Price</TableHead>
              <TableHead>Scan Name</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length ? (
              alerts.map((alert) => (
                <TableRow key={alert.id} className={alert.id === latestAlertId ? "bg-gold/5" : undefined}>
                  <TableCell className="font-bold text-white">{alert.stock}</TableCell>
                  <TableCell>
                    {alert.triggerPrice === null
                      ? "-"
                      : alert.triggerPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-[220px]">
                      <p className="font-semibold text-white">{alert.scanName}</p>
                      {alert.alertName && <p className="mt-1 text-xs text-muted-foreground">{alert.alertName}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ClientTime value={alert.triggeredAt} format="time" />
                  </TableCell>
                  <TableCell>
                    {alert.scanUrl ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={alert.scanUrl} target="_blank" rel="noreferrer">
                          <ArrowUpRight />
                          Open Scan
                        </a>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="secondary">
                        <Link href="/demo-trading">Demo Trade</Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No Chartink alerts received yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="mt-3 text-xs text-muted-foreground">
          Last checked: <ClientTime value={lastUpdatedAt} format="time" fallback="waiting" />
        </p>
      </CardContent>
    </Card>
  );
}
