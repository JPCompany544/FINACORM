"use client";

import * as React from "react";
import { UpcomingBill } from "@/constants/mock-bills";
import { PaymentBeneficiary } from "@/constants/mock-payments-beneficiaries";
import { PaymentFormData } from "./usePaymentsState";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Search, Star, Plus, AlertCircle, Calendar, Check, CheckCircle2, Lock, RefreshCw, LayoutDashboard, AlertTriangle } from "lucide-react";
import { AccountItem } from "@/constants/mock-accounts";
import { useToast } from "@/components/app-shell";
import { useRouter } from "next/navigation";

// ─── STEP 1: BILLER / BENEFICIARY SELECTOR ───────────────────────────────────
interface BillerSelectorProps {
  bills: UpcomingBill[];
  beneficiaries: PaymentBeneficiary[];
  selectedId: string | null;
  onSelect: (item: UpcomingBill | PaymentBeneficiary) => void;
}

export const BillerSelector: React.FC<BillerSelectorProps> = ({ bills, beneficiaries, selectedId, onSelect }) => {
  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState<"bills" | "beneficiaries">("bills");

  const filteredBills = bills.filter(
    (b) => b.companyName.toLowerCase().includes(search.toLowerCase())
  );
  const filteredBens = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Select Recipient or Bill
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary">
          Choose an upcoming bill or a saved beneficiary to pay.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/10 border border-border/60 p-1 rounded-custom-xl w-fit select-none">
        {(["bills", "beneficiaries"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-custom-lg text-xs font-bold transition-all cursor-pointer outline-none capitalize",
              tab === t ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "bills" ? "Upcoming Bills" : "Saved Beneficiaries"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bills or beneficiaries..."
          className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
        />
      </div>

      {/* List */}
      {tab === "bills" && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {filteredBills.map((b) => {
            const isSelected = b.id === selectedId;
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b)}
                className={cn(
                  "flex items-center gap-3.5 p-4 rounded-custom-xl border text-left transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  isSelected ? "border-primary bg-primary/5 ring-1 ring-primary shadow-soft" : "border-border bg-surface hover:border-border/80 hover:shadow-soft"
                )}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: b.logoBg }}
                >
                  {b.logoInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-foreground truncate">{b.companyName}</h4>
                  <p className="text-[10px] font-semibold text-text-secondary mt-0.5">
                    {b.category} · Due {b.dueDate}
                  </p>
                  <p className="text-xs font-black text-foreground mt-1">{formatCurrency(b.amount)}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {tab === "beneficiaries" && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {filteredBens.map((b) => {
            const isSelected = b.id === selectedId;
            return (
              <button
                key={b.id}
                onClick={() => onSelect(b)}
                className={cn(
                  "flex items-center gap-3.5 p-4 rounded-custom-xl border text-left transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  isSelected ? "border-primary bg-primary/5 ring-1 ring-primary shadow-soft" : "border-border bg-surface hover:border-border/80 hover:shadow-soft"
                )}
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: b.color }}
                >
                  {b.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold text-foreground truncate flex items-center gap-1.5">
                    {b.nickname}
                    {b.isFavorite && <Star className="h-3 w-3 text-warning fill-warning shrink-0" />}
                  </h4>
                  <p className="text-[10px] font-semibold text-text-secondary mt-0.5 truncate">{b.bankName}</p>
                  <p className="text-[9px] font-mono text-muted-foreground mt-0.5">{b.accountNumber}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            );
          })}
          {filteredBens.length === 0 && (
            <div className="sm:col-span-2 text-center py-8 border border-dashed border-border rounded-custom-xl">
              <p className="text-xs font-semibold text-muted-foreground">No beneficiaries found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── STEP 2: SOURCE ACCOUNT ───────────────────────────────────────────────────
interface AccountSelectorProps {
  accounts: AccountItem[];
  selectedId: string | null;
  onSelect: (acc: AccountItem) => void;
}

export const PaymentAccountSelector: React.FC<AccountSelectorProps> = ({ accounts, selectedId, onSelect }) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
        Funding Account
      </h3>
      <p className="text-[10px] font-semibold text-text-secondary">
        Select the account from which this payment will be debited.
      </p>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      {accounts.map((acc) => {
        const isSelected = acc.id === selectedId;
        return (
          <button
            key={acc.id}
            onClick={() => onSelect(acc)}
            className={cn(
              "flex flex-col p-4.5 rounded-custom-xl border text-left transition-all cursor-pointer relative outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              isSelected ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary" : "border-border bg-surface hover:shadow-soft"
            )}
          >
            {isSelected && <CheckCircle2 className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-primary" />}
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{acc.type}</span>
            <h4 className="text-xs font-extrabold text-foreground mb-0.5 truncate max-w-[85%]">{acc.name}</h4>
            <span className="text-[9px] font-mono text-muted-foreground block mb-3">{acc.number}</span>
            <span className="text-base font-black text-foreground tracking-tight">{formatCurrency(acc.availableBalance)}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// ─── STEP 3: PAYMENT DETAILS FORM ────────────────────────────────────────────
interface DetailsFormProps {
  data: PaymentFormData;
  onChange: (updates: Partial<PaymentFormData>) => void;
  availableBalance: number;
}

export const PaymentDetailsForm: React.FC<DetailsFormProps> = ({ data, onChange, availableBalance }) => {
  const num = parseFloat(data.amount) || 0;
  const isOverBalance = num > availableBalance && num > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Payment Details
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary">
          Enter the payment amount and reference details.
        </p>
      </div>

      <div className="bg-muted/10 border border-border px-4 py-2.5 rounded-custom-lg flex justify-between items-center select-none">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Available Balance</span>
        <span className="text-sm font-black text-foreground">{formatCurrency(availableBalance)}</span>
      </div>

      <div className="space-y-4">
        {/* Amount */}
        <div className="space-y-1.5">
          <label htmlFor="pay-amount" className="text-[10px] font-bold text-text-secondary">Amount</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground pointer-events-none">$</span>
            <input
              id="pay-amount"
              type="number"
              value={data.amount}
              onChange={(e) => onChange({ amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-surface border border-border/80 rounded-custom-xl pl-8 pr-16 py-2.5 text-xs font-bold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all font-mono"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-muted-foreground select-none">USD</span>
          </div>
          {isOverBalance && (
            <div className="flex gap-1.5 items-center text-error text-[10px] font-bold">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Amount exceeds available balance of {formatCurrency(availableBalance)}.</span>
            </div>
          )}
        </div>

        {/* Reference & Description */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="pay-ref" className="text-[10px] font-bold text-text-secondary">Payment Reference</label>
            <input
              id="pay-ref"
              type="text"
              required
              value={data.reference}
              onChange={(e) => onChange({ reference: e.target.value })}
              placeholder="e.g. Invoice #1042"
              className="w-full bg-surface border border-border/80 rounded-custom-xl px-3.5 py-2.5 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pay-desc" className="text-[10px] font-bold text-text-secondary">Description (Optional)</label>
            <input
              id="pay-desc"
              type="text"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Payment notes"
              className="w-full bg-surface border border-border/80 rounded-custom-xl px-3.5 py-2.5 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>

        {/* Payment Date */}
        <div className="space-y-1.5">
          <label htmlFor="pay-date" className="text-[10px] font-bold text-text-secondary flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Payment Date
          </label>
          <input
            id="pay-date"
            type="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full sm:w-48 bg-surface border border-border/80 rounded-custom-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

// ─── STEP 4: REVIEW ───────────────────────────────────────────────────────────
interface ReviewPaymentProps {
  data: PaymentFormData;
}

export const ReviewPayment: React.FC<ReviewPaymentProps> = ({ data }) => {
  const num = parseFloat(data.amount) || 0;
  const getBillerName = () => {
    if (!data.biller) return "—";
    return "companyName" in data.biller ? data.biller.companyName : data.biller.name;
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Review Payment</h3>
        <p className="text-[10px] font-semibold text-text-secondary">Confirm all details before authorising.</p>
      </div>

      <div className="rounded-custom-xl border border-border bg-surface overflow-hidden shadow-soft">
        <div className="bg-muted/10 border-b border-border/60 p-4 flex justify-between items-center">
          <span className="text-xl font-black text-foreground">{formatCurrency(num)}</span>
          <span className="text-[10px] font-black uppercase border border-primary/25 bg-primary/5 px-2.5 py-1 rounded text-primary tracking-widest">Bill Payment</span>
        </div>
        <div className="divide-y divide-border/40 text-xs font-semibold text-text-secondary">
          {[
            { label: "Recipient", value: getBillerName() },
            { label: "Funding Account", value: data.sourceAccount ? data.sourceAccount.name : "—" },
            { label: "Payment Date", value: data.date || "—" },
            { label: "Reference", value: data.reference || "—" },
            { label: "Processing Fee", value: "Free" },
          ].map((row, idx) => (
            <div key={idx} className="flex justify-between items-center px-4.5 py-3 gap-4">
              <span className="shrink-0">{row.label}</span>
              <span className="font-bold text-foreground text-right truncate">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning/5 border border-warning/20 p-4 rounded-custom-xl flex gap-3 items-start">
        <AlertTriangle className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Once confirmed, this payment will be submitted immediately via ACH. Cancellation is subject to availability.
        </p>
      </div>
    </div>
  );
};

// ─── STEP 5: MOCK AUTH ────────────────────────────────────────────────────────
interface PaymentAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentAuth: React.FC<PaymentAuthProps> = ({ onSuccess, onCancel }) => {
  const { success } = useToast();
  const [password, setPassword] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      success("Authorised", "Payment cleared and submitted successfully.");
      onSuccess();
    }, 1800);
  };

  return (
    <div className="space-y-5 max-w-sm mx-auto">
      <div className="space-y-1 text-center">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Authorise Payment</h3>
        <p className="text-[10px] font-semibold text-text-secondary">Verify your identity to submit this payment.</p>
      </div>

      <div className="bg-surface border border-border p-5 rounded-custom-xl space-y-4">
        {isVerifying ? (
          <div className="flex flex-col items-center py-8 space-y-3">
            <RefreshCw className="h-7 w-7 text-primary animate-spin" />
            <p className="text-xs font-bold text-foreground">Authorising payment...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="pay-auth-pwd" className="text-[10px] font-bold text-text-secondary">Account Password</label>
              <input
                id="pay-auth-pwd"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none"
            >
              <Lock className="h-3.5 w-3.5" />
              Authorise Payment
            </button>
          </form>
        )}
      </div>
      <div className="flex justify-center">
        <button onClick={onCancel} disabled={isVerifying} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─── STEP 6: SUCCESS ──────────────────────────────────────────────────────────
interface PaymentSuccessProps {
  data: PaymentFormData;
  onNewPayment: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ data, onNewPayment }) => {
  const router = useRouter();
  const num = parseFloat(data.amount) || 0;
  const getBillerName = () => {
    if (!data.biller) return "—";
    return "companyName" in data.biller ? data.biller.companyName : data.biller.name;
  };

  return (
    <div className="flex flex-col items-center text-center py-10 space-y-6 max-w-md mx-auto">
      <div className="p-4 bg-success/10 border border-success/20 rounded-full text-success animate-bounce">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-black text-foreground">Payment Successful</h3>
        <p className="text-xs font-semibold text-text-secondary leading-normal">
          Your payment has been submitted to the ACH clearing network.
        </p>
      </div>
      <div className="w-full rounded-custom-xl border border-border bg-background p-4.5 space-y-2 text-xs font-bold text-text-secondary">
        <div className="flex justify-between">
          <span>Amount Paid</span>
          <span className="text-foreground font-black">{formatCurrency(num)}</span>
        </div>
        <div className="flex justify-between">
          <span>Paid To</span>
          <span className="text-foreground font-extrabold truncate max-w-[200px]">{getBillerName()}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing</span>
          <span className="text-foreground font-extrabold">Same Business Day (ACH)</span>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2">
        <button onClick={onNewPayment} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none">
          <RefreshCw className="h-3.5 w-3.5" />
          Make Another Payment
        </button>
        <button onClick={() => router.push("/dashboard")} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none">
          <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
