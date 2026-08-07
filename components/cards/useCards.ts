"use client";

import * as React from "react";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import type { CardItem, CardStatus } from "@/constants/mock-cards";

export const useCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = React.useState<CardItem[]>([]);
  const [selectedCardId, setSelectedCardId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const supabase = createBrowserClient();
    async function loadCards() {
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("user_id", user!.id);

        if (error) {
          if (error.code === "42P01") {
            setCards([]);
            return;
          }
          throw error;
        }

        const formatted = (data || []).map((c: any): CardItem => ({
          id: c.id,
          name: c.name,
          number: c.number,
          type: c.type,
          brand: c.brand,
          cardholderName: c.cardholder_name || "Nnamdi Okonkwo",
          expiry: c.expiry || "09/31",
          status: c.status,
          isDefault: c.is_default,
          color: c.color,
          linkedAccountId: c.linked_account_id,
          linkedAccountName: "Primary Checking Account",
          availableBalance: c.available_balance || 0.00,
          dailySpending: c.daily_spending || 0.00,
          monthlySpending: c.monthly_spending || 0.00,
          spendingLimitDaily: c.spending_limit_daily || 2000,
          spendingLimitWeekly: c.spending_limit_weekly || 5000,
          spendingLimitMonthly: c.spending_limit_monthly || 10000,
          spendingLimitAtm: c.spending_limit_atm || 1000,
          spendingLimitOnline: c.spending_limit_online || 2000,
          spendingLimitContactless: c.spending_limit_contactless || 500,
          pin: c.pin || "0000",
          onlinePayments: c.online_payments ?? true,
          contactlessPayments: c.contactless_payments ?? true,
          atmWithdrawals: c.atm_withdrawals ?? true,
          internationalTransactions: c.international_transactions ?? false,
          magstripePayments: c.magstripe_payments ?? false,
          recurringPayments: c.recurring_payments ?? false,
        }));

        setCards(formatted);
        if (formatted.length > 0) {
          setSelectedCardId(formatted[0].id);
        }
      } catch (err) {
        console.error("Error loading cards:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [user]);

  const selectedCard = React.useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || cards[0] || null;
  }, [cards, selectedCardId]);

  const toggleFreeze = React.useCallback(async (id: string) => {
    let nextStatus: CardStatus = "Active";
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const willFreeze = c.status !== "Frozen";
        nextStatus = willFreeze ? "Frozen" : "Active";
        return {
          ...c,
          status: nextStatus,
          lastFreeze: willFreeze ? new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : undefined,
        };
      })
    );

    const supabase = createBrowserClient();
    try {
      await supabase.from("cards").update({ status: nextStatus }).eq("id", id);
    } catch (err) {
      console.warn("DB freeze status update failed, local fallback kept:", err);
    }
  }, []);

  const updateControl = React.useCallback(async (id: string, key: keyof CardItem, value: boolean) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );

    const supabase = createBrowserClient();
    // Convert camelCase key to snake_case equivalent
    const dbKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    try {
      await supabase.from("cards").update({ [dbKey]: value }).eq("id", id);
    } catch (err) {
      console.warn(`DB update for ${dbKey} failed:`, err);
    }
  }, []);

  const updateLimits = React.useCallback(async (id: string, updates: Partial<Pick<CardItem, "spendingLimitDaily" | "spendingLimitWeekly" | "spendingLimitMonthly" | "spendingLimitAtm" | "spendingLimitOnline" | "spendingLimitContactless">>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    const supabase = createBrowserClient();
    // Convert camelCase keys to snake_case equivalent
    const dbUpdates: Record<string, any> = {};
    Object.entries(updates).forEach(([k, v]) => {
      const dbKey = k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      dbUpdates[dbKey] = v;
    });

    try {
      await supabase.from("cards").update(dbUpdates).eq("id", id);
    } catch (err) {
      console.warn("DB limit updates failed:", err);
    }
  }, []);

  const changePin = React.useCallback(async (id: string, newPin: string) => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              pin: newPin,
              lastPinChange: today,
            }
          : c
      )
    );

    const supabase = createBrowserClient();
    try {
      await supabase.from("cards").update({ pin: newPin }).eq("id", id);
    } catch (err) {
      console.warn("DB pin change failed:", err);
    }
  }, []);

  const replaceCard = React.useCallback(async (id: string, reason: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Lost" as CardStatus,
            }
          : c
      )
    );

    const supabase = createBrowserClient();
    try {
      await supabase.from("cards").update({ status: "Lost" }).eq("id", id);
    } catch (err) {
      console.warn("DB replace status change failed:", err);
    }
  }, []);

  const updateSettings = React.useCallback(async (id: string, nickname: string, isDefault: boolean) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, name: nickname, isDefault };
        }
        if (isDefault) {
          return { ...c, isDefault: false };
        }
        return c;
      })
    );

    const supabase = createBrowserClient();
    try {
      await supabase.from("cards").update({ name: nickname, is_default: isDefault }).eq("id", id);
    } catch (err) {
      console.warn("DB update settings failed:", err);
    }
  }, []);

  const requestNewCard = React.useCallback(async (name: string, type: "metal" | "virtual" | "standard") => {
    if (!user) return;
    const id = `card-${Date.now()}`;
    const number = `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`;
    const color =
      type === "metal"
        ? "from-zinc-800 to-zinc-950 text-white"
        : type === "virtual"
        ? "from-teal-800 to-emerald-950 text-white"
        : "from-indigo-950 to-slate-900 text-white";

    const newCard: CardItem = {
      id,
      name,
      number,
      type,
      brand: "Mastercard",
      cardholderName: "Nnamdi Okonkwo",
      expiry: "09/31",
      status: "Pending",
      isDefault: false,
      color,
      linkedAccountId: "acc-checking",
      linkedAccountName: "Primary Checking Account",
      availableBalance: 0.00,
      dailySpending: 0,
      monthlySpending: 0,
      spendingLimitDaily: 2000,
      spendingLimitWeekly: 5000,
      spendingLimitMonthly: 10000,
      spendingLimitAtm: 1000,
      spendingLimitOnline: 2000,
      spendingLimitContactless: 500,
      pin: "0000",
      onlinePayments: true,
      contactlessPayments: true,
      atmWithdrawals: true,
      internationalTransactions: false,
      magstripePayments: false,
      recurringPayments: false,
    };

    setCards((prev) => [...prev, newCard]);
    if (cards.length === 0) {
      setSelectedCardId(id);
    }

    const supabase = createBrowserClient();
    try {
      await supabase.from("cards").insert({
        id,
        user_id: user.id,
        name,
        number,
        type,
        brand: "Mastercard",
        cardholder_name: "Nnamdi Okonkwo",
        expiry: "09/31",
        status: "Pending",
        is_default: false,
        color,
        linked_account_id: "acc-checking",
        available_balance: 0.00,
        daily_spending: 0,
        monthly_spending: 0,
        spending_limit_daily: 2000,
        spending_limit_weekly: 5000,
        spending_limit_monthly: 10000,
        spending_limit_atm: 1000,
        spending_limit_online: 2000,
        spending_limit_contactless: 500,
        pin: "0000",
        online_payments: true,
        contactless_payments: true,
        atm_withdrawals: true,
        international_transactions: false,
        magstripe_payments: false,
        recurring_payments: false,
      });
    } catch (err) {
      console.warn("DB insert card failed:", err);
    }
  }, [user, cards.length]);

  return {
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
  };
};
