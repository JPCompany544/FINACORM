import { Tv, Shield, Home, GraduationCap, Percent, Landmark, HelpCircle, Wifi, Smartphone } from "lucide-react";
import * as React from "react";

export type BillCategory =
  | "Utilities"
  | "Internet"
  | "Mobile"
  | "Streaming"
  | "Insurance"
  | "Mortgage"
  | "Education"
  | "Taxes"
  | "Other";

export type BillStatus = "Upcoming" | "Paid" | "Overdue" | "Scheduled" | "Failed";

export interface BillCategoryItem {
  id: BillCategory;
  label: string;
  iconName: "Wifi" | "Smartphone" | "Tv" | "Shield" | "Home" | "GraduationCap" | "Percent" | "Landmark" | "HelpCircle";
  color: string;
}

export interface UpcomingBill {
  id: string;
  companyName: string;
  category: BillCategory;
  dueDate: string;
  dueDateISO: string;
  amount: number;
  paymentMethod: string;
  status: BillStatus;
  logoInitials: string;
  logoBg: string;
}

export const BILL_CATEGORIES: BillCategoryItem[] = [
  { id: "Utilities", label: "Utilities", iconName: "Landmark", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "Internet", label: "Internet & Wifi", iconName: "Wifi", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
  { id: "Mobile", label: "Mobile Carrier", iconName: "Smartphone", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { id: "Streaming", label: "Streaming TV", iconName: "Tv", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  { id: "Insurance", label: "Insurance Policies", iconName: "Shield", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { id: "Mortgage", label: "Rent & Mortgage", iconName: "Home", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { id: "Education", label: "Education Fees", iconName: "GraduationCap", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: "Taxes", label: "Taxes & Duties", iconName: "Percent", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: "Other", label: "Other Bills", iconName: "HelpCircle", color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20" },
];

export const MOCK_BILLS: UpcomingBill[] = [];
