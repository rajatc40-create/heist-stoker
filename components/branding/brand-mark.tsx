import { brand } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="grid size-11 place-items-center rounded-2xl border border-gold/50 bg-gold/10 text-sm font-black text-gold shadow-glow">
        HS
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="brand-sidebar-title truncate text-sm font-black tracking-[0.18em]">{brand.name}</p>
          <p className="truncate text-[10px] font-semibold tracking-[0.22em] text-gold">
            {brand.tagline}
          </p>
        </div>
      )}
    </div>
  );
}
