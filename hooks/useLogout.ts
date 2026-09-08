import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/app-shell";
import { logoutUser } from "@/lib/auth/logout";
import { useAuth } from "@/lib/supabase/AuthProvider";

/**
 * Custom hook to handle secure user logout operations.
 * Manages loading states, triggers mature loading overlay,
 * handles redirects using router.replace(), and displays toast messages.
 */
export function useLogout() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await logoutUser();

      if (result.success) {
        success("Signed Out", "Your session was terminated securely.");
        // Use router.replace to prevent back button from reopening authenticated screens
        router.replace("/login");
      } else {
        toastError("Logout Failed", result.error || "Unable to sign out. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      toastError("Logout Failed", err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  }, [loading, router, success, toastError]);

  return {
    handleLogout,
    loading,
  };
}

