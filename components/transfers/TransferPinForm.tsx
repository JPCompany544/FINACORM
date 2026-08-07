"use client";

import * as React from "react";
import { Lock, AlertCircle, ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OTPInputWrapper } from "@/components/ui/input";
import {
  checkHasPinAction,
  verifyPinAction,
  setupPinAction,
} from "@/app/actions/pin";

interface TransferPinFormProps {
  onBack: () => void;
  onSuccess: () => void;
  isProcessing: boolean;
  setIsProcessing: (p: boolean) => void;
}

type PinViewState = "loading" | "verify" | "setup" | "setupConfirm";

export const TransferPinForm: React.FC<TransferPinFormProps> = ({
  onBack,
  onSuccess,
  isProcessing,
  setIsProcessing,
}) => {
  const [viewState, setViewState] = React.useState<PinViewState>("loading");
  const [pin, setPin] = React.useState("");
  const [newPin, setNewPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isLocked, setIsLocked] = React.useState(false);

  // On mount — check if user has a PIN configured
  React.useEffect(() => {
    let cancelled = false;
    async function checkPin() {
      const hasPin = await checkHasPinAction();
      if (!cancelled) {
        setViewState(hasPin ? "verify" : "setup");
      }
    }
    checkPin();
    return () => { cancelled = true; };
  }, []);

  const resetPinInputs = () => {
    setPin("");
    setNewPin("");
    setConfirmPin("");
    setErrorMsg(null);
  };

  // ── Handle verification of existing PIN ──────────────────────────────────
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || isLocked) return;

    if (pin.length !== 4) {
      setErrorMsg("Please enter all 4 digits of your Transaction PIN.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const result = await verifyPinAction(pin);

    if (result.success) {
      onSuccess();
    } else {
      if (result.lockout) {
        setIsLocked(true);
      }
      setErrorMsg(result.error || "Incorrect transaction PIN.");
      setPin("");
      setIsProcessing(false);
    }
  };

  // ── Handle first-time PIN setup from within transfer flow ────────────────
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (newPin.length !== 4) {
      setErrorMsg("PIN must be exactly 4 digits.");
      return;
    }
    if (confirmPin !== newPin) {
      setErrorMsg("PINs do not match. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const result = await setupPinAction(newPin, confirmPin);

    if (result.success) {
      // PIN is now configured — immediately proceed to authorize the transfer
      onSuccess();
    } else {
      setErrorMsg(result.error || "Failed to set PIN. Please try again.");
      resetPinInputs();
      setIsProcessing(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (viewState === "loading") {
    return (
      <div className="w-full max-w-md mx-auto bg-surface border border-border p-6 rounded-custom-xl shadow-soft flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-muted-foreground">Checking security status…</p>
        </div>
      </div>
    );
  }

  // ── Setup state — user has no PIN yet ────────────────────────────────────
  if (viewState === "setup" || viewState === "setupConfirm") {
    return (
      <div className="w-full max-w-md mx-auto bg-surface border border-border p-6 rounded-custom-xl shadow-soft select-none space-y-6">
        {/* Back CTA */}
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer outline-none"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Review</span>
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="p-3 bg-primary/5 border border-primary/10 text-primary rounded-full w-fit mx-auto">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
            Set Up Transaction PIN
          </h3>
          <p className="text-[10px] font-semibold text-text-secondary leading-normal max-w-xs mx-auto">
            You don&apos;t have a Transaction PIN yet. Create one below to authorize this transfer. It will be used for all future transfers.
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-5">
          <div className="flex flex-col items-center gap-4">
            <OTPInputWrapper
              label="New Transaction PIN"
              length={4}
              value={newPin}
              onChange={(val) => { setNewPin(val); setErrorMsg(null); }}
              helperText="4-digit numeric PIN"
              mask
            />
            <OTPInputWrapper
              label="Confirm Transaction PIN"
              length={4}
              value={confirmPin}
              onChange={(val) => { setConfirmPin(val); setErrorMsg(null); }}
              helperText="Re-enter your PIN"
              mask
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
            disabled={isProcessing || newPin.length < 4 || confirmPin.length < 4}
            className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-bold text-xs rounded-custom-md transition-all shadow-soft flex items-center justify-center gap-1.5 cursor-pointer outline-none"
          >
            {isProcessing ? "Setting up PIN…" : "Set PIN & Authorize Transfer"}
          </button>
        </form>
      </div>
    );
  }

  // ── Verify state — user has a PIN ────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto bg-surface border border-border p-6 rounded-custom-xl shadow-soft select-none space-y-6">
      {/* Back CTA */}
      <button
        onClick={onBack}
        disabled={isProcessing || isLocked}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer outline-none"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Review</span>
      </button>

      {/* Header Info */}
      <div className="space-y-1.5 text-center">
        <div className={cn(
          "p-3 border rounded-full w-fit mx-auto transition-colors",
          isLocked
            ? "bg-error/5 border-error/10 text-error"
            : "bg-primary/5 border-primary/10 text-primary"
        )}>
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
          Enter Transaction PIN
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal max-w-xs mx-auto">
          {isLocked
            ? "Your account is temporarily locked due to too many failed attempts."
            : "Enter your 4-digit Transaction PIN to authorize and submit this wire instruction."}
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* OTP Input — masked */}
        <div className="flex justify-center">
          <OTPInputWrapper
            length={4}
            value={pin}
            onChange={(val) => { setPin(val); setErrorMsg(null); }}
            error={errorMsg && !isLocked ? errorMsg : undefined}
            mask
          />
        </div>

        {/* Lockout error or regular error */}
        {errorMsg && (
          <p className={cn(
            "text-[10px] font-bold flex items-center justify-center gap-1.5 p-2.5 rounded-custom-lg",
            isLocked
              ? "text-error bg-error/5 border border-error/10"
              : "text-error bg-error/5 border border-error/10"
          )}>
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}

        {/* Forgot PIN */}
        <p className="text-[10px] text-center text-muted-foreground font-semibold">
          Forgot your PIN?{" "}
          <span className="text-foreground font-bold">
            Please contact support to reset your Transaction PIN.
          </span>
        </p>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isProcessing || isLocked || pin.length < 4}
          className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 font-bold text-xs rounded-custom-md transition-all shadow-soft flex items-center justify-center gap-1.5 cursor-pointer outline-none"
        >
          {isProcessing ? (
            <>
              <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              <span>Verifying…</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verify &amp; Authorize</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
