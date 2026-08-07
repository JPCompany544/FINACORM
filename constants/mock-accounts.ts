export interface AccountItem {
  id: string;
  name: string;
  number: string;
  availableBalance: number;
  currentBalance: number;
  currency: string;
  status: "Active" | "Frozen";
  type: "Checking" | "Savings" | "Investments";
  lastActivity: string;
  routingNumber: string;
  iban: string;
  swift: string;
  dateOpened: string;
  branch: string;
  creditLimit?: number;
}

export const MOCK_ACCOUNTS: AccountItem[] = [
  {
    id: "acc-checking",
    name: "Primary Checking Account",
    number: "•••• •••• •••• 8421",
    availableBalance: 12450.80,
    currentBalance: 12500.00,
    currency: "USD",
    status: "Active",
    type: "Checking",
    lastActivity: "Withdrawal of $6.45 at Starbucks Coffee",
    routingNumber: "021000021",
    iban: "US89 FNCR 0210 0002 1000 8421",
    swift: "FNCRUS33XXX",
    dateOpened: "Oct 12, 2024",
    branch: "FINACORM HQ - New York",
    creditLimit: 5000.0
  },
  {
    id: "acc-savings",
    name: "High-Yield Savings Deposit",
    number: "•••• •••• •••• 9015",
    availableBalance: 25800.00,
    currentBalance: 25800.00,
    currency: "USD",
    status: "Active",
    type: "Savings",
    lastActivity: "Interest credit of $42.15 received",
    routingNumber: "021000021",
    iban: "US89 FNCR 0210 0002 1000 9015",
    swift: "FNCRUS33XXX",
    dateOpened: "Nov 05, 2024",
    branch: "FINACORM HQ - New York"
  },
  {
    id: "acc-brokerage",
    name: "Stock Brokerage Portfolio",
    number: "•••• •••• •••• 3310",
    availableBalance: 4614.38,
    currentBalance: 4614.38,
    currency: "USD",
    status: "Active",
    type: "Investments",
    lastActivity: "Dividend interest credit of $12.15",
    routingNumber: "021000021",
    iban: "US89 FNCR 0210 0002 1000 3310",
    swift: "FNCRUS33XXX",
    dateOpened: "Jan 18, 2025",
    branch: "FINACORM HQ - New York"
  }
];

export const MOCK_SUMMARY = {
  checking: 12450.80,
  savings: 25800.00,
  investments: 4614.38,
  totalNet: 42865.18
};
