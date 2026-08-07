import { SupabaseClient } from "@supabase/supabase-js";

export interface CreditArgs {
  customerId: string;  // profiles.id / auth.users.id (UUID)
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  performedBy: string; // admin user_id (UUID)
}

export interface ServiceResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export const AccountService = {
  /**
   * Credit a customer's primary active account.
   *
   * Calls the `credit_customer` database RPC which runs with SECURITY DEFINER —
   * it bypasses RLS entirely, so the admin's anon-key session is sufficient.
   *
   * Validation is intentionally minimal on the client side; the RPC enforces
   * the real rules (active account exists, amount > 0) atomically inside the DB.
   */
  async credit(supabase: SupabaseClient, args: CreditArgs): Promise<ServiceResponse> {
    // Client-side guard: catch obvious mistakes before hitting the network
    if (!args.customerId) return { success: false, error: "Customer ID is required." };
    if (!args.performedBy) return { success: false, error: "Administrator ID is required." };
    if (isNaN(args.amount) || args.amount <= 0)
      return { success: false, error: "Credit amount must be greater than zero." };
    if (!args.reference?.trim()) return { success: false, error: "Reference code is required." };

    try {
      // Call the SECURITY DEFINER RPC — bypasses RLS, handles everything atomically
      const { data: ok, error: rpcErr } = await supabase.rpc("credit_customer", {
        p_user_id:    args.customerId,
        p_amount:     args.amount,
        p_reference:  args.reference.trim(),
        p_description: args.description?.trim() || `Credit: ${args.reference}`,
        p_admin_id:   args.performedBy,
      });

      if (rpcErr) {
        console.error("credit_customer RPC error:", rpcErr);
        return {
          success: false,
          error: rpcErr.message || "Database error during credit operation.",
        };
      }

      if (ok === false) {
        // RPC returned false: no active account found for this customer
        return {
          success: false,
          error: "No active account found for this customer. Verify their account status.",
        };
      }

      return { success: true };
    } catch (err: any) {
      console.error("AccountService.credit exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  // ─── Placeholder stubs ────────────────────────────────────────────────────

  async debit(_supabase: SupabaseClient, _args: any): Promise<ServiceResponse> {
    return { success: false, error: "Not implemented." };
  },

  async transfer(
    supabase: SupabaseClient,
    args: {
      senderId: string;
      sourceAccountId: string;
      recipientName: string;
      recipientBank: string;
      recipientAccount: string;
      amount: number;
      currency: string;
      reference: string;
      description?: string;
    }
  ): Promise<ServiceResponse> {
    if (!args.senderId) return { success: false, error: "Sender User ID is required." };
    if (!args.sourceAccountId) return { success: false, error: "Source Account ID is required." };
    if (!args.recipientName) return { success: false, error: "Recipient name is required." };
    if (!args.recipientAccount) return { success: false, error: "Recipient account is required." };
    if (args.amount <= 0) return { success: false, error: "Amount must be greater than zero." };

    try {
      const { data: ok, error: rpcErr } = await supabase.rpc("transfer_funds_rpc", {
        p_sender_id: args.senderId,
        p_source_account_id: args.sourceAccountId,
        p_recipient_name: args.recipientName,
        p_recipient_bank: args.recipientBank,
        p_recipient_account: args.recipientAccount,
        p_amount: args.amount,
        p_currency: args.currency,
        p_reference: args.reference,
        p_description: args.description || `Wire to ${args.recipientBank}`,
      });

      if (rpcErr) {
        console.error("transfer_funds_rpc error:", rpcErr);
        return { success: false, error: rpcErr.message || "Failed to execute fund transfer." };
      }

      if (!ok) {
        return { success: false, error: "Transfer rejected by database constraints." };
      }

      return { success: true };
    } catch (err: any) {
      console.error("AccountService.transfer exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  async freezeAccount(_supabase: SupabaseClient, _accountId: string): Promise<ServiceResponse> {
    return { success: false, error: "Not implemented." };
  },

  async unfreezeAccount(_supabase: SupabaseClient, _accountId: string): Promise<ServiceResponse> {
    return { success: false, error: "Not implemented." };
  },

  async getAccount(_supabase: SupabaseClient, _accountId: string): Promise<ServiceResponse> {
    return { success: false, error: "Not implemented." };
  },

  async getBalance(_supabase: SupabaseClient, _accountId: string): Promise<ServiceResponse> {
    return { success: false, error: "Not implemented." };
  },
};
