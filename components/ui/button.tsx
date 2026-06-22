import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#315ECA] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#284fb0]",
        secondary: "bg-[#F7F3EA] text-[#1F2937] border border-[#E7E1D6] hover:-translate-y-0.5 hover:bg-white",
        outline: "border border-[#D9D2C3] bg-white text-[#1F2937] hover:-translate-y-0.5 hover:border-[#315ECA] hover:bg-[#F5F8FF]",
        ghost: "text-[#6B7280] hover:bg-[#F3EEE5] hover:text-[#1F2937]",
        destructive: "bg-[#DC2626] text-white hover:bg-[#b91c1c]",
        bullish: "bg-[#2F855A] text-white hover:bg-[#276749]"
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
