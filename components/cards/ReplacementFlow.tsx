"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { AlertTriangle, Clock, MapPin, Truck, CheckCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/app-shell";

interface ReplacementFlowProps {
  card: CardItem;
  onReplaceCard: (id: string, reason: string) => void;
}

const REASONS = [
  { id: "lost", label: "Lost Card" },
  { id: "stolen", label: "Stolen Card" },
  { id: "damaged", label: "Damaged Card" },
  { id: "expired", label: "Expired Card" },
  { id: "other", label: "Other / Upgrade" },
];

export const ReplacementFlow: React.FC<ReplacementFlowProps> = ({
  card,
  onReplaceCard,
}) => {
  const { success, error } = useToast();

  const [reason, setReason] = React.useState("lost");
  const [speed, setSpeed] = React.useState<"standard" | "express">("standard");
  const [completed, setCompleted] = React.useState(false);

  const shippingAddress = "158 Mercer St, New York, NY 10012, USA";

  const getDetails = () => {
    if (speed === "express") {
      return { fee: 25.00, eta: "1 to 2 business days" };
    }
    return { fee: 0.00, eta: "5 to 7 business days" };
  };

  const { fee, eta } = getDetails();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReplaceCard(card.id, reason);
    setCompleted(true);
    success("Replacement ordered", "Your old card has been cancelled. A new card is on the way.");
  };

  if (completed) {
    return (
      <div className="bg-surface border border-border p-6 rounded-custom-xl text-center space-y-4 max-w-md mx-auto select-none">
        <div className="p-3 bg-success/10 border border-success/20 rounded-full text-success w-fit mx-auto">
          <CheckCircle className="h-10 w-10" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-foreground">Replacement Card Ordered</h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Card ending in **{card.number.slice(-4)}** has been blocked. A new replacement card has been dispatched to your mailing address.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-3.5 space-y-1.5 text-left text-[10px] font-bold text-text-secondary">
          <div className="flex justify-between">
            <span>Delivery Method</span>
            <span className="text-foreground capitalize">{speed}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Arrival</span>
            <span className="text-foreground">{eta}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Address</span>
            <span className="text-foreground truncate max-w-[200px]">{shippingAddress}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none">
      <div className="space-y-1">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Replace Card
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Order a replacement card. Your old card will be blocked immediately upon submitting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border p-5 rounded-custom-xl space-y-5 shadow-soft">
        {/* Reasons */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
            Replacement Reason
          </label>
          <div className="flex flex-wrap gap-2">
            {REASONS.map((res) => {
              const isSelected = reason === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setReason(res.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-custom-md border text-[10px] font-black transition-colors cursor-pointer outline-none",
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-surface border-border hover:bg-surface-hover text-foreground"
                  )}
                >
                  {res.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
            Delivery Option
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "standard" as const, label: "Standard Mailing", feeDesc: "Free", etaDesc: "5 to 7 business days", icon: Truck },
              { id: "express" as const, label: "Express Air", feeDesc: "$25.00 Charge", etaDesc: "1 to 2 business days", icon: Clock },
            ].map((d) => {
              const Icon = d.icon;
              const isSelected = speed === d.id;

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSpeed(d.id)}
                  className={cn(
                    "flex items-center gap-3.5 p-4 rounded-custom-xl border text-left cursor-pointer transition-all outline-none",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary"
                      : "border-border bg-surface hover:border-border/80 hover:shadow-soft"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                    isSelected
                      ? "bg-primary/10 border-primary/20 text-primary"
                      : "bg-muted/10 border-border text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-foreground leading-none">{d.label}</h5>
                    <p className="text-[10px] font-semibold text-text-secondary mt-1 leading-none">
                      {d.etaDesc} · {d.feeDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mailing Address disclosure */}
        <div className="bg-muted/10 border border-border/40 p-3.5 rounded-custom-lg flex items-start gap-2.5">
          <MapPin className="h-4.5 w-4.5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block leading-none">
              Shipping Address
            </span>
            <p className="text-xs font-bold text-foreground leading-none mt-1">
              {shippingAddress}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-error/5 border border-error/20 p-4 rounded-custom-xl flex gap-3 items-start leading-normal">
          <AlertTriangle className="h-4.5 w-4.5 text-error shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="text-xs font-extrabold text-foreground">Card replacement conditions</h5>
            <p className="text-[10px] font-semibold text-text-secondary">
              Upon ordering a replacement card, the existing physical and digital card credentials (Visa ending in {card.number.slice(-4)}) will be **permanently disabled**.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Confirm Replacement Order
        </button>
      </form>
    </div>
  );
};
