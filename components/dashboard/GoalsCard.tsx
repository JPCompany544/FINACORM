"use client";

import * as React from "react";
import { Landmark, ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { formatCurrency } from "@/lib/utils";
import { useAuth, fetchTransactions } from "@/lib/supabase";

export const GoalsCard: React.FC = () => {
  const { info } = useToast();
  const { user } = useAuth();
  const [hasActivity, setHasActivity] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    fetchTransactions(user.id)
      .then((txs) => {
        setHasActivity(txs.length > 0);
      })
      .catch((err) => {
        console.error("Error fetching transactions for goals:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const handleCreateGoal = () => {
    info("Create Savings Target", "Opening financial savings goal setup panel.");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted/20 animate-pulse rounded" />
        <div className="h-32 bg-muted/10 animate-pulse rounded-custom-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Landmark className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Active Savings Goals
          </h3>
        </div>

        <button
          onClick={handleCreateGoal}
          className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/25 rounded-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          New Goal
        </button>
      </div>

      {!hasActivity ? (
        <div className="rounded-custom-xl border border-border border-dashed p-6 text-center text-xs font-semibold text-muted-foreground select-none">
          No savings goals configured yet. Click 'New Goal' to start tracking your targets.
        </div>
      ) : (
        /* ─── GOALS CONTAINER CARD ───────────────────────────────────────────── */
        <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4.5 shadow-soft select-none">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-foreground">Emergency Fund Reserve</span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                0% complete
              </span>
            </div>

            {/* Progress bar container */}
            <div className="h-2 w-full bg-divider rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-success"
                style={{ width: `0%` }}
                role="progressbar"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress bar for Emergency Fund Reserve"
              />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-text-secondary">
              <span>Saved {formatCurrency(0)}</span>
              <span>Target {formatCurrency(10000)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
