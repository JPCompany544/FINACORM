export interface ScheduledPayment {
  id: string;
  name: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly" | "annually";
  nextDate: string;
  fromAccount: string;
  status: "active" | "paused" | "cancelled";
  category: string;
  logoInitials: string;
  logoBg: string;
}

export interface PaymentHistoryItem {
  id: string;
  reference: string;
  recipient: string;
  category: string;
  date: string;
  amount: number;
  fees: number;
  status: "completed" | "pending" | "processing" | "failed" | "reversed";
  type: "bill" | "transfer" | "scheduled" | "manual";
  paymentMethod: string;
  notes?: string;
  fromAccount: string;
  logoInitials: string;
  logoBg: string;
  statusTimeline: Array<{ label: string; time: string; done: boolean }>;
}

export const MOCK_SCHEDULED_PAYMENTS: ScheduledPayment[] = [];

export const MOCK_PAYMENT_HISTORY: PaymentHistoryItem[] = [];
