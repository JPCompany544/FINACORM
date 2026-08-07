"use client";

import * as React from "react";
import { Search, Calendar, FileText, ChevronDown, CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth, createBrowserClient } from "@/lib/supabase";

interface TransferRequestItem {
  id: string;
  recipient_name: string;
  recipient_bank: string;
  destination_country: string;
  recipient_account_number: string;
  routing_information: string;
  amount: number;
  currency: string;
  transfer_type: string;
  transfer_speed: string;
  description: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "DECLINED";
  admin_reason?: string;
  created_at: string;
  updated_at: string;
}

interface TransferHistoryProps {
  onSelectRecord: (record: any) => void;
}

const STATUS_CONFIGS = {
  PENDING_APPROVAL: {
    icon: Clock,
    color: "text-warning bg-warning/10 border-warning/20 animate-pulse",
    label: "Awaiting Bank Approval",
  },
  APPROVED: {
    icon: CheckCircle2,
    color: "text-success bg-success/10 border-success/20",
    label: "Transfer Approved",
  },
  DECLINED: {
    icon: XCircle,
    color: "text-error bg-error/10 border-error/20",
    label: "Transfer Declined",
  },
};

export const TransferHistory: React.FC<TransferHistoryProps> = ({ onSelectRecord }) => {
  const { user } = useAuth();
  const [requests, setRequests] = React.useState<TransferRequestItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const loadTransfers = React.useCallback(async () => {
    if (!user) return;
    const supabase = createBrowserClient();
    try {
      const { data, error } = await supabase
        .from("transfer_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "42P01") {
          setRequests([]);
          return;
        }
        throw error;
      }

      setRequests(data || []);
    } catch (err) {
      console.error("Error loading transfer requests:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch and Realtime subscription setup
  React.useEffect(() => {
    if (!user) return;
    const supabase = createBrowserClient();

    loadTransfers();

    const channel = supabase
      .channel(`realtime-customer-transfers-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transfer_requests",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTransfers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadTransfers]);

  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      const matchSearch =
        req.recipient_name.toLowerCase().includes(search.toLowerCase()) ||
        req.recipient_bank.toLowerCase().includes(search.toLowerCase()) ||
        req.id.toLowerCase().includes(search.toLowerCase());

      const matchType = typeFilter === "all" || req.transfer_type === typeFilter;
      const matchStatus = statusFilter === "all" || req.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [requests, search, typeFilter, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-4 select-none">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-custom-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── FILTERS HEADER ─── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-border/40 pb-4 select-none">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transfer history..."
            aria-label="Search transfer history"
            className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center flex-wrap">
          {/* Type Select */}
          <div className="relative">
            <select
              aria-label="Filter transfer type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-surface border border-border/85 rounded-custom-lg pl-3 pr-8 py-1.5 text-xs font-bold text-foreground cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Types</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              aria-label="Filter transfer status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-surface border border-border/85 rounded-custom-lg pl-3 pr-8 py-1.5 text-xs font-bold text-foreground cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="DECLINED">Declined</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ─── LIST ─── */}
      {filteredRequests.length > 0 ? (
        <div className="rounded-custom-xl border border-border bg-surface overflow-hidden shadow-soft">
          {filteredRequests.map((req, idx) => {
            const config = STATUS_CONFIGS[req.status] || STATUS_CONFIGS.PENDING_APPROVAL;
            const StatusIcon = config.icon;
            const dateObj = new Date(req.created_at);

            return (
              <button
                key={req.id}
                onClick={() => {
                  // Format as TransferRecord for compatibility with standard Success/Receipt panel
                  onSelectRecord({
                    id: req.id,
                    receiptNumber: `REQ-${req.id.substring(0, 6).toUpperCase()}`,
                    transactionId: req.id,
                    type: req.transfer_type,
                    status: req.status === "APPROVED" ? "success" : req.status === "DECLINED" ? "failed" : "pending",
                    date: dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
                    time: dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                    dateISO: req.created_at,
                    sender: "Primary checking Account",
                    senderAccount: "•••• 8421",
                    recipient: req.recipient_name,
                    recipientAccount: req.recipient_account_number,
                    bankName: req.recipient_bank,
                    amount: Number(req.amount),
                    fees: req.transfer_type === "international" ? 15.00 : req.transfer_speed === "priority" ? 5.00 : 0.00,
                    reference: `REF-${req.id.substring(0, 8).toUpperCase()}`,
                    notes: req.description || undefined,
                    adminReason: req.admin_reason,
                    lastUpdated: new Date(req.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }),
                  });
                }}
                className={cn(
                  "w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover/30 transition-colors select-none group outline-none focus-visible:ring-1 focus-visible:ring-primary/20",
                  idx < filteredRequests.length - 1 && "border-b border-border/40"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", config.color)}>
                    <StatusIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                      {req.recipient_name}
                    </h4>
                    <p className="text-[10px] font-semibold text-text-secondary mt-0.5 truncate leading-none">
                      {req.recipient_bank} · ID: {req.id.substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[9px] font-semibold text-muted-foreground mt-1 leading-none">
                      Submitted: {dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })} · {config.label}
                    </p>
                    {req.status === "DECLINED" && req.admin_reason && (
                      <p className="text-[9px] font-bold text-error mt-1 leading-none">
                        Reason: {req.admin_reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <span className="text-sm font-black text-foreground block tracking-tight leading-none">
                    {formatCurrency(req.amount)} {req.currency}
                  </span>
                  <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest block leading-none capitalize">
                    {req.transfer_type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-custom-xl bg-surface/50 select-none">
          <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <h4 className="text-xs font-bold text-foreground mb-1">No transfers requests.</h4>
          <p className="text-[10px] text-text-secondary">No recorded transfers requests matched your current filters.</p>
        </div>
      )}
    </div>
  );
};
