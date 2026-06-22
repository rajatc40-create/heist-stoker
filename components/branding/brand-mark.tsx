import { brand } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="grid size-10 place-items-center rounded-xl border border-[#F59E0B]/45 bg-[#F59E0B]/10 text-sm font-black text-[#F59E0B] shadow-[0_10px_24px_rgba(245,158,11,0.12)]">
        HS
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "brand-sidebar-title truncate font-black leading-none",
            compact ? "text-xs tracking-[0.16em]" : "text-sm tracking-[0.18em]"
          )}
        >
          {brand.name}
        </p>
        {!compact ? (
          <p className="mt-1 truncate text-[10px] font-semibold tracking-[0.22em] text-gold">{brand.tagline}</p>
        ) : null}
      </div>
    </div>
  );
}
