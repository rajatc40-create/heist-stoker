import { CommunityLinks } from "@/components/features/community/community-links";
import { AppShell } from "@/components/layout/app-shell";

export default function CommunityPage() {
  return (
    <AppShell title="Community" subtitle="Telegram, WhatsApp, and YouTube community links.">
      <CommunityLinks />
    </AppShell>
  );
}
