"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/constants/mock-transactions";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; classes: string; dotColor: string }
> = {
  completed: {
    label: "Completed",
    classes: "bg-success/8 border-success/25 text-success",
    dotColor: "bg-success",
  },
  pending: {
    label: "Pending",
    classes: "bg-warning/8 border-warning/25 text-warning",
    dotColor: "bg-warning animate-pulse",
  },
  processing: {
    label: "Processing",
    classes: "bg-info/8 border-info/25 text-info",
    dotColor: "bg-info animate-pulse",
  },
  failed: {
    label: "Failed",
    classes: "bg-error/8 border-error/25 text-error",
    dotColor: "bg-error",
  },
};

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({
  status,
  className,
}) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full leading-none",
        config.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotColor)} />
      {config.label}
    </span>
  );
};
