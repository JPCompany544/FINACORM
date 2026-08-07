"use client";

import * as React from "react";
import Link from "next/link";
import { PageContainer, PageHeader, PageBody, useToast } from "@/components/app-shell";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Download,
  Search,
  DollarSign,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Wallet,
  Compass,
  ArrowRight,
  Send,
  FileText,
  Globe,
} from "lucide-react";
import { useAuth, createBrowserClient } from "@/lib/supabase";

interface AccountItem {
  id: string;
  name: string;
  number: string;
  availableBalance: number;
  currentBalance: number;
  currency: string;
  status: "Active" | "Frozen";
  type: "Checking" | "Savings" | "Investments";
  lastActivity: string;
}

// ─── ACCOUNT ICON MAP ──────────────────────────────────────────────────────────
const ICON_MAP = {
  Checking: Wallet,
  Savings: Landmark,
  Investments: Compass,
};

// ─── FILTER TABS ──────────────────────────────────────────────────────────────
const TABS = ["All", "Checking", "Savings", "Investments"] as const;
type TabType = (typeof TABS)[number];

// ─── QUICK ACTION CONFIG ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Wire Transfer", icon: Send, toastType: "success" as const, message: "Secure wire transfer session opened." },
  { label: "Check Deposit", icon: Download, toastType: "success" as const, message: "Mobile check deposit scanner activated." },
  { label: "View Statements", icon: FileText, toastType: "info" as const, message: "Exporting quarterly statement log PDF..." },
  { label: "Download IBAN", icon: Globe, toastType: "success" as const, message: "IBAN and SWIFT credentials PDF downloaded." },
];

