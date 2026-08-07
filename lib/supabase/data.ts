import { createClient } from "./client";
import { parseSupabaseError } from "./error";

export interface DashboardData {
  user: {
    email: string;
    id: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    phone: string | null;
    customer_number: string;
    created_at: string;
    avatar_url?: string | null;
  };
  account: {
    id: string;
    account_number: string;
    account_type: string;
    currency: string;
    status: string;
    available_balance: number;
    current_balance: number;
    created_at: string;
  } | null;
}

export interface CardItem {
  id: string;
  name: string;
  number: string;
  type: "metal" | "virtual" | "standard";
  brand: "Visa" | "Mastercard";
  cardholder_name: string;
  expiry: string;
  status: "Active" | "Frozen" | "Expired" | "Pending" | "Blocked" | "Lost";
  is_default: boolean;
  color: string;
  linked_account_id: string;
  available_balance: number;
  daily_spending: number;
  monthly_spending: number;
  spending_limit_daily: number;
  spending_limit_weekly: number;
  spending_limit_monthly: number;
  spending_limit_atm: number;
  spending_limit_online: number;
  spending_limit_contactless: number;
  pin: string;
  online_payments: boolean;
  contactless_payments: boolean;
  atm_withdrawals: boolean;
  international_transactions: boolean;
  magstripe_payments: boolean;
  recurring_payments: boolean;
}

export interface TransactionItem {
  id: string;
  merchant: string;
  amount: number;
  direction?: string;  // 'CREDIT' | 'DEBIT'
  created_at: string;
  status: "success" | "pending" | "failed";
  type: string;
}

export interface BeneficiaryItem {
  id: string;
  name: string;
  email: string;
  account_number: string;
  routing_number: string;
  bank_name: string;
}

export interface ScheduledPaymentItem {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

/**
 * Helper function to fetch data from a table resiliently.
 * Returns an empty array if the table does not exist yet (error code 42P01).
 */
async function resilientSelect<T>(tableName: string, userId: string, fields = "*"): Promise<T[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select(fields)
      .eq("user_id", userId);

    if (error) {
      if (error.code === "42P01") {
        console.warn(`Table "${tableName}" does not exist in Supabase. Returning empty array.`);
        return [];
      }
      throw error;
    }
    return (data as T[]) || [];
  } catch (err) {
    console.error(`Failed to fetch from table "${tableName}":`, err);
    return [];
  }
}

/**
 * Fetches dashboard details (authenticated user, profile, and primary active account).
 * Runs client-side using the browser Supabase client.
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  const supabase = createClient();

  // 1. Fetch current authenticated user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("UNAUTHORIZED");
  }

  // 2. Fetch associated user profile details (core fields only — never breaks on missing columns)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone, customer_number, created_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile fetch error details:", profileError);
    throw new Error("PROFILE_MISSING");
  }

  // 2b. Fetch avatar_url separately — safe to fail if column doesn't yet exist
  let avatar_url: string | null = null;
  try {
    const { data: avatarData } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    
    const path = avatarData?.avatar_url ?? null;
    if (path) {
      if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        avatar_url = path;
      } else {
        const { data: signedData, error: signedError } = await supabase.storage
          .from("avatars")
          .createSignedUrl(path, 3600);
        if (!signedError && signedData) {
          avatar_url = signedData.signedUrl;
        } else {
          avatar_url = path;
        }
      }
    }
  } catch {
    // Column may not exist yet — non-fatal
  }

  // 3. Fetch default checking/primary account for user
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id, account_number, account_type, currency, status, available_balance, current_balance, created_at")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (accountError) {
    console.error("Account fetch error details:", accountError);
    const parsed = parseSupabaseError(accountError);
    throw new Error(parsed.message);
  }

  return {
    user: {
      email: user.email || "",
      id: user.id,
    },
    profile: { ...profile, avatar_url },
    account: account || null,
  };
}

/**
 * Fetches active cards associated with the user.
 */
export async function fetchCards(userId: string): Promise<CardItem[]> {
  return resilientSelect<CardItem>("cards", userId);
}

/**
 * Fetches transaction records associated with the user.
 */
export async function fetchTransactions(userId: string): Promise<TransactionItem[]> {
  return resilientSelect<TransactionItem>("transactions", userId);
}

/**
 * Fetches saved beneficiaries for the user.
 */
export async function fetchBeneficiaries(userId: string): Promise<BeneficiaryItem[]> {
  return resilientSelect<BeneficiaryItem>("beneficiaries", userId);
}

/**
 * Fetches scheduled bills and payments.
 */
export async function fetchScheduledPayments(userId: string): Promise<ScheduledPaymentItem[]> {
  return resilientSelect<ScheduledPaymentItem>("scheduled_payments", userId);
}

/**
 * Fetches system notifications/security alerts.
 */
export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  return resilientSelect<NotificationItem>("notifications", userId);
}
