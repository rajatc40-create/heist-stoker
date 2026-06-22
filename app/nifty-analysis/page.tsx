import { NiftyBankNiftyAnalysis } from "@/components/features/analysis/nifty-banknifty-analysis";
import { AppShell } from "@/components/layout/app-shell";

export default function NiftyAnalysisPage() {
  return (
    <AppShell title="Nifty Analysis" subtitle="NIFTY and BANKNIFTY analysis for paper trading preparation.">
      <NiftyBankNiftyAnalysis />
    </AppShell>
  );
}
