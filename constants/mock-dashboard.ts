import {
  Send,
  Receipt,
  Download,
  RefreshCw,
  CreditCard,
  ArrowDownLeft,
  ShoppingBag,
  Tv,
  Coffee,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Phone,
  Bookmark,
  DollarSign,
  TrendingUp,
  type LucideIcon
} from "lucide-react";

export interface AccountDetail {
  name: string;
  number: string;
  balance: number;
  status: "Active" | "Frozen";
  trend: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  shortcut: string;
  actionKey: string;
  description: string;
}

export interface TransactionItem {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
  type: "shopping" | "subscription" | "food" | "salary" | "transfer";
  icon: LucideIcon;
}

export interface BankingCardItem {
  id: string;
  name: string;
  number: string;
  expiry: string;
  status: "Active" | "Frozen";
  type: "metal" | "virtual" | "standard";
  color: string;
}

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  type: "success" | "info" | "warning";
}

export interface UpcomingPaymentItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  icon: LucideIcon;
}

export interface NotificationAlert {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: "security" | "success" | "info";
  group: "Today" | "Yesterday";
}

export interface SavingsGoalItem {
  id: string;
  name: string;
  current: number;
  target: number;
  color: string;
}

export interface ExchangeRateItem {
  pair: string;
  rate: number;
  change: number;
}

export interface UpcomingEventItem {
  title: string;
  date: string;
  type: "bill" | "meeting" | "audit";
}

// ─── DATA EXPORTS ─────────────────────────────────────────────────────────────

export const MOCK_OVERVIEW = {
  totalBalance: 42865.18,
  accounts: [
    { name: "Checking Account", number: "•••• 8421", balance: 12450.80, status: "Active", trend: 1.2 },
    { name: "High-Yield Savings", number: "•••• 9015", balance: 25800.00, status: "Active", trend: 5.25 },
    { name: "Stock Brokerage portfolio", number: "•••• 3310", balance: 4614.38, status: "Active", trend: 8.7 }
  ] as AccountDetail[]
};

export const MOCK_QUICK_ACTIONS: QuickActionItem[] = [
  { id: "qa-transfer", label: "Transfer Money", icon: Send, shortcut: "T", actionKey: "transfer", description: "Send money instantly" },
  { id: "qa-bills", label: "Pay Bills", icon: Receipt, shortcut: "B", actionKey: "pay-bills", description: "Clear utility invoices" },
  { id: "qa-deposit", label: "Deposit Check", icon: Download, shortcut: "D", actionKey: "deposit", description: "Scan and cash checks" },
  { id: "qa-exchange", label: "Exchange Currency", icon: RefreshCw, shortcut: "E", actionKey: "exchange", description: "Convert foreign balances" },
  { id: "qa-cards", label: "Manage Cards", icon: CreditCard, shortcut: "C", actionKey: "cards", description: "Freeze/unfreeze settings" },
  { id: "qa-request", label: "Request Money", icon: ArrowDownLeft, shortcut: "R", actionKey: "request", description: "Generate invoice links" }
];

export const MOCK_TRANSACTIONS: TransactionItem[] = [
  { id: "tx-1", merchant: "Amazon Prime Subscription", amount: -14.99, date: "Today, 10:12 AM", status: "success", type: "subscription", icon: Tv },
  { id: "tx-2", merchant: "Employer Monthly Payroll", amount: 4850.00, date: "Yesterday, 8:00 AM", status: "success", type: "salary", icon: Briefcase },
  { id: "tx-3", merchant: "Starbucks Coffee", amount: -6.45, date: "Yesterday, 3:30 PM", status: "success", type: "food", icon: Coffee },
  { id: "tx-4", merchant: "Apple Store Infinite Loop", amount: -1299.00, date: "Jul 31, 2026", status: "success", type: "shopping", icon: ShoppingBag },
  { id: "tx-5", merchant: "Transfer to Sarah Jenkins", amount: -250.00, date: "Jul 29, 2026", status: "success", type: "transfer", icon: Send },
  { id: "tx-6", merchant: "Target Supercenter Store", amount: -84.20, date: "Jul 28, 2026", status: "success", type: "shopping", icon: ShoppingBag },
  { id: "tx-7", merchant: "Netflix Membership Plan", amount: -15.49, date: "Jul 26, 2026", status: "success", type: "subscription", icon: Tv },
  { id: "tx-8", merchant: "Uber Eats Food Delivery", amount: -42.80, date: "Jul 25, 2026", status: "success", type: "food", icon: Coffee },
  { id: "tx-9", merchant: "Revolut Cash Refill", amount: -100.00, date: "Jul 23, 2026", status: "failed", type: "transfer", icon: RefreshCw },
  { id: "tx-10", merchant: "Yield Dividends Interest", amount: 12.15, date: "Jul 21, 2026", status: "success", type: "salary", icon: TrendingUp }
];

