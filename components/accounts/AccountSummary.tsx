"use client";

import * as React from "react";
import { DollarSign, TrendingUp, Landmark, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { MOCK_SUMMARY } from "@/constants/mock-accounts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AccountSummary: React.FC = () => {
  const summaries = [
    {
      label: "Checking Balance",
      value: MOCK_SUMMARY.checking,
      status: "Active",
      trend: 1.2,
      icon: DollarSign,
      color: "border-border",
    },
    {
      label: "Savings Balance",
      value: MOCK_SUMMARY.savings,
      status: "Active",
      trend: 5.25,
      icon: TrendingUp,
      color: "border-border",
    },
    {
      label: "Investments Portfolio",
      value: MOCK_SUMMARY.investments,
      status: "Active",
      trend: 8.7,
      icon: Landmark,
      color: "border-border",
    },
    {
      label: "Total Net Assets",
      value: MOCK_SUMMARY.totalNet,
      status: "Secured",
      trend: 2.4,
      icon: ShieldCheck,
      color: "border-primary/20 bg-primary/5",
    },
  ];

  return (
    <div className="grid gap-4 mobile:grid-cols-2 laptop:grid-cols-4 select-none">
      {summaries.map((sum, index) => {
        const Icon = sum.icon;
        const isNet = sum.label === "Total Net Assets";

        return (
          <motion.div
            key={sum.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            className={cn(
              "rounded-custom-xl border p-5 flex flex-col justify-between shadow-soft hover:shadow-medium hover:border-border/80 transition-all",
              sum.color
            )}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>{sum.label}</span>
              <span
                className={cn(
                  "text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide border",
                  isNet
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-success/5 border-success/20 text-success"
                )}
              >
                {sum.status}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-xl laptop:text-2xl font-black text-foreground tracking-tight">
                {formatCurrency(sum.value)}
              </span>
              
              <span className="flex items-center gap-0.5 text-[10px] font-black text-success leading-none">
                <TrendingUp className="h-3.5 w-3.5" />
                +{sum.trend}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
