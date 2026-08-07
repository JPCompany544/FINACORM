"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, KeyRound, Settings, RefreshCcw, Plus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth, fetchCards, CardItem } from "@/lib/supabase";

export const CardsCarousel: React.FC = () => {
  const { success, info } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const [cards, setCards] = React.useState<CardItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCardIdx, setSelectedCardIdx] = React.useState(0);
  const [showPin, setShowPin] = React.useState(false);
  const [pinCountdown, setPinCountdown] = React.useState(0);

  const activeCard = cards[selectedCardIdx] || null;

  React.useEffect(() => {
    if (!user) return;

    async function loadCards() {
      try {
        const data = await fetchCards(user!.id);
        setCards(data);
      } catch (err) {
        console.error("Error loading cards:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [user]);

  // PIN reveal auto-dismiss cooldown
  React.useEffect(() => {
    if (pinCountdown <= 0) {
      if (showPin) setShowPin(false);
      return;
    }
    const t = setTimeout(() => setPinCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [pinCountdown, showPin]);

  const handleToggleFreeze = () => {
    if (!activeCard) return;
    const nextStatus = activeCard.status === "Active" ? "Frozen" : "Active";
    setCards((prev) =>
      prev.map((c) => (c.id === activeCard.id ? { ...c, status: nextStatus } : c))
    );
    if (nextStatus === "Frozen") {
      success("Card Frozen Successfully", `Your card ending in ${activeCard.number.slice(-4)} has been frozen.`);
    } else {
      success("Card Restored Successfully", `Your card ending in ${activeCard.number.slice(-4)} is now active.`);
    }
  };

  const handleRevealPin = () => {
    if (!activeCard) return;
    if (showPin) {
      setShowPin(false);
      setPinCountdown(0);
    } else {
      setShowPin(true);
      setPinCountdown(5);
      info("Temporary PIN Reveal", "Card PIN is shown temporarily for 5 seconds.");
    }
  };

  const handleOrderCard = () => {
    router.push("/dashboard/cards");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          My Active Cards Carousel
        </h3>
        <button
          onClick={handleOrderCard}
          className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/25 rounded-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Order Card
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-muted/20 animate-pulse rounded-custom-xl" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-custom-xl border border-border border-dashed p-10 text-center text-xs font-semibold text-muted-foreground select-none">
          No cards available.
        </div>
      ) : (
        <>
          {/* ─── CAROUSEL HORIZONTAL LIST ───────────────────────────────────────── */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x select-none">
            {cards.map((card, idx) => {
              const isSelected = idx === selectedCardIdx;
              const isFrozen = card.status === "Frozen";

              return (
                <motion.div
                  key={card.id}
                  onClick={() => {
                    setSelectedCardIdx(idx);
                    setShowPin(false);
                    setPinCountdown(0);
                  }}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "relative flex-shrink-0 w-72 h-44 rounded-custom-xl bg-gradient-to-br p-5 flex flex-col justify-between shadow-floating cursor-pointer snap-start transition-all duration-300 border border-white/5",
                    card.color || "from-zinc-800 to-zinc-950",
                    isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.01]" : "opacity-75 hover:opacity-95"
                  )}
                >
                  {/* Decorative glowing gradient overlay for metal card */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-custom-xl pointer-events-none" />

                  {/* Card Header Type & Logo */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full text-white/90">
                        {card.type}
                      </span>
                    </div>
                    <span className="text-sm font-black italic tracking-tighter text-white/80">
                      {card.brand}
                    </span>
                  </div>

                  {/* Card Body - Masked Number */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 tracking-wider">
                      Card Number
                    </p>
                    <p className="text-lg font-mono font-bold tracking-widest text-white/95">
                      {card.number}
                    </p>
                  </div>

                  {/* Card Footer Holder, Expiry & Status */}
                  <div className="flex items-end justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                        Card Holder
                      </p>
                      <p className="text-[11px] font-black text-white/90 uppercase tracking-tight truncate max-w-[150px]">
                        {card.cardholder_name}
                      </p>
                    </div>

                    <div className="flex items-end gap-4">
                      <div className="space-y-0.5 text-right">
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                          Expires
                        </p>
                        <p className="text-[10px] font-bold text-white/90 font-mono">
                          {card.expiry}
                        </p>
                      </div>

                      {/* Frozen indicator banner overlay */}
                      {isFrozen && (
                        <span className="flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider bg-error/90 text-white px-1.5 py-0.5 rounded shadow-soft">
                          <ShieldAlert className="h-2.5 w-2.5" />
                          Frozen
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── CARD QUICK CONTROLS INTERACTIVE PANEL ─────────────────────── */}
          {activeCard && (
            <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4 select-none">
              {/* Toggle Freeze */}
              <button
                onClick={handleToggleFreeze}
                className="flex items-center justify-between p-3.5 rounded-custom-xl border border-border bg-surface hover:bg-surface-hover/75 transition-all text-left group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
              >
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-foreground">
                    {activeCard.status === "Frozen" ? "Unfreeze Card" : "Freeze Card"}
                  </h4>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-none">
                    {activeCard.status === "Frozen" ? "Restore card operations" : "Temporarily block spending"}
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg bg-muted/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                  <Shield className="h-4 w-4" />
                </div>
              </button>

              {/* Reveal PIN */}
              <button
                onClick={handleRevealPin}
                className="flex items-center justify-between p-3.5 rounded-custom-xl border border-border bg-surface hover:bg-surface-hover/75 transition-all text-left group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
              >
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-foreground flex items-center gap-1">
                    {showPin ? `PIN: ${activeCard.pin}` : "Reveal Secure PIN"}
                  </h4>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-none">
                    {showPin ? `Hiding in ${pinCountdown}s...` : "Reveal 4-digit card PIN"}
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg bg-muted/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </div>
              </button>

              {/* ATM Limit Info */}
              <div className="flex items-center justify-between p-3.5 rounded-custom-xl border border-border bg-surface select-none">
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-foreground">
                    Daily Limit Status
                  </h4>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-none">
                    ATM: {formatCurrency(activeCard.spending_limit_atm)} / day
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg bg-muted/10 flex items-center justify-center text-muted-foreground">
                  <KeyRound className="h-4 w-4" />
                </div>
              </div>

              {/* Go to full cards management module */}
              <button
                onClick={() => router.push("/dashboard/cards")}
                className="flex items-center justify-between p-3.5 rounded-custom-xl border border-border bg-surface hover:bg-surface-hover/75 transition-all text-left group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
              >
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold text-foreground">
                    Manage Card Controls
                  </h4>
                  <p className="text-[9px] text-text-secondary mt-0.5 leading-none">
                    Set online limits & block types
                  </p>
                </div>
                <div className="h-7 w-7 rounded-lg bg-muted/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
                  <Settings className="h-4 w-4" />
                </div>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
