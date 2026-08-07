export interface CardTransaction {
  id: string;
  cardId: string;
  merchant: string;
  merchantInitials: string;
  merchantColor: string;
  amount: number;
  date: string;
  dateISO: string;
  category: "Shopping" | "Food & Drink" | "Subscriptions" | "Travel" | "Utilities" | "Other";
  status: "success" | "pending" | "failed";
}

export const MOCK_CARD_TRANSACTIONS: CardTransaction[] = [
  {
    id: "ctx-1",
    cardId: "card-debit-metal",
    merchant: "Amazon Prime",
    merchantInitials: "AM",
    merchantColor: "#FF9900",
    amount: -14.99,
    date: "Today, 10:12 AM",
    dateISO: "2026-08-04T10:12:00",
    category: "Subscriptions",
    status: "success",
  },
  {
    id: "ctx-2",
    cardId: "card-debit-metal",
    merchant: "Starbucks Coffee",
    merchantInitials: "SB",
    merchantColor: "#00704A",
    amount: -6.45,
    date: "Yesterday, 3:30 PM",
    dateISO: "2026-08-03T15:30:00",
    category: "Food & Drink",
    status: "success",
  },
  {
    id: "ctx-3",
    cardId: "card-debit-metal",
    merchant: "Apple Store",
    merchantInitials: "AS",
    merchantColor: "#555555",
    amount: -1299.00,
    date: "Jul 31, 2026",
    dateISO: "2026-07-31T14:45:00",
    category: "Shopping",
    status: "success",
  },
  {
    id: "ctx-4",
    cardId: "card-travel-virtual",
    merchant: "Netflix",
    merchantInitials: "NF",
    merchantColor: "#E50914",
    amount: -15.49,
    date: "Jul 26, 2026",
    dateISO: "2026-07-26T00:00:00",
    category: "Subscriptions",
    status: "success",
  },
  {
    id: "ctx-5",
    cardId: "card-debit-metal",
    merchant: "Uber Eats",
    merchantInitials: "UE",
    merchantColor: "#142328",
    amount: -42.80,
    date: "Jul 25, 2026",
    dateISO: "2026-07-25T19:20:00",
    category: "Food & Drink",
    status: "success",
  },
];