export const MOCK_CARDS: BankingCardItem[] = [
  { id: "card-1", name: "Nnamdi O. (Metal Debit)", number: "•••• •••• •••• 4821", expiry: "09/31", status: "Active", type: "metal", color: "from-zinc-800 to-zinc-950 dark:from-zinc-900 dark:to-black" },
  { id: "card-2", name: "Nnamdi O. (Travel virtual)", number: "•••• •••• •••• 9210", expiry: "12/28", status: "Active", type: "virtual", color: "from-primary/80 to-primary-hover dark:from-primary/60 dark:to-primary" },
  { id: "card-3", name: "Nnamdi O. (Reserve Platinum)", number: "•••• •••• •••• 7110", expiry: "05/30", status: "Frozen", type: "standard", color: "from-accent to-accent/90 dark:from-accent/70 dark:to-accent" }
];

export const MOCK_INSIGHTS: InsightItem[] = [
  { id: "in-1", title: "Smart Spending habit", description: "You spent 12% less than last week, saving approximately $140.00.", type: "success" },
  { id: "in-2", title: "Top Spending category", description: "Most spending this month was recorded in Restaurants ($420.00 total).", type: "info" },
  { id: "in-3", title: "Goal Progression milestone", description: "Your Emergency Fund savings goal is currently 84% complete.", type: "success" },
  { id: "in-4", title: "Salary Ledger deposit", description: "Salary from Employer Monthly Payroll was received yesterday (+ $4,850.00).", type: "success" },
  { id: "in-5", title: "Upcoming renewal alert", description: "Your Apple Prime subscription renewal ($14.99) occurs tomorrow.", type: "warning" }
];

export const MOCK_UPCOMING_PAYMENTS: UpcomingPaymentItem[] = [
  { id: "up-1", name: "Netflix Subscription", amount: 15.49, dueDate: "Aug 06, 2026", icon: Tv },
  { id: "up-2", name: "Utility Electricity Bill", amount: 84.10, dueDate: "Aug 08, 2026", icon: Receipt },
  { id: "up-3", name: "Home Mortgage Installment", amount: 1250.00, dueDate: "Aug 12, 2026", icon: Briefcase },
  { id: "up-4", name: "Medical Insurance Policy", amount: 120.00, dueDate: "Aug 15, 2026", icon: CheckCircle },
  { id: "up-5", name: "Mobile Phone Family Plan", amount: 45.00, dueDate: "Aug 20, 2026", icon: Phone }
];

export const MOCK_ALERTS: NotificationAlert[] = [
  { id: "al-1", title: "Security Alert: Login from London, UK detected", time: "10m ago", read: false, type: "security", group: "Today" },
  { id: "al-2", title: "Transfer completed: $1,250.00 to Sarah Jenkins", time: "2h ago", read: false, type: "success", group: "Today" },
  { id: "al-3", title: "Card approved: $15.49 Netflix automatic checkout", time: "Today, 10:12 AM", read: true, type: "info", group: "Today" },
  { id: "al-4", title: "Profile Security PIN changed successfully", time: "Yesterday, 3:15 PM", read: true, type: "info", group: "Yesterday" }
];

export const MOCK_GOALS: SavingsGoalItem[] = [
  { id: "go-1", name: "Emergency Fund Reserve", current: 8400, target: 10000, color: "bg-success" },
  { id: "go-2", name: "Tokyo Vacation savings", current: 2400, target: 5000, color: "bg-primary" },
  { id: "go-3", name: "Custom House Deposit Goal", current: 15000, target: 50000, color: "bg-accent" }
];

export const MOCK_RATES: ExchangeRateItem[] = [
  { pair: "EUR/USD", rate: 1.0924, change: 0.15 },
  { pair: "GBP/USD", rate: 1.2742, change: -0.08 },
  { pair: "USD/JPY", rate: 142.15, change: 0.42 },
  { pair: "BTC/USD", rate: 64250.00, change: 1.84 }
];

export const MOCK_EVENTS: UpcomingEventItem[] = [
  { title: "Netflix Subscription payment", date: "Aug 06, 2026", type: "bill" },
  { title: "Quarterly portfolio audit meeting", date: "Aug 08, 2026", type: "meeting" },
  { title: "Mortgage wire deduction", date: "Aug 12, 2026", type: "bill" }
];
