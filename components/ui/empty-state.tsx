import * as React from "react";
import { ArrowRightLeft, BellOff, CreditCard, Landmark, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  className?: string;
  type: "transactions" | "notifications" | "cards" | "accounts" | "beneficiaries";
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  type,
  title,
  description,
  actionText,
  onAction,
}) => {
  const configs = {
    transactions: {
      icon: ArrowRightLeft,
      title: "No transactions found",
      description: "You haven't made any transactions yet. Your transaction history will display here.",
      actionText: "Make a transfer",
    },
    notifications: {
      icon: BellOff,
      title: "No new notifications",
      description: "You're all caught up! When you receive alerts or updates, they'll show up here.",
      actionText: "Refresh alerts",
    },
    cards: {
      icon: CreditCard,
      title: "No active cards",
      description: "You don't have any debit or credit cards linked. Order a metal card to get started.",
      actionText: "Order a card",
    },
    accounts: {
      icon: Landmark,
      title: "No bank accounts linked",
      description: "Securely link your retail or checking accounts to aggregate and monitor your assets.",
      actionText: "Link an account",
    },
    beneficiaries: {
      icon: UserPlus,
      title: "No beneficiaries added",
      description: "Create beneficiaries to wire funds or configure recurring salary transfers instantly.",
      actionText: "Add beneficiary",
    },
  };

  const current = configs[type];
  const Icon = current.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-custom-lg border border-dashed border-border bg-surface/40 max-w-md mx-auto my-6 space-y-4",
        className
      )}
    >
      <div className="p-3.5 bg-muted/5 border border-border/60 rounded-full text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-sm font-bold text-foreground">{title || current.title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed">{description || current.description}</p>
      </div>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText || current.actionText}
        </Button>
      )}
    </div>
  );
};
