"use client";

import * as React from "react";
import {
  PageContainer,
  PageHeader,
  PageBody,
  useToast,
} from "@/components/app-shell";
import { usePayments } from "@/components/payments/usePaymentsState";
import { PaymentStepper } from "@/components/payments/PaymentStepper";
import { PaymentSummary } from "@/components/payments/PaymentSummary";
import { BeneficiaryManager } from "@/components/payments/BeneficiaryManager";
import { ScheduledPayments } from "@/components/payments/ScheduledPayments";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { BillCategoryGrid } from "@/components/payments/BillCategoryGrid";
import { UpcomingBills } from "@/components/payments/UpcomingBills";
import {
  BillerSelector,
  PaymentAccountSelector,
  PaymentDetailsForm,
  ReviewPayment,
  PaymentAuth,
  PaymentSuccess,
} from "@/components/payments/BillPaymentForm";
import { MOCK_BENEFICIARIES } from "@/constants/mock-payments-beneficiaries";
import { AccountItem } from "@/constants/mock-accounts";
import { UpcomingBill } from "@/constants/mock-bills";
import { PaymentBeneficiary } from "@/constants/mock-payments-beneficiaries";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Receipt,
  CalendarClock,
  Users,
  History,
  ArrowLeft,
  Zap,
  LayoutGrid,
  SendHorizonal,
} from "lucide-react";

type TabKey = "overview" | "pay" | "scheduled" | "beneficiaries" | "history";

const TABS: Array<{ id: TabKey; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Bill Center", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { id: "pay", label: "Pay a Bill", icon: <SendHorizonal className="h-3.5 w-3.5" /> },
  { id: "scheduled", label: "Scheduled", icon: <CalendarClock className="h-3.5 w-3.5" /> },
  { id: "beneficiaries", label: "Beneficiaries", icon: <Users className="h-3.5 w-3.5" /> },
  { id: "history", label: "History", icon: <History className="h-3.5 w-3.5" /> },
];

