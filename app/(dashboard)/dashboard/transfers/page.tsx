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
  TransferCodeForm,
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
  const [profileInfo, setProfileInfo] = React.useState<{ cot_enabled: boolean; vat_enabled: boolean } | null>(null);
  const [preCreatedTransferId, setPreCreatedTransferId] = React.useState<string | null>(null);

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
  // Load live funding accounts and profile settings of user from database on mount
  React.useEffect(() => {
    if (!user) return;
    const supabase = createBrowserClient();
    async function loadUserData() {
      try {
        // Fetch accounts
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

        // Fetch profile flags
        const { data: profData, error: profErr } = await supabase
          .from("profiles")
          .select("cot_enabled, vat_enabled")
          .eq("id", user!.id)
          .single();
        if (!profErr && profData) {
          setProfileInfo({
            cot_enabled: !!profData.cot_enabled,
            vat_enabled: !!profData.vat_enabled,
          });
        } else {
          setProfileInfo({ cot_enabled: false, vat_enabled: false });
        }
      } catch (err) {
        console.error("Error loading user data in TransfersPage:", err);
      } finally {
        setAccountsLoading(false);
      }
    }
    loadUserData();
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
      if (preCreatedTransferId) {
        const { data: req, error: fetchErr } = await supabase
          .from("transfer_requests")
          .select("*")
          .eq("id", preCreatedTransferId)
          .single();

        if (fetchErr || !req) {
          throw new Error(fetchErr?.message || "Failed to retrieve pre-created transfer details.");
        }

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
          reference: req.reference || ref,
          notes: data.description || undefined,
        };

        setCompletedRecord(newRecord);
        setReference(req.reference || ref);
        setStep("success");
        setPreCreatedTransferId(null);
        success("Transaction Processing", "Your wire instructions have been accepted for review.");
        setIsProcessing(false);
        return;
      }

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
    if (step === "code") setStep("review");
    if (step === "pin") {
      if (profileInfo?.cot_enabled || profileInfo?.vat_enabled) {
        setStep("code");
      } else {
        setStep("review");
      }
    }
  };

  const handleConfirmReview = async () => {
    setIsProcessing(true);
    try {
      const supabase = createBrowserClient();
      const { data: profData, error: profErr } = await supabase
        .from("profiles")
        .select("cot_enabled, vat_enabled")
        .eq("id", user!.id)
        .single();

      let hasCot = false;
      let hasVat = false;

      if (!profErr && profData) {
        hasCot = !!profData.cot_enabled;
        hasVat = !!profData.vat_enabled;
        
        // Update local state freshly
        setProfileInfo({ cot_enabled: hasCot, vat_enabled: hasVat });
      }

      if (hasCot || hasVat) {
        setStep("code");
      } else {
        setStep("pin");
      }
    } catch (err) {
      console.error("Error refreshing profile settings:", err);
      // Fallback
      if (profileInfo?.cot_enabled || profileInfo?.vat_enabled) {
        setStep("code");
      } else {
        setStep("pin");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormFlow = step === "details" || step === "review" || step === "code" || step === "pin";

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
                      onConfirm={handleConfirmReview}
                    />

                    <div className="flex justify-end gap-3 select-none">
                      <button
                        onClick={handleBack}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer outline-none disabled:opacity-50"
                      >
                        Previous Step
                      </button>
                      <button
                        onClick={handleConfirmReview}
                        disabled={isProcessing}
                        className="px-5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isProcessing && <div className="h-3 w-3 rounded-full border border-current border-t-transparent animate-spin" />}
                        Confirm Transfer
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP: TRANSACTIONAL CODE VERIFICATION (COT/VAT) ── */}
                {activeTab === "transfer" && step === "code" && (
                  <TransferCodeForm
                    type={profileInfo?.cot_enabled ? "COT" : "VAT"}
                    onBack={handleBack}
                    onVerified={(transferId: string) => {
                      setPreCreatedTransferId(transferId);
                      setStep("pin");
                    }}
                    transferData={data}
                  />
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
