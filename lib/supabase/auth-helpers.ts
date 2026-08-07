"use server";

import crypto from "crypto";
import { createClient } from "./server";
import { parseSupabaseError, AppError } from "./error";
import { PinService } from "@/lib/services/pin/PinService";

interface SignUpParams {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  transaction_pin: string;
  origin: string;
  avatar_url?: string;
}

interface SignUpResult {
  success: boolean;
  sessionConfirmed: boolean;
  error?: AppError;
}

/**
 * Triggers the Supabase signUp flow with user registration details.
 * The transaction PIN is hashed server-side before being passed to Supabase user metadata.
 * The raw PIN is NEVER stored or logged.
 */
export async function signUpUser({
  email,
  password,
  first_name,
  last_name,
  phone,
  transaction_pin,
  origin,
  avatar_url,
}: SignUpParams): Promise<SignUpResult> {
  console.log("[SIGNUP DIAGNOSTIC] signUpUser server action triggered for email:", email);

  // Validate PIN before doing any work
  if (!PinService.validateStrength(transaction_pin)) {
    console.log("[SIGNUP DIAGNOSTIC] PIN validation failed.");
    return {
      success: false,
      sessionConfirmed: false,
      error: { message: "Transaction PIN must be exactly 4 numeric digits." },
    };
  }

  // Hash the PIN server-side — the raw PIN never leaves this function
  console.log("[SIGNUP DIAGNOSTIC] Hashing transaction PIN...");
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = PinService.hash(transaction_pin, salt);
  console.log("[SIGNUP DIAGNOSTIC] Hashing complete.");

  console.log("[SIGNUP DIAGNOSTIC] Initializing Supabase client...");
  const supabase = await createClient();

  try {
    console.log("[SIGNUP DIAGNOSTIC] Calling supabase.auth.signUp() with emailRedirectTo:", `${origin}/auth/callback`);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          first_name,
          last_name,
          phone,
          avatar_url,
          transaction_pin_hash: hash,
          transaction_pin_salt: salt,
        },
      },
    });

    if (error) {
      console.error("[SIGNUP DIAGNOSTIC] supabase.auth.signUp() returned an error object:", error);
      return {
        success: false,
        sessionConfirmed: false,
        error: parseSupabaseError(error),
      };
    }

    console.log("[SIGNUP DIAGNOSTIC] supabase.auth.signUp() completed successfully.");
    console.log("[SIGNUP DIAGNOSTIC] Created User ID:", data.user?.id);
    console.log("[SIGNUP DIAGNOSTIC] Session confirmed:", !!data.session);

    const sessionConfirmed = !!data.session;

    return {
      success: true,
      sessionConfirmed,
    };
  } catch (err: any) {
    console.error("[SIGNUP DIAGNOSTIC] Exception caught during signup flow execution:", err);
    return {
      success: false,
      sessionConfirmed: false,
      error: parseSupabaseError(err),
    };
  }
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

interface SignInParams {
  email: string;
  password: string;
}

interface SignInResult {
  success: boolean;
  error?: AppError;
}

/**
 * Signs an existing user in using email + password.
 * Returns a friendly error if credentials are wrong or the account doesn't exist.
 */
export async function signInUser({
  email,
  password,
}: SignInParams): Promise<SignInResult> {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Map Supabase auth error codes to user-friendly messages
      let message = "Incorrect email or password. Please try again.";
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        message = "Please verify your email before signing in.";
      } else if (error.message?.toLowerCase().includes("invalid login")) {
        message = "Incorrect email or password. Please try again.";
      } else if (error.message?.toLowerCase().includes("too many requests")) {
        message = "Too many sign-in attempts. Please wait a moment and try again.";
      }
      return { success: false, error: { message, originalError: error.message || String(error) } };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: parseSupabaseError(err) };
  }
}
