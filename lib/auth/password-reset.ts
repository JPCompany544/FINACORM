import { createBrowserClient } from "@/lib/supabase";
import { parseSupabaseError, AppError } from "@/lib/supabase/error";
import {
  sendPasswordResetAction,
  updateUserPasswordAction,
} from "@/lib/supabase/auth-helpers";

/**
 * Sends a password reset link to the specified email address.
 * Routes the link through /auth/callback?next=/auth/reset-password to ensure
 * proper PKCE code exchange and session establishment.
 */
export async function sendPasswordResetLink(
  email: string
): Promise<{ success: boolean; error?: AppError }> {
  const sanitized = email.trim().toLowerCase();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  try {
    // 1. Try server action first
    const actionResult = await sendPasswordResetAction(sanitized, origin);
    if (actionResult.success) {
      return { success: true };
    }

    // If server action returned an error, check if it's fatal or we should fallback
    if (actionResult.error) {
      // If error is rate limit or validation, return immediately
      if (
        actionResult.error.message.toLowerCase().includes("rate limit") ||
        actionResult.error.message.toLowerCase().includes("seconds")
      ) {
        return actionResult;
      }
    }
  } catch (actionErr) {
    console.warn("sendPasswordResetAction failed, falling back to browser client:", actionErr);
  }

  // 2. Client-side fallback with correctly targeted callback redirect
  try {
    const supabase = createBrowserClient();
    const redirectTo = origin
      ? `${origin}/auth/callback?next=/auth/reset-password`
      : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(sanitized, {
      redirectTo,
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
 * Verifies a 6-digit recovery OTP code sent to the user's email.
 * This establishes an authenticated recovery session without relying on URL magic links or cookies.
 */
export async function verifyRecoveryOtp(
  email: string,
  token: string
): Promise<{ success: boolean; error?: AppError }> {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: "recovery",
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
 * Updates the user's password using the active authenticated recovery session.
 * Tries server action first for robust cookie handling, then falls back to browser client.
 */
export async function updateUserPassword(
  password: string
): Promise<{ success: boolean; error?: AppError }> {
  try {
    // 1. Try server action first
    const actionResult = await updateUserPasswordAction(password);
    if (actionResult.success) {
      return { success: true };
    }
    if (actionResult.error) {
      console.warn("updateUserPasswordAction returned error, attempting browser client:", actionResult.error);
    }
  } catch (actionErr) {
    console.warn("updateUserPasswordAction exception, falling back to browser client:", actionErr);
  }

  // 2. Client-side fallback
  try {
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: parseSupabaseError(error) };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: parseSupabaseError(err) };
  }
}
