"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/branding/brand-mark";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-[#334155] bg-[#0b1220]/95 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <BrandMark compact />
        <Button size="icon" variant="outline" aria-label="Open navigation" onClick={() => setOpen((current) => !current)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <div className="mt-3 grid gap-2 rounded-xl border border-[#334155] bg-[#0f172a] p-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border border-[#334155] px-3 text-sm font-semibold text-slate-400",
                  active && "border-[#3B82F6]/35 bg-[#172554] text-slate-50"
                )}
              >
                <Icon className="size-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
