"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentStepName } from "./usePaymentsState";

interface PaymentStepperProps {
  currentStep: PaymentStepName;
}

const FLOW_STEPS: Array<{ name: PaymentStepName; label: string }> = [
  { name: "recipient", label: "Recipient" },
  { name: "source", label: "Account" },
  { name: "details", label: "Details" },
  { name: "review", label: "Review" },
  { name: "auth", label: "Authorise" },
];

export const PaymentStepper: React.FC<PaymentStepperProps> = ({ currentStep }) => {
  const activeIndex = FLOW_STEPS.findIndex((s) => s.name === currentStep);
  const isEndState = currentStep === "success";

  if (currentStep === "home") return null;

  return (
    <div className="w-full bg-surface border border-border p-4 rounded-custom-xl select-none" aria-label="Payment progress">
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
        {FLOW_STEPS.map((item, idx) => {
          const isCompleted = isEndState || activeIndex > idx;
          const isActive = !isEndState && activeIndex === idx;
          return (
            <React.Fragment key={item.name}>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-all",
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/25"
                      : "bg-muted/10 border border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{idx + 1}</span>}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-black uppercase tracking-wider",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
              {idx < FLOW_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-all duration-300",
                    isCompleted ? "bg-success" : activeIndex === idx ? "bg-gradient-to-r from-primary to-border" : "bg-border/60"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
