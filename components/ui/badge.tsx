import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 select-none gap-1",
  {
    variants: {
      variant: {
        success: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success",
        pending: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:text-warning",
        failed: "bg-error/10 text-error border-error/20 dark:bg-error/20 dark:text-error",
        new: "bg-accent/10 text-accent-foreground border-accent/20 dark:bg-accent/25 dark:text-accent-foreground",
        premium: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground",
        verified: "bg-info/10 text-info border-info/20 dark:bg-info/20 dark:text-info",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "verified" && <ShieldCheck className="h-3 w-3 shrink-0" />}
      {children}
    </div>
  );
}
