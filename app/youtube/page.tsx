import { YouTubeChannel } from "@/components/features/youtube/youtube-channel";
import { AppShell } from "@/components/layout/app-shell";

export default function YouTubePage() {
  return (
    <AppShell title="YouTube" subtitle={<><span className="brand-inline">HEIST STOKER</span> video hub.</>}>
      <YouTubeChannel />
    </AppShell>
  );
}
