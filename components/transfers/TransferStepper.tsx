"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { StepName } from "./useTransfer";

interface TransferStepperProps {
  currentStep: StepName;
}

const STEP_ORDER: Array<{ name: StepName; label: string }> = [
  { name: "details", label: "Details" },
  { name: "review", label: "Review" },
  { name: "pin", label: "Security PIN" },
  { name: "success", label: "Success" },
];

export const TransferStepper: React.FC<TransferStepperProps> = ({ currentStep }) => {
  const activeIndex = STEP_ORDER.findIndex((s) => s.name === currentStep);
  const isEndState = currentStep === "success";

  return (
    <div className="w-full bg-surface border border-border p-4 rounded-custom-xl select-none" aria-label="Transfer progress tracker">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {STEP_ORDER.map((item, idx) => {
          const isCompleted = isEndState || activeIndex > idx;
          const isActive = !isEndState && activeIndex === idx;

          return (
            <React.Fragment key={item.name}>
              {/* Step Circle */}
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
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-black uppercase tracking-wider",
                    isActive ? "text-primary font-black" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {/* Connecting line */}
              {idx < STEP_ORDER.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-all duration-300",
                    isCompleted || (activeIndex > idx)
                      ? "bg-success"
                      : activeIndex === idx
                      ? "bg-gradient-to-r from-primary to-border"
                      : "bg-border/60"
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
