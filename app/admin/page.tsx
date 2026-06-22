import { AdminPanel } from "@/components/features/admin/admin-panel";
import { AppShell } from "@/components/layout/app-shell";

export default function AdminPage() {
  return (
    <AppShell title="Admin" subtitle="Add, remove, enable, disable, and tune scanner settings.">
      <AdminPanel />
    </AppShell>
  );
}
