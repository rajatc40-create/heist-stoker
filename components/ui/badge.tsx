import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-gold/40 bg-gold/10 text-gold",
        secondary: "border-white/10 bg-white/8 text-white",
        bullish: "border-bullish/40 bg-bullish/10 text-bullish",
        bearish: "border-bearish/40 bg-bearish/10 text-bearish",
        outline: "text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
