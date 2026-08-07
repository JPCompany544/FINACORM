import { SupabaseClient } from "@supabase/supabase-js";
import { AccountService } from "../account/AccountService";

export interface SubmitTransferArgs {
  userId: string;
  sourceAccountId: string;
  recipientName: string;
  recipientBank: string;
  destinationCountry: string;
  recipientAccount: string;
  routingInformation: string;
  amount: number;
  currency: string;
  transferType: string;
  transferSpeed: string;
  description?: string;
  reference: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export const TransferService = {
  /**
   * Submit a transfer request for bank administrator approval.
   */
  async submitTransfer(supabase: SupabaseClient, args: SubmitTransferArgs): Promise<ServiceResponse> {
    if (!args.userId) return { success: false, error: "User ID is required." };
    if (!args.sourceAccountId) return { success: false, error: "Source funding account is required." };
    if (!args.recipientName.trim()) return { success: false, error: "Recipient name is required." };
    if (!args.recipientAccount.trim()) return { success: false, error: "Recipient account is required." };
    if (args.amount <= 0) return { success: false, error: "Transfer amount must be greater than zero." };

    try {
      // 1. Get user profile for notification metadata
      const { data: profile } = await supabase
        .from("profiles")
        .select("customer_number")
        .eq("id", args.userId)
        .single();

      const customerNum = profile?.customer_number || "Unknown";

      const { data: request, error: insErr } = await supabase
        .from("transfer_requests")
        .insert({
          user_id: args.userId,
          source_account_id: args.sourceAccountId,
          recipient_name: args.recipientName,
          recipient_bank: args.recipientBank,
          destination_country: args.destinationCountry,
          recipient_account_number: args.recipientAccount,
          routing_information: args.routingInformation,
          amount: args.amount,
          currency: args.currency,
          transfer_type: args.transferType,
          transfer_speed: args.transferSpeed,
          description: args.description || "",
          status: "PENDING_APPROVAL",
        })
        .select()
        .single();

      if (insErr || !request) {
        console.error("Error creating transfer request:", insErr);
        return { success: false, error: insErr?.message || "Failed to create transfer request." };
      }

      // 3. Create customer notification
      try {
        await supabase.from("notifications").insert({
          user_id: args.userId,
          title: "Transaction Processing",
          message: `Your transfer of ${args.amount} ${args.currency} to ${args.recipientName} is processing and awaiting bank approval.`,
          read: false,
        });
      } catch (e) {
        console.warn("Failed to insert customer notification:", e);
      }

      // 4. Create admin notification (for all admin users)
      try {
        const { data: admins } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "admin");

        if (admins && admins.length > 0) {
          const adminNotifications = admins.map((admin) => ({
            user_id: admin.id,
            title: "New Transfer Request",
            message: `Customer ${customerNum} submitted a transfer of ${args.amount} ${args.currency} to ${args.recipientName} for approval.`,
            read: false,
          }));
          await supabase.from("notifications").insert(adminNotifications);
        }
      } catch (e) {
        console.warn("Failed to insert admin notifications:", e);
      }

      return { success: true, data: request };
    } catch (err: any) {
      console.error("TransferService.submitTransfer exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  /**
   * Approve a transfer request and execute fund transfer through AccountService.
   */
  async approveTransfer(
    supabase: SupabaseClient,
    transferId: string,
    adminId: string
  ): Promise<ServiceResponse> {
    if (!transferId) return { success: false, error: "Transfer ID is required." };
    if (!adminId) return { success: false, error: "Admin ID is required." };

    try {
      // 1. Fetch transfer request
      const { data: req, error: fetchErr } = await supabase
        .from("transfer_requests")
        .select("*")
        .eq("id", transferId)
        .single();

      if (fetchErr || !req) {
        return { success: false, error: "Transfer request not found." };
      }

      if (req.status !== "PENDING_APPROVAL") {
        return { success: false, error: `Transfer request is already ${req.status.toLowerCase()}.` };
      }

      const reference = `NSTR-${Math.floor(10000000 + Math.random() * 90000000)}`;

      // 2. Delegate money movement to AccountService
      const txRes = await AccountService.transfer(supabase, {
        senderId: req.user_id,
        sourceAccountId: req.source_account_id || "",
        recipientName: req.recipient_name,
        recipientBank: req.recipient_bank,
        recipientAccount: req.recipient_account_number,
        amount: Number(req.amount),
        currency: req.currency,
        reference: reference,
        description: req.description,
      });

      if (!txRes.success) {
        return { success: false, error: txRes.error || "Failed to execute fund transfer." };
      }

      // 3. Update transfer status to APPROVED
      const { error: updErr } = await supabase
        .from("transfer_requests")
        .update({
          status: "APPROVED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transferId);

      if (updErr) {
        console.error("Error updating transfer request status:", updErr);
        return { success: false, error: "Fund transfer succeeded, but failed to update status to APPROVED." };
      }

      // 4. Create Audit Log
      try {
        await supabase.from("transfer_audits").insert({
          admin_id: adminId,
          transfer_id: transferId,
          action: "APPROVE",
        });
      } catch (e) {
        console.warn("Failed to create transfer audit log:", e);
      }

      // 5. Create customer notification
      try {
        await supabase.from("notifications").insert({
          user_id: req.user_id,
          title: "Transfer Approved",
          message: `Your transfer of ${req.amount} ${req.currency} to ${req.recipient_name} has been approved and completed.`,
          read: false,
        });
      } catch (e) {
        console.warn("Failed to insert approval notification:", e);
      }

      return { success: true };
    } catch (err: any) {
      console.error("TransferService.approveTransfer exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  /**
   * Decline a transfer request.
   */
  async declineTransfer(
    supabase: SupabaseClient,
    transferId: string,
    adminId: string,
    reason?: string
  ): Promise<ServiceResponse> {
    if (!transferId) return { success: false, error: "Transfer ID is required." };
    if (!adminId) return { success: false, error: "Admin ID is required." };

    try {
      // 1. Fetch transfer request
      const { data: req, error: fetchErr } = await supabase
        .from("transfer_requests")
        .select("*")
        .eq("id", transferId)
        .single();

      if (fetchErr || !req) {
        return { success: false, error: "Transfer request not found." };
      }

      if (req.status !== "PENDING_APPROVAL") {
        return { success: false, error: `Transfer request is already ${req.status.toLowerCase()}.` };
      }

      // 2. Update status to DECLINED with reason
      const { error: updErr } = await supabase
        .from("transfer_requests")
        .update({
          status: "DECLINED",
          admin_reason: reason || "Declined by administrator.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", transferId);

      if (updErr) {
        console.error("Error updating transfer request status to DECLINED:", updErr);
        return { success: false, error: "Failed to decline transfer request." };
      }

      // 3. Create Audit Log
      try {
        await supabase.from("transfer_audits").insert({
          admin_id: adminId,
          transfer_id: transferId,
          action: "DECLINE",
          reason: reason || "Declined by administrator.",
        });
      } catch (e) {
        console.warn("Failed to create transfer decline audit log:", e);
      }

      // 4. Create customer notification
      try {
        await supabase.from("notifications").insert({
          user_id: req.user_id,
          title: "Transfer Declined",
          message: `Your transfer of ${req.amount} ${req.currency} to ${req.recipient_name} has been declined. ${
            reason ? `Reason: ${reason}` : ""
          }`,
          read: false,
        });
      } catch (e) {
        console.warn("Failed to insert decline notification:", e);
      }

      return { success: true };
    } catch (err: any) {
      console.error("TransferService.declineTransfer exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  /**
   * Fetch a single transfer status.
   */
  async getTransferStatus(supabase: SupabaseClient, transferId: string): Promise<ServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("transfer_requests")
        .select("status, admin_reason")
        .eq("id", transferId)
        .single();

      if (error || !data) {
        return { success: false, error: "Could not fetch transfer status." };
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },
};
