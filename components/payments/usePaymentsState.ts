"use client";

import * as React from "react";
import { AccountItem } from "@/constants/mock-accounts";
import { PaymentBeneficiary, MOCK_BENEFICIARIES } from "@/constants/mock-payments-beneficiaries";
import { ScheduledPayment, MOCK_SCHEDULED_PAYMENTS } from "@/constants/mock-payments";
import { UpcomingBill, MOCK_BILLS } from "@/constants/mock-bills";

export type PaymentStepName =
  | "home"
  | "recipient"
  | "source"
  | "details"
  | "review"
  | "auth"
  | "success";

export interface PaymentFormData {
  biller: UpcomingBill | PaymentBeneficiary | null;
  sourceAccount: AccountItem | null;
  amount: string;
  reference: string;
  description: string;
  date: string;
}

export const INITIAL_PAYMENT_DATA: PaymentFormData = {
  biller: null,
  sourceAccount: null,
  amount: "",
  reference: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

export const usePayments = () => {
  const [step, setStep] = React.useState<PaymentStepName>("home");
  const [data, setData] = React.useState<PaymentFormData>(INITIAL_PAYMENT_DATA);
  const [bills, setBills] = React.useState<UpcomingBill[]>([]);

  const updateData = React.useCallback((updates: Partial<PaymentFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = React.useCallback(() => {
    setData(INITIAL_PAYMENT_DATA);
    setStep("home");
  }, []);

  const payBillNow = React.useCallback((billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: "Paid" as const } : b))
    );
  }, []);

  return {
    step,
    setStep,
    data,
    updateData,
    resetForm,
    bills,
    payBillNow,
  };
};

export const usePaymentsBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = React.useState<PaymentBeneficiary[]>([]);

  const addBeneficiary = React.useCallback((newBen: Omit<PaymentBeneficiary, "id">) => {
    const id = `pben-${Date.now()}`;
    const entry: PaymentBeneficiary = { ...newBen, id };
    setBeneficiaries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const deleteBeneficiary = React.useCallback((id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleFavorite = React.useCallback((id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  }, []);

  return { beneficiaries, addBeneficiary, deleteBeneficiary, toggleFavorite };
};

export const useScheduledPayments = () => {
  const [schedules, setSchedules] = React.useState<ScheduledPayment[]>([]);

  const toggleStatus = React.useCallback((id: string) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, status: s.status === "active" ? ("paused" as const) : ("active" as const) };
      })
    );
  }, []);

  const deleteSchedule = React.useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { schedules, toggleStatus, deleteSchedule };
};
