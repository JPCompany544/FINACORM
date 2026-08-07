"use client";

import * as React from "react";
import { EmptyState } from "@/components/ui/empty-state";

interface EmptyStateViewProps {
  type: "transactions" | "notifications" | "cards" | "accounts" | "beneficiaries";
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="py-6 select-none">
      <EmptyState
        type={type}
        title={title}
        description={description}
        actionText={actionText}
        onAction={onAction}
      />
    </div>
  );
};
