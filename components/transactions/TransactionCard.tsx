"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { RichTransaction } from "@/constants/mock-transactions";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

interface TransactionCardProps {
  transaction: RichTransaction;
  onSelect: (tx: RichTransaction) => void;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Income": "bg-success/10 text-success",
  "Subscriptions": "bg-primary/10 text-primary",
  "Food & Drink": "bg-warning/10 text-warning",
  "Food Delivery": "bg-warning/10 text-warning",
  "Electronics": "bg-info/10 text-info",
  "Groceries": "bg-success/10 text-success",
  "Transfers": "bg-accent/10 text-accent",
  "Investment Returns": "bg-primary/10 text-primary",
  "Travel": "bg-info/10 text-info",
  "Utilities": "bg-warning/10 text-warning",
  "Transport": "bg-foreground/10 text-foreground",
  "Refunds": "bg-success/10 text-success",
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction: tx,
  onSelect,
  index,
}) => {
  const isCredit = tx.direction === "credit";
  const categoryColor = CATEGORY_COLORS[tx.category] ?? "bg-muted/10 text-muted-foreground";
  const Icon = tx.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <button
        onClick={() => onSelect(tx)}
        className="w-full text-left flex items-center gap-4 p-4 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-soft transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
        aria-label={`${tx.merchant} — ${isCredit ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)} — ${tx.status}`}
      >
        {/* ─── MERCHANT AVATAR ──────────────────────────────────────────────── */}
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0 transition-transform group-hover:scale-105"
          style={{ backgroundColor: tx.merchantColor }}
          aria-hidden="true"
        >
          {tx.merchantInitials}
        </div>

        {/* ─── MAIN INFO ────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
              {tx.merchant}
            </h4>
            <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider", categoryColor)}>
              {tx.category}
            </span>
          </div>
          <p className="text-[10px] font-semibold text-text-secondary mt-0.5 truncate">
            {tx.description}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-[9px] font-bold text-muted-foreground">
              {tx.date} at {tx.time}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground font-mono">
              Ref: {tx.referenceNumber}
            </span>
          </div>
        </div>

        {/* ─── AMOUNT + STATUS ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Amount with direction indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "p-0.5 rounded-full",
                isCredit ? "bg-success/10 text-success" : "bg-error/10 text-error"
              )}
              aria-hidden="true"
            >
              {isCredit ? (
                <ArrowDownLeft className="h-3 w-3" />
              ) : (
                <ArrowUpRight className="h-3 w-3" />
              )}
            </div>
            <span
              className={cn(
                "text-sm font-black tracking-tight",
                isCredit ? "text-success" : "text-error"
              )}
            >
              {isCredit ? "+" : "−"}
              {formatCurrency(Math.abs(tx.amount))}
            </span>
          </div>

          {/* Running balance */}
          <span className="text-[9px] font-semibold text-muted-foreground">
            Bal: {formatCurrency(tx.runningBalance)}
          </span>

          {/* Status badge */}
          <TransactionStatusBadge status={tx.status} />
        </div>
      </button>
    </motion.div>
  );
};
