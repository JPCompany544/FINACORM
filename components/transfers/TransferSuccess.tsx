"use client";

import * as React from "react";
import { CheckCircle2, FileText, LayoutDashboard, Star, Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TransferData } from "./useTransfer";
import { useRouter } from "next/navigation";
import { useBeneficiaries } from "./useBeneficiaries";
import { useToast } from "@/components/app-shell";

interface TransferSuccessProps {
  data: TransferData;
  referenceCode: string;
  onViewReceipt: () => void;
  onReset: () => void;
}

export const TransferSuccess: React.FC<TransferSuccessProps> = ({
  data,
  referenceCode,
  onViewReceipt,
  onReset,
}) => {
  const router = useRouter();
  const { success } = useToast();
  const { addBeneficiary } = useBeneficiaries();
  
  const [showSavePrompt, setShowSavePrompt] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);

  const numAmount = parseFloat(data.amount) || 0;
  const estimatedDelivery = data.speed === "priority" ? "Same Business Day" : "2–3 Business Days";

  const handleSaveBeneficiary = async () => {
    try {
      const initials = data.recipientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      await addBeneficiary({
        name: data.recipientName,
        type: data.transactionType === "international" ? "international" : "domestic",
        bankName: data.recipientBank,
        accountNumber: data.recipientAccount,
        swiftCode: data.routingValue,
        routingInformation: data.routingValue,
        isFavorite: false,
        initials: initials || "BE",
        color: "#2563EB",
        country: data.destinationCountry,
        currency: data.currency,
      });

      setIsSaved(true);
      setShowSavePrompt(false);
      success("Beneficiary Saved", `${data.recipientName} has been saved for future transfers.`);
    } catch (err) {
      console.error("Error saving beneficiary:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 select-none max-w-md mx-auto">
      {/* Success indicator icon */}
      <div className="p-4 bg-success/10 border border-success/20 rounded-full text-success">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-black text-foreground tracking-tight">
          ✓ Transaction Processing
        </h3>
        <p className="text-xs font-semibold text-text-secondary leading-normal">
          Your instruction has been accepted and is currently in routing queue.
        </p>
      </div>

      {/* Summary table */}
      <div className="w-full rounded-custom-xl border border-border bg-surface p-4.5 space-y-2 text-xs font-bold text-text-secondary">
        <div className="flex justify-between items-center">
          <span>Transfer Reference</span>
          <span className="text-foreground font-mono uppercase">{referenceCode}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Transfer Status</span>
          <span className="text-primary font-black uppercase text-[10px]">Processing</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Transfer Speed</span>
          <span className="text-foreground capitalize">{data.speed} Clearance</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Estimated Delivery</span>
          <span className="text-foreground">{estimatedDelivery}</span>
        </div>
        <div className="flex justify-between items-center border-t border-border/40 pt-2 mt-2">
          <span>Recipient Name</span>
          <span className="text-foreground font-extrabold truncate max-w-[180px]">{data.recipientName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Amount Sent</span>
          <span className="text-foreground font-black">{formatCurrency(numAmount)} {data.currency}</span>
        </div>
      </div>

      {/* Save Beneficiary Prompt */}
      {showSavePrompt && !isSaved && (
        <div className="w-full bg-primary/5 border border-primary/20 p-4.5 rounded-custom-xl text-left space-y-3">
          <div className="flex items-start gap-2.5">
            <Star className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-foreground">Save Recipient Account</h4>
              <p className="text-[10px] text-text-secondary font-semibold mt-0.5 leading-normal">
                Would you like to save this recipient for future transfers?
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveBeneficiary}
              className="flex-1 py-1.5 bg-primary text-primary-foreground text-[10px] font-black rounded-lg shadow-soft cursor-pointer hover:opacity-90 transition-all outline-none"
            >
              Save Beneficiary
            </button>
            <button
              onClick={() => setShowSavePrompt(false)}
              className="px-4 py-1.5 border border-border bg-surface text-[10px] font-bold rounded-lg cursor-pointer hover:bg-surface-hover transition-colors outline-none"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {isSaved && (
        <div className="w-full bg-success/5 border border-success/15 p-3 rounded-custom-xl text-xs font-bold text-success flex items-center justify-center gap-1.5">
          <Check className="h-4 w-4" />
          Saved to Beneficiary Book
        </div>
      )}

      {/* Buttons */}
      <div className="w-full flex flex-col gap-2 pt-2">
        <button
          onClick={onViewReceipt}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none"
        >
          <FileText className="h-3.5 w-3.5" />
          View Receipt Details
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
          >
            New Transfer
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
