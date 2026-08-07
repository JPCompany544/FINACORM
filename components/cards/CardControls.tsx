"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { cn } from "@/lib/utils";
import { Globe, CreditCard, Landmark, ShieldCheck, ShoppingBag, BellRing } from "lucide-react";
import { useToast } from "@/components/app-shell";

interface CardControlsProps {
  card: CardItem;
  onUpdateControl: (id: string, key: keyof CardItem, value: boolean) => void;
}

export const CardControls: React.FC<CardControlsProps> = ({
  card,
  onUpdateControl,
}) => {
  const { success } = useToast();

  const handleToggle = (key: keyof CardItem, label: string) => {
    const nextVal = !card[key];
    onUpdateControl(card.id, key, nextVal);
    success(
      "Control updated",
      `${label} is now ${nextVal ? "enabled" : "disabled"} for card ending ${card.number.slice(-4)}.`
    );
  };

  const controls = [
    {
      key: "onlinePayments" as keyof CardItem,
      label: "Online Transactions",
      description: "Allow payments on ecommerce websites or virtual invoices.",
      icon: ShoppingBag,
    },
    {
      key: "contactlessPayments" as keyof CardItem,
      label: "Contactless / Apple Pay",
      description: "Allow physical taps at registers or public transports.",
      icon: CreditCard,
    },
    {
      key: "atmWithdrawals" as keyof CardItem,
      label: "ATM Cash Withdrawals",
      description: "Allow card pin clearances at bank dispensers.",
      icon: Landmark,
    },
    {
      key: "internationalTransactions" as keyof CardItem,
      label: "International Purchases",
      description: "Allow conversions and charges at overseas terminals.",
      icon: Globe,
    },
    {
      key: "magstripePayments" as keyof CardItem,
      label: "Magnetic Stripe Taps",
      description: "Legacy card swipe capabilities at older terminals.",
      icon: ShieldCheck,
    },
    {
      key: "recurringPayments" as keyof CardItem,
      label: "Recurring Memberships",
      description: "Allow direct subscription auto-renewals on this card.",
      icon: BellRing,
    },
  ];

  return (
    <div className="space-y-4 select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Card Controls
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Toggle interactive settings for instant card security management.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {controls.map((ctrl) => {
          const Icon = ctrl.icon;
          const isEnabled = !!card[ctrl.key];

          return (
            <div
              key={ctrl.label}
              className="flex items-center justify-between p-4 rounded-custom-xl border border-border bg-surface shadow-soft hover:shadow-medium transition-all"
            >
              <div className="flex gap-3.5 items-start min-w-0">
                <div className="p-2 bg-muted/10 rounded-lg text-muted-foreground shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-foreground leading-none">{ctrl.label}</h4>
                  <p className="text-[10px] font-semibold text-text-secondary mt-1.5 leading-normal">
                    {ctrl.description}
                  </p>
                </div>
              </div>

              {/* IOS Styled Switch */}
              <button
                onClick={() => handleToggle(ctrl.key, ctrl.label)}
                aria-label={`Toggle ${ctrl.label}`}
                className={cn(
                  "h-5 w-9 rounded-full relative shrink-0 transition-colors duration-200 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/20",
                  isEnabled ? "bg-primary" : "bg-muted-foreground/20"
                )}
              >
                <div
                  className={cn(
                    "h-3.5 w-3.5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-soft",
                    isEnabled ? "right-0.5" : "left-0.5"
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
