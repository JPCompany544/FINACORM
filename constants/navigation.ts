import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  Receipt,
  CreditCard,
  Banknote,
  TrendingUp,
  History,
  Users,
  HelpCircle,
  Settings,
  type LucideIcon
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

export const BANKING_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your finances"
  },
  {
    label: "Accounts",
    href: "/dashboard/accounts",
    icon: Landmark,
    description: "Checking, savings & business accounts"
  },
  {
    label: "Transfers",
    href: "/dashboard/transfers",
    icon: ArrowLeftRight,
    description: "Move money between accounts or send outward"
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: Receipt,
    description: "Pay bills, utilities or set up standing orders"
  },
  {
    label: "Cards",
    href: "/dashboard/cards",
    icon: CreditCard,
    description: "Manage your physical and virtual debit/credit cards"
  },
  {
    label: "Loans",
    href: "/dashboard/loans",
    icon: Banknote,
    description: "Personal and mortgage loan options"
  },
  {
    label: "Investments",
    href: "/dashboard/investments",
    icon: TrendingUp,
    description: "Wealth management, stock portfolios & yields",
    badge: "5.25% APY"
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: History,
    description: "Detailed ledger of past statements and activity"
  },
  {
    label: "Beneficiaries",
    href: "/dashboard/beneficiaries",
    icon: Users,
    description: "Manage contacts, direct deposit receivers & accounts"
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
    description: "Contact center, guides and help documentation"
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Preferences, profile, security & access controls"
  }
];
