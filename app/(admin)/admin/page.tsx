"use client";

import * as React from "react";
import { StatisticCard, DashboardCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Landmark, Send, History, ShieldAlert } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { FeesCard } from "@/components/admin/FeesCard";

interface AuditLog {
  id: string;
  action: string;
  target: string;
  amount: number;
  time: string;
  status: "success";
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();

  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [loadingStats, setLoadingStats] = React.useState(true);

  // Live Statistics States
  const [totalAssetsUsd, setTotalAssetsUsd] = React.useState(0);
  const [activeUsersCount, setActiveUsersCount] = React.useState(0);
  const [pendingTransfersCount, setPendingTransfersCount] = React.useState(0);
  const [totalTransactionsCount, setTotalTransactionsCount] = React.useState(0);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);

  // 1. Role verification check
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

  // 2. Fetch function to load all real overview metrics
  const fetchOverviewStats = React.useCallback(async () => {
    try {
      // A. Total Managed Assets (USD)
      const { data: accounts } = await supabase
        .from("accounts")
        .select("current_balance")
        .eq("currency", "USD");
      const sumAssets = (accounts || []).reduce((acc, a) => acc + Number(a.current_balance), 0);
      setTotalAssetsUsd(sumAssets);

      // B. Registered Customers Count
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      setActiveUsersCount(usersCount || 0);

      // C. Pending Wire Transfers Count
      const { count: pendingCount } = await supabase
        .from("transfer_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "PENDING_APPROVAL");
      setPendingTransfersCount(pendingCount || 0);

      // D. Audited Transactions Count
      const { count: txCount } = await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true });
      setTotalTransactionsCount(txCount || 0);

      // E. Recent Security/Credit Audit Logs
      const { data: audits } = await supabase
        .from("credit_audits")
        .select("id, customer_id, amount, reference, created_at")
        .order("created_at", { ascending: false })
        .limit(4);

      if (audits && audits.length > 0) {
        // Fetch profiles matching customer_id in audits to display clean names
        const customerIds = Array.from(new Set(audits.map((a) => a.customer_id)));
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", customerIds);

        const mapped = audits.map((log) => {
          const prof = (profiles || []).find((p) => p.id === log.customer_id);
          const name = prof ? `${prof.first_name} ${prof.last_name}` : `ID: ${log.customer_id.substring(0, 8)}`;
          return {
            id: log.id,
            action: "Balance Credit Adjust",
            target: `To: ${name} • Ref: ${log.reference}`,
            amount: Number(log.amount),
            time: new Date(log.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "success" as const,
          };
        });
        setAuditLogs(mapped);
      } else {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error("Error loading admin overview stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, [supabase]);

  // 3. Initial load & Realtime subscription sync
  React.useEffect(() => {
    if (user && isAdmin === true) {
      fetchOverviewStats();

      // Realtime channel definitions
      const accountsChannel = supabase
        .channel("overview-accounts-sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "accounts" }, () => {
          fetchOverviewStats();
        })
        .subscribe();

      const profilesChannel = supabase
        .channel("overview-profiles-sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
          fetchOverviewStats();
        })
        .subscribe();

      const transfersChannel = supabase
        .channel("overview-transfers-sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "transfer_requests" }, () => {
          fetchOverviewStats();
        })
        .subscribe();

      const transactionsChannel = supabase
        .channel("overview-transactions-sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
          fetchOverviewStats();
        })
        .subscribe();

      const auditsChannel = supabase
        .channel("overview-audits-sync")
        .on("postgres_changes", { event: "*", schema: "public", table: "credit_audits" }, () => {
          fetchOverviewStats();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(accountsChannel);
        supabase.removeChannel(profilesChannel);
        supabase.removeChannel(transfersChannel);
        supabase.removeChannel(transactionsChannel);
        supabase.removeChannel(auditsChannel);
      };
    }
  }, [user, isAdmin, fetchOverviewStats, supabase]);

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
            Only authenticated administrators may access the command control console.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Console Command Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Realtime database integrations and registered user operations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 mobile:grid-cols-2 laptop:grid-cols-4">
        <StatisticCard
          label="Total Managed Assets"
          value={loadingStats ? "..." : formatCurrency(totalAssetsUsd, "USD")}
          changeLabel="live USD accounts ledger total"
          icon={Landmark}
        />
        <StatisticCard
          label="Active Users"
          value={loadingStats ? "..." : formatNumber(activeUsersCount)}
          changeLabel="kyc signups register count"
          icon={Users}
        />
        <StatisticCard
          label="Pending Wire Transfers"
          value={loadingStats ? "..." : formatNumber(pendingTransfersCount)}
          changeLabel="awaiting administrator audit"
          icon={Send}
        />
        <StatisticCard
          label="Audited Transactions"
          value={loadingStats ? "..." : formatNumber(totalTransactionsCount)}
          changeLabel="total ledger logs registered"
          icon={History}
        />
      </div>

      {/* Main Console Data Logs Grid */}
      <div className="grid gap-6 laptop:grid-cols-3">
        <div className="laptop:col-span-2">
          <DashboardCard
            title="Recent Security Audit Logs"
            subtitle="Live stream of system credit adjustments and ledger adjustments."
          >
            <div className="divide-y divide-border/40 font-semibold">
              {auditLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground select-none">
                  No administrator ledger modifications registered yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-3.5">
                    <div>
                      <p className="text-sm font-bold text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {log.target} • {log.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-success">
                        +{formatCurrency(log.amount)}
                      </span>
                      <Badge variant="success">{log.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <FeesCard />
        </div>
      </div>
    </div>
  );
}
