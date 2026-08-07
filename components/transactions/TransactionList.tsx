"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RichTransaction } from "@/constants/mock-transactions";
import type { TransactionFiltersState } from "./TransactionFilters";
import { TransactionCard } from "./TransactionCard";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { useAuth, createBrowserClient } from "@/lib/supabase";

interface TransactionListProps {
  transactions: RichTransaction[];
  isLoading: boolean;
  filters: TransactionFiltersState;
  onSelectTransaction: (tx: RichTransaction) => void;
  accountId?: string;
}

function applyFilters(
  txs: RichTransaction[],
  filters: TransactionFiltersState
): RichTransaction[] {
  let result = [...txs];

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (tx) =>
        tx.merchant.toLowerCase().includes(q) ||
        tx.referenceNumber.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        Math.abs(tx.amount).toString().includes(q) ||
        tx.transactionId.toLowerCase().includes(q)
    );
  }

  // Type
  if (filters.type !== "all") {
    result = result.filter((tx) => tx.type === filters.type);
  }

  // Status
  if (filters.status !== "all") {
    result = result.filter((tx) => tx.status === filters.status);
  }

  // Direction
  if (filters.direction !== "all") {
    result = result.filter((tx) => tx.direction === filters.direction);
  }

  // Amount range
  if (filters.amountMin !== "") {
    const min = parseFloat(filters.amountMin);
    if (!isNaN(min)) result = result.filter((tx) => Math.abs(tx.amount) >= min);
  }
  if (filters.amountMax !== "") {
    const max = parseFloat(filters.amountMax);
    if (!isNaN(max)) result = result.filter((tx) => Math.abs(tx.amount) <= max);
  }

  // Sort
  switch (filters.sortBy) {
    case "newest":
      result.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
      break;
    case "oldest":
      result.sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
      break;
    case "highest":
      result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
      break;
    case "lowest":
      result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
      break;
  }

  return result;
}

// Group transactions by date label
function groupByDate(txs: RichTransaction[]): Array<{ label: string; items: RichTransaction[] }> {
  const groups: Record<string, RichTransaction[]> = {};
  for (const tx of txs) {
    if (!groups[tx.date]) groups[tx.date] = [];
    groups[tx.date].push(tx);
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading,
  filters,
  onSelectTransaction,
}) => {

  const filtered = React.useMemo(
    () => applyFilters(transactions, filters),
    [transactions, filters]
  );

  const grouped = React.useMemo(() => groupByDate(filtered), [filtered]);

  if (isLoading) return <TransactionSkeleton />;

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-16 space-y-4 rounded-custom-xl border border-dashed border-border bg-surface/40"
        role="status"
        aria-label="No transactions found"
      >
        <div className="p-4 rounded-full bg-muted/10 border border-border/60 text-muted-foreground">
          <ArrowLeftRight className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-extrabold text-foreground">No Transactions Found</h4>
          <p className="text-xs font-semibold text-text-secondary max-w-xs">
            No transactions match your current search or filter criteria. Try adjusting your filters.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6" role="list" aria-label="Transaction history">
      <AnimatePresence mode="popLayout">
        {grouped.map((group) => (
          <motion.section
            key={group.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            aria-label={`Transactions on ${group.label}`}
          >
            {/* Date group header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                {group.label}
              </span>
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap">
                {group.items.length} transaction{group.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Cards in this date group */}
            <div className="space-y-2" role="list">
              {group.items.map((tx, i) => (
                <div key={tx.id} role="listitem">
                  <TransactionCard
                    transaction={tx}
                    onSelect={onSelectTransaction}
                    index={i}
                  />
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </AnimatePresence>
    </div>
  );
};
