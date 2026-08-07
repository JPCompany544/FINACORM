"use client";

import * as React from "react";
import { MOCK_CARD_TRANSACTIONS, CardTransaction } from "@/constants/mock-card-transactions";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Search, X, FolderOpen, Calendar, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/components/app-shell";

interface CardActivityProps {
  cardId: string;
}

export const CardActivity: React.FC<CardActivityProps> = ({ cardId }) => {
  const { info } = useToast();
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  const filtered = React.useMemo(() => {
    return MOCK_CARD_TRANSACTIONS.filter((tx) => {
      if (tx.cardId !== cardId) return false;
      
      const matchSearch = tx.merchant.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || tx.category === categoryFilter;

      return matchSearch && matchCat;
    });
  }, [cardId, search, categoryFilter]);

  const handleTxClick = (tx: CardTransaction) => {
    info(
      "Transaction details",
      `Merchant: ${tx.merchant}\nValue: ${formatCurrency(Math.abs(tx.amount))}\nStatus: ${tx.status}`
    );
  };

  const categories = ["all", "Shopping", "Food & Drink", "Subscriptions", "Travel", "Utilities", "Other"];

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-border/40 pb-4 select-none">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search card transactions..."
            aria-label="Search card transactions"
            className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="relative">
          <select
            aria-label="Filter category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-surface border border-border/85 rounded-custom-lg pl-3 pr-8 py-1.5 text-xs font-bold text-foreground cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
          <FolderOpen className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="rounded-custom-xl border border-border bg-surface overflow-hidden shadow-soft">
          {filtered.map((tx, idx) => (
            <button
              key={tx.id}
              onClick={() => handleTxClick(tx)}
              className={cn(
                "w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover/30 transition-colors select-none group outline-none focus-visible:ring-1 focus-visible:ring-primary/20",
                idx < filtered.length - 1 && "border-b border-border/40"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: tx.merchantColor }}
                >
                  {tx.merchantInitials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {tx.merchant}
                  </h4>
                  <p className="text-[10px] font-semibold text-text-secondary mt-0.5 leading-none">
                    {tx.category} · {tx.date}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 space-y-1">
                <span className="text-xs font-black text-foreground block tracking-tight leading-none">
                  {formatCurrency(tx.amount)}
                </span>
                <span className="text-[8px] font-black uppercase text-success tracking-wider block leading-none">
                  {tx.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-border rounded-custom-xl bg-surface/50 select-none">
          <FolderOpen className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <h4 className="text-xs font-bold text-foreground mb-1">No Transactions Found</h4>
          <p className="text-[10px] text-text-secondary">No recorded card transactions match your filter query.</p>
        </div>
      )}
    </div>
  );
};
