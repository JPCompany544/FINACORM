export { createClient as createBrowserClient } from "./client";
export { parseSupabaseError } from "./error";
export type { AppError } from "./error";
export { AuthProvider, useAuth } from "./AuthProvider";
export { signUpUser, signInUser } from "./auth-helpers";
export { fetchDashboardData, fetchCards, fetchTransactions, fetchBeneficiaries, fetchScheduledPayments, fetchNotifications } from "./data";
export type { DashboardData, CardItem, TransactionItem, BeneficiaryItem, ScheduledPaymentItem, NotificationItem } from "./data";


