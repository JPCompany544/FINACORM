"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { ShieldAlert, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/app-shell";

interface FreezeControlProps {
  card: CardItem;
  onToggleFreeze: (id: string) => void;
}

export const FreezeControl: React.FC<FreezeControlProps> = ({
  card,
  onToggleFreeze,
}) => {
  const { success, error } = useToast();
  const [showConfirm, setShowConfirm] = React.useState(false);
  const isFrozen = card.status === "Frozen";

  const handleAction = () => {
    onToggleFreeze(card.id);
    setShowConfirm(false);
    if (!isFrozen) {
      error("Card Frozen", `Card ending in ${card.number.slice(-4)} locked.`);
    } else {
      success("Card Reactivated", `Card ending in ${card.number.slice(-4)} is now active.`);
    }
  };

  return (
    <div className="space-y-4 select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Freeze Card
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Lock card authorizations instantly if misplaced or stolen. Unfreeze anytime.
        </p>
      </div>

      <div className="bg-surface border border-border p-5 rounded-custom-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-soft">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground">
            {isFrozen ? "Card is currently locked" : "Temporarily freeze card"}
          </h4>
          <p className="text-[10px] font-semibold text-text-secondary leading-normal max-w-md">
            {isFrozen
              ? "All outgoing authorizations, swipes, and online checkouts are blocked. Inbound refunds remain active."
              : "Temporarily prevent outgoing purchases. Enable back instantly from this dashboard."}
          </p>
        </div>

        <button
          onClick={() => {
            if (isFrozen) handleAction(); // unfreeze directly
            else setShowConfirm(true);    // show confirm dialog to freeze
          }}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 px-4 rounded-custom-md text-xs font-bold transition-all shadow-soft cursor-pointer outline-none",
            isFrozen
              ? "bg-success text-success-foreground hover:opacity-90"
              : "bg-error text-error-foreground hover:opacity-90"
          )}
        >
          {isFrozen ? (
            <>
              <ShieldCheck className="h-4 w-4" />
              Unfreeze Card
            </>
          ) : (
            <>
              <ShieldAlert className="h-4 w-4" />
              Freeze Card
            </>
          )}
        </button>
      </div>

      {/* Freeze confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-custom-xl p-5 max-w-sm w-full space-y-4 shadow-modal select-none">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-xs font-black uppercase text-error tracking-wider">Freeze Card?</span>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-1 rounded hover:bg-muted/10 text-muted-foreground hover:text-foreground outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-text-secondary leading-relaxed">
              Confirm temporary freeze for your **{card.name}**? Swipe checkouts, contactless, and subscriptions charges will fail immediately.
            </p>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="px-4 py-1.5 rounded-custom-md bg-error text-error-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
              >
                Freeze Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
