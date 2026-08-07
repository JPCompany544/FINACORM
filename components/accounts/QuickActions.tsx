"use client";

import * as React from "react";
import { Send, Download, FileText, Globe } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { motion } from "framer-motion";

export const QuickActions: React.FC = () => {
  const { success, info } = useToast();

  const handleTransfer = () => {
    success("Transfer Terminal Initialized", "Secure transfer session opened.");
  };

  const handleDeposit = () => {
    success("Mobile check deposit active", "Scan credentials checklist details.");
  };

  const handleViewStatements = () => {
    info("Statement Export", "Downloading quarterly statement log details...");
  };

  const handleDownloadIban = () => {
    success("IBAN Downloaded", "IBAN and bank swift credentials PDF downloaded.");
  };

  const actions = [
    { label: "Transfer Money", icon: Send, onClick: handleTransfer, color: "text-primary" },
    { label: "Deposit Check", icon: Download, onClick: handleDeposit, color: "text-success" },
    { label: "View Statements", icon: FileText, onClick: handleViewStatements, color: "text-accent" },
    { label: "Download IBAN", icon: Globe, onClick: handleDownloadIban, color: "text-foreground" },
  ];

  return (
    <div className="space-y-3.5 select-none">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Account Actions Panel
      </h3>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.label}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={act.onClick}
              className="flex items-center gap-3 p-4 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:bg-primary/5 transition-all text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <div className="p-2 bg-muted/10 rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">{act.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
