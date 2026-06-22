import { ScannerBoard } from "@/components/features/scanner/scanner-board";
import { AppShell } from "@/components/layout/app-shell";

export default function ScannerPage() {
  return (
    <AppShell
      title="Scanner"
      subtitle={
        <>
          <span className="brand-inline">HEIST STOKER</span> scanner workspace with Chartink webhook alerts.
        </>
      }
    >
      <ScannerBoard />
    </AppShell>
  );
}
