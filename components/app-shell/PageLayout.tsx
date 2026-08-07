"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── PAGECONTAINER ────────────────────────────────────────────────────────────

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "max-w-[1600px] w-full mx-auto px-4 sm:px-6 laptop:px-8 py-6 laptop:py-8 space-y-6 laptop:space-y-8 flex flex-col flex-1 min-h-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── PAGEHEADER ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/10 pb-4 shrink-0 select-none",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-xl laptop:text-2xl font-black text-foreground tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs laptop:text-sm font-semibold text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {secondaryAction}
          {primaryAction}
        </div>
      )}
    </div>
  );
};

// ─── PAGEBODY ─────────────────────────────────────────────────────────────────

interface PageBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageBody: React.FC<PageBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
};
