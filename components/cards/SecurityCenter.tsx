"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { ShieldCheck, ShieldAlert, Laptop, MapPin, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityCenterProps {
  card: CardItem;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({ card }) => {
  const isRiskOk = card.status !== "Blocked" && card.status !== "Lost";

  return (
    <div className="space-y-4 select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Card Security Audit
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Check live diagnostic parameters and cryptographic token status.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Risk Status */}
        <div className="p-4 rounded-custom-xl border border-border bg-surface flex items-start gap-3.5 shadow-soft">
          <div className={cn(
            "p-2 rounded-lg shrink-0 mt-0.5",
            isRiskOk ? "bg-success/10 text-success" : "bg-error/10 text-error"
          )}>
            {isRiskOk ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5" />}
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-0.5">
              Risk Profile Status
            </span>
            <span className="text-xs font-bold text-foreground leading-none block mt-1">
              {isRiskOk ? "Optimal (No fraud warnings)" : "Suspended / Flagged"}
            </span>
            <p className="text-[9px] font-semibold text-text-secondary mt-1.5 leading-normal">
              Active real-time security tracking is monitoring card swipes for anomalies.
            </p>
          </div>
        </div>

        {/* Audit Details */}
        <div className="p-4 rounded-custom-xl border border-border bg-surface space-y-2.5 shadow-soft">
          {[
            { label: "Last Pin Update", value: card.lastPinChange || "Never changed", icon: CalendarDays },
            { label: "Last Freeze Locked", value: card.lastFreeze || "Never frozen", icon: Clock },
            { label: "Last Used Terminal", value: card.lastUsed || "No transactions recorded", icon: Laptop },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {item.label}
                </span>
                <span className="text-foreground font-extrabold">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
