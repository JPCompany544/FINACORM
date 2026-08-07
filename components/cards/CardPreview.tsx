"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { cn } from "@/lib/utils";
import { ShieldAlert, Compass, Eye, EyeOff } from "lucide-react";

interface CardPreviewProps {
  card: CardItem;
  revealNumber?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({ card, revealNumber = false }) => {
  const isFrozen = card.status === "Frozen";

  return (
    <div
      className={cn(
        "w-full aspect-[1.586/1] max-w-[340px] rounded-custom-xl bg-gradient-to-br p-5 flex flex-col justify-between shadow-floating relative overflow-hidden select-none select-none transition-all duration-300",
        card.color,
        isFrozen && "brightness-75 saturate-50"
      )}
      aria-label={`${card.name} (${card.brand} ${card.type}) - Status: ${card.status}`}
    >
      {/* Absolute overlay if frozen */}
      {isFrozen && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 z-20">
          <ShieldAlert className="h-6 w-6 text-error animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-error-foreground">
            Card Frozen
          </span>
        </div>
      )}

      {/* Radial shine overlay */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      {/* Top Brand Block */}
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-80 leading-none">
            {card.name}
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest block opacity-50 mt-1 leading-none">
            {card.type} Card
          </span>
        </div>

        {/* Brand logo label */}
        <span className="text-xs font-black italic tracking-tighter opacity-90">
          {card.brand}
        </span>
      </div>

      {/* Chip/Logo Decorator */}
      <div className="h-7 w-9 rounded bg-yellow-500/25 border border-yellow-500/30 flex items-center justify-center shrink-0 z-10 mt-3">
        <Compass className="h-4.5 w-4.5 text-yellow-500/70" />
      </div>

      {/* Card number */}
      <div className="my-3 text-sm sm:text-base font-bold font-mono tracking-widest opacity-90 z-10">
        {revealNumber ? card.number.replace(/•/g, "4") : card.number}
      </div>

      {/* Expiry / Cardholder */}
      <div className="flex justify-between items-end z-10 text-[9px] font-semibold opacity-80 leading-none">
        <div>
          <span className="text-[7px] font-black uppercase opacity-55 tracking-wider block mb-1">
            Cardholder Name
          </span>
          <span className="font-extrabold uppercase tracking-wide">{card.cardholderName}</span>
        </div>
        <div className="text-right">
          <span className="text-[7px] font-black uppercase opacity-55 tracking-wider block mb-1">
            Expires
          </span>
          <span className="font-mono font-bold">{card.expiry}</span>
        </div>
      </div>
    </div>
  );
};
