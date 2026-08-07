"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Download,
  Repeat,
  Share2,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { RichTransaction } from "@/constants/mock-transactions";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { useToast } from "@/components/app-shell";

interface TransactionDrawerProps {
  transaction: RichTransaction | null;
  onClose: () => void;
}

const TimelineIcon: React.FC<{ done: boolean }> = ({ done }) => {
  if (done) return <CheckCircle className="h-4 w-4 text-success" />;
  return <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />;
};

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  transaction,
  onClose,
}) => {
  const { success, info } = useToast();

  // Close on Escape
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (transaction) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [transaction, onClose]);

  // Trap body scroll when open on mobile
  React.useEffect(() => {
    if (transaction) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [transaction]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success("Copied", `${label} copied to clipboard.`);
  };

  if (!transaction) return null;

  const isCredit = transaction.direction === "credit";

  return (
    <AnimatePresence>
      {transaction && (
        <>
          {/* ─── BACKDROP ───────────────────────────────────────────────────── */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ─── DRAWER PANEL ───────────────────────────────────────────────── */}
          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Transaction details: ${transaction.merchant}`}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full tablet:max-w-[440px] bg-surface border-l border-border shadow-modal flex flex-col overflow-hidden"
          >
            {/* ─── DRAWER HEADER ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: transaction.merchantColor }}
                >
                  {transaction.merchantInitials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-foreground truncate">
                    {transaction.merchant}
                  </h3>
                  <p className="text-[10px] font-semibold text-text-secondary">
                    Transaction Details
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close transaction details"
                className="p-2 rounded-custom-md border border-border hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ─── DRAWER BODY ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Amount hero */}
              <div className="flex flex-col items-center justify-center py-6 rounded-custom-xl border border-border bg-background space-y-2 text-center">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    isCredit ? "bg-success/10" : "bg-error/10"
                  )}
                  aria-hidden="true"
                >
                  {isCredit ? (
                    <ArrowDownLeft className="h-5 w-5 text-success" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-error" />
                  )}
                </div>
                <div
                  className={cn(
                    "text-3xl font-black tracking-tight",
                    isCredit ? "text-success" : "text-error"
                  )}
                >
                  {isCredit ? "+" : "−"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
                {transaction.fees > 0 && (
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    Includes {formatCurrency(transaction.fees)} service fee
                  </p>
                )}
                <TransactionStatusBadge status={transaction.status} />
              </div>

              {/* ─── DETAIL FIELDS ────────────────────────────────────────── */}
              <div className="space-y-0 rounded-custom-xl border border-border overflow-hidden">
                {[
                  { label: "Transaction ID", value: transaction.transactionId, mono: true, copyable: true },
                  { label: "Reference Number", value: transaction.referenceNumber, mono: true, copyable: true },
                  { label: "Payment Method", value: transaction.paymentMethod, mono: false, copyable: false },
                  { label: "Account Used", value: transaction.accountUsed, mono: false, copyable: false },
                  { label: "Date & Time", value: `${transaction.date} at ${transaction.time}`, mono: false, copyable: false },
                  { label: "Transaction Type", value: transaction.type.replace("_", " ").toUpperCase(), mono: false, copyable: false },
                  ...(transaction.fees > 0
                    ? [{ label: "Fees", value: formatCurrency(transaction.fees), mono: false, copyable: false }]
                    : []),
                  ...(transaction.exchangeRate
                    ? [{ label: "Exchange Rate", value: transaction.exchangeRate, mono: true, copyable: false }]
                    : []),
                  { label: "Running Balance", value: formatCurrency(transaction.runningBalance), mono: false, copyable: false },
                  ...(transaction.balanceBefore !== undefined
                    ? [{ label: "Balance Before", value: formatCurrency(transaction.balanceBefore), mono: false, copyable: false }]
                    : []),
                  ...(transaction.balanceAfter !== undefined
                    ? [{ label: "Balance After", value: formatCurrency(transaction.balanceAfter), mono: false, copyable: false }]
                    : []),
                  ...(transaction.source
                    ? [{ label: "Source / Sender", value: transaction.source, mono: false, copyable: false }]
                    : []),
                  ...(transaction.destination
                    ? [{ label: "Destination", value: transaction.destination, mono: false, copyable: false }]
                    : []),
                  ...(transaction.recipientName
                    ? [{ label: "Recipient Name", value: transaction.recipientName, mono: false, copyable: false }]
                    : []),
                  ...(transaction.recipientBank
                    ? [{ label: "Recipient Bank", value: transaction.recipientBank, mono: false, copyable: false }]
                    : []),
                  ...(transaction.recipientAccountNumber
                    ? [{ label: "Recipient Account No.", value: transaction.recipientAccountNumber, mono: true, copyable: true }]
                    : []),
                  ...(transaction.destinationCountry
                    ? [{ label: "Country", value: transaction.destinationCountry, mono: false, copyable: false }]
                    : []),
                  ...(transaction.transferSpeed
                    ? [{ label: "Transfer Speed", value: transaction.transferSpeed, mono: false, copyable: false }]
                    : []),
                  ...(transaction.createdBy
                    ? [{ label: "Created By", value: transaction.createdBy, mono: true, copyable: true }]
                    : []),
                  ...(transaction.approvedBy
                    ? [{ label: "Approved By", value: transaction.approvedBy, mono: true, copyable: true }]
                    : []),
                ].map((field, i, arr) => (
                  <div
                    key={field.label}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-xs gap-4",
                      i < arr.length - 1 && "border-b border-border/40"
                    )}
                  >
                    <span className="font-semibold text-text-secondary shrink-0">{field.label}</span>
                    <div className="flex items-center gap-1.5 min-w-0 justify-end">
                      <span className={cn("font-bold text-foreground truncate text-right", field.mono && "font-mono text-[11px]")}>
                        {field.value}
                      </span>
                      {field.copyable && (
                        <button
                          onClick={() => handleCopy(field.value, field.label)}
                          aria-label={`Copy ${field.label}`}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ─── NOTES ────────────────────────────────────────────────── */}
              {transaction.notes && (
                <div className="rounded-custom-xl border border-border/60 bg-background p-4 space-y-1.5">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Notes</h4>
                  <p className="text-xs font-semibold text-text-secondary leading-relaxed">
                    {transaction.notes}
                  </p>
                </div>
              )}

              {/* ─── STATUS TIMELINE ──────────────────────────────────────── */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Transaction Timeline
                </h4>
                <div className="space-y-1">
                  {transaction.statusTimeline.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center shrink-0 mt-0.5">
                        <TimelineIcon done={step.done} />
                        {i < transaction.statusTimeline.length - 1 && (
                          <div className={cn(
                            "w-px flex-1 mt-1",
                            step.done ? "bg-success/30 h-6" : "bg-border/40 h-6"
                          )} />
                        )}
                      </div>
                      <div className="pb-4 min-w-0">
                        <p className={cn(
                          "text-xs font-bold",
                          step.done ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                          {step.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── DRAWER FOOTER: ACTIONS ─────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-border/60 shrink-0 space-y-2">
              <button
                onClick={() => success("Receipt Downloaded", `${transaction.merchant} receipt exported as PDF.`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30 shadow-soft"
              >
                <Download className="h-3.5 w-3.5" />
                Download Receipt
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => info("Repeat Transaction", "Pre-filling transfer form with transaction details...")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
                >
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                  Repeat
                </button>
                <button
                  onClick={() => info("Share Receipt", "Generating shareable receipt link...")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
                >
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Share
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
