import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "none";
}

export const Section: React.FC<SectionProps> = ({
  className,
  as: Component = "section",
  size = "md",
  ...props
}) => {
  return (
    <Component
      className={cn(
        size === "sm" && "py-8 tablet:py-12",
        size === "md" && "py-16 tablet:py-24",
        size === "lg" && "py-24 tablet:py-32",
        size === "none" && "py-0",
        className
      )}
      {...props}
    />
  );
};
