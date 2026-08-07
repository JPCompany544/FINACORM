"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const AccountFilters: React.FC<AccountFiltersProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const tabs = ["All", "Checking", "Savings", "Investments"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-border/40 pb-4 select-none">
      
      {/* ─── FILTER TABS ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-muted/10 border border-border/60 p-1 rounded-custom-xl shrink-0">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-custom-lg text-xs font-bold transition-all cursor-pointer outline-none",
                isActive
                  ? "bg-surface text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ─── SEARCH INPUT ───────────────────────────────────────────────────── */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search accounts name or number..."
          className="w-full bg-surface border border-border/80 hover:border-border rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
        />
      </div>

    </div>
  );
};
