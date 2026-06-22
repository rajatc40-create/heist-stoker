import { TradingJournal } from "@/components/features/journal/trading-journal";
import { AppShell } from "@/components/layout/app-shell";

export default function TradingJournalPage() {
  return (
    <AppShell title="Trading Journal" subtitle="Capture trade notes, mistakes, lessons, psychology, and screenshots.">
      <TradingJournal />
    </AppShell>
  );
}
