"use client";

import * as React from "react";
import { ShieldCheck, TrendingUp, X } from "lucide-react";
import { Container } from "@/components/layout/container";

export const TopBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 text-xs font-semibold relative select-none border-b border-white/10">
      <Container className="flex items-center justify-between">
        <div className="flex items-center space-x-6 mx-auto tablet:mx-0">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Member FDIC. Insured up to $250M+.</span>
          </div>
          <div className="hidden tablet:flex items-center space-x-1.5">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span>High-Yield Savings Rate: 5.25% APY.</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors p-1"
          aria-label="Close alert banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </Container>
    </div>
  );
};
