"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { TransferData } from "./useTransfer";
import { ArrowRight, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferSummaryProps {
  data: TransferData;
}

export const calculateFees = (type: string | null, speed: string): number => {
  if (!type) return 0;
  if (type === "international") return 15.00;
  if (speed === "priority") return 5.00;
  return 0.00;
};

export const getDeliveryEstimate = (type: string | null, speed: string): string => {
  if (!type) return "";
  if (type === "internal") return "Instantaneous";
  if (speed === "priority") return "Same Business Day (Priority)";
  if (type === "international") return "2 to 3 Business Days (SWIFT)";
  return "1 to 2 Business Days (ACH)";
};

export const TransferSummary: React.FC<TransferSummaryProps> = ({ data }) => {
  const { transactionType: type, sourceAccount, recipientName, recipientAccount, amount, currency, speed } = data;

  const numAmount = parseFloat(amount) || 0;
  const fees = calculateFees(type, speed);
  const totalDeduction = numAmount + fees;

  const balanceRemaining = sourceAccount
    ? sourceAccount.availableBalance - totalDeduction
    : 0;

  const deliveryEst = getDeliveryEstimate(type, speed);

  return (
    <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4 shadow-floating relative overflow-hidden select-none sticky top-24">
      {/* Background glow decorator */}
      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Movement Summary
      </h4>

      <div className="space-y-3.5 text-xs font-semibold text-text-secondary leading-none">
        {/* Source Account */}
        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Funding Ledger</span>
          <div className="text-right">
            <span className="text-foreground font-bold block">
              {sourceAccount ? sourceAccount.name : "Not selected"}
            </span>
            {sourceAccount && (
              <span className="text-[10px] font-semibold text-muted-foreground mt-0.5 block">
                Bal: {formatCurrency(sourceAccount.availableBalance)}
              </span>
            )}
          </div>
        </div>

        {/* Recipient */}
        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Recipient</span>
          <div className="text-right">
            <span className="text-foreground font-bold block">
              {recipientName || "Not entered"}
            </span>
            {recipientAccount && (
              <span className="text-[10px] font-mono text-muted-foreground mt-0.5 block">
                •••• {recipientAccount.slice(-4)}
              </span>
            )}
          </div>
        </div>

        {/* Transfer Type */}
        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Transfer Mode</span>
          <span className="text-foreground font-bold capitalize">
            {type ? `${type} transfer` : "Not selected"}
          </span>
        </div>

        {/* Amount */}
        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Transfer Amount</span>
          <span className="text-foreground font-bold">
            {numAmount > 0 ? `${formatCurrency(numAmount)} ${currency}` : "—"}
          </span>
        </div>

        {/* Transfer Fee */}
        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Processing Fees</span>
          <span className="text-foreground font-bold">
            {fees > 0 ? formatCurrency(fees) : "Free"}
          </span>
        </div>

        {/* Exchange rate for international transfers */}
        {type === "international" && currency !== "USD" && (
          <div className="flex justify-between border-b border-border/20 pb-2.5 bg-muted/5 p-2 rounded-lg border">
            <span>Exchange rate</span>
            <div className="text-right">
              <span className="text-foreground font-bold block">
                1 USD = {currency === "JPY" ? "142.15 JPY" : currency === "EUR" ? "0.92 EUR" : "1.34 CAD"}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                Calculated value: {formatCurrency(numAmount * (currency === "JPY" ? 142.15 : currency === "EUR" ? 0.92 : 1.34), currency)}
              </span>
            </div>
          </div>
        )}

        {/* Delivery speed estimate */}
        {type && (
          <div className="flex justify-between border-b border-border/20 pb-2.5">
            <span>Est. Arrival</span>
            <span className="text-foreground font-bold text-right">{deliveryEst}</span>
          </div>
        )}

        {/* Net Deductions total */}
        <div className="flex justify-between border-t border-border/40 pt-3 text-sm">
          <span>Total Deduction</span>
          <span className="text-foreground font-black">
            {numAmount > 0 ? `${formatCurrency(totalDeduction)} ${currency}` : "—"}
          </span>
        </div>

        {/* Remaining balance calculation */}
        {sourceAccount && (
          <div className="flex justify-between pt-1">
            <span>Remaining Ledger</span>
            <span
              className={cn(
                "font-black text-[11px]",
                balanceRemaining < 0 ? "text-error" : "text-success"
              )}
            >
              {formatCurrency(balanceRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Safety lock notice */}
      <div className="bg-muted/10 border border-border/40 p-3 rounded-lg flex gap-2.5 items-start">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Funds are protected by multi-signature vaults and FDIC regulations. Confirm details before approval.
        </p>
      </div>
    </div>
  );
};
