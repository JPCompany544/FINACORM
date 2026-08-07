"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/loader";

export const DashboardSkeletonPlaceholder: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse select-none">
      {/* Greeting skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 bg-muted/20" />
        <Skeleton className="h-4 w-72 bg-muted/15" />
      </div>

      {/* Main grids */}
      <div className="grid gap-6 laptop:grid-cols-4">
        {/* Left main area (3 columns) */}
        <div className="laptop:col-span-3 space-y-6">
          
          {/* Financial Overview skeleton */}
          <div className="rounded-custom-xl border border-border bg-surface p-6 space-y-4">
            <Skeleton className="h-4 w-28 bg-muted/20" />
            <Skeleton className="h-9 w-48 bg-muted/20" />
            <div className="grid gap-4 sm:grid-cols-3 pt-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-4 border border-border rounded-xl space-y-3">
                  <Skeleton className="h-4 w-20 bg-muted/20" />
                  <Skeleton className="h-6 w-24 bg-muted/15" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-muted/20" />
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="p-4 border border-border rounded-xl flex flex-col items-center justify-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full bg-muted/15" />
                  <Skeleton className="h-3 w-16 bg-muted/20" />
                </div>
              ))}
            </div>
          </div>

          {/* Cards carousel skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 bg-muted/20" />
            <div className="flex gap-4 overflow-x-hidden">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="w-72 h-44 rounded-custom-xl border border-border p-5 flex flex-col justify-between flex-shrink-0 bg-muted/5">
                  <Skeleton className="h-4 w-16 bg-muted/20" />
                  <Skeleton className="h-5 w-40 bg-muted/20" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right sidebar area (1 column) */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="rounded-custom-xl border border-border p-4 space-y-3.5 bg-muted/5">
              <Skeleton className="h-4 w-32 bg-muted/20" />
              <Skeleton className="h-12 w-full bg-muted/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
