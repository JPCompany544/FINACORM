"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface DeleteUserResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Server action to securely delete a user account from the admin panel.
 * Enforces admin authorization via session and executes atomic database cascade.
 */
export async function deleteCustomerAction(customerId: string): Promise<DeleteUserResult> {
  if (!customerId) {
    return { success: false, error: "Customer ID is required." };
  }

  try {
    const supabase = await createClient();

    // 1. Verify caller session
    const {
      data: { user: caller },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !caller) {
      return { success: false, error: "Unauthorized: Session expired or invalid." };
    }

    // 2. Prevent self-deletion
    if (caller.id === customerId) {
      return { success: false, error: "Action Prohibited: You cannot delete your own admin account." };
    }

    // 3. Verify caller is an administrator
    const { data: callerProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (profileError || callerProfile?.role !== "admin") {
      return { success: false, error: "Unauthorized: Only administrators can delete customer accounts." };
    }

    // 4. Execute atomic deletion RPC
    const { data, error: rpcError } = await supabase.rpc("admin_delete_user", {
      p_target_user_id: customerId,
    });

    if (rpcError) {
      return { success: false, error: rpcError.message || "Failed to delete customer." };
    }

    // 5. Revalidate admin views
    revalidatePath("/admin/users");
    revalidatePath("/admin");

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    console.error("deleteCustomerAction exception:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
