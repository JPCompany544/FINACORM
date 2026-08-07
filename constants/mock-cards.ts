export type CardType = "metal" | "virtual" | "standard";
export type CardBrand = "Visa" | "Mastercard";
export type CardStatus = "Active" | "Frozen" | "Expired" | "Pending" | "Blocked" | "Lost";

export interface CardItem {
  id: string;
  name: string;
  number: string;
  type: CardType;
  brand: CardBrand;
  cardholderName: string;
  expiry: string;
  status: CardStatus;
  isDefault: boolean;
  color: string;
  linkedAccountId: string;
  linkedAccountName: string;
  availableBalance: number;
  dailySpending: number;
  monthlySpending: number;
  spendingLimitDaily: number;
  spendingLimitWeekly: number;
  spendingLimitMonthly: number;
  spendingLimitAtm: number;
  spendingLimitOnline: number;
  spendingLimitContactless: number;
  pin: string;
  onlinePayments: boolean;
  contactlessPayments: boolean;
  atmWithdrawals: boolean;
  internationalTransactions: boolean;
  magstripePayments: boolean;
  recurringPayments: boolean;
  lastUsed?: string;
  lastOnlinePurchase?: string;
  lastAtmWithdrawal?: string;
  lastContactlessPayment?: string;
  lastPinChange?: string;
  lastFreeze?: string;
}

export const MOCK_CARDS: CardItem[] = [
  {
    id: "card-debit-metal",
    name: "FINACORM Metal Debit",
    number: "•••• •••• •••• 4821",
    type: "metal",
    brand: "Visa",
    cardholderName: "Nnamdi Okonkwo",
    expiry: "09/31",
    status: "Active",
    isDefault: true,
    color: "from-zinc-800 to-zinc-950 text-white",
    linkedAccountId: "acc-checking",
    linkedAccountName: "Primary Checking Account",
    availableBalance: 12450.80,
    dailySpending: 420.50,
    monthlySpending: 1842.10,
    spendingLimitDaily: 5000,
    spendingLimitWeekly: 15000,
    spendingLimitMonthly: 50000,
    spendingLimitAtm: 2000,
    spendingLimitOnline: 5000,
    spendingLimitContactless: 1000,
    pin: "4921",
    onlinePayments: true,
    contactlessPayments: true,
    atmWithdrawals: true,
    internationalTransactions: true,
    magstripePayments: false,
    recurringPayments: true,
    lastUsed: "Today, 10:12 AM",
    lastOnlinePurchase: "Today, 10:12 AM",
    lastAtmWithdrawal: "Jul 28, 2026",
    lastContactlessPayment: "Yesterday, 3:30 PM",
    lastPinChange: "Oct 12, 2024",
  },
  {
    id: "card-travel-virtual",
    name: "Travel Virtual Card",
    number: "•••• •••• •••• 9210",
    type: "virtual",
    brand: "Mastercard",
    cardholderName: "Nnamdi Okonkwo",
    expiry: "12/28",
    status: "Active",
    isDefault: false,
    color: "from-teal-800 to-emerald-950 text-white",
    linkedAccountId: "acc-checking",
    linkedAccountName: "Primary Checking Account",
    availableBalance: 12450.80,
    dailySpending: 0.00,
    monthlySpending: 120.00,
    spendingLimitDaily: 2000,
    spendingLimitWeekly: 5000,
    spendingLimitMonthly: 10000,
    spendingLimitAtm: 0,
    spendingLimitOnline: 2000,
    spendingLimitContactless: 500,
    pin: "8802",
    onlinePayments: true,
    contactlessPayments: true,
    atmWithdrawals: false,
    internationalTransactions: true,
    magstripePayments: false,
    recurringPayments: false,
    lastUsed: "Jul 26, 2026",
    lastOnlinePurchase: "Jul 26, 2026",
    lastPinChange: "Nov 05, 2024",
  },
  {
    id: "card-platinum-reserve",
    name: "Platinum Reserve Credit",
    number: "•••• •••• •••• 7110",
    type: "standard",
    brand: "Visa",
    cardholderName: "Nnamdi Okonkwo",
    expiry: "05/30",
    status: "Frozen",
    isDefault: false,
    color: "from-indigo-950 to-slate-900 text-white",
    linkedAccountId: "acc-savings",
    linkedAccountName: "High-Yield Savings Deposit",
    availableBalance: 25800.00,
    dailySpending: 0.00,
    monthlySpending: 0.00,
    spendingLimitDaily: 10000,
    spendingLimitWeekly: 30000,
    spendingLimitMonthly: 100000,
    spendingLimitAtm: 5000,
    spendingLimitOnline: 10000,
    spendingLimitContactless: 2000,
    pin: "5132",
    onlinePayments: false,
    contactlessPayments: false,
    atmWithdrawals: false,
    internationalTransactions: false,
    magstripePayments: false,
    recurringPayments: false,
    lastUsed: "Jun 30, 2026",
    lastFreeze: "Jul 01, 2026",
    lastPinChange: "Jan 18, 2025",
  },
];
