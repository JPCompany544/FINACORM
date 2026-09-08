import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

/**
 * Supabase Auth Callback Route Handler
 *
 * This route is called by Supabase after:
 *   - Password recovery (forgot-password magic link)
 *   - Email confirmation (signup verification)
 *   - Magic link authentication
 *   - OAuth provider callbacks
 *
 * It exchanges the one-time authorization `code` (or verifies `token_hash`)
 * on the server, establishes session cookies, then redirects the user.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Destination after successful exchange
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";
  const isRecovery = next.includes("reset-password") || type === "recovery";

  // No code or token_hash means this is a malformed or direct request
  if (!code && !(token_hash && type)) {
    console.warn("[auth/callback] Missing authorization code or token hash.");
    const fallbackUrl = isRecovery
      ? "/auth/reset-password?error=invalid_session"
      : "/login?error=auth_callback";
    return NextResponse.redirect(new URL(fallbackUrl, origin));
  }

  try {
    const supabase = await createClient();
    let authError: { message: string } | null = null;

    if (token_hash && type) {
      console.log("[auth/callback] Verifying OTP via token_hash for type:", type);
      const { error } = await supabase.auth.verifyOtp({ token_hash, type });
      if (error) authError = error;
    } else if (code) {
      console.log("[auth/callback] Exchanging authorization code for session...");
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) authError = error;
    }

    if (authError) {
      console.error("[auth/callback] Code/Token exchange failed:", authError.message);
      // For recovery, send user to reset-password with the error so they can use 6-digit OTP code fallback
      const failureUrl = isRecovery
        ? `/auth/reset-password?error=invalid_session&error_description=${encodeURIComponent(authError.message)}`
        : "/login?error=auth_callback";
      return NextResponse.redirect(new URL(failureUrl, origin));
    }

    // Code was exchanged successfully — session cookies are established.
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(new URL(next, origin));
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(new URL(next, origin));
    }
  } catch (err: any) {
    console.error("[auth/callback] Unexpected error:", err);
    const failureUrl = isRecovery
      ? `/auth/reset-password?error=invalid_session&error_description=${encodeURIComponent(err?.message || "Unexpected error")}`
      : "/login?error=auth_callback";
    return NextResponse.redirect(new URL(failureUrl, origin));
  }
}
