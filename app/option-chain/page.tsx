import { OptionChainData } from "@/components/features/options/option-chain-data";
import { AppShell } from "@/components/layout/app-shell";

export default function OptionChainPage() {
  return (
    <AppShell title="Option Chain" subtitle="CE and PE premium view for NIFTY paper trading.">
      <OptionChainData />
    </AppShell>
  );
}
