"use client";

import * as React from "react";
import { PageContainer, PageHeader, PageBody, useToast } from "@/components/app-shell";
import {
  useTransfer,
  useBeneficiaries,
  TransferStepper,
  TransferSummary,
  TransferForm,
  ReviewTransfer,
  TransferSuccess,
  TransferReceipt,
  TransferHistory,
  Beneficiaries,
  TransferRecord,
  TransferPinForm,
} from "@/components/transfers";
import { AccountItem } from "@/constants/mock-accounts";
import { Beneficiary } from "@/constants/mock-beneficiaries";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, History, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { TransferService } from "@/lib/services/transfer/TransferService";

export default function TransfersPage() {
  const { success, error, info } = useToast();
  const { user } = useAuth();
  const [accounts, setAccounts] = React.useState<AccountItem[]>([]);
  const [accountsLoading, setAccountsLoading] = React.useState(true);
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [reference, setReference] = React.useState("");

  // Custom hooks for state
  const {
    step,
    setStep,
    data,
    updateData,
    resetTransfer,
    completedRecord,
    setCompletedRecord,
  } = useTransfer();

  const {
    beneficiaries,
    addBeneficiary,
    deleteBeneficiary,
    toggleFavorite,
  } = useBeneficiaries();

  // Active top tab ("transfer" | "history" | "beneficiaries")
  const [activeTab, setActiveTab] = React.useState<"transfer" | "history" | "beneficiaries">("transfer");

  // Load live funding accounts of user from database on mount
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
          iban: `US89 FNCR 0210 0002 1000 ${acc.account_number.slice(-4)}`,
          swift: "FNCRUS33XXX",
          dateOpened: "Oct 12, 2024",
          branch: "FINACORM HQ - New York",
        }));
        setAccounts(formatted);
      } catch (err) {
        console.error("Error loading accounts in TransfersPage:", err);
      } finally {
        setAccountsLoading(false);
      }
    }
    loadAccounts();
  }, [user]);

  // Set default source account once loaded
  React.useEffect(() => {
    if (accounts.length > 0 && !data.sourceAccount) {
      updateData({ sourceAccount: accounts[0] });
    }
  }, [accounts, data.sourceAccount, updateData]);

  // Validate form entries before moving to review stage
  const handleDetailsSubmit = () => {
    const errors: Record<string, string> = {};

    if (!data.sourceAccount) {
      errors.sourceAccount = "Source funding account is required.";
    }
    if (!data.recipientName.trim()) {
      errors.recipientName = "Recipient Full Name is required.";
    }
    if (!data.recipientBank.trim()) {
      errors.recipientBank = "Recipient Bank Name is required.";
    }
    if (!data.recipientAccount.trim()) {
      errors.recipientAccount = "Recipient Account Number is required.";
    }
    if (!data.routingValue.trim()) {
      errors.routingValue = "Routing / Clear codes are required.";
    }

    const numAmount = parseFloat(data.amount) || 0;
    if (isNaN(numAmount) || numAmount <= 0) {
      errors.amount = "Amount must be greater than zero.";
    } else if (data.sourceAccount && numAmount > data.sourceAccount.availableBalance) {
      errors.amount = "Insufficient balance in funding account.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      error("Details invalid", "Please correct the highlighted entries.");
      return;
    }

    setValidationErrors({});
    setStep("review");
  };

  // Process transfer and save record details
  const handleSubmitTransferRequest = async () => {
    if (!user || !data.sourceAccount) return;
    setIsProcessing(true);

    const ref = "NSTR-" + Math.floor(10000000 + Math.random() * 90000000);
    const dateObj = new Date();
    const numAmount = parseFloat(data.amount) || 0;

    const supabase = createBrowserClient();
    try {
      const res = await TransferService.submitTransfer(supabase, {
        userId: user.id,
        sourceAccountId: data.sourceAccount.id,
        recipientName: data.recipientName,
        recipientBank: data.recipientBank,
        destinationCountry: data.destinationCountry,
        recipientAccount: data.recipientAccount,
        routingInformation: data.routingValue,
        amount: numAmount,
        currency: data.currency,
        transferType: data.transactionType,
        transferSpeed: data.speed,
        description: data.description,
        reference: ref,
      });

      if (res.success && res.data) {
        const req = res.data;
        const newRecord: TransferRecord = {
          id: req.id,
          receiptNumber: `REQ-${req.id.substring(0, 6).toUpperCase()}`,
          transactionId: req.id,
          type: req.transfer_type as any,
          status: "pending",
          date: dateObj.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          time: dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          dateISO: dateObj.toISOString(),
          sender: data.sourceAccount ? data.sourceAccount.name : "FINACORM Account",
          senderAccount: data.sourceAccount ? data.sourceAccount.number : "•••• 0000",
          recipient: data.recipientName,
          recipientAccount: data.recipientAccount,
          bankName: data.recipientBank,
          amount: numAmount,
          fees: data.transactionType === "international" ? 15.00 : data.speed === "priority" ? 5.00 : 0.00,
          reference: ref,
          notes: data.description || undefined,
        };

        setCompletedRecord(newRecord);
        setReference(ref);
        setStep("success");
        success("Transaction Processing", "Your wire instructions have been accepted for review.");
      } else {
        error("Submission Failed", res.error || "Could not submit transfer request.");
      }
    } catch (err: any) {
      error("Error", err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHistoryRecord = (record: TransferRecord) => {
    setCompletedRecord(record);
    setStep("success");
  };

  const handleRepeatTransfer = (record: TransferRecord) => {
    updateData({
      recipientName: record.recipient,
      recipientAccount: record.recipientAccount,
      recipientBank: record.bankName || "",
      amount: String(record.amount),
      description: record.notes || "",
    });
    setCompletedRecord(null);
    setStep("details");
    setActiveTab("transfer");
  };

  const handleBack = () => {
    if (step === "review") setStep("details");
    if (step === "pin") setStep("review");
  };

  const isFormFlow = step === "details" || step === "review" || step === "pin";

  return (
    <PageContainer>
      {/* ─── PAGE HEADER ────────────────────────────────────────────────── */}
      <PageHeader
        title="Send Money"
        description="Move money securely between your accounts, other banks, or internationally."
      />

      <PageBody className="space-y-6">
        
        {/* ─── TOP TABS (Only visible during setup state or home tab modes) ─── */}
        {step !== "success" && (
          <div className="flex items-center gap-1.5 bg-muted/10 border border-border/60 p-1 rounded-custom-xl w-fit select-none shrink-0">
            {[
              { id: "transfer" as const, label: "Transfers Console", icon: Send },
              { id: "history" as const, label: "Wire History", icon: History },
              { id: "beneficiaries" as const, label: "Beneficiary Book", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "transfer") {
                      setStep("details");
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-1.5 rounded-custom-lg text-xs font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    isActive
                      ? "bg-surface text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ─── FLOW CONTENT AND SUMMARY COLUMNS ──────────────────────────── */}
        <div className="grid gap-6 laptop:grid-cols-4 items-start">
          
          {/* Main Area (3 cols desktop, full on mobile) */}
          <div className={cn("space-y-6", isFormFlow ? "laptop:col-span-3" : "laptop:col-span-4")}>
            
            {/* Back action mid-flow */}
            {step === "review" && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none select-none"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}

            {/* Stepper display */}
            {activeTab === "transfer" && <TransferStepper currentStep={step} />}

            {/* Render Step Panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step + activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="min-h-0"
              >
                {/* ── TAB WIRE HISTORY ── */}
                {activeTab === "history" && step !== "success" && (
                  <TransferHistory onSelectRecord={handleSelectHistoryRecord} />
                )}

                {/* ── TAB BENEFICIARY BOOK ── */}
                {activeTab === "beneficiaries" && step !== "success" && (
                  <Beneficiaries
                    beneficiaries={beneficiaries}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteBeneficiary}
                    onCreateNewTransfer={() => {
                      setActiveTab("transfer");
                      setStep("details");
                    }}
                    onSelectRecipient={(ben) => {
                      updateData({
                        recipientName: ben.name,
                        recipientBank: ben.bankName || "External Bank",
                        destinationCountry: ben.country || "United States",
                        recipientAccount: ben.accountNumber || ben.iban || "",
                        routingValue: ben.swiftCode || "",
                        currency: ben.currency || "USD",
                        transactionType: ben.type || "domestic",
                      });
                      setActiveTab("transfer");
                      setStep("details");
                    }}
                  />
                )}

                {/* ── STEP 1: TRANSFER DETAILS ── */}
                {activeTab === "transfer" && step === "details" && (
                  <div className="space-y-6">
                    <TransferForm
                      data={data}
                      onChange={updateData}
                      accounts={accounts}
                      validationErrors={validationErrors}
                    />

                    <div className="flex justify-end gap-3 select-none">
                      <button
                        onClick={handleDetailsSubmit}
                        className="px-5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: REVIEW MOVEMENT ── */}
                {activeTab === "transfer" && step === "review" && (
                  <div className="space-y-6">
                    <ReviewTransfer
                      data={data}
                      onBack={handleBack}
                      onConfirm={() => setStep("pin")}
                    />

                    <div className="flex justify-end gap-3 select-none">
                      <button
                        onClick={handleBack}
                        className="px-5 py-2.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer outline-none"
                      >
                        Previous Step
                      </button>
                      <button
                        onClick={() => setStep("pin")}
                        className="px-5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none"
                      >
                        Confirm Transfer
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: SECURITY PIN ── */}
                {activeTab === "transfer" && step === "pin" && (
                  <TransferPinForm
                    onBack={handleBack}
                    onSuccess={handleSubmitTransferRequest}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                )}

                {/* ── STEP 3 & 4: SUCCESS & OPTIONAL SAVE ── */}
                {step === "success" && (
                  <div className="space-y-6">
                    <TransferSuccess
                      data={data}
                      referenceCode={reference}
                      onViewReceipt={() => setStep("receipt")}
                      onReset={() => {
                        resetTransfer();
                        setActiveTab("transfer");
                      }}
                    />
                  </div>
                )}

                {/* ── OPTIONAL: RECEIPT SHEET ── */}
                {step === "receipt" && completedRecord && (
                  <TransferReceipt
                    record={completedRecord}
                    onClose={() => {
                      resetTransfer();
                      setActiveTab("history");
                    }}
                    onRepeat={handleRepeatTransfer}
                  />
                )}
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Sticky Summary Sidebar Area (Only visible when form setup/review flow is active) */}
          {isFormFlow && activeTab === "transfer" && (
            <div className="laptop:col-span-1">
              <TransferSummary data={data} />
            </div>
          )}

        </div>

      </PageBody>
    </PageContainer>
  );
}
