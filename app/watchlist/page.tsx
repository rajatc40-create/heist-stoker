import { WatchlistManager } from "@/components/features/watchlist/watchlist-manager";
import { AppShell } from "@/components/layout/app-shell";

export default function WatchlistPage() {
  return (
    <AppShell title="Watchlist" subtitle="Create lists, add symbols, and track focus assets.">
      <WatchlistManager />
    </AppShell>
  );
}
