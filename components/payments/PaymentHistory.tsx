"use client";

import * as React from "react";
import { MOCK_PAYMENT_HISTORY, PaymentHistoryItem } from "@/constants/mock-payments";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Filter, Download, ChevronDown, X, ArrowUpRight, CheckCircle2, Clock, AlertCircle, XCircle, RefreshCw } from "lucide-react";

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; cls: string }> = {
  completed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: "text-success" },
  pending: { icon: <Clock className="h-3.5 w-3.5" />, cls: "text-warning" },
  processing: { icon: <RefreshCw className="h-3.5 w-3.5" />, cls: "text-primary" },
  failed: { icon: <XCircle className="h-3.5 w-3.5" />, cls: "text-error" },
  reversed: { icon: <AlertCircle className="h-3.5 w-3.5" />, cls: "text-muted-foreground" },
};

interface PaymentHistoryProps {
  onViewDetails?: (item: PaymentHistoryItem) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ onViewDetails }) => {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  const filtered = MOCK_PAYMENT_HISTORY.filter((p) => {
    const matchSearch =
      p.recipient.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalPaid = MOCK_PAYMENT_HISTORY.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pendingCount = MOCK_PAYMENT_HISTORY.filter(p => p.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payment History</h3>
          <p className="text-[10px] font-semibold text-text-secondary mt-0.5">Review all past payment activity.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-custom-md border border-border bg-surface text-xs font-bold text-text-secondary hover:text-foreground hover:shadow-soft transition-all cursor-pointer outline-none">
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Paid (30 days)", value: formatCurrency(totalPaid), sub: "Completed payments" },
          { label: "Pending", value: pendingCount, sub: "In transit" },
          { label: "Total Transactions", value: MOCK_PAYMENT_HISTORY.length, sub: "All time" },
        ].map((s, i) => (
          <div key={i} className="rounded-custom-xl border border-border bg-surface p-3.5 space-y-1">
            <p className="text-sm font-black text-foreground">{s.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="text-[9px] font-semibold text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments, references, categories..."
            className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-custom-xl text-xs font-bold text-text-secondary hover:text-foreground transition-all cursor-pointer outline-none bg-surface"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showFilters && "rotate-180")} />
        </button>
      </div>

      {showFilters && (
        <div className="bg-muted/5 border border-border/60 rounded-custom-xl p-4 flex flex-wrap gap-4">
          <div className="space-y-1.5 flex-1 min-w-[140px]">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface border border-border rounded-custom-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {["all", "completed", "pending", "processing", "failed", "reversed"].map((s) => (
                <option key={s} value={s} className="capitalize">{s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[140px]">
            <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-surface border border-border rounded-custom-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {["all", "bill", "transfer", "scheduled", "manual"].map((t) => (
                <option key={t} value={t}>{t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setSearch(""); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-custom-md border border-border text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-custom-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/10 border-b border-border/60">
                {["Recipient", "Category", "Date", "Reference", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground first:pl-4.5 last:pr-4.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((p) => {
                const sc = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.completed;
                return (
                  <tr key={p.id} className="bg-surface hover:bg-muted/5 transition-colors">
                    <td className="px-4.5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0"
                          style={{ backgroundColor: p.logoBg }}
                        >
                          {p.logoInitials}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{p.recipient}</p>
                          <p className="text-[9px] font-semibold text-muted-foreground">{p.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border border-border bg-muted/10 text-muted-foreground">{p.category}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-muted-foreground whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-3.5 font-mono text-muted-foreground text-[10px]">{p.reference}</td>
                    <td className="px-4 py-3.5 font-black text-foreground whitespace-nowrap">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("flex items-center gap-1 font-bold capitalize whitespace-nowrap", sc.cls)}>
                        {sc.icon}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4.5 py-3.5">
                      <button
                        onClick={() => onViewDetails?.(p)}
                        className="text-primary font-bold text-[10px] hover:underline cursor-pointer outline-none flex items-center gap-0.5"
                      >
                        View <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs font-semibold text-muted-foreground">
                    No payments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[9px] font-semibold text-muted-foreground text-center">
        Showing {filtered.length} of {MOCK_PAYMENT_HISTORY.length} transactions
      </p>
    </div>
  );
};
