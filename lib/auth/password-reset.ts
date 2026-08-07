import { createBrowserClient } from "@/lib/supabase";
import { parseSupabaseError, AppError } from "@/lib/supabase/error";

/**
 * Sends a password reset link to the specified email address.
 * Generates an idempotent call targeting /auth/reset-password path.
 */
export async function sendPasswordResetLink(email: string): Promise<{ success: boolean; error?: AppError }> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: parseSupabaseError(error) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: parseSupabaseError(err) };
  }
}

/**
 * Updates the user's password using standard Supabase authentication.
 * Doesn't require the old password as it works within a recovery session context.
 */
export async function updateUserPassword(password: string): Promise<{ success: boolean; error?: AppError }> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: parseSupabaseError(error) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: parseSupabaseError(err) };
  }
}
