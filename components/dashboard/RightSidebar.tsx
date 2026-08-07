"use client";

import * as React from "react";
import { Calendar, HelpCircle, MessageSquare, PhoneCall, TrendingUp, ArrowDown, ArrowUp } from "lucide-react";
import { MOCK_RATES, MOCK_EVENTS } from "@/constants/mock-dashboard";
import { useToast } from "@/components/app-shell";
import { cn } from "@/lib/utils";

import { loadTawkSupport } from "@/lib/tawk";

export const RightSidebar: React.FC = () => {
  const { success, info } = useToast();

  const handleSupportChat = () => {
    loadTawkSupport();
  };

  const handleSupportCall = () => {
    info("Emergency Support Call", "Dialing Northstar Bank emergency customer support desk...");
  };

  return (
    <div className="space-y-6 laptop:sticky laptop:top-24 select-none">
      
      {/* ─── LIVE EXCHANGE RATES ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Exchange Rates Terminal
          </h3>
        </div>

        <div className="rounded-custom-xl border border-border bg-surface p-4.5 space-y-3.5 shadow-soft">
          {MOCK_RATES.map((rate) => {
            const isUp = rate.change >= 0;
            return (
              <div key={rate.pair} className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground font-bold">{rate.pair}</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-black">{rate.rate.toLocaleString()}</span>
                  <span
                    className={cn(
                      "flex items-center text-[9px] font-black uppercase tracking-wider px-1 py-0.5 rounded",
                      isUp ? "bg-success/5 text-success" : "bg-error/5 text-error"
                    )}
                  >
                    {isUp ? <ArrowUp className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDown className="h-2.5 w-2.5 mr-0.5" />}
                    {Math.abs(rate.change)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* ─── QUICK HELP / SUPPORT ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Secure Concierge Help
          </h3>
        </div>

        <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-4 shadow-soft text-center">
          <div className="space-y-1.5 max-w-xs mx-auto">
            <h4 className="text-xs font-extrabold text-foreground">Need Assistance?</h4>
            <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
              Get immediate answers to your secure bank accounts, ledger sync or card concerns.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSupportChat}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat Concierge
            </button>
            <button
              onClick={handleSupportCall}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer outline-none"
            >
              <PhoneCall className="h-3.5 w-3.5 text-muted-foreground" />
              Direct Support Call
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
