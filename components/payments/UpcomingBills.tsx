"use client";

import * as React from "react";
import { UpcomingBill, BillStatus } from "@/constants/mock-bills";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle2, AlertCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/app-shell";

interface UpcomingBillsProps {
  bills: UpcomingBill[];
  onPayBill: (bill: UpcomingBill) => void;
  onScheduleBill: (bill: UpcomingBill) => void;
}

const STATUS_CFG: Record<
  BillStatus,
  { label: string; classes: string; dot: string }
> = {
  Upcoming: { label: "Upcoming", classes: "bg-info/8 border-info/20 text-info", dot: "bg-info" },
  Paid: { label: "Settled Paid", classes: "bg-success/8 border-success/20 text-success", dot: "bg-success" },
  Overdue: { label: "Overdue Charge", classes: "bg-error/8 border-error/20 text-error animate-pulse", dot: "bg-error" },
  Scheduled: { label: "Auto Scheduled", classes: "bg-warning/8 border-warning/20 text-warning", dot: "bg-warning" },
  Failed: { label: "Processing Failed", classes: "bg-error/8 border-error/20 text-error", dot: "bg-error" },
};

export const UpcomingBills: React.FC<UpcomingBillsProps> = ({
  bills,
  onPayBill,
  onScheduleBill,
}) => {
  const { success, info } = useToast();

  const handleDetails = (b: UpcomingBill) => {
    info("Invoice details", `Company: ${b.companyName}\nDue Date: ${b.dueDate}\nValue: ${formatCurrency(b.amount)}\nMethod: ${b.paymentMethod}`);
  };

  return (
    <div className="space-y-3.5 select-none">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-0.5">
        Upcoming Bills Ledger
      </h3>

      {bills.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-custom-xl bg-surface/50 select-none">
          <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <h4 className="text-xs font-bold text-foreground mb-1">No payments yet.</h4>
          <p className="text-[10px] text-text-secondary">All your bills are settled. Check back later.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {bills.map((bill) => {
            const isSettled = bill.status === "Paid";
            const statusCfg = STATUS_CFG[bill.status];

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-4.5 rounded-custom-xl border border-border bg-surface shadow-soft hover:shadow-medium transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Logo Initials */}
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: bill.logoBg }}
                  >
                    {bill.logoInitials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-2">
                      {bill.companyName}
                    </h4>
                    <p className="text-[10px] font-semibold text-text-secondary mt-0.5 truncate leading-none">
                      {bill.category} · {bill.paymentMethod}
                    </p>
                    
                    {/* Info Row */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1 leading-none">
                        <Calendar className="h-3 w-3" />
                        Due {bill.dueDate}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full leading-none",
                        statusCfg.classes
                      )}>
                        <span className={cn("h-1 w-1 rounded-full", statusCfg.dot)} />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="text-right shrink-0 space-y-2">
                  <span className="text-sm font-black text-foreground block tracking-tight leading-none">
                    {formatCurrency(bill.amount)}
                  </span>

                  <div className="flex items-center gap-1.5 justify-end">
                    {!isSettled && (
                      <button
                        onClick={() => onPayBill(bill)}
                        className="px-2.5 py-1 rounded bg-primary text-primary-foreground hover:opacity-90 text-[9px] font-black transition-all cursor-pointer outline-none"
                      >
                        Pay Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDetails(bill)}
                      className="p-1 rounded border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground cursor-pointer outline-none"
                      aria-label={`View details for ${bill.companyName}`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
