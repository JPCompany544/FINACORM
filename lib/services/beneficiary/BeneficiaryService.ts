import { SupabaseClient } from "@supabase/supabase-js";

export interface SaveBeneficiaryArgs {
  userId: string;
  name: string;
  bankName: string;
  country: string;
  accountNumber: string;
  routingInformation: string;
  currency: string;
  nickname?: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export const BeneficiaryService = {
  /**
   * Add or update a beneficiary for the authenticated customer.
   */
  async saveBeneficiary(
    supabase: SupabaseClient,
    args: SaveBeneficiaryArgs
  ): Promise<ServiceResponse> {
    if (!args.userId) return { success: false, error: "User ID is required." };
    if (!args.name.trim()) return { success: false, error: "Recipient name is required." };
    if (!args.accountNumber.trim()) return { success: false, error: "Account number is required." };

    try {
      // Use standard UUID generation or UUID random string in JS
      const entryId = "ben_" + Math.floor(10000000 + Math.random() * 90000000);

      const { data, error } = await supabase
        .from("beneficiaries")
        .insert({
          id: entryId,
          user_id: args.userId,
          name: args.name.trim(),
          bank_name: args.bankName.trim() || "External Bank",
          account_number: args.accountNumber.trim(),
          country: args.country || "United States",
          routing_information: args.routingInformation.trim(),
          currency: args.currency || "USD",
          nickname: args.nickname?.trim() || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting beneficiary:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("BeneficiaryService.saveBeneficiary exception:", err);
      return { success: false, error: err.message || "An unexpected error occurred." };
    }
  },

  /**
   * Retrieve all saved beneficiaries for a specific customer.
   */
  async getBeneficiaries(
    supabase: SupabaseClient,
    userId: string
  ): Promise<ServiceResponse<any[]>> {
    if (!userId) return { success: false, error: "User ID is required." };

    try {
      const { data, error } = await supabase
        .from("beneficiaries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (err: any) {
      console.error("BeneficiaryService.getBeneficiaries exception:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Delete a saved beneficiary.
   */
  async deleteBeneficiary(
    supabase: SupabaseClient,
    beneficiaryId: string
  ): Promise<ServiceResponse> {
    if (!beneficiaryId) return { success: false, error: "Beneficiary ID is required." };

    try {
      const { error } = await supabase
        .from("beneficiaries")
        .delete()
        .eq("id", beneficiaryId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("BeneficiaryService.deleteBeneficiary exception:", err);
      return { success: false, error: err.message };
    }
  },
};
