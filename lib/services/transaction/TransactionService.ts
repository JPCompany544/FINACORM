import { SupabaseClient } from "@supabase/supabase-js";

export type TransactionType =
  | "ADMIN_CREDIT"
  | "CREDIT"
  | "TRANSFER_SENT"
  | "TRANSFER_RECEIVED"
  | "TRANSFER_PENDING"
  | "TRANSFER_DECLINED"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "REVERSAL"
  | "FEE"
  | "INTEREST"
  | "SYSTEM_ADJUSTMENT";

export type TransactionDirection = "CREDIT" | "DEBIT";

export interface RecordTransactionArgs {
  userId: string;
  accountId: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: number;
  currency: string;
  description?: string;
  referenceNumber?: string;
  source?: string;
  destination?: string;
  recipientName?: string;
  recipientBank?: string;
  recipientAccountNumber?: string;
  destinationCountry?: string;
  transferSpeed?: string;
  createdBy?: string;
  approvedBy?: string;
  metadata?: Record<string, any>;
  status?: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export const TransactionService = {
  /**
   * Centralized method to record transaction entries in the ledger database.
   */
  async recordTransaction(
    supabase: SupabaseClient,
    args: RecordTransactionArgs
  ): Promise<ServiceResponse> {
    if (!args.userId) return { success: false, error: "User ID is required." };
    if (!args.accountId) return { success: false, error: "Account ID is required." };
    if (args.amount < 0) return { success: false, error: "Amount cannot be negative." };

    try {
      // 1. Fetch current balances of the account (for balance_before calculation)
      const { data: account, error: accErr } = await supabase
        .from("accounts")
        .select("current_balance, currency")
        .eq("id", args.accountId)
        .single();

      if (accErr || !account) {
        console.error("Failed to fetch account balance for transaction tracking:", accErr);
        return { success: false, error: "Account not found." };
      }

      const balanceBefore = Number(account.current_balance);
      const diff = args.direction === "CREDIT" ? args.amount : -args.amount;
      const balanceAfter = balanceBefore + diff;

      // 2. Generate a reference number if not supplied
      const ref = args.referenceNumber || "NSTR-TXN-" + Math.floor(10000000 + Math.random() * 90000000);

      // 3. Insert transaction record into the ledger
      const { data: transaction, error: insErr } = await supabase
        .from("transactions")
        .insert({
          user_id: args.userId,
          account_id: args.accountId,
          type: args.type,
          direction: args.direction,
          amount: args.amount,
          currency: args.currency || account.currency || "USD",
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          status: args.status || "success",
          description: args.description || `${args.type.replace("_", " ")}`,
          reference_number: ref,
          source: args.source || "Northstar Account",
          destination: args.destination || args.recipientBank || "External Transfer",
          recipient_name: args.recipientName || null,
          recipient_bank: args.recipientBank || null,
          recipient_account_number: args.recipientAccountNumber || null,
          destination_country: args.destinationCountry || null,
          transfer_speed: args.transferSpeed || null,
          created_by: args.createdBy || null,
          approved_by: args.approvedBy || null,
          metadata: args.metadata || {},
        })
        .select()
        .single();

      if (insErr || !transaction) {
        console.error("Failed to insert transaction record:", insErr);
        return { success: false, error: insErr?.message || "Failed to save transaction record." };
      }

      return { success: true, data: transaction };
    } catch (err: any) {
      console.error("TransactionService.recordTransaction exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  /**
   * Fetch complete ledger records for a customer account.
   */
  async getAccountLedger(
    supabase: SupabaseClient,
    accountId: string
  ): Promise<ServiceResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (err: any) {
      console.error("TransactionService.getAccountLedger exception:", err);
      return { success: false, error: err.message };
    }
  },
};
