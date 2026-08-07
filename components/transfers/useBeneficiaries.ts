"use client";

import * as React from "react";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import type { Beneficiary } from "@/constants/mock-beneficiaries";
import { BeneficiaryService } from "@/lib/services/beneficiary/BeneficiaryService";

export const useBeneficiaries = () => {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = React.useState<Beneficiary[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const supabase = createBrowserClient();
    async function loadBeneficiaries() {
      try {
        const res = await BeneficiaryService.getBeneficiaries(supabase, user!.id);

        if (!res.success) {
          setBeneficiaries([]);
          return;
        }

        const formatted = (res.data || []).map((b: any): Beneficiary => ({
          id: b.id,
          name: b.name,
          email: b.email || "",
          accountNumber: b.account_number || "",
          bankName: b.bank_name || "External Bank",
          isFavorite: b.is_favorite || false,
          initials: b.name ? b.name.substring(0, 2).toUpperCase() : "BE",
          color: b.color || "#2563EB",
          type: (b.type || "domestic") as any,
          country: b.country || "United States",
          routingInformation: b.routing_information || "",
          currency: b.currency || "USD",
          nickname: b.nickname || "",
        }));

        setBeneficiaries(formatted);
      } catch (err) {
        console.error("Error fetching beneficiaries:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBeneficiaries();
  }, [user]);

  const addBeneficiary = React.useCallback(async (newBen: Omit<Beneficiary, "id">) => {
    if (!user) return null;
    const supabase = createBrowserClient();

    try {
      const res = await BeneficiaryService.saveBeneficiary(supabase, {
        userId: user.id,
        name: newBen.name,
        bankName: newBen.bankName || "External Bank",
        country: newBen.country || "United States",
        accountNumber: newBen.accountNumber || "",
        routingInformation: newBen.routingInformation || "",
        currency: newBen.currency || "USD",
        nickname: newBen.nickname || "",
      });

      if (res.success && res.data) {
        const b = res.data;
        const entry: Beneficiary = {
          id: b.id,
          name: b.name,
          email: b.email || "",
          accountNumber: b.account_number || "",
          bankName: b.bank_name || "External Bank",
          isFavorite: b.is_favorite || false,
          initials: b.name ? b.name.substring(0, 2).toUpperCase() : "BE",
          color: b.color || "#2563EB",
          type: (b.type || "domestic") as any,
          country: b.country,
          routingInformation: b.routing_information,
          currency: b.currency,
          nickname: b.nickname || "",
        };
        setBeneficiaries((prev) => [entry, ...prev]);
        return entry;
      }
    } catch (err) {
      console.error("Error saving beneficiary:", err);
    }
    return null;
  }, [user]);

  const deleteBeneficiary = React.useCallback(async (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));

    const supabase = createBrowserClient();
    try {
      await BeneficiaryService.deleteBeneficiary(supabase, id);
    } catch (err) {
      console.warn("DB delete beneficiary failed:", err);
    }
  }, []);

  const toggleFavorite = React.useCallback(async (id: string) => {
    let nextFav = false;
    setBeneficiaries((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          nextFav = !b.isFavorite;
          return { ...b, isFavorite: nextFav };
        }
        return b;
      })
    );

    const supabase = createBrowserClient();
    try {
      await supabase.from("beneficiaries").update({ is_favorite: nextFav }).eq("id", id);
    } catch (err) {
      console.warn("DB favorite update failed:", err);
    }
  }, []);

  return {
    beneficiaries,
    loading,
    addBeneficiary,
    deleteBeneficiary,
    toggleFavorite,
  };
};
