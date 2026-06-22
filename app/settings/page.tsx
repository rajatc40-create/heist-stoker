import { SettingsPanel } from "@/components/features/settings/settings-panel";
import { AppShell } from "@/components/layout/app-shell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Brand, theme, scanner, RSI, and channel configuration.">
      <SettingsPanel />
    </AppShell>
  );
}
