"use client";

import * as React from "react";

export const StatementSkeleton: React.FC = () => (
  <div className="space-y-3" aria-label="Loading statements" aria-busy="true">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 p-5 rounded-custom-xl border border-border bg-surface animate-pulse"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        {/* Icon placeholder */}
        <div className="h-12 w-12 rounded-xl bg-muted/20 shrink-0" />

        {/* Text lines */}
        <div className="flex-1 space-y-2.5 min-w-0">
          <div className="h-3.5 bg-muted/20 rounded w-3/5" />
          <div className="h-2.5 bg-muted/15 rounded w-2/5" />
          <div className="h-2 bg-muted/10 rounded w-1/4 mt-1" />
        </div>

        {/* Actions skeleton */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-20 bg-muted/15 rounded-custom-md" />
          <div className="h-7 w-24 bg-muted/20 rounded-custom-md" />
        </div>
      </div>
    ))}
  </div>
);
