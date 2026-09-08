import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth Callback Route Handler
 *
 * This route is called by Supabase after:
 *   - Password recovery (forgot-password magic link)
 *   - Email confirmation (signup verification)
 *   - Magic link authentication
 *   - OAuth provider callbacks
 *
 * It exchanges the one-time authorization `code` for a server-side session,
 * sets auth cookies, then redirects the user to their intended destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  // Destination after successful exchange
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";
  const isRecovery = next.includes("reset-password");

  // No code means this is a malformed or tampered request
  if (!code) {
    console.warn("[auth/callback] Missing authorization code.");
    const fallbackUrl = isRecovery
      ? "/forgot-password?error=invalid_session"
      : "/login?error=auth_callback";
    return NextResponse.redirect(new URL(fallbackUrl, origin));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] Code exchange failed:", error.message);
      const failureUrl = isRecovery
        ? "/forgot-password?error=invalid_session"
        : "/login?error=auth_callback";
      return NextResponse.redirect(new URL(failureUrl, origin));
    }

    // Code was exchanged successfully — session cookies are set.
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      return NextResponse.redirect(new URL(next, origin));
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(new URL(next, origin));
    }
  } catch (err) {
    console.error("[auth/callback] Unexpected error:", err);
    const failureUrl = isRecovery
      ? "/forgot-password?error=invalid_session"
      : "/login?error=auth_callback";
    return NextResponse.redirect(new URL(failureUrl, origin));
  }
}
