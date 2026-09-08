"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input, Password } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { FormError } from "@/components/auth/FormError";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { PasswordStrength, getStrengthScore } from "@/components/auth/PasswordStrength";
import { verifyRecoveryOtp, updateUserPassword } from "@/lib/auth/password-reset";
import { createBrowserClient } from "@/lib/supabase";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BRAND_NAME } from "@/constants";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form Fields
  const [email, setEmail] = React.useState(searchParams.get("email") || "");
  const [otpCode, setOtpCode] = React.useState(searchParams.get("token") || "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  // States
  const [hasActiveSession, setHasActiveSession] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // ─── Detect Active Recovery Session (from SSR callback or local session) ──
  React.useEffect(() => {
    const supabase = createBrowserClient();
    const code = searchParams.get("code");

    async function checkSession() {
      try {
        // A. If code is in URL, try server exchange
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data.session) {
            setHasActiveSession(true);
            setCheckingSession(false);
            return;
          }
        }

        // B. Check if active session already exists
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHasActiveSession(true);
        }
      } catch (err) {
        console.warn("[RESET PASSWORD] Session check exception:", err);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [searchParams]);

  // Validation
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

  const getOtpError = () => {
    if (!touched || hasActiveSession) return "";
    if (!otpCode.trim()) return "6-digit code is required";
    if (otpCode.trim().length !== 6) return "Code must be exactly 6 digits";
    return "";
  };

  const getEmailError = () => {
    if (!touched || hasActiveSession) return "";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
    return "";
  };

  const isFormValid =
    !getPasswordError() &&
    !getConfirmError() &&
    (hasActiveSession || (!getOtpError() && !getEmailError())) &&
    password.length >= 8;

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFormError(null);

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // 1. If not in an active session, verify the 6-digit OTP code first
      if (!hasActiveSession) {
        console.log("[RESET PASSWORD] Verifying 6-digit OTP code for:", email);
        const otpResult = await verifyRecoveryOtp(email.trim(), otpCode.trim());
        if (!otpResult.success) {
          setFormError(
            otpResult.error?.message ||
              "Invalid or expired 6-digit code. Please check your email and try again."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Now with active session, update the password
      console.log("[RESET PASSWORD] Updating user password...");
      const updateResult = await updateUserPassword(password);
      if (!updateResult.success) {
        setFormError(
          updateResult.error?.message || "Failed to update password. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // 3. Success!
      setIsSuccess(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2200);
    } catch (err: any) {
      console.error("[RESET PASSWORD] Unhandled submission error:", err);
      setFormError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Loading state during initial session check ────────────────────────────
  if (checkingSession) {
    return (
      <AuthCard className="max-w-[460px] text-center p-8">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <h3 className="text-sm font-extrabold text-foreground">Preparing reset form...</h3>
        </div>
      </AuthCard>
    );
  }

  // ─── Reset Password Form ───────────────────────────────────────────────────
  return (
    <AuthCard className="max-w-[460px]">
      <div className="flex justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary select-none"
        >
          <KeyRound className="h-3 w-3" />
          {hasActiveSession ? "Session Verified" : "Code Verification"}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
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
              <h2 className="text-xl font-extrabold text-foreground">Password Reset Successful!</h2>
              <p className="text-xs text-text-secondary font-semibold">
                Your new credentials are saved. Redirecting you to sign in...
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
              description={
                hasActiveSession
                  ? "Enter and confirm your new password below."
                  : "Enter the 6-digit code sent to your email to verify and choose a new password."
              }
            />

            {formError && <FormError id="reset-error" message={formError} />}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* If no active session, ask for Email & 6-Digit Code */}
              {!hasActiveSession && (
                <>
                  <div className="space-y-1">
                    <span className="text-label text-text-secondary select-none">Account Email</span>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      onBlur={() => setTouched(true)}
                      error={getEmailError()}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-label text-text-secondary select-none">
                        6-Digit Security Code
                      </span>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        Resend code?
                      </Link>
                    </div>
                    <Input
                      id="reset-otp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, ""));
                        if (formError) setFormError(null);
                      }}
                      onBlur={() => setTouched(true)}
                      error={getOtpError()}
                      className="text-center font-mono tracking-widest text-lg font-bold"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </>
              )}

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
                    if (formError) setFormError(null);
                  }}
                  onBlur={() => setTouched(true)}
                  error={getPasswordError()}
                  disabled={isSubmitting}
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
                    if (formError) setFormError(null);
                  }}
                  onBlur={() => setTouched(true)}
                  error={getConfirmError()}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Submit */}
              <motion.div
                whileTap={isSubmitting ? {} : { scale: 0.985 }}
                transition={{ duration: 0.12 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center h-12 text-sm font-bold mt-2"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Updating Password..."
                    : hasActiveSession
                    ? "Update Password"
                    : "Verify Code & Update Password"}
                </Button>
              </motion.div>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-bold text-text-secondary hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3 mr-1.5" />
                  Return to Sign In
                </Link>
              </div>
            </form>

            <SecurityNotice message="Your session and credentials are encrypted with enterprise banking SSL." />
          </motion.div>
        )}
      </AnimatePresence>

      <AuthFooter>
        <span suppressHydrationWarning>
          © {new Date().getFullYear()} {BRAND_NAME} — All rights reserved.
        </span>
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
