"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/app-shell";

interface LimitsManagerProps {
  card: CardItem;
  onUpdateLimits: (id: string, updates: any) => void;
}

export const LimitsManager: React.FC<LimitsManagerProps> = ({
  card,
  onUpdateLimits,
}) => {
  const { success } = useToast();

  const [daily, setDaily] = React.useState(card.spendingLimitDaily);
  const [weekly, setWeekly] = React.useState(card.spendingLimitWeekly);
  const [monthly, setMonthly] = React.useState(card.spendingLimitMonthly);
  const [atm, setAtm] = React.useState(card.spendingLimitAtm);
  const [online, setOnline] = React.useState(card.spendingLimitOnline);
  const [contactless, setContactless] = React.useState(card.spendingLimitContactless);

  // Sync state if card changes
  React.useEffect(() => {
    setDaily(card.spendingLimitDaily);
    setWeekly(card.spendingLimitWeekly);
    setMonthly(card.spendingLimitMonthly);
    setAtm(card.spendingLimitAtm);
    setOnline(card.spendingLimitOnline);
    setContactless(card.spendingLimitContactless);
  }, [card]);

  const handleSave = () => {
    onUpdateLimits(card.id, {
      spendingLimitDaily: daily,
      spendingLimitWeekly: weekly,
      spendingLimitMonthly: monthly,
      spendingLimitAtm: atm,
      spendingLimitOnline: online,
      spendingLimitContactless: contactless,
    });
    success("Limits updated", "Your spending allowances have been adjusted.");
  };

  const limitItems = [
    { label: "Daily Purchase limit", val: daily, set: setDaily, max: 10000, step: 500, remaining: daily - card.dailySpending },
    { label: "Weekly Purchase limit", val: weekly, set: setWeekly, max: 30000, step: 1000, remaining: weekly - card.dailySpending },
    { label: "Monthly Purchase limit", val: monthly, set: setMonthly, max: 100000, step: 5000, remaining: monthly - card.monthlySpending },
    { label: "ATM Withdrawal limit", val: atm, set: setAtm, max: 5000, step: 100, remaining: atm },
    { label: "Online transaction limit", val: online, set: setOnline, max: 10000, step: 500, remaining: online },
    { label: "Contactless spending limit", val: contactless, set: setContactless, max: 2000, step: 100, remaining: contactless },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center select-none shrink-0 mb-1 gap-4">
        <div className="space-y-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Spending Limits
          </h3>
          <p className="text-[10px] font-semibold text-text-secondary leading-normal">
            Adjust limits using numeric fields or interactive sliders.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-[10px] font-black transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          Save Limits
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {limitItems.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-custom-xl border border-border bg-surface space-y-3.5 shadow-soft select-none"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-foreground">{item.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-semibold">Max:</span>
                <input
                  aria-label={`${item.label} numeric input`}
                  type="number"
                  value={item.val}
                  onChange={(e) => item.set(Math.min(item.max, Math.max(0, Number(e.target.value))))}
                  className="w-20 bg-background border border-border rounded px-1.5 py-0.5 text-center font-mono font-bold text-[10px] text-foreground outline-none"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              aria-label={`${item.label} slider`}
              type="range"
              min={0}
              max={item.max}
              step={item.step}
              value={item.val}
              onChange={(e) => item.set(Number(e.target.value))}
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />

            <div className="flex justify-between items-center text-[9px] font-semibold text-text-secondary leading-none">
              <span>Set: {formatCurrency(item.val)}</span>
              <span>Available Allowance: {formatCurrency(Math.max(0, item.remaining))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
