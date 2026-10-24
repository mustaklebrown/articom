import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#D96B27] text-white hover:bg-[#c45c1c] shadow-sm hover:shadow",
        primary:
          "bg-[#0F2C4C] text-white hover:bg-[#183e68] shadow-sm hover:shadow",
        outline:
          "border border-[#0F2C4C]/20 bg-transparent text-[#0F2C4C] hover:bg-[#0F2C4C]/5",
        secondary:
          "bg-[#0F2C4C]/10 text-[#0F2C4C] hover:bg-[#0F2C4C]/15",
        ghost:
          "hover:bg-[#0F2C4C]/5 text-[#0F2C4C]",
        gold:
          "bg-[#C5A059] text-white hover:bg-[#b08d44] shadow-sm",
        whatsapp:
          "bg-[#25D366] text-white hover:bg-[#20ba59] shadow-sm hover:shadow",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-bold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
