"use client";

import * as React from "react";
import { TransferData } from "./useTransfer";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck } from "lucide-react";

interface ReviewTransferProps {
  data: TransferData;
  onBack: () => void;
  onConfirm: () => void;
}

function getRoutingLabel(country: string): string {
  const c = country.toLowerCase();
  if (c.includes("united states")) return "Routing Number";
  if (c.includes("united kingdom")) return "Sort Code";
  if (c.includes("canada")) return "Transit Number";
  if (c.includes("australia")) return "BSB Code";
  if (c.includes("eurozone") || c.includes("europe")) return "IBAN";
  return "Routing Information";
}

function maskAccountNumber(accNum: string): string {
  if (accNum.length <= 4) return accNum;
  return `•••• •••• •••• ${accNum.slice(-4)}`;
}

export const ReviewTransfer: React.FC<ReviewTransferProps> = ({
  data,
  onBack,
  onConfirm,
}) => {
  const {
    recipientName,
    recipientBank,
    destinationCountry,
    recipientAccount,
    routingValue,
    amount,
    currency,
    transactionType,
    speed,
    description,
  } = data;

  const numAmount = parseFloat(amount) || 0;
  const estimatedDelivery = speed === "priority" ? "Same Business Day" : "2–3 Business Days";
  const routingLabel = getRoutingLabel(destinationCountry);

  return (
    <div className="space-y-5 select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          2. Review Wire Details
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Ensure recipient information matches the destination ledger requirements.
        </p>
      </div>

      <div className="rounded-custom-xl border border-border bg-surface overflow-hidden shadow-soft">
        {/* Header summary info block */}
        <div className="bg-muted/10 border-b border-border/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block leading-none">
              Transfer Amount
            </span>
            <span className="text-xl font-black text-foreground block mt-1.5 leading-none">
              {formatCurrency(numAmount)} {currency}
            </span>
          </div>
          <span className="text-[10px] font-black uppercase border border-primary/25 bg-primary/5 px-2.5 py-1 rounded text-primary tracking-widest leading-none self-start sm:self-auto capitalize">
            {transactionType} Wire
          </span>
        </div>

        {/* Dynamic structured details table */}
        <div className="divide-y divide-border/40 text-xs font-semibold text-text-secondary leading-none">
          {[
            { label: "Recipient Name", value: recipientName },
            { label: "Recipient Bank", value: recipientBank },
            { label: "Destination Country", value: destinationCountry },
            { label: "Recipient Account Number", value: maskAccountNumber(recipientAccount) },
            { label: routingLabel, value: routingValue },
            { label: "Amount", value: `${formatCurrency(numAmount)} ${currency}` },
            { label: "Transaction Type", value: transactionType.toUpperCase() },
            { label: "Transfer Speed", value: speed === "priority" ? "Priority Clearance" : "Standard Clearance" },
            { label: "Estimated Delivery", value: estimatedDelivery },
            { label: "Description / Notes", value: description || "No notes attached" },
          ].map((field, idx) => (
            <div key={idx} className="flex justify-between items-start px-4.5 py-3.5 gap-4">
              <span className="shrink-0 text-muted-foreground font-semibold">{field.label}</span>
              <span className="text-foreground font-bold text-right truncate max-w-[200px]">{field.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Warning */}
      <div className="bg-warning/5 border border-warning/20 p-4 rounded-custom-xl flex gap-3 items-start leading-normal text-xs font-semibold text-text-secondary">
        <AlertTriangle className="h-4.5 w-4.5 text-warning shrink-0" />
        <p>
          Please ensure all fields are correct. Outbound wires are processed immediately and are not subject to recall once cleared.
        </p>
      </div>
    </div>
  );
};
