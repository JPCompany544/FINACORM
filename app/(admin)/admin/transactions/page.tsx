"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  User,
  Landmark,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/app-shell";

interface TransactionItem {
  id: string;
  user_id: string;
  account_id: string;
  merchant: string;
  description: string;
  amount: number;
  running_balance: number;
  status: string;
  type: string;
  reference_number: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  direction: "CREDIT" | "DEBIT";
  currency: string;
  balance_before: number;
  balance_after: number;
  source?: string;
  destination?: string;
  recipient_name?: string;
  recipient_bank?: string;
  recipient_account_number?: string;
  destination_country?: string;
  transfer_speed?: string;
  created_by?: string;
  approved_by?: string;
  metadata?: any;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    customer_number: string;
  };
}

export default function AdminTransactionsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [transactions, setTransactions] = React.useState<TransactionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [amountMin, setAmountMin] = React.useState<string>("");
  const [amountMax, setAmountMax] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  const [selectedTx, setSelectedTx] = React.useState<TransactionItem | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [hasTableError, setHasTableError] = React.useState(false);

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

  // 2. Fetch all transactions and match with customer profile details
  const loadTransactions = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: txs, error: fetchErr } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) {
        if (fetchErr.code === "42P01") {
          setTransactions([]);
          setHasTableError(true);
          return;
        }
        throw fetchErr;
      }

      setHasTableError(false);

      // Fetch customer profile details
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, customer_number");

      const mapped: TransactionItem[] = (txs || []).map((t: any) => {
        const prof = (profiles || []).find((p) => p.id === t.user_id);
        return {
          ...t,
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

      setTransactions(mapped);

      // Keep selected transaction fresh if updated
      setSelectedTx((prev) => {
        if (!prev) return null;
        return mapped.find((item) => item.id === prev.id) || prev;
      });
    } catch (err) {
      console.error("Error loading transactions:", err);
      setHasTableError(true);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Realtime subscription setup
  React.useEffect(() => {
    if (user && isAdmin === true) {
      loadTransactions();

      const channel = supabase
        .channel("realtime-admin-transactions")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "transactions" },
          () => {
            loadTransactions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin, loadTransactions, supabase]);

  // Filters & Search logic
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchQuery.toLowerCase();
      const customerName = tx.customer
        ? `${tx.customer.first_name} ${tx.customer.last_name}`.toLowerCase()
        : "";
      const customerEmail = tx.customer?.email?.toLowerCase() || "";
      const matchesSearch =
        customerName.includes(q) ||
        customerEmail.includes(q) ||
        tx.id.toLowerCase().includes(q) ||
        (tx.reference_number || "").toLowerCase().includes(q) ||
        (tx.recipient_name || "").toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      const matchesType = typeFilter === "all" || tx.type === typeFilter || (typeFilter === "CREDIT" && tx.type === "ADMIN_CREDIT");

      let matchesAmount = true;
      if (amountMin !== "") {
        const min = parseFloat(amountMin);
        if (!isNaN(min)) matchesAmount = matchesAmount && Math.abs(tx.amount) >= min;
      }
      if (amountMax !== "") {
        const max = parseFloat(amountMax);
        if (!isNaN(max)) matchesAmount = matchesAmount && Math.abs(tx.amount) <= max;
      }

      return matchesSearch && matchesStatus && matchesType && matchesAmount;
    });
  }, [transactions, searchQuery, statusFilter, typeFilter, amountMin, amountMax]);

  // Pagination bounds
  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, amountMin, amountMax]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toastSuccess("Copied", `${label} copied to clipboard.`);
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
            Only authenticated administrators may access the central transaction ledger registry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div className="px-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">Central Transaction Ledger</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Audit and trace all financial activity, debits, credits, and systemic adjustments.
        </p>
      </div>

      {/* Split Pane Container */}
      <div className="flex flex-1 rounded-xl border border-border overflow-hidden bg-surface min-h-0">
        
        {/* LEFT - Table List */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Toolbar Filters Panel */}
          <div className="grid gap-3 p-4 border-b border-border/60 shrink-0 bg-muted/5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, ID, reference..."
                  className="w-full bg-background border border-border/80 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>

              {/* Toolbar Dropdowns */}
              <div className="flex gap-2 items-center flex-wrap">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-background border border-border/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-background border border-border/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground cursor-pointer outline-none focus:ring-2 focus:ring-primary/25"
                >
                  <option value="all">All Types</option>
                  <option value="CREDIT">Credit</option>
                  <option value="TRANSFER_SENT">Transfer Sent</option>
                  <option value="TRANSFER_RECEIVED">Transfer Received</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                </select>
              </div>
            </div>

            {/* Min / Max Amount Filters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground shrink-0">Amount Limits:</span>
              <input
                type="number"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder="Min ($)"
                className="bg-background border border-border/80 rounded-lg px-2 py-1 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 w-24"
              />
              <span className="text-muted-foreground text-xs">–</span>
              <input
                type="number"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder="Max ($)"
                className="bg-background border border-border/80 rounded-lg px-2 py-1 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 w-24"
              />
              {(amountMin || amountMax || searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
                <button
                  onClick={() => {
                    setAmountMin("");
                    setAmountMax("");
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="text-[10px] font-black uppercase text-primary hover:underline ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left text-xs font-semibold text-text-secondary">
              <thead className="sticky top-0 bg-surface z-10 border-b border-border/40">
                <tr className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-5">Reference</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5 text-right">Amount</th>
                  <th className="py-3 px-5">Direction / Type</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {hasTableError ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-error select-none">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-bold text-foreground">Ledger database could not be reached.</span>
                        <span className="text-[10px] text-muted-foreground">Verify transactions table migrations.</span>
                      </div>
                    </td>
                  </tr>
                ) : loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/10 animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4 px-5">
                          <div className="h-3 bg-muted/20 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground select-none">
                      No matching transaction entries found in the ledger.
                    </td>
                  </tr>
                ) : (
                  paginated.map((tx) => {
                    const isCredit = tx.direction === "CREDIT" || tx.amount > 0;
                    const isSelected = selectedTx?.id === tx.id;
                    return (
                      <tr
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className={cn(
                          "border-b border-border/10 cursor-pointer transition-colors",
                          isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/8"
                        )}
                      >
                        <td className="py-3.5 px-5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                          {tx.reference_number || tx.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-foreground whitespace-nowrap">
                          {tx.customer ? `${tx.customer.first_name} ${tx.customer.last_name}` : "System Account"}
                        </td>
                        <td className={cn(
                          "py-3.5 px-5 text-right font-bold whitespace-nowrap",
                          isCredit ? "text-success" : "text-error"
                        )}>
                          {isCredit ? "+" : "−"}{formatCurrency(Math.abs(tx.amount))} {tx.currency || "USD"}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap capitalize">
                          <span className={cn(
                            "text-[10px] font-black mr-2 px-1.5 py-0.5 rounded",
                            isCredit ? "bg-success/10 text-success" : "bg-muted/15 text-muted-foreground"
                          )}>
                            {tx.direction || (isCredit ? "CREDIT" : "DEBIT")}
                          </span>
                          <span className="text-muted-foreground">{tx.type.replace("_", " ")}</span>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <Badge variant={tx.status === "success" ? "success" : tx.status === "failed" ? "failed" : "pending"}>
                            {tx.status === "success" ? "COMPLETED" : tx.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
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

        {/* RIGHT - Detailed Panel */}
        {selectedTx && (
          <aside className="w-80 shrink-0 border-l border-l-border bg-surface flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-foreground">Transaction Trace</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Audit log details</p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-md hover:bg-muted/15 text-muted-foreground hover:text-foreground cursor-pointer outline-none transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List Details */}
            <div className="flex-grow p-5 space-y-6 text-xs font-semibold text-text-secondary leading-none">
              
              {/* Account / User Link */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
                  <User className="h-3 w-3 text-primary" /> Customer Account
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sender Name</span>
                    <span className="text-foreground font-bold">
                      {selectedTx.customer ? `${selectedTx.customer.first_name} ${selectedTx.customer.last_name}` : "System Log"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account ID</span>
                    <span className="text-foreground font-mono text-[10px] truncate max-w-[150px]">
                      {selectedTx.account_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference No.</span>
                    <div className="flex items-center gap-1">
                      <span className="text-foreground font-mono text-[10px]">
                        {selectedTx.reference_number || "—"}
                      </span>
                      {selectedTx.reference_number && (
                        <button onClick={() => handleCopy(selectedTx.reference_number, "Reference")} className="text-muted-foreground hover:text-foreground">
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recipient summary */}
              {(selectedTx.recipient_name || selectedTx.recipient_bank) && (
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
                    <Landmark className="h-3 w-3 text-primary" /> Recipient Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Recipient Name</span>
                      <span className="text-foreground font-bold">{selectedTx.recipient_name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient Bank</span>
                      <span className="text-foreground">{selectedTx.recipient_bank || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number</span>
                      <span className="text-foreground font-mono text-[10px]">{selectedTx.recipient_account_number || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Country</span>
                      <span className="text-foreground">{selectedTx.destination_country || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transfer Speed</span>
                      <span className="text-foreground capitalize">{selectedTx.transfer_speed || "—"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance Card adjustments */}
              <div className="rounded-xl border border-border bg-primary/5 p-4 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Adjusted Amount</span>
                  <Badge variant={selectedTx.status === "success" ? "success" : "failed"}>
                    {selectedTx.status === "success" ? "SUCCESS" : selectedTx.status.toUpperCase()}
                  </Badge>
                </div>
                <p className={cn(
                  "text-xl font-black",
                  selectedTx.direction === "CREDIT" || selectedTx.amount > 0 ? "text-success" : "text-error"
                )}>
                  {selectedTx.direction === "CREDIT" || selectedTx.amount > 0 ? "+" : "−"}{formatCurrency(Math.abs(selectedTx.amount))} {selectedTx.currency || "USD"}
                </p>

                <div className="pt-2.5 border-t border-border/30 space-y-2 text-[10px]">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Balance Before</span>
                    <span className="font-bold text-foreground">{formatCurrency(selectedTx.balance_before || 0)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Balance After</span>
                    <span className="font-bold text-foreground">{formatCurrency(selectedTx.balance_after || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Trace Log Spec */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
                  <FileText className="h-3 w-3 text-primary" /> Trace specification
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Direction</span>
                    <span className="text-foreground font-bold">{selectedTx.direction || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type Key</span>
                    <span className="text-foreground font-mono text-[10px]">{selectedTx.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created By Admin</span>
                    <span className="text-foreground font-mono text-[10px] truncate max-w-[120px]">{selectedTx.created_by || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved By Admin</span>
                    <span className="text-foreground font-mono text-[10px] truncate max-w-[120px]">{selectedTx.approved_by || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description</span>
                    <span className="text-foreground truncate max-w-[150px]">{selectedTx.description}</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