const PAGE_VARIANTS: any = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function PaymentsPage() {
  const { success, error, info } = useToast();
  const { user } = useAuth();
  const [accounts, setAccounts] = React.useState<AccountItem[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const supabase = createBrowserClient();
    async function loadAccounts() {
      try {
        const { data: dbData, error: dbErr } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user!.id);
        if (dbErr) throw dbErr;
        const formatted = (dbData || []).map((acc: any): AccountItem => ({
          id: acc.id,
          name: acc.account_type === "CHECKING" ? "Primary Checking Account" : acc.account_type,
          number: `•••• •••• •••• ${acc.account_number.slice(-4)}`,
          availableBalance: acc.available_balance,
          currentBalance: acc.current_balance,
          currency: acc.currency,
          status: acc.status as "Active" | "Frozen",
          type: (acc.account_type === "CHECKING" ? "Checking" : acc.account_type) as "Checking" | "Savings" | "Investments",
          lastActivity: "No activity yet",
          routingNumber: "021000021",
          iban: `US89 NSTR 0210 0002 1000 ${acc.account_number.slice(-4)}`,
          swift: "NSTRUS33XXX",
          dateOpened: "Oct 12, 2024",
          branch: "Northstar HQ - New York",
        }));
        setAccounts(formatted);
      } catch (err) {
        console.error("Error loading accounts in PaymentsPage:", err);
      }
    }
    loadAccounts();
  }, [user]);
  const { step, setStep, data, updateData, resetForm, bills, payBillNow } = usePayments();
  const [activeTab, setActiveTab] = React.useState<TabKey>("overview");

  // Switch to pay tab when user clicks Pay Now on a bill
  const handlePayBill = (bill: UpcomingBill) => {
    updateData({ biller: bill, amount: String(bill.amount) });
    setActiveTab("pay");
    setStep("source");
  };

  // Pay from Beneficiary
  const handlePayBeneficiary = (b: PaymentBeneficiary) => {
    updateData({ biller: b });
    setActiveTab("pay");
    setStep("source");
  };

  // Stepper navigation helpers
  const canProceedStep = (): boolean => {
    if (step === "recipient") return !!data.biller;
    if (step === "source") return !!data.sourceAccount;
    if (step === "details") {
      const n = parseFloat(data.amount) || 0;
      return n > 0 && !!data.reference;
    }
    return true;
  };

  const handleNext = () => {
    const ORDER: Array<typeof step> = ["recipient", "source", "details", "review", "auth", "success"];
    const idx = ORDER.indexOf(step as any);
    if (idx < ORDER.length - 1) setStep(ORDER[idx + 1] as any);
  };

  const handleBack = () => {
    const ORDER: Array<typeof step> = ["recipient", "source", "details", "review", "auth"];
    const idx = ORDER.indexOf(step as any);
    if (idx > 0) setStep(ORDER[idx - 1] as any);
    else { setStep("home"); setActiveTab("overview"); }
  };

  // Is in active payment flow?
  const isInFlow = activeTab === "pay" && step !== "home" && step !== "success";

  return (
    <PageContainer>
      <PageHeader
        title="Payments & Bills"
        description="Pay bills, manage beneficiaries, and track every scheduled payment."
      />

      <PageBody>
        {/* ── TOP MODULE TABS ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-muted/8 border border-border/60 p-1 rounded-custom-xl w-fit select-none flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`pay-tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "pay") { setStep("home"); }
              }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-custom-lg text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                activeTab === tab.id
                  ? "bg-surface text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CONTENT AREA ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {/* ── BILL CENTER (OVERVIEW) ─────────────────────────────────────── */}
          {activeTab === "overview" && (
            <motion.div key="overview" {...PAGE_VARIANTS} className="space-y-6">
              {/* Quick Insight Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Total Due This Month",
                    value: "$1,607.29",
                    sub: "Across 5 bills",
                    dot: "bg-warning",
                  },
                  {
                    label: "Bills Paid",
                    value: "1",
                    sub: "Aug 01, 2026",
                    dot: "bg-success",
                  },
                  {
                    label: "Overdue / Failed",
                    value: "1",
                    sub: "Requires attention",
                    dot: "bg-error",
                  },
                  {
                    label: "Upcoming Next 7 Days",
                    value: "2",
                    sub: "Due Aug 10 & Aug 12",
                    dot: "bg-primary",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-custom-xl border border-border bg-surface p-4 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full shrink-0", s.dot)} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xl font-black text-foreground">{s.value}</p>
                    <p className="text-[10px] font-semibold text-text-secondary">{s.sub}</p>
                  </div>
                ))}
              </div>

              <BillCategoryGrid
                onSelectCategory={(cat) => {
                  info("Category Filter", `Showing ${cat} bills`);
                }}
              />

              <UpcomingBills
                bills={bills}
                onPayBill={handlePayBill}
                onScheduleBill={(bill) => {
                  info("Scheduled", `Bill for ${bill.companyName} added to schedule.`);
                }}
              />
            </motion.div>
          )}

          {/* ── PAY A BILL FLOW ────────────────────────────────────────────── */}
          {activeTab === "pay" && (
            <motion.div key="pay" {...PAGE_VARIANTS} className="space-y-5">
              {/* Stepper */}
              {step !== "home" && step !== "success" && (
                <PaymentStepper currentStep={step} />
              )}

              {/* Pay Flow Content + Summary Sidebar */}
              <div className={cn("grid gap-6", isInFlow && step !== "auth" ? "lg:grid-cols-[1fr_300px]" : "")}>
                <div className="space-y-5">
                  {/* Entry prompt if no step started */}
                  {step === "home" && (
                    <div className="text-center py-12 border border-dashed border-border rounded-custom-xl space-y-4">
                      <div className="p-3 bg-primary/5 border border-primary/15 rounded-full w-fit mx-auto">
                        <Zap className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">Pay a Bill or Beneficiary</h3>
                        <p className="text-xs font-semibold text-text-secondary mt-1">
                          Select a recipient from your bills or beneficiaries directory.
                        </p>
                      </div>
                      <button
                        onClick={() => setStep("recipient")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-custom-md text-xs font-bold shadow-soft hover:opacity-90 transition-all cursor-pointer outline-none"
                      >
                        <SendHorizonal className="h-4 w-4" />
                        Start Payment
                      </button>
                    </div>
                  )}

                  {step === "recipient" && (
                    <BillerSelector
                      bills={bills.filter((b) => b.status !== "Paid")}
                      beneficiaries={MOCK_BENEFICIARIES}
                      selectedId={data.biller ? ("id" in data.biller ? data.biller.id : null) : null}
                      onSelect={(item) => updateData({ biller: item })}
                    />
                  )}

                  {step === "source" && (
                    <PaymentAccountSelector
                      accounts={accounts}
                      selectedId={data.sourceAccount?.id ?? null}
                      onSelect={(acc: AccountItem) => updateData({ sourceAccount: acc })}
                    />
                  )}

                  {step === "details" && (
                    <PaymentDetailsForm
                      data={data}
                      onChange={updateData}
                      availableBalance={data.sourceAccount?.availableBalance ?? 0}
                    />
                  )}

                  {step === "review" && <ReviewPayment data={data} />}

                  {step === "auth" && (
                    <PaymentAuth
                      onSuccess={() => setStep("success")}
                      onCancel={() => setStep("review")}
                    />
                  )}

                  {step === "success" && (
                    <PaymentSuccess
                      data={data}
                      onNewPayment={() => {
                        resetForm();
                        setActiveTab("overview");
                      }}
                    />
                  )}

                  {/* Navigation Controls */}
                  {isInFlow && step !== "auth" && (
                    <div className="flex items-center justify-between border-t border-border/40 pt-4">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-custom-md border border-border bg-surface text-xs font-bold text-text-secondary hover:text-foreground hover:shadow-soft transition-all cursor-pointer outline-none"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                      </button>
                      {step !== "review" && (
                        <button
                          onClick={handleNext}
                          disabled={!canProceedStep()}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-custom-md bg-primary text-primary-foreground text-xs font-bold shadow-soft hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer outline-none"
                        >
                          Continue
                        </button>
                      )}
                      {step === "review" && (
                        <button
                          onClick={() => setStep("auth")}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-custom-md bg-primary text-primary-foreground text-xs font-bold shadow-soft hover:opacity-90 transition-all cursor-pointer outline-none"
                        >
                          Authorise Payment
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Sticky Summary Sidebar */}
                {isInFlow && step !== "auth" && (
                  <div className="hidden lg:block">
                    <PaymentSummary data={data} />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── SCHEDULED PAYMENTS ────────────────────────────────────────── */}
          {activeTab === "scheduled" && (
            <motion.div key="scheduled" {...PAGE_VARIANTS}>
              <ScheduledPayments />
            </motion.div>
          )}

          {/* ── BENEFICIARIES ─────────────────────────────────────────────── */}
          {activeTab === "beneficiaries" && (
            <motion.div key="beneficiaries" {...PAGE_VARIANTS}>
              <BeneficiaryManager onPayBeneficiary={handlePayBeneficiary} />
            </motion.div>
          )}

          {/* ── PAYMENT HISTORY ───────────────────────────────────────────── */}
          {activeTab === "history" && (
            <motion.div key="history" {...PAGE_VARIANTS}>
              <PaymentHistory
                onViewDetails={(item) => {
                  info("Payment Details", `Ref: ${item.reference} · ${item.recipient} · $${item.amount}`);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </PageBody>
    </PageContainer>
  );
}