export default function AccountsPage() {
  const { success, info } = useToast();
  const { user } = useAuth();
  const [accounts, setAccounts] = React.useState<AccountItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabType>("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (!user) return;

    const supabase = createBrowserClient();
    async function loadAccounts() {
      try {
        const { data, error } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user!.id);

        if (error) throw error;

        const formatted = (data || []).map((acc: any) => ({
          id: acc.id,
          name: acc.account_type === "CHECKING" ? "Primary Checking Account" : acc.account_type,
          number: acc.account_number,
          availableBalance: acc.available_balance,
          currentBalance: acc.current_balance,
          currency: acc.currency,
          status: acc.status as "Active" | "Frozen",
          type: (acc.account_type === "CHECKING" ? "Checking" : acc.account_type) as "Checking" | "Savings" | "Investments",
          lastActivity: "No recent activity",
        }));

        setAccounts(formatted);
      } catch (err) {
        console.error("Error loading accounts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, [user]);

  // ─── CALCULATE DYNAMIC SUMMARY TILES ──────────────────────────────────────────
  const checkingTotal = accounts
    .filter((a) => a.type === "Checking")
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const savingsTotal = accounts
    .filter((a) => a.type === "Savings")
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const investmentsTotal = accounts
    .filter((a) => a.type === "Investments")
    .reduce((sum, a) => sum + a.availableBalance, 0);

  const totalNet = accounts.reduce((sum, a) => sum + a.availableBalance, 0);

  const summaryTiles = [
    {
      label: "Checking Balance",
      value: checkingTotal,
      status: "Active",
      trend: "+0.0%",
      icon: DollarSign,
      highlight: false,
    },
    {
      label: "Savings Balance",
      value: savingsTotal,
      status: "Active",
      trend: "+0.0%",
      icon: TrendingUp,
      highlight: false,
    },
    {
      label: "Investments Portfolio",
      value: investmentsTotal,
      status: "Active",
      trend: "+0.0%",
      icon: Landmark,
      highlight: false,
    },
    {
      label: "Total Net Assets",
      value: totalNet,
      status: "Secured",
      trend: "+0.0%",
      icon: ShieldCheck,
      highlight: true,
    },
  ];

  // ─── FILTER LOGIC ────────────────────────────────────────────────────────────
  const filteredAccounts = React.useMemo((): AccountItem[] => {
    return accounts.filter((acc) => {
      const matchType = activeTab === "All" || acc.type === activeTab;
      const q = searchQuery.toLowerCase();
      const matchQuery = !q || acc.name.toLowerCase().includes(q) || acc.number.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [accounts, activeTab, searchQuery]);

  const handleAction = (toastType: "success" | "info", message: string) => {
    if (toastType === "success") success("Action Triggered", message);
    else info("Action Triggered", message);
  };

  return (
    <PageContainer>
      {/* ─── PAGE HEADER ────────────────────────────────────────────────────── */}
      <PageHeader
        title="Accounts"
        description="Manage and monitor all your financial accounts in one place."
        primaryAction={
          <button
            onClick={() => success("Portal Opening", "Opening new account application portal...")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Plus className="h-4 w-4" />
            Open New Account
          </button>
        }
        secondaryAction={
          <button
            onClick={() => success("Summary Exported", "Net asset statement exported as PDF.")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer outline-none"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            Download Summary
          </button>
        }
      />

      <PageBody className="space-y-8">
        {/* SECTION 1 — ACCOUNT SUMMARY TILES */}
        <div className="grid gap-4 grid-cols-1 mobile:grid-cols-2 laptop:grid-cols-4">
          {summaryTiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  "rounded-custom-xl border p-5 flex flex-col justify-between shadow-soft hover:shadow-medium transition-all select-none",
                  tile.highlight
                    ? "border-primary/20 bg-primary/5"
                    : "border-border bg-surface"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    {tile.label}
                  </span>
                  <span
                    className={cn(
                      "text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border",
                      tile.highlight
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-success/5 border-success/20 text-success"
                    )}
                  >
                    {tile.status}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xl laptop:text-2xl font-black text-foreground tracking-tight">
                    {formatCurrency(tile.value)}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-success leading-none">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {tile.trend}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION 2 — QUICK ACTIONS */}
        <div className="space-y-3">
          <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-0.5">
            Account Actions
          </h3>
          <div className="grid gap-3 grid-cols-2 tablet:grid-cols-4">
            {QUICK_ACTIONS.map((act) => {
              const Icon = act.icon;
              return (
                <motion.button
                  key={act.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAction(act.toastType, act.message)}
                  className="flex items-center gap-3 p-4 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:bg-primary/5 transition-all text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <div className="p-2 bg-muted/10 rounded-lg shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{act.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3 — FILTERS + SEARCH */}
        <div className="flex flex-col tablet:flex-row gap-4 items-stretch tablet:items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-1 bg-muted/10 border border-border/60 p-1 rounded-custom-xl shrink-0 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-custom-lg text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  activeTab === tab
                    ? "bg-surface text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts..."
              className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>

        {/* SECTION 4 — ACCOUNT LIST */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 tablet:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-custom-xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredAccounts.length > 0 ? (
              <motion.div
                key="accounts-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid gap-4 grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3"
              >
                {filteredAccounts.map((acc, idx) => {
                  const Icon = ICON_MAP[acc.type] || Wallet;
                  return (
                    <motion.div
                      key={acc.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.06 }}
                    >
                      <Link
                        href={`/dashboard/accounts/${acc.id}`}
                        className="block rounded-custom-xl border border-border bg-surface p-5 hover:shadow-medium hover:border-primary/20 transition-all select-none group outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-soft"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-xl border border-border/80 bg-primary/5 text-primary flex items-center justify-center shrink-0">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-foreground truncate group-hover:text-primary transition-colors">
                                {acc.name}
                              </h4>
                              <p className="text-[10px] font-bold text-muted-foreground mt-0.5 tracking-wider">
                                {acc.number}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase border border-success/20 bg-success/5 px-2 py-0.5 rounded text-success tracking-wider shrink-0">
                            {acc.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-5 border-y border-border/40 py-3.5">
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground block leading-none">
                              Available Balance
                            </span>
                            <p className="text-base font-black text-foreground leading-none tracking-tight">
                              {formatCurrency(acc.availableBalance)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground block leading-none">
                              Current Ledger
                            </span>
                            <p className="text-sm font-extrabold text-text-secondary leading-none tracking-tight">
                              {formatCurrency(acc.currentBalance)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <p className="text-[10px] font-semibold text-text-secondary truncate max-w-[160px]">
                            {acc.lastActivity}
                          </p>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-custom-md border border-border group-hover:border-primary/20 group-hover:bg-primary/5 text-[10px] font-extrabold text-foreground group-hover:text-primary transition-all shrink-0">
                            View Details
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center text-center p-12 rounded-custom-xl border border-dashed border-border bg-surface/40 my-6 space-y-4"
              >
                <div className="p-4 bg-muted/5 border border-border/60 rounded-full text-muted-foreground">
                  <Landmark className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-foreground">No accounts found</h4>
                  <p className="text-xs text-text-secondary">No accounts match your current filter or search.</p>
                </div>
                <button
                  onClick={() => { setActiveTab("All"); setSearchQuery(""); }}
                  className="px-4 py-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </PageBody>
    </PageContainer>
  );
}
