"use client";

import * as React from "react";
import { PageContainer, PageHeader, PageBody, useToast } from "@/components/app-shell";
import {
  useCards,
  CardCarousel,
  CardPreview,
  CardControls,
  FreezeControl,
  LimitsManager,
  PinManager,
  ReplacementFlow,
  CardSettings,
  CardActivity,
  SecurityCenter,
  CardItem,
} from "@/components/cards";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CreditCard, Eye, EyeOff, ShieldCheck, ListTodo, Plus, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CardsPage() {
  const { success, error, info } = useToast();

  const {
    cards,
    loading,
    selectedCardId,
    setSelectedCardId,
    selectedCard,
    toggleFreeze,
    updateControl,
    updateLimits,
    changePin,
    replaceCard,
    updateSettings,
    requestNewCard,
  } = useCards();

  // Selected sub-tab configuration
  const [activeTab, setActiveTab] = React.useState<"controls" | "limits" | "pin" | "replace" | "settings" | "activity" | "security">("controls");
  const [revealNum, setRevealNum] = React.useState(false);

  // New card modal parameters
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [newCardNickname, setNewCardNickname] = React.useState("");
  const [newCardType, setNewCardType] = React.useState<"metal" | "virtual" | "standard">("metal");

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNickname) return;
    requestNewCard(newCardNickname, newCardType);
    setShowRequestModal(false);
    setNewCardNickname("");
    success("Card ordered", "Your new card request has been registered in pending status.");
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="h-64 bg-muted/20 animate-pulse rounded-custom-xl" />
      </PageContainer>
    );
  }

  if (cards.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Cards"
          description="Manage every aspect of your debit and credit cards."
          primaryAction={
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Plus className="h-4 w-4" />
              Request New Card
            </button>
          }
        />
        <PageBody>
          <div className="flex flex-col items-center justify-center text-center p-16 rounded-custom-xl border border-dashed border-border bg-surface/40 my-6 space-y-4">
            <div className="p-4 bg-muted/5 border border-border/60 rounded-full text-muted-foreground">
              <CreditCard className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-foreground">You don't have any cards yet</h4>
              <p className="text-xs text-text-secondary">Request a new virtual or metal card to begin spending instantly.</p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-colors cursor-pointer shadow-soft outline-none"
            >
              Order your first card
            </button>
          </div>
        </PageBody>

        <AnimatePresence>
          {showRequestModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRequestModal(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm rounded-custom-xl border border-border bg-surface p-6 shadow-modal"
              >
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">New Card Request</h3>
                    <button type="button" onClick={() => setShowRequestModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Card Nickname</label>
                    <input type="text" value={newCardNickname} onChange={(e) => setNewCardNickname(e.target.value)} placeholder="e.g. Daily Spending" className="w-full bg-surface-hover border border-border rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Card Type</label>
                    <select value={newCardType} onChange={(e: any) => setNewCardType(e.target.value)} className="w-full bg-surface-hover border border-border rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary">
                      <option value="metal">Northstar Metal Debit</option>
                      <option value="virtual">Travel Virtual Card</option>
                      <option value="standard">Standard Debit Card</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-soft">Submit Request</button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ─── PAGE HEADER ────────────────────────────────────────────────── */}
      <PageHeader
        title="Cards"
        description="Manage every aspect of your debit and credit cards."
        primaryAction={
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Plus className="h-4 w-4" />
            Request New Card
          </button>
        }
        secondaryAction={
          <button
            onClick={() => {
              setActiveTab("activity");
              info("Card History Activated", "Switched views to card statement ledger logs.");
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer outline-none"
          >
            <ListTodo className="h-4 w-4 text-muted-foreground" />
            View Card History
          </button>
        }
      />

      <PageBody className="space-y-6">
        
        {/* Horizontal Carousel */}
        <CardCarousel
          cards={cards}
          selectedCardId={selectedCardId}
          onSelectCard={setSelectedCardId}
        />

        {/* ─── CARD DETAILS GRID COLUMN LAYOUT ────────────────────────────── */}
        <div className="grid gap-6 laptop:grid-cols-3 items-start">
          
          {/* Left Column (Realistic detail preview card + specs) */}
          <div className="laptop:col-span-1 space-y-6 select-none">
            <div className="rounded-custom-xl border border-border bg-surface p-5 space-y-5 shadow-soft relative overflow-hidden">
              {/* background glow */}
              <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Card Parameters
                </span>

                <button
                  onClick={() => setRevealNum(!revealNum)}
                  className="flex items-center gap-1 text-[10px] font-extrabold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {revealNum ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Mask
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Reveal
                    </>
                  )}
                </button>
              </div>

              {/* Visual Preview */}
              <div className="flex justify-center py-2.5">
                <CardPreview card={selectedCard} revealNumber={revealNum} />
              </div>

              {/* Specs */}
              <div className="space-y-3.5 text-xs font-semibold text-text-secondary leading-none">
                <div className="flex justify-between border-b border-border/20 pb-2.5">
                  <span>Linked Account</span>
                  <span className="text-foreground font-bold">{selectedCard.linkedAccountName}</span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-2.5">
                  <span>Spend Limit (Daily)</span>
                  <span className="text-foreground font-bold">
                    {formatCurrency(selectedCard.spendingLimitDaily)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-2.5">
                  <span>Spend Limit (Monthly)</span>
                  <span className="text-foreground font-bold">
                    {formatCurrency(selectedCard.spendingLimitMonthly)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-2.5">
                  <span>Daily Usage</span>
                  <span className="text-foreground font-bold">
                    {formatCurrency(selectedCard.dailySpending)} / {formatCurrency(selectedCard.spendingLimitDaily)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/20 pb-2.5">
                  <span>Monthly Usage</span>
                  <span className="text-foreground font-bold">
                    {formatCurrency(selectedCard.monthlySpending)} / {formatCurrency(selectedCard.spendingLimitMonthly)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Available Balance</span>
                  <span className="text-foreground font-bold">
                    {formatCurrency(selectedCard.availableBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Controls tabs + dynamic sections) */}
          <div className="laptop:col-span-2 space-y-6">
            
            {/* Nav tabs selector */}
            <div className="flex items-center gap-1 bg-muted/10 border border-border/60 p-1 rounded-custom-xl w-fit select-none overflow-x-auto shrink-0 max-w-full hide-scrollbar">
              {[
                { id: "controls" as const, label: "Security Locks" },
                { id: "limits" as const, label: "Limits" },
                { id: "pin" as const, label: "PIN Code" },
                { id: "activity" as const, label: "Recent Activity" },
                { id: "settings" as const, label: "Nickname & Alerts" },
                { id: "replace" as const, label: "Replace Card" },
                { id: "security" as const, label: "Security Audit" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-custom-lg text-xs font-bold transition-all shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    activeTab === tab.id
                      ? "bg-surface text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic content sections */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "controls" && (
                  <div className="space-y-6">
                    <FreezeControl
                      card={selectedCard}
                      onToggleFreeze={toggleFreeze}
                    />
                    <CardControls
                      card={selectedCard}
                      onUpdateControl={updateControl}
                    />
                  </div>
                )}

                {activeTab === "limits" && (
                  <LimitsManager
                    card={selectedCard}
                    onUpdateLimits={updateLimits}
                  />
                )}

                {activeTab === "pin" && (
                  <PinManager
                    card={selectedCard}
                    onChangePin={changePin}
                  />
                )}

                {activeTab === "activity" && (
                  <CardActivity cardId={selectedCard.id} />
                )}

                {activeTab === "settings" && (
                  <CardSettings
                    card={selectedCard}
                    onUpdateSettings={updateSettings}
                  />
                )}

                {activeTab === "replace" && (
                  <ReplacementFlow
                    card={selectedCard}
                    onReplaceCard={replaceCard}
                  />
                )}

                {activeTab === "security" && (
                  <SecurityCenter card={selectedCard} />
                )}

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </PageBody>

      {/* ─── REQUEST NEW CARD MODAL ─── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleRequestSubmit} className="bg-surface border border-border rounded-custom-xl p-5 max-w-sm w-full space-y-4 shadow-modal select-none">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-xs font-black uppercase text-foreground tracking-wider">Request New Card</span>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="p-1 rounded hover:bg-muted/10 text-muted-foreground hover:text-foreground outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label htmlFor="req-nick" className="text-[10px] font-bold text-text-secondary block">Card Nickname / Label</label>
                <input
                  id="req-nick"
                  type="text"
                  required
                  value={newCardNickname}
                  onChange={(e) => setNewCardNickname(e.target.value)}
                  placeholder="e.g. Travel Card, Shopping virtual"
                  className="w-full bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="req-type" className="text-[10px] font-bold text-text-secondary block">Card Material / Type</label>
                <select
                  id="req-type"
                  value={newCardType}
                  onChange={(e) => setNewCardType(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-custom-lg px-3 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="metal">Premium Metal Card ($15.00 issue charge)</option>
                  <option value="virtual">Virtual Travel Card (Free, instant activation)</option>
                  <option value="standard">Standard Biodegradable Plastic (Free)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all cursor-pointer"
              >
                Request Card
              </button>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
}
