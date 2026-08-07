"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { History, Landmark } from "lucide-react";
import type { RichTransaction } from "@/constants/mock-transactions";
import { TransactionFilters, DEFAULT_FILTERS, type TransactionFiltersState } from "./TransactionFilters";
import { TransactionList } from "./TransactionList";
import { TransactionDrawer } from "./TransactionDrawer";
import { useAuth, createBrowserClient } from "@/lib/supabase";

interface TransactionsTabProps {
  accountId?: string;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({ accountId }) => {
  const { user } = useAuth();
  const [filters, setFilters] = React.useState<TransactionFiltersState>(DEFAULT_FILTERS);
  const [selectedTransaction, setSelectedTransaction] = React.useState<RichTransaction | null>(null);
  const [transactions, setTransactions] = React.useState<RichTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const supabase = createBrowserClient();
    async function loadTransactions() {
      try {
        let query = supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });
          
        if (accountId) {
          query = query.eq("account_id", accountId);
        }

        const { data, error } = await query;

        if (error) {
          if (error.code === "42P01") {
            setTransactions([]);
            return;
          }
          throw error;
        }

        const formatted = (data || []).map((tx: any): RichTransaction => {
          // Use DB direction field as the authoritative source; amounts are stored as positive values
          const isCredit = tx.direction ? tx.direction === "CREDIT" : tx.amount > 0;
          const direction = isCredit ? "credit" : "debit";
          const initials = tx.merchant ? tx.merchant.substring(0, 2).toUpperCase() : "TX";
          const dateISO = tx.created_at;
          const dateObj = new Date(tx.created_at);
          const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
          const timeStr = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

          return {
            id: tx.id,
            merchant: tx.merchant || "Bank Transaction",
            merchantInitials: initials,
            merchantColor: isCredit ? "#16A34A" : "#DC2626",
            description: tx.description || `${tx.type} payment`,
            amount: Math.abs(tx.amount),
            direction: (tx.direction?.toLowerCase() || direction) as any,
            runningBalance: tx.running_balance || 0,
            date: dateStr,
            time: timeStr,
            dateISO: dateISO,
            status: (tx.status === "success" ? "completed" : tx.status) as any,
            type: tx.type || "other",
            category: tx.type || "Other",
            icon: Landmark,
            referenceNumber: tx.reference_number || tx.id.substring(0, 8).toUpperCase(),
            transactionId: tx.id,
            paymentMethod: tx.payment_method || "Electronic Transfer",
            accountUsed: tx.account_id || "",
            fees: tx.fees || 0.00,
            statusTimeline: [
              { label: "Initiated", time: timeStr, done: true },
              { label: "Processed", time: timeStr, done: tx.status !== "pending" },
              { label: "Completed", time: timeStr, done: tx.status === "success" },
            ],
            balanceBefore: tx.balance_before,
            balanceAfter: tx.balance_after,
            source: tx.source,
            destination: tx.destination,
            recipientName: tx.recipient_name,
            recipientBank: tx.recipient_bank,
            recipientAccountNumber: tx.recipient_account_number,
            destinationCountry: tx.destination_country,
            transferSpeed: tx.transfer_speed,
            createdBy: tx.created_by,
            approvedBy: tx.approved_by,
          };
        });

        setTransactions(formatted);
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();

    // Subscribe to realtime updates for transactions of this account
    const channel = supabase
      .channel(`realtime-account-transactions-${accountId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `account_id=eq.${accountId}`,
        },
        () => {
          loadTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, accountId]);

  // Compute filtered count for filter bar (same logic as TransactionList applies)
  const filteredCount = React.useMemo(() => {
    let result = transactions;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.merchant.toLowerCase().includes(q) ||
          tx.referenceNumber.toLowerCase().includes(q) ||
          tx.description.toLowerCase().includes(q) ||
          Math.abs(tx.amount).toString().includes(q) ||
          tx.transactionId.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") result = result.filter((tx) => tx.type === filters.type);
    if (filters.status !== "all") result = result.filter((tx) => tx.status === filters.status);
    if (filters.direction !== "all") result = result.filter((tx) => tx.direction === filters.direction);
    if (filters.amountMin !== "") {
      const min = parseFloat(filters.amountMin);
      if (!isNaN(min)) result = result.filter((tx) => Math.abs(tx.amount) >= min);
    }
    if (filters.amountMax !== "") {
      const max = parseFloat(filters.amountMax);
      if (!isNaN(max)) result = result.filter((tx) => Math.abs(tx.amount) <= max);
    }
    return result.length;
  }, [transactions, filters]);

  return (
    <>
      <motion.div
        key="transactions-tab-content"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="space-y-5"
      >
        {/* ─── TAB HEADER ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Transaction History
              </h3>
            </div>
            <p className="text-[11px] font-semibold text-text-secondary">
              View, search and manage all activity for this account.
            </p>
          </div>
        </div>

        {/* ─── SEARCH & FILTERS BAR ─────────────────────────────────────────── */}
        <div className="rounded-custom-xl border border-border bg-surface p-4 shadow-soft">
          <TransactionFilters
            filters={filters}
            onChange={setFilters}
            totalCount={transactions.length}
            filteredCount={filteredCount}
          />
        </div>

        {/* ─── TRANSACTION LIST ─────────────────────────────────────────────── */}
        <TransactionList
          transactions={transactions}
          isLoading={loading}
          filters={filters}
          onSelectTransaction={setSelectedTransaction}
        />
      </motion.div>

      {/* ─── TRANSACTION DETAIL DRAWER (portal-like, fixed) ──────────────── */}
      <TransactionDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
};
