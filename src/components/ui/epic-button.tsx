import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";

const epicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        hero: "btn-hero",
        mystic: "btn-mystic",
        ghost: "bg-transparent text-foreground hover:bg-white/10 border border-white/20 hover:border-white/30",
        glow: "bg-gradient-primary text-white font-semibold animate-pulse-glow border border-white/30",
        outline: "border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 py-2 rounded-lg",
        lg: "h-12 px-6 py-3 rounded-xl text-lg",
        xl: "h-14 px-8 py-4 rounded-2xl text-xl"
      }
    },
    defaultVariants: {
      variant: "hero",
      size: "md"
    }
  }
);

export interface EpicButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof epicButtonVariants> {}

const EpicButton = forwardRef<HTMLButtonElement, EpicButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(epicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

EpicButton.displayName = "EpicButton";

export { EpicButton, epicButtonVariants };