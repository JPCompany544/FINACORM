"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { TransferService } from "@/lib/services/transfer/TransferService";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Send,
  X,
  User,
  Landmark,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/app-shell";

interface TransferRequest {
  id: string;
  user_id: string;
  source_account_id: string;
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
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    customer_number: string;
  };
}

export default function AdminTransfersPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [requests, setRequests] = React.useState<TransferRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("PENDING_APPROVAL"); // Default to pending
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 8;

  const [selectedRequest, setSelectedRequest] = React.useState<TransferRequest | null>(null);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = React.useState(false);
  const [declineReason, setDeclineReason] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  // 1. Authorization check
  React.useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.role === "admin");
      });
  }, [user, supabase]);

  const [hasTableError, setHasTableError] = React.useState(false);

  // 2. Load transfer requests and fetch user profile metadata
  const loadTransfers = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: reqs, error: fetchErr } = await supabase
        .from("transfer_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) {
        console.warn("Could not load transfer requests (likely table not migrated yet):", fetchErr);
        setHasTableError(true);
        setRequests([]);
        return;
      }

      setHasTableError(false);

      // Fetch customer profile details for each request
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, customer_number");

      const mapped: TransferRequest[] = (reqs || []).map((r: any) => {
        const prof = (profiles || []).find((p) => p.id === r.user_id);
        return {
          ...r,
          customer: prof
            ? {
              first_name: prof.first_name,
              last_name: prof.last_name,
              customer_number: prof.customer_number,
              email: `${prof.first_name.toLowerCase()}.${prof.last_name.toLowerCase()}@northstar.com`,
            }
            : undefined,
        };
      });

      setRequests(mapped);

      // Keep selectedRequest fresh using functional update to avoid dependency issues
      setSelectedRequest((prev) => {
        if (!prev) return null;
        return mapped.find((item) => item.id === prev.id) || prev;
      });
    } catch (err) {
      console.error("Error loading transfer requests:", err);
      setHasTableError(true);
      setRequests([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  // Initial load & Realtime subscription
  React.useEffect(() => {
    if (user && isAdmin === true) {
      loadTransfers();

      const channel = supabase
        .channel("realtime-admin-transfers")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "transfer_requests" },
          () => {
            loadTransfers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin, loadTransfers, supabase]);

  // Filters & Search
  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const customerName = req.customer
        ? `${req.customer.first_name} ${req.customer.last_name}`.toLowerCase()
        : "";
      const customerEmail = req.customer?.email?.toLowerCase() || "";
      const matchesSearch =
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.recipient_name.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  // Pagination bounds
  const totalItems = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Actions
  const handleApprove = async (req: TransferRequest) => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await TransferService.approveTransfer(supabase, req.id, user.id);
      if (res.success) {
        toastSuccess("Transfer Approved", "Fund transfer executed successfully.");
        await loadTransfers();
      } else {
        toastError("Approval Failed", res.error || "Could not complete the approval process.");
      }
    } catch (err: any) {
      toastError("Error", err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!user || !selectedRequest || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await TransferService.declineTransfer(supabase, selectedRequest.id, user.id, declineReason);
      if (res.success) {
        toastSuccess("Transfer Declined", "The request has been updated to DECLINED.");
        setIsDeclineModalOpen(false);
        setDeclineReason("");
        await loadTransfers();
      } else {
        toastError("Decline Failed", res.error || "Could not decline request.");
      }
    } catch (err: any) {
      toastError("Error", err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── AUTH & GUARDS ───
  if (authLoading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-muted-foreground text-xs font-bold animate-pulse">
        Verifying authorizations...
      </div>
    );
  }

  if (!user || isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 space-y-4">
        <div className="p-3.5 bg-red-500/10 border border-red-500/15 text-red-500 rounded-full">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-black text-foreground uppercase tracking-wider">Access Restricted</h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            Only authenticated administrators may access customer wire registry operations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Title */}
      <div className="px-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Wire Transfers Control</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Approve, decline, or audit pending customer outbound wire transfers.
        </p>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 rounded-xl border border-border overflow-hidden bg-surface min-h-0">
        {/* LEFT - Table List */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Toolbar & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/60 shrink-0">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-muted/10 border border-border/60 p-1 rounded-lg w-fit">
              {[
                { id: "PENDING_APPROVAL", label: "Pending" },
                { id: "APPROVED", label: "Approved" },
                { id: "DECLINED", label: "Declined" },
                { id: "all", label: "All" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none",
                    statusFilter === tab.id
                      ? "bg-surface text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, ID, bank..."
                className="bg-background border border-border/80 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 w-60"
              />
            </div>
          </div>

          {/* Requests Table */}
          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left text-xs font-semibold text-text-secondary">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-5">Transfer ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Recipient</th>
                  <th className="py-3 px-5 text-right">Amount</th>
                  <th className="py-3 px-5">Type / Speed</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5">Created At</th>
                </tr>
              </thead>
              <tbody>
                {hasTableError ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-error select-none font-bold">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="h-6 w-6 text-error animate-bounce" />
                        <h4 className="text-xs font-bold text-foreground">Database tables not found.</h4>
                        <p className="text-[10px] text-muted-foreground font-semibold max-w-md">
                          The `transfer_requests` table does not exist in your database yet. Run the `auxiliary_schema.sql` migration script inside the Supabase SQL editor to create the necessary tables.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/10 animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="py-4 px-5">
                          <div className="h-3 bg-muted/20 rounded w-full max-w-[120px]" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground select-none">
                      No transfer requests matching selected filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((req) => {
                    const isSelected = selectedRequest?.id === req.id;
                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={cn(
                          "border-b border-border/10 cursor-pointer transition-colors",
                          isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/8"
                        )}
                      >
                        <td className="py-3.5 px-5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                          {req.id.substring(0, 8).toUpperCase()}...
                        </td>
                        <td className="py-3.5 px-5 font-bold text-foreground whitespace-nowrap">
                          {req.customer ? `${req.customer.first_name} ${req.customer.last_name}` : "Unknown"}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div>{req.recipient_name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">{req.recipient_bank}</div>
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-foreground whitespace-nowrap">
                          {formatCurrency(req.amount)} {req.currency}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap capitalize">
                          {req.transfer_type} <span className="text-[9px] text-muted-foreground">({req.transfer_speed})</span>
                        </td>
                        <td className="py-3.5 px-5 text-center whitespace-nowrap">
                          <Badge
                            variant={
                              req.status === "APPROVED" ? "success" : req.status === "DECLINED" ? "failed" : "pending"
                            }
                          >
                            {req.status === "PENDING_APPROVAL" ? "PENDING" : req.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border/40 shrink-0">
              <span className="text-[10px] font-bold text-muted-foreground">
                {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border border-border hover:bg-muted/10 text-muted-foreground disabled:opacity-40 cursor-pointer outline-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-foreground px-1.5">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded border border-border hover:bg-muted/10 text-muted-foreground disabled:opacity-40 cursor-pointer outline-none"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - Detail Panel */}
        {selectedRequest && (
          <aside className="w-80 shrink-0 border-l border-border bg-surface flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-foreground">Audit Transfer</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Verify and process payment</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-md hover:bg-muted/15 text-muted-foreground hover:text-foreground cursor-pointer outline-none transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Structured details list */}
            <div className="flex-grow p-5 space-y-6 text-xs font-semibold text-text-secondary leading-none">
              {/* Customer summary */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
                  <User className="h-3 w-3 text-primary" /> Submitted Customer
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sender Name</span>
                    <span className="text-foreground font-bold">
                      {selectedRequest.customer ? `${selectedRequest.customer.first_name} ${selectedRequest.customer.last_name}` : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer No.</span>
                    <span className="text-foreground font-mono text-[10px]">
                      {selectedRequest.customer?.customer_number || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="text-foreground truncate max-w-[150px]">{selectedRequest.customer?.email || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Recipient summary */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
                  <Landmark className="h-3 w-3 text-primary" /> Beneficiary Info
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Recipient Name</span>
                    <span className="text-foreground font-bold">{selectedRequest.recipient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient Bank</span>
                    <span className="text-foreground">{selectedRequest.recipient_bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination Country</span>
                    <span className="text-foreground">{selectedRequest.destination_country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number</span>
                    <span className="text-foreground font-mono text-[10px]">{selectedRequest.recipient_account_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routing Info</span>
                    <span className="text-foreground font-mono text-[10px]">{selectedRequest.routing_information}</span>
                  </div>
                </div>
              </div>

              {/* Wire details */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
                  <FileText className="h-3 w-3 text-primary" /> Wire Specification
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Transfer Type</span>
                    <span className="text-foreground capitalize">{selectedRequest.transfer_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed Speed</span>
                    <span className="text-foreground capitalize">{selectedRequest.transfer_speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description</span>
                    <span className="text-foreground truncate max-w-[150px]">{selectedRequest.description || "No notes"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge
                      variant={
                        selectedRequest.status === "APPROVED"
                          ? "success"
                          : selectedRequest.status === "DECLINED"
                            ? "failed"
                            : "pending"
                      }
                    >
                      {selectedRequest.status === "PENDING_APPROVAL" ? "PENDING" : selectedRequest.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Balance Card */}
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Authorized Amount</p>
                <p className="text-xl font-black text-foreground">
                  {formatCurrency(selectedRequest.amount)} {selectedRequest.currency}
                </p>
              </div>

              {/* Audit Trail Details (if approved / declined) */}
              {selectedRequest.status !== "PENDING_APPROVAL" && (
                <div className="p-3 bg-muted/10 border border-border/40 rounded-xl space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Verification Audit</p>
                  <p className="text-[10px] text-foreground font-bold">
                    Action: {selectedRequest.status === "APPROVED" ? "Completed Wire Approval" : "Wire Request Declined"}
                  </p>
                  {selectedRequest.admin_reason && (
                    <p className="text-[10px] text-error font-bold leading-normal">
                      Reason: {selectedRequest.admin_reason}
                    </p>
                  )}
                  <p className="text-[9px] text-muted-foreground">
                    Last Update: {new Date(selectedRequest.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Action CTAs */}
            {selectedRequest.status === "PENDING_APPROVAL" && (
              <div className="p-4 border-t border-border/60 shrink-0 space-y-2">
                <button
                  onClick={() => handleApprove(selectedRequest)}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer outline-none disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" /> Approve Outbound Wire
                </button>
                <button
                  onClick={() => {
                    setDeclineReason("");
                    setIsDeclineModalOpen(true);
                  }}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-error text-error-foreground hover:opacity-90 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer outline-none disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" /> Decline Wire Request
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Decline Reason Modal */}
      {isDeclineModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              if (!isSubmitting) setIsDeclineModalOpen(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-xl p-5 space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-border/40 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                Specify Decline Reason
              </h3>
              <button
                onClick={() => setIsDeclineModalOpen(false)}
                disabled={isSubmitting}
                className="p-1 rounded hover:bg-muted/10 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="decline-notes" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                  Decline Reason Notes
                </label>
                <textarea
                  id="decline-notes"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Compliance verification failed / Insufficient funds check..."
                  rows={3}
                  className="w-full bg-background border border-border/80 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/25 resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsDeclineModalOpen(false)}
                  className="flex-1 py-2 border border-border bg-surface text-foreground font-bold hover:bg-surface-hover rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleDecline}
                  className="flex-1 py-2 bg-error text-error-foreground font-bold hover:opacity-90 rounded-lg text-xs flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? "Declining..." : "Decline Wire"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
