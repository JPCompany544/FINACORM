export const BRAND_NAME = "FINACORM Bank";

export interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
}

export const MARKETING_NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Personal Banking", href: "/personal" },
  { label: "Cards", href: "/cards" },
  { label: "Loans", href: "/loans" },
  { label: "Investments", href: "/investments" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const DASHBOARD_NAV_LINKS: NavLinkItem[] = [
  { label: "Overview", href: "/dashboard" },
  { label: "Accounts", href: "/dashboard/accounts" },
  { label: "Transfers", href: "/dashboard/transfers" },
  { label: "Cards", href: "/dashboard/cards" },
  { label: "Investments", href: "/dashboard/investments" },
  { label: "Settings", href: "/dashboard/settings" },
];

export const ADMIN_NAV_LINKS: NavLinkItem[] = [
  { label: "Admin Console", href: "/admin" },
  { label: "User Management", href: "/admin/users" },
  { label: "Transactions Control", href: "/admin/transactions" },
  { label: "Security & Audits", href: "/admin/security" },
];
