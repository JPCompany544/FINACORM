"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, User } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DashboardData } from "@/lib/supabase";

interface DashboardOverviewProps {
  data: DashboardData;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
  const { profile, account, user } = data;

  const totalBalance = account ? account.available_balance : 0;
  const currency = account ? account.currency : "USD";

  return (
    <div className="space-y-4">
      {/* ─── AVAILABLE BALANCE CARD ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-custom-xl border border-border/80 bg-surface/50 dark:bg-dark/50 backdrop-blur-md p-6 relative overflow-hidden shadow-floating"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between select-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Available Net Balance
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl laptop:text-4xl font-black text-foreground tracking-tight">
            {formatCurrency(totalBalance, currency)}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase">{currency}</span>
        </div>

        <p className="text-[11px] font-semibold text-text-secondary mt-1.5 leading-relaxed">
          Aggregated checkings, savings deposits, and equity portfolios.
        </p>
      </motion.div>

      {/* ─── SUB ACCOUNTS LIST GRID ─────────────────────────────────────────── */}
      <div className="grid gap-3.5 sm:grid-cols-1">
        {account ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-custom-lg border border-border bg-surface p-4 flex flex-col justify-between shadow-soft hover:shadow-medium hover:border-border/80 transition-all group select-none"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
                  {account.account_type === "CHECKING" ? "Checking Account" : account.account_type}
                </h4>
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                  {account.account_number}
                </p>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-success border border-success/20 bg-success/5 px-1.5 py-0.5 rounded">
                {account.status}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-base laptop:text-lg font-black text-foreground tracking-tight">
                {formatCurrency(account.available_balance, account.currency)}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-black text-success">
                <TrendingUp className="h-3 w-3" />
                1.2%
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-custom-lg border border-border border-dashed p-6 text-center text-xs font-semibold text-muted-foreground">
            No active account found.
          </div>
        )}
      </div>

      {/* ─── CUSTOMER & ACCOUNT METADATA PANEL ───────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Customer Profile Card */}
        <div className="rounded-custom-xl border border-border bg-surface/30 p-5 space-y-4 shadow-soft">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <User className="h-3.5 w-3.5 text-primary" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Customer Profile
            </h4>
          </div>
          <div className="space-y-2.5 text-xs font-semibold text-text-secondary">
            <div className="flex justify-between items-center">
              <span>Full Name</span>
              <span className="text-foreground font-extrabold">
                {profile.first_name} {profile.last_name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Customer ID</span>
              <span className="text-foreground font-extrabold">
                {profile.customer_number}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Email Address</span>
              <span className="text-foreground font-extrabold truncate max-w-[180px]">
                {user.email}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Member Since</span>
              <span className="text-foreground font-extrabold">
                {formatDate(profile.created_at, { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="rounded-custom-xl border border-border bg-surface/30 p-5 space-y-4 shadow-soft">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Account Information
            </h4>
          </div>
          {account ? (
            <div className="space-y-2.5 text-xs font-semibold text-text-secondary">
              <div className="flex justify-between items-center">
                <span>Account Number</span>
                <span className="text-foreground font-extrabold">
                  {account.account_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Account Type</span>
                <span className="text-foreground font-extrabold uppercase">
                  {account.account_type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Currency</span>
                <span className="text-foreground font-extrabold">
                  {account.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Current Balance</span>
                <span className="text-foreground font-extrabold">
                  {formatCurrency(account.current_balance, account.currency)}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs font-semibold text-muted-foreground py-4">
              No active account details available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
