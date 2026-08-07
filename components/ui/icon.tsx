import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: LucideIconComponent, size = "md", className, ...props }, ref) => {
    return (
      <LucideIconComponent
        ref={ref}
        className={cn(
          "shrink-0",
          size === "sm" && "h-4 w-4",
          size === "md" && "h-5 w-5",
          size === "lg" && "h-6 w-6",
          className
        )}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";
