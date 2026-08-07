import * as React from "react";
import { sendPasswordResetLink, updateUserPassword } from "@/lib/auth/password-reset";

/**
 * Custom hook to manage forgot-password email requests and new password updates.
 * Provides granular states for loading spinner toggles, successful triggers, and errors.
 */
export function usePasswordReset() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const triggerResetLink = React.useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const result = await sendPasswordResetLink(email);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error?.message || "Unable to send reset link. Please try again.");
    }
    setLoading(false);
  }, []);

  const triggerPasswordUpdate = React.useCallback(async (password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const result = await updateUserPassword(password);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error?.message || "Unable to update password. Please try again.");
    }
    setLoading(false);
  }, []);

  return {
    triggerResetLink,
    triggerPasswordUpdate,
    loading,
    success,
    error,
    setError,
  };
}
