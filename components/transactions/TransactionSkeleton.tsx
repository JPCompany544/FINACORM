"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const TransactionSkeleton: React.FC = () => {
  return (
    <div className="space-y-3" aria-label="Loading transactions" aria-busy="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-custom-xl border border-border bg-surface animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Avatar skeleton */}
          <div className="h-10 w-10 rounded-full bg-muted/20 shrink-0" />

          {/* Text lines */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-3 bg-muted/20 rounded w-2/5" />
            <div className="h-2.5 bg-muted/15 rounded w-1/3" />
          </div>

          {/* Amount + badge skeletons */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="h-3.5 bg-muted/20 rounded w-20" />
            <div className="h-2.5 bg-muted/15 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
