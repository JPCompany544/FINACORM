export interface PaymentBeneficiary {
  id: string;
  name: string;
  nickname: string;
  bankName: string;
  accountNumber: string;
  type: "domestic" | "international";
  isFavorite: boolean;
  initials: string;
  color: string;
  email?: string;
  phone?: string;
  lastPayment?: { amount: number; date: string };
}

export const MOCK_BENEFICIARIES: PaymentBeneficiary[] = [];

// Keep backward-compat alias
export const MOCK_PAYMENTS_BENEFICIARIES = MOCK_BENEFICIARIES;
