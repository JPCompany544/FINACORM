"use client";

import * as React from "react";
import { AlertCircle, Lightbulb, Compass, Award } from "lucide-react";
import { useAuth, fetchTransactions } from "@/lib/supabase";

export const Insights: React.FC = () => {
  const { user } = useAuth();
  const [hasTx, setHasTx] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    fetchTransactions(user.id)
      .then((txs) => {
        setHasTx(txs.length > 0);
      })
      .catch((err) => {
        console.error("Error fetching transactions for insights:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted/20 animate-pulse rounded" />
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="h-20 bg-muted/10 animate-pulse rounded-custom-xl" />
          <div className="h-20 bg-muted/10 animate-pulse rounded-custom-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 select-none">
        <Lightbulb className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Financial Insights
        </h3>
      </div>

      {!hasTx ? (
        <div className="rounded-custom-xl border border-border border-dashed p-6 text-center text-xs font-semibold text-muted-foreground select-none">
          No insights yet. Complete your first transaction to unlock smart spending alerts.
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 select-none">
          <div className="p-4 rounded-custom-xl border flex gap-3.5 bg-success/5 border-success/20 text-success items-start text-xs font-semibold">
            <div className="p-1.5 rounded-full shrink-0 border mt-0.5 bg-success/10 border-success/15 text-success">
              <Award className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-foreground text-xs">Tracking Ledger Sync</h4>
              <p className="text-[11px] text-text-secondary font-medium">Your bank accounts are securely syncing with active ledger logs.</p>
            </div>
          </div>
          <div className="p-4 rounded-custom-xl border flex gap-3.5 bg-info/5 border-info/20 text-info items-start text-xs font-semibold">
            <div className="p-1.5 rounded-full shrink-0 border mt-0.5 bg-info/10 border-info/15 text-info">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-foreground text-xs">Category mapping enabled</h4>
              <p className="text-[11px] text-text-secondary font-medium">Automatic category classification is scanning your outbound transfers.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
