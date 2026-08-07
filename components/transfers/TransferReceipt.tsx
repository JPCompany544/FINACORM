"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Download, Share2, Printer, ArrowLeft, RefreshCw, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { TransferRecord } from "@/constants/mock-transfers";
import { BRAND_NAME } from "@/constants";

interface TransferReceiptProps {
  record: TransferRecord | null;
  onClose: () => void;
  onRepeat: (rec: TransferRecord) => void;
}

export const TransferReceipt: React.FC<TransferReceiptProps> = ({
  record,
  onClose,
  onRepeat,
}) => {
  const { success, info } = useToast();

  if (!record) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 select-none">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Transfers</span>
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Transfer Receipt
        </span>
      </div>

      <div className="max-w-xl mx-auto rounded-custom-xl border border-border bg-surface shadow-floating overflow-hidden relative">
        {/* Receipt Header */}
        <div className="bg-muted/10 border-b border-border/60 p-6 flex justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-black text-foreground tracking-tight">{BRAND_NAME.toUpperCase()}</span>
            </div>
            <p className="text-[9px] font-semibold text-text-secondary">Receipt {record.receiptNumber}</p>
          </div>
          
          <div className="text-right space-y-1 select-none">
            <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider border border-success/20 bg-success/5 px-2.5 py-1 rounded-full text-success leading-none">
              <CheckCircle className="h-3 w-3" />
              {record.status}
            </span>
            <p className="text-[9px] font-semibold text-muted-foreground block">{record.date} at {record.time}</p>
          </div>
        </div>

        {/* Amount Section */}
        <div className="p-6 border-b border-border/40 text-center select-none">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
            Movement Value
          </span>
          <span className="text-3xl font-black text-foreground block mt-2">
            {formatCurrency(record.amount)}
          </span>
          {record.fees > 0 && (
            <p className="text-[10px] font-semibold text-text-secondary mt-1">
              Includes {formatCurrency(record.fees)} service charge
            </p>
          )}
        </div>

        {/* Ledger Details */}
        <div className="p-6 space-y-5 text-xs font-semibold text-text-secondary leading-none">
          {/* Sender & Recipient block */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2 select-none">Sender</span>
              <p className="text-foreground font-bold">{record.sender}</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">{record.senderAccount}</p>
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2 select-none">Recipient</span>
              <p className="text-foreground font-bold">{record.recipient}</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">{record.recipientAccount}</p>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">{record.bankName}</p>
            </div>
          </div>

          <div className="h-px bg-border/40 select-none shrink-0" />

          {/* Wire details list */}
          <div className="space-y-3">
            {[
              { label: "Transaction ID", value: record.transactionId, mono: true },
              { label: "Movement Type", value: record.type.toUpperCase(), mono: false },
              { label: "Reference Code", value: record.reference, mono: false },
              ...(record.exchangeRate
                ? [{ label: "Foreign Exchange Rate", value: record.exchangeRate, mono: true }]
                : []),
              ...(record.notes
                ? [{ label: "Notes", value: record.notes, mono: false }]
                : []),
            ].map((f, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4">
                <span className="shrink-0 select-none">{f.label}</span>
                <span className={cn("text-foreground font-extrabold text-right min-w-0 truncate", f.mono && "font-mono text-[10px]")}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Footer Action Bar */}
        <div className="bg-muted/10 border-t border-border/60 px-6 py-4 flex items-center justify-between gap-3 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => success("PDF Exported", `Receipt ${record.receiptNumber} downloaded successfully.`)}
              className="p-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
              aria-label="Download receipt as PDF"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => info("Receipt Print", "Sending document to local print spooler...")}
              className="p-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
              aria-label="Print receipt"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={() => info("Receipt Shared", "Secure receipt download link copied to clipboard.")}
              className="p-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
              aria-label="Share receipt"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => onRepeat(record)}
            className="flex items-center gap-1.5 py-2 px-4 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Repeat Wire
          </button>
        </div>
      </div>
    </div>
  );
};
