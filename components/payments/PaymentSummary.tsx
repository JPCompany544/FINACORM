"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { PaymentFormData } from "./usePaymentsState";
import { ShieldCheck, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentSummaryProps {
  data: PaymentFormData;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ data }) => {
  const { biller, sourceAccount, amount } = data;

  const numAmount = parseFloat(amount) || 0;
  const fees = 0; // Bill payments = free
  const totalDeduction = numAmount + fees;

  const remainingBalance = sourceAccount
    ? Math.max(0, sourceAccount.availableBalance - totalDeduction)
    : 0;

  const getBillerName = () => {
    if (!biller) return "Not selected";
    return "companyName" in biller ? biller.companyName : biller.name;
  };

  return (
    <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4 shadow-floating relative overflow-hidden select-none sticky top-24">
      <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/40 pb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        Payment Summary
      </h4>

      <div className="space-y-3 text-xs font-semibold text-text-secondary leading-none">
        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Funding Account</span>
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

        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Recipient</span>
          <span className="text-foreground font-bold text-right truncate max-w-[160px]">{getBillerName()}</span>
        </div>

        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Payment Amount</span>
          <span className="text-foreground font-bold">
            {numAmount > 0 ? formatCurrency(numAmount) : "—"}
          </span>
        </div>

        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span>Processing Fee</span>
          <span className="text-success font-bold">Free</span>
        </div>

        <div className="flex justify-between border-b border-border/20 pb-2.5">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            Settlement Time
          </span>
          <span className="text-foreground font-bold text-right">
            {biller ? "Same Business Day" : "—"}
          </span>
        </div>

        <div className="flex justify-between border-t border-border/40 pt-3 text-sm">
          <span>Total Deduction</span>
          <span className="text-foreground font-black">
            {numAmount > 0 ? formatCurrency(totalDeduction) : "—"}
          </span>
        </div>

        {sourceAccount && numAmount > 0 && (
          <div className="flex justify-between">
            <span>Remaining Balance</span>
            <span className={cn("font-black text-[11px]", remainingBalance === 0 ? "text-error" : "text-success")}>
              {formatCurrency(remainingBalance)}
            </span>
          </div>
        )}
      </div>

      <div className="bg-muted/10 border border-border/40 p-3 rounded-lg flex gap-2.5 items-start">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Bill payments are processed via ACH Same-Day clearing. Funds may take 1 business day to reflect.
        </p>
      </div>
    </div>
  );
};
