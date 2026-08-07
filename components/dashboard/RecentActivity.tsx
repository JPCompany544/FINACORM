"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, X, CheckCircle2, AlertTriangle, ArrowUpRight, Tv, Briefcase, Coffee, ShoppingBag, Send, RefreshCw, Landmark } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth, fetchTransactions, TransactionItem } from "@/lib/supabase";

const TYPE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shopping: ShoppingBag,
  subscription: Tv,
  food: Coffee,
  salary: Briefcase,
  transfer: Send,
};

export const RecentActivity: React.FC = () => {
  const { info } = useToast();
  const { user } = useAuth();
  const [selectedTx, setSelectedTx] = React.useState<TransactionItem | null>(null);
  const [txList, setTxList] = React.useState<TransactionItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    async function loadTransactions() {
      try {
        const data = await fetchTransactions(user!.id);
        setTxList(data);
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Transaction History
        </h3>
        <button
          onClick={() => info("Statement History", "Navigating to Transaction journal records.")}
          className="text-[10px] font-black text-primary hover:underline cursor-pointer outline-none"
        >
          View Ledger
        </button>
      </div>

      {loading ? (
        <div className="space-y-3.5 pl-6 ml-3.5 border-l-2 border-border/40">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-muted/20 animate-pulse rounded-custom-lg" />
          ))}
        </div>
      ) : txList.length === 0 ? (
        <div className="rounded-custom-lg border border-border border-dashed p-6 text-center text-xs font-semibold text-muted-foreground select-none">
          No transactions yet.
        </div>
      ) : (
        /* ─── TIMELINE CONTAINER ────────────────────────────────────────────── */
        <div className="relative border-l-2 border-border/60 pl-6 ml-3.5 space-y-6 select-none">
          {txList.map((tx, index) => {
            const Icon = TYPE_ICON_MAP[tx.type] || Landmark;
            // Use the direction column from DB; fall back to amount sign for legacy rows
            const isNegative = tx.direction === "DEBIT" || (!tx.direction && tx.amount < 0);

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedTx(tx)}
                className="relative group cursor-pointer"
              >
                {/* Dot bullet indicator */}
                <div
                  className={cn(
                    "absolute -left-[35px] top-1 h-5 w-5 rounded-full border bg-surface flex items-center justify-center transition-all group-hover:scale-110",
                    tx.status === "success" && "border-success/35 text-success bg-success/5 group-hover:border-success",
                    tx.status === "failed" && "border-error/35 text-error bg-error/5 group-hover:border-error",
                    tx.status === "pending" && "border-warning/35 text-warning bg-warning/5 group-hover:border-warning"
                  )}
                >
                  <Icon className="h-2.5 w-2.5 shrink-0" />
                </div>

                {/* Transaction details row */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-custom-lg border border-transparent hover:border-border hover:bg-surface-hover/50 transition-all">
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {tx.merchant}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-text-secondary">
                      <span>{formatDate(tx.created_at, { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="uppercase tracking-wider text-[8px] text-muted-foreground">
                        {tx.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={cn(
                        "text-xs font-extrabold tracking-tight",
                        isNegative ? "text-error" : "text-success"
                      )}
                    >
                      {isNegative ? "−" : "+"}
                      {formatCurrency(Math.abs(tx.amount))}
                    </span>
                    
                    {/* Status pill */}
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase px-1.5 py-0.5 rounded border tracking-wider",
                        tx.status === "success" && "bg-success/5 border-success/20 text-success",
                        tx.status === "failed" && "bg-error/5 border-error/20 text-error",
                        tx.status === "pending" && "bg-warning/5 border-warning/20 text-warning"
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── DETAILS DIALOG / MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-custom-xl border border-border bg-surface p-6 shadow-modal overflow-hidden select-none"
            >
              {/* Top Row Header */}
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <History className="h-3.5 w-3.5 text-primary" />
                  Transaction Details
                </span>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded hover:bg-muted/15 text-muted-foreground hover:text-foreground cursor-pointer transition-colors outline-none"
                  aria-label="Close modal dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Amount Display Header */}
              <div className="text-center py-4 space-y-1 select-all">
                <h3
                  className={cn(
                    "text-3xl font-black tracking-tight",
                    selectedTx.amount < 0 ? "text-foreground" : "text-success"
                  )}
                >
                  {selectedTx.amount < 0 ? "" : "+"}
                  {formatCurrency(selectedTx.amount)}
                </h3>
                <p className="text-xs font-bold text-foreground">
                  {selectedTx.merchant}
                </p>
              </div>

              {/* Detail fields list */}
              <div className="mt-4 space-y-2.5 text-xs font-semibold text-text-secondary border-t border-border/50 pt-4">
                <div className="flex justify-between items-center">
                  <span>Transaction ID</span>
                  <span className="text-foreground font-mono select-all truncate max-w-[140px] uppercase">
                    {selectedTx.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Timestamp</span>
                  <span className="text-foreground">
                    {formatDate(selectedTx.created_at, { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Category type</span>
                  <span className="text-foreground capitalize">{selectedTx.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Settlement Status</span>
                  <span className="flex items-center gap-1">
                    {selectedTx.status === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                    )}
                    <span className="text-foreground capitalize">{selectedTx.status}</span>
                  </span>
                </div>
              </div>

              {/* Action footer button */}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    info("Receipt Requested", "Generating PDF checkout receipt sheet.");
                    setSelectedTx(null);
                  }}
                  className="flex-1 py-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
                >
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    info("Concierge Inquiry", "Routing transaction ID to emergency ledger desk.");
                    setSelectedTx(null);
                  }}
                  className="flex-1 py-2 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none flex items-center justify-center gap-1"
                >
                  Raise Dispute
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
