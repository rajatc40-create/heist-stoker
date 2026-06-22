import { OptionStrategyTools } from "@/components/features/options/option-strategy-tools";
import { AppShell } from "@/components/layout/app-shell";

export default function OptionStrategyToolsPage() {
  return (
    <AppShell
      title="Option Strategy Tools"
      subtitle="Iron Condor, Iron Fly, Bull Put Spread, and paper-mode option selling practice."
    >
      <OptionStrategyTools />
    </AppShell>
  );
}
