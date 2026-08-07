"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type MotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-custom-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover focus-visible:ring-primary/50",
        secondary: "bg-accent text-accent-foreground shadow-soft hover:opacity-90 focus-visible:ring-accent/50",
        outline: "border border-border bg-surface text-foreground shadow-soft hover:bg-surface-hover hover:text-foreground focus-visible:ring-primary/20",
        ghost: "text-foreground hover:bg-surface-hover hover:text-foreground focus-visible:ring-primary/20",
        text: "text-primary hover:underline px-0 py-0 h-auto bg-transparent focus-visible:ring-primary/10 shadow-none hover:bg-transparent",
        danger: "bg-error text-error-foreground shadow-soft hover:bg-error/90 focus-visible:ring-error/50",
        success: "bg-success text-success-foreground shadow-soft hover:bg-success/90 focus-visible:ring-success/50",
      },
      size: {
        sm: "h-9 rounded-custom-md px-3 text-xs",
        md: "h-11 px-5 py-2.5 text-sm",
        lg: "h-12 rounded-custom-lg px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonBaseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof MotionProps
> & { children?: React.ReactNode };

export interface ButtonProps
  extends ButtonBaseProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, disabled, children, ...props }, ref) => {
    const isActuallyDisabled = disabled || isLoading;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isActuallyDisabled}
        whileTap={isActuallyDisabled ? undefined : { scale: 0.98 }}
        whileHover={isActuallyDisabled ? undefined : { scale: 1.01 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        {...(props as MotionProps)}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            {children}
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
