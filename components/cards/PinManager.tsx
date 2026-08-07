"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { Lock, Eye, EyeOff, Check, X, ShieldAlert, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/app-shell";

interface PinManagerProps {
  card: CardItem;
  onChangePin: (id: string, newPin: string) => void;
}

export const PinManager: React.FC<PinManagerProps> = ({
  card,
  onChangePin,
}) => {
  const { success, error, info } = useToast();

  const [pinRevealed, setPinRevealed] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authPassword, setAuthPassword] = React.useState("");
  const [countdown, setCountdown] = React.useState(5);

  const [showChangeModal, setShowChangeModal] = React.useState(false);
  const [currentPinInput, setCurrentPinInput] = React.useState("");
  const [newPinInput, setNewPinInput] = React.useState("");
  const [confirmPinInput, setConfirmPinInput] = React.useState("");

  // Handle countdown for PIN reveal
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pinRevealed && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (pinRevealed && countdown === 0) {
      setPinRevealed(false);
      setCountdown(5);
      info("PIN hidden", "Your PIN code was auto-hidden for cryptographic security.");
    }
    return () => clearTimeout(timer);
  }, [pinRevealed, countdown]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPassword) return;

    // Simulate password validation
    setShowAuthModal(false);
    setAuthPassword("");
    setPinRevealed(true);
    setCountdown(5);
    success("Identity verified", "Displaying PIN code for 5 seconds.");
  };

  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput !== card.pin) {
      error("PIN change failed", "The current PIN you entered is incorrect.");
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      error("PIN change failed", "New PIN must be exactly 4 digits.");
      return;
    }
    if (newPinInput === card.pin) {
      error("PIN change failed", "New PIN cannot be the same as your existing PIN.");
      return;
    }
    if (newPinInput !== confirmPinInput) {
      error("PIN change failed", "New PIN and confirmation entries do not match.");
      return;
    }

    onChangePin(card.id, newPinInput);
    setShowChangeModal(false);
    
    // Clear inputs
    setCurrentPinInput("");
    setNewPinInput("");
    setConfirmPinInput("");
    
    success("PIN Changed", "Your card PIN code was updated successfully.");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 select-none">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          PIN Management
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Safely reveal your card PIN or configure new verification codes.
        </p>
      </div>

      <div className="bg-surface border border-border p-5 rounded-custom-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft">
        {/* PIN display */}
        <div className="flex items-center gap-4 select-none">
          <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl text-primary flex items-center justify-center shrink-0">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5 leading-none">
              Card PIN Code
            </span>
            <span className="font-mono text-base font-black text-foreground tracking-widest block leading-none mt-1">
              {pinRevealed ? (
                <span className="text-primary font-black animate-pulse">
                  {card.pin} <span className="text-[9px] font-bold text-muted-foreground font-sans tracking-normal">({countdown}s)</span>
                </span>
              ) : (
                "••••"
              )}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 select-none">
          <button
            onClick={() => {
              if (pinRevealed) {
                setPinRevealed(false);
              } else {
                setShowAuthModal(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
          >
            {pinRevealed ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                Hide PIN
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                Reveal PIN
              </>
            )}
          </button>

          <button
            onClick={() => setShowChangeModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <Key className="h-3.5 w-3.5 text-primary-foreground/75" />
            Change PIN
          </button>
        </div>
      </div>

      {/* ─── AUTHENTICATION REVEAL MODAL ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAuthSubmit} className="bg-surface border border-border rounded-custom-xl p-5 max-w-sm w-full space-y-4 shadow-modal select-none">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-xs font-black uppercase text-foreground tracking-wider">Confirm Identity</span>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="p-1 rounded hover:bg-muted/10 text-muted-foreground hover:text-foreground outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="auth-pass" className="text-[10px] font-bold text-text-secondary">Password</label>
              <input
                id="auth-pass"
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Enter account password"
                className="w-full bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
              >
                Verify Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── CHANGE PIN MODAL ─── */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleChangeSubmit} className="bg-surface border border-border rounded-custom-xl p-5 max-w-sm w-full space-y-4 shadow-modal select-none">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-xs font-black uppercase text-foreground tracking-wider">Change PIN Code</span>
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="p-1 rounded hover:bg-muted/10 text-muted-foreground hover:text-foreground outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="curr-pin" className="text-[10px] font-bold text-text-secondary">Current 4-Digit PIN</label>
                <input
                  id="curr-pin"
                  type="password"
                  required
                  maxLength={4}
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••"
                  className="w-full text-center font-mono tracking-widest bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-bold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="new-pin" className="text-[10px] font-bold text-text-secondary">New PIN</label>
                  <input
                    id="new-pin"
                    type="password"
                    required
                    maxLength={4}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full text-center font-mono tracking-widest bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-bold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="confirm-pin" className="text-[10px] font-bold text-text-secondary">Confirm PIN</label>
                  <input
                    id="confirm-pin"
                    type="password"
                    required
                    maxLength={4}
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    className="w-full text-center font-mono tracking-widest bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-bold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
              >
                Confirm Change
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
