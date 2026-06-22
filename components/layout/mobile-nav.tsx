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
    <div className="sticky top-0 z-30 border-b border-white/10 bg-black/90 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <BrandMark compact />
        <Button size="icon" variant="outline" aria-label="Open navigation" onClick={() => setOpen((current) => !current)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <div className="mt-3 grid gap-2 rounded-lg border border-white/10 bg-black/95 p-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm font-semibold text-muted-foreground",
                  active && "border-gold/40 bg-gold/10 text-gold"
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
