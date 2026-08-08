"use client";

import * as React from "react";
import { TransferData } from "./useTransfer";
import { AccountItem } from "@/constants/mock-accounts";
import { useBeneficiaries } from "./useBeneficiaries";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, Landmark, Wallet, CheckSquare, Zap, Clock, Star } from "lucide-react";

interface TransferFormProps {
  data: TransferData;
  onChange: (updates: Partial<TransferData>) => void;
  accounts: AccountItem[];
  validationErrors: Record<string, string>;
}

const COUNTRIES = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "EU", name: "Eurozone (Germany, France, Italy, etc.)", currency: "EUR" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "JP", name: "Japan", currency: "JPY" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "CN", name: "China", currency: "CNY" },
  { code: "BR", name: "Brazil", currency: "BRL" },
  { code: "MX", name: "Mexico", currency: "MXN" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "AE", name: "United Arab Emirates", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR" },
  { code: "NZ", name: "New Zealand", currency: "NZD" },
  { code: "CH", name: "Switzerland", currency: "CHF" },
  { code: "SE", name: "Sweden", currency: "SEK" },
  { code: "NO", name: "Norway", currency: "NOK" },
  { code: "DK", name: "Denmark", currency: "DKK" },
  { code: "TR", name: "Turkey", currency: "TRY" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
  { code: "ID", name: "Indonesia", currency: "IDR" },
  { code: "TH", name: "Thailand", currency: "THB" },
  { code: "PH", name: "Philippines", currency: "PHP" },
  { code: "VN", name: "Vietnam", currency: "VND" },
  { code: "PK", name: "Pakistan", currency: "PKR" },
  { code: "BD", name: "Bangladesh", currency: "BDT" },
  { code: "EG", name: "Egypt", currency: "EGP" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "GH", name: "Ghana", currency: "GHS" },
  { code: "AR", name: "Argentina", currency: "ARS" },
  { code: "CL", name: "Chile", currency: "CLP" },
  { code: "CO", name: "Colombia", currency: "COP" },
  { code: "PE", name: "Peru", currency: "PEN" },
  { code: "IL", name: "Israel", currency: "ILS" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "HK", name: "Hong Kong", currency: "HKD" },
  { code: "TW", name: "Taiwan", currency: "TWD" },
  { code: "UA", name: "Ukraine", currency: "UAH" },
  { code: "RU", name: "Russia", currency: "RUB" },
  { code: "PL", name: "Poland", currency: "PLN" },
  { code: "RO", name: "Romania", currency: "RON" },
  { code: "MA", name: "Morocco", currency: "MAD" },
  { code: "DZ", name: "Algeria", currency: "DZD" },
  { code: "QA", name: "Qatar", currency: "QAR" },
  { code: "KW", name: "Kuwait", currency: "KWD" },
  { code: "OM", name: "Oman", currency: "OMR" },
  { code: "LK", name: "Sri Lanka", currency: "LKR" },
  { code: "NP", name: "Nepal", currency: "NPR" },
];

function getRoutingLabel(country: string): string {
  const c = country.toLowerCase();
  if (c.includes("united states")) return "Routing Number";
  if (c.includes("united kingdom")) return "Sort Code";
  if (c.includes("canada")) return "Transit Number";
  if (c.includes("australia")) return "BSB Code";
  if (c.includes("eurozone") || c.includes("europe")) return "IBAN";
  return "IBAN / Routing Information";
}

export const TransferForm: React.FC<TransferFormProps> = ({
  data,
  onChange,
  accounts,
  validationErrors,
}) => {
  const { beneficiaries } = useBeneficiaries();

  const handleSelectBeneficiary = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const benId = e.target.value;
    if (!benId) return;
    const selected = beneficiaries.find((b) => b.id === benId);
    if (selected) {
      onChange({
        recipientName: selected.name,
        recipientBank: selected.bankName || "External Bank",
        destinationCountry: selected.country || "United States",
        recipientAccount: selected.accountNumber || selected.iban || "",
        routingValue: selected.routingInformation || selected.swiftCode || "",
        currency: selected.currency || "USD",
      });
    }
  };

  const routingLabel = getRoutingLabel(data.destinationCountry);

  return (
    <div className="space-y-6 select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          1. Transfer Details
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Configure check parameters, clearance speed, and funding sources.
        </p>
      </div>

      {/* ─── SOURCE ACCOUNT SELECTOR ─── */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
          Source Funding Account *
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {accounts.map((acc) => {
            const isSelected = data.sourceAccount?.id === acc.id;
            return (
              <button
                type="button"
                key={acc.id}
                onClick={() => onChange({ sourceAccount: acc })}
                className={cn(
                  "flex items-center gap-3.5 p-4 rounded-custom-xl border text-left transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary"
                    : "border-border bg-surface hover:shadow-soft"
                )}
              >
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border",
                  isSelected ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/10 border-border text-muted-foreground"
                )}>
                  <Wallet className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-foreground truncate">{acc.name}</h4>
                  <p className="text-[9px] font-mono text-muted-foreground mt-0.5">
                    {acc.number} · {formatCurrency(acc.availableBalance)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {validationErrors.sourceAccount && (
          <p className="text-[10px] text-error font-bold flex items-center gap-1 mt-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationErrors.sourceAccount}
          </p>
        )}
      </div>

      {/* ─── QUICK SELECT BENEFICIARY ─── */}
      {beneficiaries.length > 0 && (
        <div className="space-y-1.5">
          <label htmlFor="ben-select" className="text-[10px] font-bold text-text-secondary block">
            Saved Beneficiary Quick Fill (Optional)
          </label>
          <div className="relative">
            <select
              id="ben-select"
              onChange={handleSelectBeneficiary}
              className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/25"
            >
              <option value="">-- Choose a Saved Beneficiary --</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.bankName || "External Bank"})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ─── RECIPIENT INFORMATION ─── */}
      <div className="bg-muted/5 border border-border p-5 rounded-custom-xl space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
          Recipient Destination Information
        </h4>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Recipient Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="rec-name" className="text-[10px] font-bold text-text-secondary">Recipient Full Name *</label>
            <input
              id="rec-name"
              type="text"
              value={data.recipientName}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            />
            {validationErrors.recipientName && (
              <p className="text-[9px] text-error font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.recipientName}
              </p>
            )}
          </div>

          {/* Recipient Bank Name */}
          <div className="space-y-1.5">
            <label htmlFor="rec-bank" className="text-[10px] font-bold text-text-secondary">Recipient Bank Name *</label>
            <input
              id="rec-bank"
              type="text"
              value={data.recipientBank}
              onChange={(e) => onChange({ recipientBank: e.target.value })}
              placeholder="e.g. JPMorgan Chase"
              className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            />
            {validationErrors.recipientBank && (
              <p className="text-[9px] text-error font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.recipientBank}
              </p>
            )}
          </div>

          {/* Destination Country */}
          <div className="space-y-1.5">
            <label htmlFor="rec-country" className="text-[10px] font-bold text-text-secondary">Destination Country *</label>
            <select
              id="rec-country"
              value={data.destinationCountry}
              onChange={(e) => {
                onChange({
                  destinationCountry: e.target.value,
                });
              }}
              className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Account Number */}
          <div className="space-y-1.5">
            <label htmlFor="rec-acc" className="text-[10px] font-bold text-text-secondary">Recipient Account Number *</label>
            <input
              id="rec-acc"
              type="text"
              value={data.recipientAccount}
              onChange={(e) => onChange({ recipientAccount: e.target.value })}
              placeholder="e.g. 12049104820"
              className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 font-mono"
            />
            {validationErrors.recipientAccount && (
              <p className="text-[9px] text-error font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.recipientAccount}
              </p>
            )}
          </div>

          {/* Dynamic Routing Field */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="rec-routing" className="text-[10px] font-bold text-text-secondary">
              {routingLabel} *
            </label>
            <input
              id="rec-routing"
              type="text"
              value={data.routingValue}
              onChange={(e) => onChange({ routingValue: e.target.value })}
              placeholder={`Enter recipient ${routingLabel.toLowerCase()}`}
              className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 font-mono"
            />
            {validationErrors.routingValue && (
              <p className="text-[9px] text-error font-bold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.routingValue}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── TRANSFER DETAILS INFORMATION ─── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Amount */}
        <div className="space-y-1.5">
          <label htmlFor="trans-amount" className="text-[10px] font-bold text-text-secondary">Amount *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">$</span>
            <input
              id="trans-amount"
              type="number"
              value={data.amount}
              onChange={(e) => onChange({ amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-surface border border-border rounded-custom-xl pl-6 pr-12 py-2 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground">{data.currency}</span>
          </div>
          {validationErrors.amount && (
            <p className="text-[9px] text-error font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {validationErrors.amount}
            </p>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-1.5">
          <label htmlFor="trans-currency" className="text-[10px] font-bold text-text-secondary">Currency *</label>
          <select
            id="trans-currency"
            value={data.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            className="w-full bg-surface border border-border rounded-custom-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
            <option value="JPY">JPY</option>
          </select>
        </div>

        {/* Transaction Type */}
        <div className="space-y-1.5">
          <label htmlFor="trans-type" className="text-[10px] font-bold text-text-secondary">Transaction Type *</label>
          <select
            id="trans-type"
            value={data.transactionType}
            onChange={(e) => onChange({ transactionType: e.target.value })}
            className="w-full bg-surface border border-border rounded-custom-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="domestic">Domestic Wire</option>
            <option value="international">International Swift</option>
            <option value="internal">Internal Book Transfer</option>
          </select>
        </div>
      </div>

      {/* ─── TRANSFER SPEED Clearance ─── */}
      <div className="space-y-2 select-none">
        <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
          Transfer Clearance Speed *
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: "standard" as const, title: "Standard Clearance", sub: "Estimated delivery: 2–3 Business Days", icon: Clock },
            { id: "priority" as const, title: "Priority Clearance", sub: "Estimated delivery: Same Business Day", icon: Zap },
          ].map((sp) => {
            const isSelected = data.speed === sp.id;
            const Icon = sp.icon;
            return (
              <button
                type="button"
                key={sp.id}
                onClick={() => onChange({ speed: sp.id })}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-custom-xl border text-left transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary"
                    : "border-border bg-surface hover:shadow-soft"
                )}
              >
                <div className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
                  isSelected ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/10 border-border text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground leading-tight">{sp.title}</h4>
                  <p className="text-[9px] font-medium text-text-secondary mt-0.5 leading-none">
                    {sp.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── OPTIONAL DESCRIPTION ─── */}
      <div className="space-y-1.5">
        <label htmlFor="trans-desc" className="text-[10px] font-bold text-text-secondary">Description (Optional)</label>
        <textarea
          id="trans-desc"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Enter reference description notes..."
          rows={2}
          className="w-full bg-surface border border-border rounded-custom-xl px-3.5 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
};
