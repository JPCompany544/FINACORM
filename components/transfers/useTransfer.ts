"use client";

import * as React from "react";
import { AccountItem } from "@/constants/mock-accounts";
import { TransferRecord } from "@/constants/mock-transfers";

export interface TransferData {
  sourceAccount: AccountItem | null;
  recipientName: string;
  recipientBank: string;
  destinationCountry: string;
  recipientAccount: string;
  routingValue: string; // Dynamic routing value based on country (Routing No, Sort Code, IBAN, Transit No, BSB Code)
  amount: string;
  currency: string;
  transactionType: string;
  speed: "standard" | "priority";
  description: string;
}

export const INITIAL_TRANSFER_DATA: TransferData = {
  sourceAccount: null,
  recipientName: "",
  recipientBank: "",
  destinationCountry: "United States",
  recipientAccount: "",
  routingValue: "",
  amount: "",
  currency: "USD",
  transactionType: "domestic",
  speed: "standard",
  description: "",
};

export type StepName =
  | "details"
  | "review"
  | "code"
  | "pin"
  | "success"
  | "receipt";

export const useTransfer = () => {
  const [step, setStep] = React.useState<StepName>("details");
  const [data, setData] = React.useState<TransferData>(INITIAL_TRANSFER_DATA);
  const [completedRecord, setCompletedRecord] = React.useState<TransferRecord | null>(null);

  const updateData = React.useCallback((updates: Partial<TransferData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetTransfer = React.useCallback(() => {
    setData(INITIAL_TRANSFER_DATA);
    setCompletedRecord(null);
    setStep("details");
  }, []);

  return {
    step,
    setStep,
    data,
    updateData,
    resetTransfer,
    completedRecord,
    setCompletedRecord,
  };
};
