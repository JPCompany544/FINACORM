"use client";

import * as React from "react";
import { MOCK_SCHEDULED_PAYMENTS, ScheduledPayment } from "@/constants/mock-payments";
import { formatCurrency, cn } from "@/lib/utils";
import { Calendar, Pause, Play, Pencil, Trash2, AlertCircle, RefreshCw, Clock } from "lucide-react";
import { useToast } from "@/components/app-shell";

export const ScheduledPayments: React.FC = () => {
  const { success, info } = useToast();
  const [payments, setPayments] = React.useState<ScheduledPayment[]>(MOCK_SCHEDULED_PAYMENTS);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const totalMonthly = payments
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + p.amount, 0);

  const toggleStatus = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p))
    );
    const p = payments.find((p) => p.id === id);
    if (p) {
      info(p.status === "active" ? "Payment Paused" : "Payment Resumed", `${p.name} ${p.status === "active" ? "paused" : "resumed"}.`);
    }
  };

  const deletePayment = (id: string) => {
    const p = payments.find((p) => p.id === id);
    setPayments((prev) => prev.filter((p) => p.id !== id));
    success("Deleted", `${p?.name || "Scheduled payment"} deleted.`);
    setDeleteId(null);
  };

  const FREQUENCY_LABEL: Record<string, string> = {
    monthly: "Monthly",
    weekly: "Weekly",
    biweekly: "Bi-weekly",
    annually: "Annually",
  };

  const STATUS_STYLE: Record<string, string> = {
    active: "border-success/25 bg-success/5 text-success",
    paused: "border-warning/25 bg-warning/5 text-warning",
    cancelled: "border-error/25 bg-error/5 text-error",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Scheduled Payments</h3>
        <p className="text-[10px] font-semibold text-text-secondary">Manage your recurring bill payments and scheduled transactions.</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Schedules", value: payments.filter(p => p.status === "active").length, icon: <Play className="h-4 w-4 text-success" /> },
          { label: "Paused", value: payments.filter(p => p.status === "paused").length, icon: <Pause className="h-4 w-4 text-warning" /> },
          { label: "Monthly Commitment", value: formatCurrency(totalMonthly), icon: <Calendar className="h-4 w-4 text-primary" />, isAmount: true },
        ].map((s) => (
          <div key={s.label} className="rounded-custom-xl border border-border bg-surface p-4 space-y-2">
            {s.icon}
            <div>
              <p className={cn("font-black", s.isAmount ? "text-sm text-foreground" : "text-lg text-foreground")}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment list */}
      <div className="space-y-2.5">
        {payments.map((p) => (
          <div
            key={p.id}
            className={cn("flex items-center gap-4 p-4 rounded-custom-xl border transition-all",
              p.status === "paused" ? "border-warning/20 bg-warning/5" : "border-border bg-surface hover:shadow-soft"
            )}
          >
            {/* Logo */}
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
              style={{ backgroundColor: p.logoBg }}
            >
              {p.logoInitials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h4 className="text-xs font-extrabold text-foreground">{p.name}</h4>
                <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border", STATUS_STYLE[p.status])}>
                  {p.status}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-text-secondary">
                {FREQUENCY_LABEL[p.frequency] ?? p.frequency} · Next: {p.nextDate}
              </p>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">From: {p.fromAccount}</p>
            </div>

            {/* Amount */}
            <div className="text-right hidden sm:block shrink-0">
              <p className="text-sm font-black text-foreground">{formatCurrency(p.amount)}</p>
              <p className="text-[9px] font-bold text-muted-foreground mt-0.5 flex items-center justify-end gap-1">
                <RefreshCw className="h-3 w-3" />
                {FREQUENCY_LABEL[p.frequency]}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleStatus(p.id)}
                className={cn("p-2 rounded-lg transition-colors cursor-pointer", p.status === "active" ? "text-warning hover:bg-warning/10" : "text-success hover:bg-success/10")}
                title={p.status === "active" ? "Pause" : "Resume"}
              >
                {p.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setDeleteId(p.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="py-12 text-center border border-dashed border-border rounded-custom-xl space-y-2">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-xs font-semibold text-muted-foreground">No scheduled payments found.</p>
          </div>
        )}
      </div>

      {/* Upcoming calendar hint */}
      <div className="bg-primary/5 border border-primary/15 rounded-custom-xl p-4 flex gap-3 items-start">
        <Clock className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-wider mb-0.5">Upcoming this month</p>
          <p className="text-[10px] font-semibold text-text-secondary leading-normal">
            You have {payments.filter(p => p.status === "active").length} scheduled payments totalling {formatCurrency(totalMonthly)} due this month.
          </p>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-custom-xl p-6 space-y-4 max-w-sm w-full shadow-floating">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-error/10 border border-error/20 text-error">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground">Delete Schedule?</h4>
                <p className="text-[10px] font-semibold text-text-secondary">
                  All future payments will be cancelled.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-border rounded-custom-md text-xs font-bold hover:bg-surface-hover transition-all cursor-pointer outline-none">Cancel</button>
              <button onClick={() => deletePayment(deleteId!)} className="flex-1 py-2 bg-error text-error-foreground rounded-custom-md text-xs font-bold hover:opacity-90 transition-all cursor-pointer outline-none shadow-soft">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
