"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Download,
  Printer,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarDays,
  User,
  Hash,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { StatementItem } from "@/constants/mock-statements";
import { useToast } from "@/components/app-shell";

interface StatementPreviewModalProps {
  statement: StatementItem | null;
  onClose: () => void;
}

// Row helper for the statement preview table
const DetailRow: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
  borderTop?: boolean;
}> = ({ label, value, valueClass, borderTop }) => (
  <div
    className={cn(
      "flex justify-between items-center py-2.5 text-xs",
      borderTop && "border-t border-border/60 mt-1 pt-3.5"
    )}
  >
    <span className="font-semibold text-text-secondary">{label}</span>
    <span className={cn("font-bold text-foreground", valueClass)}>{value}</span>
  </div>
);

export const StatementPreviewModal: React.FC<StatementPreviewModalProps> = ({
  statement,
  onClose,
}) => {
  const { success } = useToast();

  // Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (statement) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [statement, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    document.body.style.overflow = statement ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [statement]);

  if (!statement) return null;
  const { preview: p } = statement;

  // Derived
  const netChange = p.closingBalance - p.openingBalance;
  const isPositive = netChange >= 0;

  return (
    <AnimatePresence>
      {statement && (
        <>
          {/* Backdrop */}
          <motion.div
            key="stmt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="stmt-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Statement preview: ${statement.title}`}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-4 tablet:inset-8 laptop:inset-auto laptop:top-1/2 laptop:left-1/2 laptop:-translate-x-1/2 laptop:-translate-y-1/2 laptop:w-[640px] laptop:max-h-[88vh] z-50 bg-surface rounded-custom-xl border border-border shadow-modal flex flex-col overflow-hidden"
          >
            {/* ─── MODAL HEADER ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/8 border border-primary/15">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    Northstar Bank
                  </h3>
                  <p className="text-[10px] font-semibold text-text-secondary">
                    Official Account Statement — Preview
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close preview"
                className="p-2 rounded-custom-md border border-border hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ─── MODAL BODY ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Bank statement header block */}
              <div className="rounded-custom-xl border border-border bg-background p-5 space-y-4">
                {/* Northstar branding bar */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-xs font-black text-foreground tracking-tight">
                        NORTHSTAR BANK
                      </span>
                    </div>
                    <p className="text-[9px] font-semibold text-text-secondary tracking-wide">
                      International Banking Division · New York, USA
                    </p>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded">
                    OFFICIAL DOCUMENT
                  </span>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-4 text-[10px]">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Account Holder</p>
                        <p className="font-bold text-foreground mt-0.5">{p.holderName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Account</p>
                        <p className="font-bold text-foreground mt-0.5">{statement.accountName}</p>
                        <p className="font-semibold text-text-secondary">{statement.accountNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Statement Period</p>
                        <p className="font-bold text-foreground mt-0.5">{statement.period}</p>
                        <p className="font-semibold text-text-secondary">
                          {statement.periodStart} → {statement.periodEnd}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Document Type</p>
                        <p className="font-bold text-foreground mt-0.5">{statement.type}</p>
                        <p className="font-semibold text-text-secondary">Generated {statement.generatedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial summary */}
              <div className="rounded-custom-xl border border-border bg-background p-5 space-y-1">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Financial Summary
                </h4>

                <DetailRow label="Opening Balance" value={formatCurrency(p.openingBalance)} />
                <div className="space-y-1 pl-4 border-l-2 border-success/30 ml-1">
                  <div className="flex items-center justify-between py-1.5 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-success">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Total Credits (Money In)
                    </span>
                    <span className="font-extrabold text-success">+{formatCurrency(p.totalCredits)}</span>
                  </div>
                </div>
                <div className="space-y-1 pl-4 border-l-2 border-border/40 ml-1">
                  <div className="flex items-center justify-between py-1.5 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-text-secondary">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Total Debits (Money Out)
                    </span>
                    <span className="font-extrabold text-foreground">−{formatCurrency(p.totalDebits)}</span>
                  </div>
                </div>
                {p.totalFees > 0 && (
                  <DetailRow label="Fees & Charges" value={`−${formatCurrency(p.totalFees)}`} />
                )}
                <DetailRow
                  label="Closing Balance"
                  value={formatCurrency(p.closingBalance)}
                  valueClass="text-base font-black"
                  borderTop
                />

                {/* Net change */}
                <div
                  className={cn(
                    "flex items-center justify-between mt-2 p-3 rounded-xl border text-xs font-bold",
                    isPositive
                      ? "bg-success/5 border-success/20 text-success"
                      : "bg-error/5 border-error/20 text-error"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Net Change This Period
                  </span>
                  <span className="font-black">
                    {isPositive ? "+" : ""}
                    {formatCurrency(netChange)}
                  </span>
                </div>
              </div>

              {/* Transaction count */}
              <div className="rounded-custom-xl border border-border/60 bg-background px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  Transactions this period
                </span>
                <span className="text-sm font-extrabold text-foreground">
                  {p.transactionCount}{" "}
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    transactions
                  </span>
                </span>
              </div>

              {/* Export options */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Export Options
                </h4>
                <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2">
                  {[
                    { label: "PDF", desc: "Full statement", primary: true },
                    { label: "CSV", desc: "Spreadsheet data", primary: false },
                    { label: "OFX", desc: "For Quicken / QuickBooks", primary: false, placeholder: true },
                    { label: "QFX", desc: "For Mint / YNAB", primary: false, placeholder: true },
                  ].map((fmt) => (
                    <button
                      key={fmt.label}
                      onClick={() =>
                        fmt.placeholder
                          ? success("Coming Soon", `${fmt.label} export will be available shortly.`)
                          : success(`${fmt.label} Downloaded`, `${statement.title} exported as ${fmt.label}.`)
                      }
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-custom-md border text-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all",
                        fmt.primary
                          ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                          : "bg-surface border-border hover:bg-surface-hover text-foreground",
                        fmt.placeholder && "opacity-60"
                      )}
                    >
                      <span className="text-xs font-black">{fmt.label}</span>
                      <span className={cn("text-[9px] font-semibold mt-0.5", fmt.primary ? "text-primary-foreground/70" : "text-text-secondary")}>
                        {fmt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[9px] font-semibold text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                This is a mock preview generated for demonstration purposes only. The figures shown are simulated and do not constitute an official bank statement. Northstar Bank, N.A. is a registered banking institution regulated by the OCC.
              </p>
            </div>

            {/* ─── MODAL FOOTER ───────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-border/60 shrink-0 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer outline-none"
              >
                Close Preview
              </button>
              <button
                onClick={() =>
                  success("PDF Downloaded", `${statement.title} exported as PDF.`)
                }
                className="flex items-center gap-2 px-5 py-2 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30 shadow-soft"
              >
                <Download className="h-3.5 w-3.5" />
                Download Full Statement
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
