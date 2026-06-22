import { PremiumArea } from "@/components/features/premium/premium-area";
import { AppShell } from "@/components/layout/app-shell";

export default function PremiumPage() {
  return (
    <AppShell title="Premium" subtitle="Membership area for students and premium classroom access.">
      <PremiumArea />
    </AppShell>
  );
}
