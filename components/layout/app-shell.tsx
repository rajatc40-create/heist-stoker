import type { ReactNode } from "react";
import { Bell, Radio, Search } from "lucide-react";
import { BrandMark } from "@/components/branding/brand-mark";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <MobileNav />
        <header className="flex flex-col gap-4 border-b border-white/10 bg-black/45 p-4 backdrop-blur md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-center gap-4">
            <BrandMark compact className="lg:hidden" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-normal text-white">{title}</h2>
                <Badge variant="bullish">
                  <Radio className="mr-1 size-3" />
                  Live Feed
                </Badge>
                <Badge variant="outline">Paper Mode</Badge>
              </div>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 md:w-auto">
            <div className="relative min-w-0 flex-1 md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search symbol, setup, scanner" />
            </div>
            <Button size="icon" variant="outline" aria-label="Notifications">
              <Bell />
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-6">
          {children}
          <div className="mt-6 rounded-lg border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-white/80">
            HEIST STOKER is for education, scanner practice and paper trading. This is not investment advice. Confirm with
            your own analysis before trading.
          </div>
        </div>
      </main>
    </div>
  );
}
