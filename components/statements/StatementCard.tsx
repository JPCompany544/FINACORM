"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileText, Eye, Download, Share2, Archive, Receipt, FileCheck, FileClock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatementItem, StatementStatus, StatementType } from "@/constants/mock-statements";
import { useToast } from "@/components/app-shell";

interface StatementCardProps {
  statement: StatementItem;
  onPreview: (s: StatementItem) => void;
  index: number;
}

// ─── ICON MAP BY TYPE ─────────────────────────────────────────────────────────
const TYPE_ICONS: Record<StatementType, React.ElementType> = {
  "Monthly Statement": FileText,
  "Quarterly Statement": FileText,
  "Annual Summary": FileCheck,
  "Tax Document (1099)": Receipt,
  "Wire Confirmation": FileClock,
  "Account Opening": FileCheck,
};

const TYPE_COLORS: Record<StatementType, string> = {
  "Monthly Statement": "bg-primary/8 text-primary border-primary/15",
  "Quarterly Statement": "bg-accent/8 text-accent border-accent/15",
  "Annual Summary": "bg-success/8 text-success border-success/15",
  "Tax Document (1099)": "bg-warning/8 text-warning border-warning/15",
  "Wire Confirmation": "bg-info/8 text-info border-info/15",
  "Account Opening": "bg-muted/10 text-muted-foreground border-border",
};

const STATUS_CONFIG: Record<
  StatementStatus,
  { label: string; classes: string; dot: string }
> = {
  available: {
    label: "Available",
    classes: "bg-success/8 border-success/25 text-success",
    dot: "bg-success",
  },
  processing: {
    label: "Processing",
    classes: "bg-warning/8 border-warning/25 text-warning",
    dot: "bg-warning animate-pulse",
  },
  archived: {
    label: "Archived",
    classes: "bg-muted/10 border-border text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export const StatementCard: React.FC<StatementCardProps> = ({
  statement: stmt,
  onPreview,
  index,
}) => {
  const { success, info } = useToast();
  const Icon = TYPE_ICONS[stmt.type];
  const typeColor = TYPE_COLORS[stmt.type];
  const statusCfg = STATUS_CONFIG[stmt.status];
  const isAvailable = stmt.status === "available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:shadow-soft transition-all group"
    >
      {/* ─── TYPE ICON ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
          typeColor
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* ─── STATEMENT INFO ────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-xs font-extrabold text-foreground truncate group-hover:text-primary transition-colors">
          {stmt.title}
        </h4>
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-semibold text-text-secondary">
          <span>{stmt.accountName}</span>
          <span className="text-border">·</span>
          <span>{stmt.accountNumber}</span>
          <span className="text-border">·</span>
          <span>Generated {stmt.generatedDate}</span>
          <span className="text-border">·</span>
          <span>{stmt.fileSize}</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          {/* Statement type pill */}
          <span
            className={cn(
              "inline-flex text-[8px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full leading-none",
              typeColor
            )}
          >
            {stmt.type}
          </span>
          {/* Status badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full leading-none",
              statusCfg.classes
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dot)} />
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* ─── ACTIONS ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {isAvailable && (
          <button
            onClick={() => onPreview(stmt)}
            aria-label={`Preview ${stmt.title}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-[10px] font-bold text-foreground transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            Preview
          </button>
        )}
        <button
          onClick={() =>
            success("PDF Downloaded", `${stmt.title} exported as PDF.`)
          }
          disabled={!isAvailable}
          aria-label={`Download ${stmt.title} as PDF`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-bold transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </button>
        <button
          onClick={() =>
            success("CSV Downloaded", `${stmt.title} exported as CSV.`)
          }
          disabled={!isAvailable}
          aria-label={`Download ${stmt.title} as CSV`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-bold text-foreground transition-all cursor-pointer outline-none"
        >
          CSV
        </button>
        <button
          onClick={() => info("Share Link", "Generating a secure share link...")}
          aria-label={`Share ${stmt.title}`}
          className="p-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground transition-all cursor-pointer outline-none"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
