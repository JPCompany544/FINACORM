import * as React from "react";
import { cn } from "@/lib/utils";

// --- Spinner Component ---
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = "md", ...props }) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-primary border-t-transparent shrink-0",
        size === "sm" && "h-4 w-4",
        size === "md" && "h-6 w-6",
        size === "lg" && "h-8 w-8",
        className
      )}
      {...props}
    />
  );
};

// --- Basic Skeleton Component ---
export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded bg-muted/20 dark:bg-muted/10", className)}
      {...props}
    />
  );
};

// --- Card Skeleton Component ---
export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-custom-lg border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-custom-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};

// --- Table Skeleton Component ---
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full rounded-custom-lg border border-border bg-surface overflow-hidden">
      <div className="h-11 bg-muted/5 border-b border-border flex items-center px-6 gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 px-6 flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Dashboard Skeleton Component ---
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 mobile:grid-cols-2 laptop:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
      <div className="grid gap-6 laptop:grid-cols-3">
        <div className="laptop:col-span-2">
          <TableSkeleton rows={3} />
        </div>
        <div className="rounded-custom-lg border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full rounded-custom-md" />
        </div>
      </div>
    </div>
  );
};
