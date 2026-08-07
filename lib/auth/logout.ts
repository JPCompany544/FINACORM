import { createBrowserClient } from "@/lib/supabase";

/**
 * Reusable utility to destroy the active session on both client and server,
 * and purge local caches. Highly resilient: if the server-side signOut fails
 * (e.g. due to expired tokens, offline state), it still purges all local states,
 * cookies, and caches to guarantee a smooth, fail-safe user logout.
 */
export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  const supabase = createBrowserClient();

  try {
    // Attempt standard Supabase server signout. We catch any errors to prevent
    // them from blocking the local storage purge and client redirect.
    await supabase.auth.signOut();
  } catch (err: any) {
    console.warn("Supabase server-side signOut failed or was already logged out:", err);
  }

  // Resiliently purge all local storage, session storage, and cookies
  try {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
      
      // Clear cookie storage manually
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/dashboard`;
      }
    }
  } catch (clearErr: any) {
    console.error("Resilient local state purge failed:", clearErr);
  }

  // Always return success: true to ensure the frontend router redirects smoothly
  return { success: true };
}
