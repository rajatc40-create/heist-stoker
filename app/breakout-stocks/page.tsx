import { BreakoutStocksSection } from "@/components/features/breakouts/breakout-stocks-section";
import { AppShell } from "@/components/layout/app-shell";

export default function BreakoutStocksPage() {
  return (
    <AppShell title="Breakout Stocks" subtitle="Momentum and breakout candidates from scanner logic.">
      <BreakoutStocksSection />
    </AppShell>
  );
}
