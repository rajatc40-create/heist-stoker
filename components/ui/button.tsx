import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#2563EB] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#1d4ed8]",
        secondary: "bg-[#F8FAFC] text-[#111827] border border-[#E5E7EB] hover:-translate-y-0.5 hover:bg-[#EFF6FF]",
        outline: "border border-[#D1D5DB] bg-white text-[#111827] hover:-translate-y-0.5 hover:border-[#2563EB] hover:bg-[#EFF6FF]",
        ghost: "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]",
        destructive: "bg-[#DC2626] text-white hover:bg-[#b91c1c]",
        bullish: "bg-[#16A34A] text-white hover:bg-[#15803d]"
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5",
        icon: "size-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
