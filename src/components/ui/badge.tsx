import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0F2C4C] text-white",
        secondary:
          "border-transparent bg-[#D96B27]/10 text-[#D96B27]",
        verified:
          "border border-[#C5A059]/30 bg-[#C5A059]/15 text-[#8C6D27] font-bold",
        outline:
          "text-[#0F2C4C] border border-[#0F2C4C]/20",
        success:
          "border-transparent bg-emerald-100 text-emerald-800",
        warning:
          "border-transparent bg-amber-100 text-amber-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
