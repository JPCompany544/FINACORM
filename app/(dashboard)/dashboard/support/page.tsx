"use client";

import * as React from "react";
import { loadTawkSupport } from "@/lib/tawk";

export default function SupportCenterPage() {
  React.useEffect(() => {
    loadTawkSupport();
  }, []);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-semibold text-muted-foreground">Opening secure chat concierge…</span>
      </div>
    </div>
  );
}
