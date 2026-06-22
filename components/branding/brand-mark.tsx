import { brand } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="grid size-10 place-items-center rounded-xl border border-[#D5C7A2] bg-[#FFF7E6] text-sm font-black text-[#C98A1A] shadow-[0_8px_18px_rgba(201,138,26,0.12)]">
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
