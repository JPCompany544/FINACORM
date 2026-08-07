"use client";

import * as React from "react";
import Link from "next/link";
import { Wallet, Landmark, Compass, ArrowRight } from "lucide-react";
import { AccountItem } from "@/constants/mock-accounts";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  account: AccountItem;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const IconMap = {
    Checking: Wallet,
    Savings: Landmark,
    Investments: Compass,
  };

  const Icon = IconMap[account.type];

  return (
    <Link
      href={`/dashboard/accounts/${account.id}`}
      className="block rounded-custom-xl border border-border bg-surface p-5 flex flex-col justify-between shadow-soft hover:shadow-medium hover:border-primary/20 transition-all select-none group outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl border border-border/80 bg-primary/5 text-primary flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-black text-foreground truncate group-hover:text-primary transition-colors">
              {account.name}
            </h4>
            <p className="text-[10px] font-bold text-muted-foreground mt-0.5 tracking-wider">
              {account.number}
            </p>
          </div>
        </div>
        <span className="text-[9px] font-black uppercase border border-success/20 bg-success/5 px-2 py-0.5 rounded text-success tracking-wider">
          {account.status}
        </span>
      </div>

      {/* Balance disclosures */}
      <div className="grid grid-cols-2 gap-4 mt-6 border-y border-border/40 py-3.5">
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground leading-none">
            Available Balance
          </span>
          <p className="text-base font-black text-foreground leading-none tracking-tight">
            {formatCurrency(account.availableBalance)}
          </p>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground leading-none">
            Current Ledger
          </span>
          <p className="text-sm font-extrabold text-text-secondary leading-none tracking-tight">
            {formatCurrency(account.currentBalance)}
          </p>
        </div>
      </div>

      {/* Bottom card logs */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[8px] font-extrabold uppercase tracking-wider text-muted-foreground block">
            Last statement activity
          </span>
          <p className="text-[10px] font-semibold text-text-secondary truncate mt-0.5 max-w-[200px]">
            {account.lastActivity}
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-custom-md border border-border bg-surface group-hover:border-primary/20 group-hover:bg-primary/5 text-[10px] font-extrabold text-foreground group-hover:text-primary transition-all shrink-0 self-start sm:self-auto">
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
};
