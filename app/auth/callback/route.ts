import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth Callback Route Handler
 *
 * This route is called by Supabase after:
 *   - Email confirmation (signup verification)
 *   - Magic link authentication
 *   - OAuth provider callbacks
 *
 * It exchanges the one-time authorization `code` for a server-side session,
 * then redirects the user to their intended destination.
 *
 * POST-AUTH REDIRECT STRATEGY:
 *   Success → /dashboard (or ?next= param if provided)
 *   Failure → /login?error=auth_callback
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  // Optional: allow the caller to specify a post-auth redirect destination.
  // We sanitize this to ensure it only ever redirects to a relative path,
  // preventing open-redirect vulnerabilities.
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  // No code means this is a malformed or tampered request
  if (!code) {
    console.warn("[auth/callback] Missing authorization code — redirecting to login.");
    return NextResponse.redirect(
      new URL("/login?error=auth_callback", origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // This catches expired codes, already-used codes, and Supabase errors
      console.error("[auth/callback] Code exchange failed:", error.message);
      return NextResponse.redirect(
        new URL("/login?error=auth_callback", origin)
      );
    }

    // Code was exchanged successfully — session cookies are now set.
    // Redirect the user to the dashboard (or intended destination).
    return NextResponse.redirect(new URL(next, origin));
  } catch (err) {
    // Catch unexpected network/runtime errors without crashing the server
    console.error("[auth/callback] Unexpected error:", err);
    return NextResponse.redirect(
      new URL("/login?error=auth_callback", origin)
    );
  }
}
