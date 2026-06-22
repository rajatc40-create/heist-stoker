"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { availableScanners } from "@/lib/constants";

export function AdminPanel() {
  const [scanners, setScanners] = useState(availableScanners);
  const [newScannerName, setNewScannerName] = useState("Custom Liquidity Model");
  const disabledScanners = scanners.filter((scanner) => !scanner.enabled);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card className="border-gold/20 bg-black/35">
          <CardHeader>
            <CardTitle>Add Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="scanner-name">Scanner Name</Label>
              <Input
                id="scanner-name"
                value={newScannerName}
                onChange={(event) => setNewScannerName(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!newScannerName.trim()) {
                  return;
                }

                setScanners((current) => [
                  {
                    id: newScannerName.toLowerCase().replace(/\s+/g, "-"),
                    name: newScannerName,
                    category: "Liquidity",
                    enabled: true,
                    description: "Admin-created scanner placeholder."
                  },
                  ...current
                ]);
                setNewScannerName("");
              }}
            >
              <Plus />
              Add Scanner
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/35">
          <CardHeader>
            <CardTitle>Scanner Controls</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {scanners.map((scanner) => (
              <div key={scanner.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{scanner.name}</p>
                      <Badge variant={scanner.enabled ? "bullish" : "outline"}>
                        {scanner.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      {!scanner.enabled ? <Badge variant="secondary">Coming Soon</Badge> : null}
                      <Badge variant="secondary">{scanner.category}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{scanner.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={scanner.enabled}
                      onCheckedChange={(checked) =>
                        setScanners((current) =>
                          current.map((item) => (item.id === scanner.id ? { ...item, enabled: checked } : item))
                        )
                      }
                      aria-label={`Toggle ${scanner.name}`}
                    />
                    <Button size="icon" variant="ghost" aria-label="Edit scanner">
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remove scanner"
                      onClick={() => setScanners((current) => current.filter((item) => item.id !== scanner.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <CardTitle>Coming Soon Scanners</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {disabledScanners.map((scanner) => (
            <div key={scanner.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-white">{scanner.name}</p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{scanner.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
