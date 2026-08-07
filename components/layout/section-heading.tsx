"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/ui/animations";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  className?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: "success" | "pending" | "failed" | "new" | "premium";
  align?: "left" | "center" | "right";
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  title,
  subtitle,
  badgeText,
  badgeVariant = "new",
  align = "center",
  id,
}) => {
  return (
    <FadeUp
      id={id}
      className={cn(
        "flex flex-col space-y-4 mb-12",
        align === "left" && "items-start text-left",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        className
      )}
    >
      {badgeText && (
        <Badge variant={badgeVariant} className="px-3 py-1 text-xs">
          {badgeText}
        </Badge>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground tablet:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-base tablet:text-lg text-muted-foreground font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </FadeUp>
  );
};
