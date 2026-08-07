"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Calendar, CreditCard, X, Landmark } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth, fetchScheduledPayments, ScheduledPaymentItem } from "@/lib/supabase";

export const UpcomingPayments: React.FC = () => {
  const { success } = useToast();
  const { user } = useAuth();
  const [payments, setPayments] = React.useState<ScheduledPaymentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPay, setSelectedPay] = React.useState<ScheduledPaymentItem | null>(null);

  React.useEffect(() => {
    if (!user) return;

    async function loadPayments() {
      try {
        const data = await fetchScheduledPayments(user!.id);
        setPayments(data);
      } catch (err) {
        console.error("Error fetching scheduled payments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, [user]);

  const handleConfirmPay = () => {
    if (!selectedPay) return;
    success("Payment Completed Successfully", `Approved transfer of ${formatCurrency(selectedPay.amount)} for ${selectedPay.name}.`);
    setPayments((prev) => prev.filter((p) => p.id !== selectedPay.id));
    setSelectedPay(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 select-none">
        <Receipt className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Upcoming Scheduled Payments
        </h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-muted/20 animate-pulse rounded-custom-xl" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-custom-xl border border-border border-dashed p-6 text-center text-xs font-semibold text-muted-foreground select-none">
          No payments yet.
        </div>
      ) : (
        /* ─── PAYMENTS LIST ──────────────────────────────────────────────────── */
        <div className="space-y-2 select-none">
          {payments.map((pay) => {
            return (
              <div
                key={pay.id}
                className="flex items-center justify-between p-3.5 rounded-custom-xl border border-border bg-surface hover:bg-surface-hover/30 transition-all gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl border border-border/80 bg-muted/10 flex items-center justify-center text-muted-foreground shrink-0">
                    <Landmark className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">{pay.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-text-secondary mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDate(pay.due_date, { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 shrink-0">
                  <span className="text-xs font-black text-foreground">
                    {formatCurrency(pay.amount)}
                  </span>
                  <button
                    onClick={() => setSelectedPay(pay)}
                    className="py-1 px-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-[10px] font-black text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    Pay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── CONFIRM PAYMENT DIALOG ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPay(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-custom-xl border border-border bg-surface p-6 shadow-modal overflow-hidden select-none"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                  Approve Wire Bill
                </span>
                <button
                  onClick={() => setSelectedPay(null)}
                  className="p-1 rounded hover:bg-muted/15 text-muted-foreground hover:text-foreground cursor-pointer transition-colors outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                  You are approving a scheduled debit payout. The ledger records will immediately reflect this outgoing check.
                </p>

                <div className="rounded-xl border border-border bg-muted/5 p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Recipient / Service</span>
                    <span className="text-foreground font-bold">{selectedPay.name}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-secondary">Due Date</span>
                    <span className="text-foreground font-bold">{formatDate(selectedPay.due_date, { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold border-t border-border/40 pt-2 mt-2">
                    <span className="text-text-secondary">Total Payout</span>
                    <span className="text-primary font-black text-sm">{formatCurrency(selectedPay.amount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSelectedPay(null)}
                  className="flex-1 py-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPay}
                  className="flex-1 py-2 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none"
                >
                  Approve Payout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
