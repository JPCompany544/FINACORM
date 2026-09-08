"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle, ArrowLeft, ShieldCheck, LockKeyhole } from "lucide-react";
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

  // Phase State: 1 = Verify Code, 2 = Set New Password
  const [phase, setPhase] = React.useState<1 | 2>(1);

  // Form Fields
  const [email, setEmail] = React.useState(searchParams.get("email") || "");
  const [otpCode, setOtpCode] = React.useState(searchParams.get("token") || "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Touch states
  const [phase1Touched, setPhase1Touched] = React.useState(false);
  const [phase2Touched, setPhase2Touched] = React.useState(false);

  // UI States
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // ─── Initial Session Check (Skip Phase 1 if already authenticated via link/callback) ──
  React.useEffect(() => {
    const supabase = createBrowserClient();
    const code = searchParams.get("code");

    async function checkSession() {
      try {
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data.session) {
            setPhase(2);
            setCheckingSession(false);
            return;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setPhase(2);
        }
      } catch (err) {
        console.warn("[RESET PASSWORD] Session check exception:", err);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [searchParams]);

  // Phase 1 Validations
  const getEmailError = () => {
    if (!phase1Touched) return "";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address";
    return "";
  };

  const getOtpError = () => {
    if (!phase1Touched) return "";
    const clean = otpCode.trim();
    if (!clean) return "Verification code is required";
    if (clean.length < 6) return "Code must be at least 6 digits";
    return "";
  };

  const isPhase1Valid = !getEmailError() && !getOtpError() && otpCode.trim().length >= 6;

  // Phase 2 Validations
  const getPasswordError = () => {
    if (!phase2Touched) return "";
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (getStrengthScore(password) < 3) return "Please choose a stronger password";
    return "";
  };

  const getConfirmError = () => {
    if (!phase2Touched) return "";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const isPhase2Valid = !getPasswordError() && !getConfirmError() && password.length >= 8;

  // ─── Phase 1: Verify Code ──────────────────────────────────────────────────
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase1Touched(true);
    setFormError(null);

    if (!isPhase1Valid) return;

    setIsSubmitting(true);

    try {
      console.log("[RESET PASSWORD] Verifying security code for:", email);
      const otpResult = await verifyRecoveryOtp(email.trim(), otpCode.trim());

      if (!otpResult.success) {
        setFormError(
          otpResult.error?.message ||
            "Invalid or expired verification code. Please check your email and try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Successfully verified! Move to Phase 2
      setPhase(2);
      setFormError(null);
    } catch (err: any) {
      console.error("[RESET PASSWORD] Verification error:", err);
      setFormError(err?.message || "An error occurred verifying your code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Phase 2: Update Password ──────────────────────────────────────────────
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase2Touched(true);
    setFormError(null);

    if (!isPhase2Valid) return;

    setIsSubmitting(true);

    try {
      console.log("[RESET PASSWORD] Updating user password...");
      const updateResult = await updateUserPassword(password);

      if (!updateResult.success) {
        setFormError(
          updateResult.error?.message || "Failed to update password. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Success!
      setIsSuccess(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2200);
    } catch (err: any) {
      console.error("[RESET PASSWORD] Password update error:", err);
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

  // ─── Render Form ───────────────────────────────────────────────────────────
  return (
    <AuthCard className="max-w-[460px]">
      {/* ── Badge ──────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <motion.span
          key={phase}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary select-none"
        >
          {phase === 1 ? (
            <>
              <KeyRound className="h-3 w-3" />
              Step 1 of 2: Verify Code
            </>
          ) : (
            <>
              <LockKeyhole className="h-3 w-3" />
              Step 2 of 2: Set Password
            </>
          )}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {/* ══════════ SUCCESS STATE ══════════ */}
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
                Your credentials have been updated securely. Redirecting to sign in...
              </p>
            </div>
          </motion.div>
        ) : phase === 1 ? (
          /* ══════════ PHASE 1: ENTER & VERIFY CODE ══════════ */
          <motion.div
            key="phase1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            <AuthHeader
              title="Enter Security Code"
              description="Enter the verification code sent to your email to verify your identity."
            />

            {formError && <FormError id="verify-error" message={formError} />}

            <form onSubmit={handleVerifyCode} noValidate className="flex flex-col gap-4">
              {/* Email */}
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
                  onBlur={() => setPhase1Touched(true)}
                  error={getEmailError()}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Verification Code (Accepts 6, 8, or more characters) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-label text-text-secondary select-none">
                    Security Code
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
                  placeholder="Enter code from email"
                  maxLength={12}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.trim());
                    if (formError) setFormError(null);
                  }}
                  onBlur={() => setPhase1Touched(true)}
                  error={getOtpError()}
                  className="text-center font-mono tracking-widest text-lg font-bold"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Submit Phase 1 */}
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
                  {isSubmitting ? "Verifying Code..." : "Verify Code & Continue"}
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

            <SecurityNotice message="Your identity is protected with enterprise multi-factor authentication protocols." />
          </motion.div>
        ) : (
          /* ══════════ PHASE 2: SET NEW PASSWORD ══════════ */
          <motion.div
            key="phase2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            <AuthHeader
              title="Create New Password"
              description="Identity verified! Please set a strong new password for your account."
            />

            {formError && <FormError id="password-error" message={formError} />}

            <form onSubmit={handleUpdatePassword} noValidate className="flex flex-col gap-4">
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
                  onBlur={() => setPhase2Touched(true)}
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
                  onBlur={() => setPhase2Touched(true)}
                  error={getConfirmError()}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Submit Phase 2 */}
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
                  {isSubmitting ? "Saving New Password..." : "Update Password"}
                </Button>
              </motion.div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setPhase(1)}
                  className="inline-flex items-center text-xs font-bold text-text-secondary hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3 mr-1.5" />
                  Use a different code or email
                </button>
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
