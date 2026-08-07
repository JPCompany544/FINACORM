"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { AccountService } from "@/lib/services/account/AccountService";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  DollarSign,
  X,
  User,
  Landmark,
  Calendar,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/components/app-shell";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  customer_number: string;
  email: string;
  account_number: string;
  account_type: string;
  current_balance: number;
  available_balance: number;
  status: string;
  currency: string;
  created_at: string;
}

// ─── DETAIL PANEL ────────────────────────────────────────────────────────────

function CustomerDetailPanel({
  customer,
  onClose,
  onCredit,
}: {
  customer: Customer;
  onClose: () => void;
  onCredit: () => void;
}) {
  return (
    <aside className="w-80 shrink-0 border-l border-border bg-surface flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-foreground">
            Customer File
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Profile & account audit
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-muted/15 text-muted-foreground hover:text-foreground cursor-pointer outline-none transition-colors"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 p-5 space-y-5 text-xs font-semibold text-text-secondary">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/40">
          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-black text-primary select-none uppercase shrink-0">
            {customer.first_name[0]}{customer.last_name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground truncate">
              {customer.first_name} {customer.last_name}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
              {customer.customer_number}
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
            <User className="h-3 w-3 text-primary" /> Profile Information
          </h4>
          <div className="space-y-2.5">
            <Row label="Email" value={customer.email} mono />
            <Row label="Phone" value={customer.phone || "—"} />
            <Row
              label="Member Since"
              value={new Date(customer.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            />
          </div>
        </div>

        {/* Account Section */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 pb-1.5 border-b border-border/30">
            <Landmark className="h-3 w-3 text-primary" /> Account Details
          </h4>
          <div className="space-y-2.5">
            <Row label="Account No." value={customer.account_number} mono />
            <Row
              label="Account Type"
              value={
                customer.account_type && customer.account_type !== "—"
                  ? customer.account_type.charAt(0).toUpperCase() +
                    customer.account_type.slice(1).toLowerCase()
                  : "—"
              }
            />
            <Row label="Currency" value={customer.currency} />
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Status</span>
              <Badge variant={customer.status === "ACTIVE" ? "success" : "failed"}>
                {customer.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Balance Box */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Current Balance
              </p>
              <p className="text-xl font-black text-foreground mt-0.5">
                {formatCurrency(customer.current_balance, customer.currency)}
              </p>
            </div>
          </div>
          <div className="border-t border-primary/10 pt-3 flex justify-between">
            <span className="text-muted-foreground">Available</span>
            <span className="font-black text-foreground">
              {formatCurrency(customer.available_balance, customer.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-border/60 shrink-0">
        {customer.status === "ACTIVE" ? (
          <button
            onClick={onCredit}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer outline-none"
          >
            <DollarSign className="h-4 w-4" />
            Credit Account
          </button>
        ) : (
          <div className="p-3 bg-muted/10 border border-border/40 text-center rounded-lg text-[10px] font-bold text-muted-foreground">
            Inactive account — cannot be adjusted.
          </div>
        )}
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-text-secondary shrink-0">{label}</span>
      <span
        className={cn(
          "text-foreground font-bold text-right truncate max-w-[160px]",
          mono && "font-mono text-[10px]"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── CREDIT MODAL ─────────────────────────────────────────────────────────────

function CreditModal({
  customer,
  onClose,
  onSuccess,
  adminId,
}: {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
  adminId: string;
}) {
  const supabase = createBrowserClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [amount, setAmount] = React.useState("");
  const [currency, setCurrency] = React.useState(customer.currency || "USD");
  const [reference, setReference] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [confirming, setConfirming] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
      errs.amount = "Amount must be greater than zero.";
    if (!reference.trim()) errs.reference = "Reference code is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setConfirming(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await AccountService.credit(supabase, {
        customerId: customer.id,
        amount: parseFloat(amount),
        currency,
        reference,
        description: description || `Credit: ${reference}`,
        performedBy: adminId,
      });
      if (res.success) {
        toastSuccess("Credit Applied", `${formatCurrency(parseFloat(amount), currency)} credited to ${customer.first_name} ${customer.last_name}.`);
        onSuccess();
        onClose();
      } else {
        toastError("Credit Failed", res.error || "Could not process the credit.");
        setConfirming(false);
      }
    } catch (err: any) {
      toastError("Error", err.message || "An unexpected error occurred.");
      setConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={() => { if (!isSubmitting) onClose(); }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="bg-surface border border-border w-full max-w-md rounded-xl shadow-xl relative z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <p className="text-sm font-black uppercase tracking-widest text-foreground">
            {confirming ? "Confirm Credit" : "Credit Account"}
          </p>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-md hover:bg-muted/15 text-muted-foreground hover:text-foreground outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {confirming ? (
          <div className="p-6 space-y-5 text-center">
            <div className="p-3 bg-primary/5 border border-primary/10 text-primary rounded-full w-fit mx-auto">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-text-secondary leading-relaxed">
                You are about to credit{" "}
                <span className="font-extrabold font-mono text-foreground">
                  {formatCurrency(parseFloat(amount) || 0, currency)}
                </span>{" "}
                to{" "}
                <span className="font-extrabold text-foreground">
                  {customer.first_name} {customer.last_name}
                </span>
                .
              </p>
              <p className="text-[10px] text-muted-foreground">
                Ref: {reference}
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                disabled={isSubmitting}
                onClick={() => setConfirming(false)}
                className="flex-1 py-2.5 border border-border bg-surface text-foreground font-bold hover:bg-muted/10 rounded-lg cursor-pointer outline-none text-xs"
              >
                Go Back
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold hover:opacity-90 rounded-lg cursor-pointer outline-none text-xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Recipient info */}
            <div className="flex items-center gap-3 p-3 bg-muted/10 border border-border/40 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary uppercase shrink-0">
                {customer.first_name[0]}{customer.last_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {customer.first_name} {customer.last_name}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {customer.account_number}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label htmlFor="credit-amount" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground pointer-events-none">$</span>
                <input
                  id="credit-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-background border border-border/80 rounded-lg pl-8 pr-14 py-2.5 font-mono text-sm font-bold outline-none focus:ring-2 focus:ring-primary/25"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">
                  {currency}
                </span>
              </div>
              {errors.amount && (
                <p className="text-[9px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.amount}
                </p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <label htmlFor="credit-currency" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Currency *
              </label>
              <select
                id="credit-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-background border border-border/80 rounded-lg px-3.5 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="CAD">CAD — Canadian Dollar</option>
              </select>
            </div>

            {/* Reference */}
            <div className="space-y-1.5">
              <label htmlFor="credit-ref" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Reference *
              </label>
              <input
                id="credit-ref"
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. KYC-ADJ-928"
                className="w-full bg-background border border-border/80 rounded-lg px-3.5 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/25"
              />
              {errors.reference && (
                <p className="text-[9px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.reference}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="credit-desc" className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Description <span className="normal-case font-semibold text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="credit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Reason for adjustment..."
                rows={2}
                className="w-full bg-background border border-border/80 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/25 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-border bg-surface text-foreground font-bold hover:bg-muted/10 rounded-lg cursor-pointer outline-none text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold hover:opacity-90 rounded-lg cursor-pointer outline-none text-xs"
              >
                Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const { error: toastError } = useToast();
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 8;

  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = React.useState(false);

  // Role check
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

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

  const loadCustomers = React.useCallback(async (): Promise<Customer[]> => {
    setLoading(true);
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc("get_all_customers");
      if (!rpcErr && rpcData) {
        setCustomers(rpcData);
        return rpcData;
      }

      // Fallback: manual join
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      const { data: accounts } = await supabase.from("accounts").select("*");

      const joined: Customer[] = (profiles || []).map((p: any) => {
        const accs = (accounts || []).filter((a: any) => a.user_id === p.id);
        const acc = accs.find((a: any) => a.account_type?.toUpperCase() === "CHECKING") || accs[0] || null;
        return {
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          phone: p.phone ?? null,
          customer_number: p.customer_number,
          email: p.email ?? "—",
          account_number: acc?.account_number ?? "No account",
          account_type: acc?.account_type ?? "—",
          current_balance: acc ? Number(acc.current_balance) : 0,
          available_balance: acc ? Number(acc.available_balance) : 0,
          status: acc?.status ?? "INACTIVE",
          currency: acc?.currency ?? "USD",
          created_at: p.created_at,
        };
      });

      setCustomers(joined);
      return joined;
    } catch (err) {
      console.error("Error loading customers:", err);
      return [];
    } finally {
      setLoading(false);
    }
  // supabase instance is stable; selectedCustomer intentionally excluded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  React.useEffect(() => {
    if (user && isAdmin === true) {
      loadCustomers();
    }
  }, [user, isAdmin, loadCustomers]);

  const filteredCustomers = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return customers.filter((c) =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q) ||
      (c.customer_number ?? "").toLowerCase().includes(q) ||
      (c.account_number ?? "").toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage]);

  React.useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const handleCreditSuccess = React.useCallback(async () => {
    const freshList = await loadCustomers();
    if (selectedCustomer) {
      const fresh = freshList.find((c) => c.id === selectedCustomer.id);
      if (fresh) setSelectedCustomer(fresh);
    }
  }, [loadCustomers, selectedCustomer]);

  // ─── GUARDS ───────────────────────────────────────────────────────────────

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
          <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
            Access Restricted
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm">
            Only authenticated administrators may access customer registry operations.
          </p>
        </div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Page heading */}
      <div className="px-1 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Base Operations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage customer directories, KYC registers, and adjust transaction balances.
        </p>
      </div>

      {/* Split pane */}
      <div className="flex flex-1 rounded-xl border border-border overflow-hidden bg-surface min-h-0">
        {/* LEFT — Customer Table */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60 shrink-0">
            <div>
              <p className="text-sm font-black text-foreground">Registered Accounts Registry</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {totalItems} {totalItems === 1 ? "customer" : "customers"} found
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, account..."
                className="bg-background border border-border/80 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 w-56"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs font-semibold text-text-secondary">
              <thead className="sticky top-0 bg-surface z-10">
                <tr className="border-b border-border/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Customer No.</th>
                  <th className="py-3 px-5">Email</th>
                  <th className="py-3 px-5">Account No.</th>
                  <th className="py-3 px-5">Type</th>
                  <th className="py-3 px-5 text-right">Balance</th>
                  <th className="py-3 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
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
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No customers match your search.
                    </td>
                  </tr>
                ) : (
                  paginated.map((cust) => {
                    const selected = selectedCustomer?.id === cust.id;
                    return (
                      <tr
                        key={cust.id}
                        onClick={() => setSelectedCustomer(cust)}
                        className={cn(
                          "border-b border-border/10 cursor-pointer transition-colors",
                          selected
                            ? "bg-primary/5 border-l-2 border-l-primary"
                            : "hover:bg-muted/8"
                        )}
                      >
                        <td className="py-3.5 px-5 font-bold text-foreground whitespace-nowrap">
                          {cust.first_name} {cust.last_name}
                        </td>
                        <td className="py-3.5 px-5 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                          {cust.customer_number}
                        </td>
                        <td className="py-3.5 px-5 max-w-[160px]">
                          <span className="truncate block">{cust.email}</span>
                        </td>
                        <td className="py-3.5 px-5 font-mono text-[10px] whitespace-nowrap">
                          {cust.account_number}
                        </td>
                        <td className="py-3.5 px-5 capitalize whitespace-nowrap">
                          {cust.account_type !== "—"
                            ? cust.account_type.charAt(0).toUpperCase() +
                              cust.account_type.slice(1).toLowerCase()
                            : "—"}
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-foreground whitespace-nowrap">
                          {formatCurrency(cust.current_balance, cust.currency)}
                        </td>
                        <td className="py-3.5 px-5 text-center whitespace-nowrap">
                          <Badge variant={cust.status === "ACTIVE" ? "success" : "failed"}>
                            {cust.status}
                          </Badge>
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

        {/* RIGHT — Detail Panel (only rendered when a customer is selected) */}
        {selectedCustomer && (
          <CustomerDetailPanel
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onCredit={() => setIsCreditModalOpen(true)}
          />
        )}
      </div>

      {/* Credit Modal */}
      {isCreditModalOpen && selectedCustomer && user && (
        <CreditModal
          customer={selectedCustomer}
          adminId={user.id}
          onClose={() => setIsCreditModalOpen(false)}
          onSuccess={handleCreditSuccess}
        />
      )}
    </div>
  );
}
