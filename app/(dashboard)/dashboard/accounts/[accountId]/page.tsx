"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageContainer, PageHeader, PageBody, ErrorState, useToast } from "@/components/app-shell";
import { MOCK_ACCOUNTS, AccountItem } from "@/constants/mock-accounts";
import { MOCK_UPCOMING_PAYMENTS, MOCK_INSIGHTS } from "@/constants/mock-dashboard";
import { TransactionsTab } from "@/components/transactions";
import { StatementsTab } from "@/components/statements";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Receipt,
  Download,
  Shield,
  ShieldAlert,
  FileText,
  Copy,
  CheckCircle,
  HelpCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Clock,
  MapPin,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── STATIC DATA FOR DETAILS PAGE ─────────────────────────────────────────────

const MOCK_MANAGER = {
  name: "Emma Vance",
  role: "Senior Asset Relationship Officer",
  email: "e.vance@northstar.bank",
  avatarInitials: "EV",
};

const MOCK_SECURITY = {
  encryption: "256-bit AES",
  twoFactor: "Enabled",
  lastSync: "Just now",
  recentLogin: {
    time: "Today, 4:15 PM",
    device: "macOS Safari",
    ip: "192.168.1.182",
    location: "London, UK",
  },
};

import { useAuth, createBrowserClient } from "@/lib/supabase";
import { loadTawkSupport } from "@/lib/tawk";

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { success, error, info } = useToast();
  
  const accountId = params?.accountId as string;
  const [account, setAccount] = React.useState<AccountItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"Overview" | "Transactions" | "Statements" | "Information">("Overview");

  // Fetch account matching the parameter accountId
  React.useEffect(() => {
    if (!accountId || !user) return;

    const supabase = createBrowserClient();
    async function loadAccount() {
      try {
        const { data, error: fetchErr } = await supabase
          .from("accounts")
          .select("*")
          .eq("id", accountId)
          .eq("user_id", user!.id)
          .single();

        if (fetchErr) throw fetchErr;

        if (data) {
          setAccount({
            id: data.id,
            name: data.account_type === "CHECKING" ? "Primary Checking Account" : data.account_type,
            number: data.account_number,
            availableBalance: data.available_balance,
            currentBalance: data.current_balance,
            currency: data.currency,
            status: data.status as "Active" | "Frozen",
            type: (data.account_type === "CHECKING" ? "Checking" : data.account_type) as "Checking" | "Savings" | "Investments",
            lastActivity: "No recent activity",
            routingNumber: "021000021",
            iban: `US89 NSTR 0210 0002 1000 ${data.account_number.slice(-4)}`,
            swift: "NSTRUS33XXX",
            dateOpened: new Date(data.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
            branch: "Northstar HQ - New York",
          });
        }
      } catch (err) {
        console.error("Error fetching account detail:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [accountId, user]);

  if (loading) {
    return (
      <PageContainer>
        <div className="h-64 bg-muted/20 animate-pulse rounded-custom-xl" />
      </PageContainer>
    );
  }

  if (!account) {
    return (
      <PageContainer>
        <ErrorState
          title="Account Record Not Found"
          description="The requested account ledger identifier could not be verified in the bank catalog database."
          onBack={() => router.push("/dashboard/accounts")}
        />
      </PageContainer>
    );
  }

  // Handle Clipboard Copy
  const handleCopyText = (text: string, fieldLabel: string) => {
    navigator.clipboard.writeText(text);
    success("Copied to Clipboard", `${fieldLabel} copied to clipboard successfully.`);
  };

  const handleToggleFreeze = () => {
    const nextStatus = account.status === "Active" ? "Frozen" : "Active";
    setAccount((prev) => prev ? { ...prev, status: nextStatus } : null);
    if (nextStatus === "Frozen") {
      error("Account Locked", "Outgoing transfers are frozen. Inbound credits remain active.");
    } else {
      success("Account Reactivated", "Account is now fully active for wire transfers.");
    }
  };

  const isFrozen = account.status === "Frozen";

  return (
    <PageContainer>
      {/* ─── BREADCRUMB HEADER ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 select-none shrink-0 mb-2">
        <Link
          href="/dashboard/accounts"
          className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Accounts</span>
        </Link>
      </div>

      <PageHeader
        title={account.name}
        description={`${account.number} • ${account.type} Portfolio Account`}
        primaryAction={
          <span
            className={cn(
              "text-[10px] font-black uppercase border px-3 py-1.5 rounded tracking-widest",
              isFrozen
                ? "bg-error/5 border-error/25 text-error animate-pulse"
                : "bg-success/5 border-success/20 text-success"
            )}
          >
            {account.status}
          </span>
        }
      />

      <PageBody className="space-y-6">
        <div className="grid gap-6 laptop:grid-cols-4 items-start">
          
          {/* ════════════════ LEFT MAIN VIEW (3 cols) ════════════════ */}
          <div className="laptop:col-span-3 space-y-6">
            
            {/* ─── HERO DETAIL CARD ─── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-custom-xl border border-border bg-surface p-6 shadow-floating relative overflow-hidden select-none"
            >
              {/* Decorative radial blur background */}
              <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

              <div className="grid gap-6 md:grid-cols-3">
                {/* Available Balance */}
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Available Balance
                  </span>
                  <div className="text-2xl laptop:text-3xl font-black text-foreground tracking-tight">
                    {formatCurrency(account.availableBalance)}
                  </div>
                  <p className="text-[10px] font-semibold text-text-secondary">
                    Settled funds ready to spend
                  </p>
                </div>

                {/* Current Balance */}
                <div className="space-y-1 md:border-l md:border-border/40 md:pl-6">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Current Balance
                  </span>
                  <div className="text-xl laptop:text-2xl font-extrabold text-foreground tracking-tight">
                    {formatCurrency(account.currentBalance)}
                  </div>
                  <p className="text-[10px] font-semibold text-text-secondary">
                    Total balance including pending transactions
                  </p>
                </div>

                {/* Account Details / Identifiers */}
                <div className="space-y-1 md:border-l md:border-border/40 md:pl-6">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Credit line available
                  </span>
                  <div className="text-lg font-bold text-foreground">
                    {account.creditLimit ? formatCurrency(account.creditLimit) : "Not Applicable"}
                  </div>
                  <p className="text-[10px] font-semibold text-text-secondary">
                    Overdraft protection facility
                  </p>
                </div>
              </div>

              {/* Masked credentials footer bar */}
              <div className="mt-6 pt-5 border-t border-border/40 grid gap-4 sm:grid-cols-3 text-xs font-semibold text-text-secondary leading-normal">
                {/* Routing Copy */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/5 group">
                  <div className="min-w-0">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block leading-none">
                      ABA Routing Number
                    </span>
                    <span className="font-mono text-foreground text-xs font-bold block mt-1 leading-none">
                      {account.routingNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyText(account.routingNumber, "Routing number")}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded"
                    aria-label="Copy ABA routing number"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Account Number Copy */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/5 group">
                  <div className="min-w-0">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block leading-none">
                      Account Number
                    </span>
                    <span className="font-mono text-foreground text-xs font-bold block mt-1 leading-none">
                      {account.number}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyText(account.number, "Account number")}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded"
                    aria-label="Copy account number"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* IBAN Copy */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/5 group">
                  <div className="min-w-0">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block leading-none">
                      International IBAN
                    </span>
                    <span className="font-mono text-foreground text-xs font-bold block mt-1 leading-none truncate max-w-[130px]">
                      {account.iban}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyText(account.iban, "IBAN number")}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded"
                    aria-label="Copy international IBAN"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ─── QUICK ACTIONS ─── */}
            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-5 select-none">
              {[
                { label: "Transfer Funds", icon: Send, onClick: () => success("Transfer Terminal Opened", "Outbound wire window active.") },
                { label: "Pay Utility Bill", icon: Receipt, onClick: () => info("Utility Invoice Catalog", "Opening statements pay widget.") },
                { label: "Deposit Check", icon: Download, onClick: () => success("Deposit scan active", "Ready for scanning check documents.") },
                {
                  label: isFrozen ? "Unfreeze Account" : "Freeze Account",
                  icon: isFrozen ? ShieldCheck : Shield,
                  onClick: handleToggleFreeze,
                  activeColor: isFrozen ? "bg-success/5 border-success/20 text-success" : "bg-error/5 border-error/20 text-error",
                },
                { label: "View Statements", icon: FileText, onClick: () => info("Statement logs downloaded", "Exporting statement journal PDF...") },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.label}
                    onClick={act.onClick}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:bg-primary/5 transition-all text-center cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20",
                      act.activeColor
                    )}
                  >
                    <div className="p-2 bg-muted/10 rounded-lg text-muted-foreground group-hover:text-primary mb-2">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[10px] font-black leading-none">{act.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ─── TABBED VIEW SEPARATOR ─── */}
            <div className="space-y-4">
              <div
                className="flex items-center gap-1 bg-muted/10 border border-border/60 p-1 rounded-custom-xl w-fit select-none"
                role="tablist"
                aria-label="Account ledger modules"
              >
                {(["Overview", "Transactions", "Statements", "Information"] as const).map((tab) => {
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      role="tab"
                      aria-selected={isActive}
                      className={cn(
                        "px-4 py-1.5 rounded-custom-lg text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                        isActive
                          ? "bg-surface text-foreground shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* ─── TABS CONTENT PANELS ─── */}
              <AnimatePresence mode="wait">
                
                {/* ════ OVERVIEW TAB PANEL ════ */}
                {activeTab === "Overview" && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Visual income vs spending */}
                    <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4.5 shadow-soft select-none">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Income vs Spending Breakdown
                      </h4>
                      
                      <div className="space-y-3.5">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1 text-success">
                              <TrendingUp className="h-4 w-4" /> Total Cash Inflow
                            </span>
                            <span className="text-foreground">$5,240.00</span>
                          </div>
                          <div className="h-2 w-full bg-divider rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: "70%" }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1 text-foreground">
                              <TrendingDown className="h-4 w-4 text-muted-foreground" /> Total Expenditures
                            </span>
                            <span className="text-foreground">$1,842.10</span>
                          </div>
                          <div className="h-2 w-full bg-divider rounded-full overflow-hidden">
                            <div className="h-full bg-foreground rounded-full" style={{ width: "28%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] font-semibold text-text-secondary leading-relaxed bg-muted/10 border border-border/40 p-3 rounded-lg">
                        Surplus Net Capital: You retained <span className="font-extrabold text-foreground">$3,397.90 (64.8%)</span> of total deposits.
                      </div>
                    </div>

                    {/* Insights alerts */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                        Intelligent Insights
                      </h4>
                      <div className="grid gap-3.5 sm:grid-cols-2">
                        {MOCK_INSIGHTS.slice(0, 2).map((ins) => (
                          <div
                            key={ins.id}
                            className="p-4 rounded-custom-xl border border-border bg-surface flex gap-3 items-start select-none"
                          >
                            <div className="p-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary shrink-0">
                              <CheckCircle className="h-3.5 w-3.5" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-extrabold text-foreground">{ins.title}</h5>
                              <p className="text-[10px] font-semibold text-text-secondary leading-normal">
                                {ins.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming scheduled payments */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                        Upcoming account payments
                      </h4>
                      <div className="space-y-2">
                        {MOCK_UPCOMING_PAYMENTS.slice(0, 2).map((pay) => (
                          <div
                            key={pay.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface select-none"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {React.createElement(pay.icon, { className: "h-4 w-4 text-muted-foreground shrink-0" })}
                              <span className="text-xs font-bold text-foreground truncate">{pay.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-extrabold text-foreground">
                                {formatCurrency(pay.amount)}
                              </span>
                              <span className="text-[9px] font-extrabold text-muted-foreground">
                                Due {pay.dueDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ════ TRANSACTIONS TAB PANEL ════ */}
                {activeTab === "Transactions" && (
                  <TransactionsTab accountId={accountId} />
                )}

                {/* ════ STATEMENTS TAB PANEL ════ */}
                {activeTab === "Statements" && (
                  <StatementsTab accountId={accountId} />
                )}

                {/* ════ INFORMATION TAB PANEL ════ */}
                {activeTab === "Information" && (
                  <motion.div
                    key="tab-info"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5 select-none"
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Account ledger credentials profile
                    </h4>

                    <div className="rounded-xl border border-border bg-surface p-5 space-y-4 shadow-soft text-xs font-semibold text-text-secondary leading-none">
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>Account Number</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-foreground font-bold">{account.number}</span>
                          <button
                            onClick={() => handleCopyText(account.number, "Account number")}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>Routing Number</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-foreground font-bold">{account.routingNumber}</span>
                          <button
                            onClick={() => handleCopyText(account.routingNumber, "Routing number")}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>International IBAN</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-foreground font-bold truncate max-w-[150px]">{account.iban}</span>
                          <button
                            onClick={() => handleCopyText(account.iban, "IBAN number")}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>SWIFT/BIC</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-foreground font-bold">{account.swift}</span>
                          <button
                            onClick={() => handleCopyText(account.swift, "SWIFT/BIC code")}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>Account Type</span>
                        <span className="text-foreground font-bold">{account.type}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>Date Opened</span>
                        <span className="text-foreground font-bold">{account.dateOpened}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>Status</span>
                        <span className="text-foreground font-bold uppercase tracking-wider text-[10px]">{account.status}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2.5">
                        <span>Branch</span>
                        <span className="text-foreground font-bold">{account.branch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency</span>
                        <span className="text-foreground font-bold">{account.currency}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

          {/* ════════════════ RIGHT SIDEBAR VIEW (1 col) ════════════════ */}
          <div className="space-y-6 select-none">
            
            {/* Account Manager Contact Card */}
            <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4.5 shadow-soft">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Account Wealth Manager
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                  {MOCK_MANAGER.avatarInitials}
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-extrabold text-foreground truncate">{MOCK_MANAGER.name}</h5>
                  <p className="text-[9px] font-semibold text-text-secondary truncate mt-0.5">
                    {MOCK_MANAGER.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1 border-t border-border/30">
                <button
                  onClick={loadTawkSupport}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Chat with Emma
                </button>
                <button
                  onClick={() => info("Direct manager call", "Connecting to Wealth Manager secure landline...")}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
                >
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  Direct Phone Call
                </button>
              </div>
            </div>

            {/* Security Audit log details */}
            <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4.5 shadow-soft">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Security status
                </h4>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-text-secondary leading-none">
                <div className="flex justify-between">
                  <span>Cryptographic Vault</span>
                  <span className="text-foreground font-bold">{MOCK_SECURITY.encryption}</span>
                </div>
                <div className="flex justify-between">
                  <span>Two-Factor Authentication</span>
                  <span className="text-success font-bold">{MOCK_SECURITY.twoFactor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ledger Synchronization</span>
                  <span className="text-foreground font-bold">{MOCK_SECURITY.lastSync}</span>
                </div>
              </div>

              <div className="h-px bg-border/40 my-3 shrink-0" />

              {/* Recent Login activity tracking */}
              <div className="space-y-2">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3 w-3" /> Recent Login activity
                </div>
                <div className="rounded-lg border border-border bg-muted/5 p-3 space-y-2 text-[10px] font-bold text-text-secondary leading-tight">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{MOCK_SECURITY.recentLogin.device}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{MOCK_SECURITY.recentLogin.location}</span>
                  </div>
                  <div className="text-[9px] font-semibold text-muted-foreground pt-0.5">
                    {MOCK_SECURITY.recentLogin.time}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </PageBody>
    </PageContainer>
  );
}
