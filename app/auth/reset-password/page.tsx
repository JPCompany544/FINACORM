"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ShieldAlert, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Password } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { PasswordStrength, getStrengthScore } from "@/components/auth/PasswordStrength";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { createBrowserClient } from "@/lib/supabase";
import { AuthLayout } from "@/components/auth/AuthLayout";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerPasswordUpdate, loading, success, error, setError } = usePasswordReset();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [sessionError, setSessionError] = React.useState(false);

  // ─── 1. VERIFY RECOVERY SESSION ──────────────────────────────────────────────
  React.useEffect(() => {
    const supabase = createBrowserClient();

    // Check if we have an active authenticated recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setSessionError(true);
        // Briefly delay redirect to let user read the warning
        setTimeout(() => {
          router.replace("/forgot-password?error=invalid_session");
        }, 3000);
      } else {
        setCheckingSession(false);
      }
    });
  }, [router]);

  // ─── 2. VALIDATION ───────────────────────────────────────────────────────────
  const getPasswordError = () => {
    if (!touched) return "";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (getStrengthScore(password) < 3) return "Please choose a stronger password";
    return "";
  };

  const getConfirmError = () => {
    if (!touched) return "";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const isFormValid = !getPasswordError() && !getConfirmError() && password.length >= 8;

  // ─── 3. SUBMIT ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isFormValid) return;

    await triggerPasswordUpdate(password);
  };

  // Redirect to login after successful password update
  React.useEffect(() => {
    if (success) {
      const t = setTimeout(() => {
        router.replace("/login");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [success, router]);

  const isLoading = loading;

  // ─── 4. RENDER INITIAL VERIFICATION LOADER ───────────────────────────────────
  if (checkingSession) {
    return (
      <AuthCard className="max-w-[460px] text-center p-8">
        <div className="flex flex-col items-center gap-4 py-8">
          {sessionError ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                <ShieldAlert className="h-6 w-6 animate-bounce" />
              </div>
              <h3 className="text-sm font-extrabold text-foreground">Invalid Recovery Link</h3>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed max-w-xs">
                Your recovery session is invalid or expired. Redirecting to forgot password helper...
              </p>
            </>
          ) : (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <h3 className="text-sm font-extrabold text-foreground">Verifying secure token...</h3>
            </>
          )}
        </div>
      </AuthCard>
    );
  }

  // ─── 5. RENDER PASSWORD UPDATE PANEL ─────────────────────────────────────────
  return (
    <AuthCard className="max-w-[460px]">
      <div className="flex justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary select-none"
        >
          <KeyRound className="h-3 w-3" />
          Secure Reset
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 py-6 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success ring-1 ring-success/20">
              <CheckCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-foreground">Password updated successfully.</h2>
              <p className="text-xs text-text-secondary font-semibold">
                Returning you to login interface...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-5"
          >
            <AuthHeader
              title="Reset Password"
              description="Choose a secure new password for your banking account."
            />

            <FormError id="reset-error" message={error || undefined} />

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* New Password */}
              <div className="space-y-1">
                <span className="text-label text-text-secondary select-none">New Password</span>
                <Password
                  id="reset-password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onBlur={() => setTouched(true)}
                  error={getPasswordError()}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password Strength Widget */}
              <div className="py-1">
                <PasswordStrength password={password} visible={password.length > 0} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <span className="text-label text-text-secondary select-none">Confirm New Password</span>
                <Password
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onBlur={() => setTouched(true)}
                  error={getConfirmError()}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Submit */}
              <motion.div whileTap={isLoading ? {} : { scale: 0.985 }} transition={{ duration: 0.12 }}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center h-12 text-sm font-bold mt-2"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving New Password..." : "Update Password"}
                </Button>
              </motion.div>
            </form>

            <SecurityNotice message="Your session parameters are secured via Supabase SSL protocols." />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthFooter>
        © {new Date().getFullYear()} Northstar Bank — All rights reserved.
      </AuthFooter>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <React.Suspense
        fallback={
          <AuthCard className="max-w-[460px] text-center p-8">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <h3 className="text-sm font-extrabold text-foreground">Loading reset page...</h3>
            </div>
          </AuthCard>
        }
      >
        <ResetPasswordPageContent />
      </React.Suspense>
    </AuthLayout>
  );
}
