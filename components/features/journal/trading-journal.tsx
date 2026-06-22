"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ImageUp, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientTime } from "@/components/ui/client-time";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTradingStore } from "@/store/trading-store";

const emptyJournalDraft = {
  tradeId: "",
  symbol: "NIFTY",
  tradeNotes: "",
  mistake: "",
  lessonLearned: "",
  psychologyNotes: "",
  screenshotName: ""
};

export function TradingJournal() {
  const { journalEntries, addJournalEntry } = useTradingStore();
  const [draft, setDraft] = useState(emptyJournalDraft);

  return (
    <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
      <Card className="border-gold/20 bg-black/35">
        <CardHeader>
          <CardTitle>Journal Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Symbol">
            <Input
              value={draft.symbol}
              onChange={(event) => setDraft((current) => ({ ...current, symbol: event.target.value.toUpperCase() }))}
            />
          </Field>
          <Field label="Trade Notes">
            <Textarea
              value={draft.tradeNotes}
              onChange={(event) => setDraft((current) => ({ ...current, tradeNotes: event.target.value }))}
            />
          </Field>
          <Field label="Mistake">
            <Textarea
              value={draft.mistake}
              onChange={(event) => setDraft((current) => ({ ...current, mistake: event.target.value }))}
            />
          </Field>
          <Field label="Lesson Learned">
            <Textarea
              value={draft.lessonLearned}
              onChange={(event) => setDraft((current) => ({ ...current, lessonLearned: event.target.value }))}
            />
          </Field>
          <Field label="Psychology Notes">
            <Textarea
              value={draft.psychologyNotes}
              onChange={(event) => setDraft((current) => ({ ...current, psychologyNotes: event.target.value }))}
            />
          </Field>
          <Field label="Screenshot Upload">
            <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gold/35 bg-gold/5 text-sm font-semibold text-gold">
              <ImageUp className="size-4" />
              {draft.screenshotName || "Upload screenshot"}
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    screenshotName: event.target.files?.[0]?.name ?? ""
                  }))
                }
              />
            </label>
          </Field>
          <Button
            className="w-full"
            onClick={() => {
              addJournalEntry({ ...draft, tradeId: draft.tradeId || undefined });
              setDraft(emptyJournalDraft);
            }}
          >
            <Plus />
            Add Journal Entry
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/35">
        <CardHeader>
          <CardTitle>Review Log</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {journalEntries.map((entry) => (
            <article key={entry.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{entry.symbol}</h3>
                  <p className="text-xs text-muted-foreground">
                    <ClientTime value={entry.createdAt} />
                  </p>
                </div>
                {entry.screenshotName && <Badge>{entry.screenshotName}</Badge>}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <JournalBlock title="Trade Notes" value={entry.tradeNotes} />
                <JournalBlock title="Mistake" value={entry.mistake} />
                <JournalBlock title="Lesson Learned" value={entry.lessonLearned} />
                <JournalBlock title="Psychology Notes" value={entry.psychologyNotes} />
              </div>
            </article>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function JournalBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white">{value || "Pending review"}</p>
    </div>
  );
}
