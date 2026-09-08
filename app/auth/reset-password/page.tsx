"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ShieldAlert, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Password } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { FormError } from "@/components/auth/FormError";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { PasswordStrength, getStrengthScore } from "@/components/auth/PasswordStrength";
import { usePasswordReset } from "@/hooks/usePasswordReset";
import { createBrowserClient } from "@/lib/supabase";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BRAND_NAME } from "@/constants";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerPasswordUpdate, loading, success, error, setError } = usePasswordReset();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [sessionError, setSessionError] = React.useState(false);
  const [sessionErrorMessage, setSessionErrorMessage] = React.useState(
    "Your password reset link is invalid, expired, or has already been used."
  );

  // ─── 1. VERIFY RECOVERY SESSION WITH TRIPLE REDUNDANCY ──────────────────────
  React.useEffect(() => {
    const supabase = createBrowserClient();
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    let isMounted = true;

    // Check if URL directly brought an error parameter from Supabase
    if (errorParam || errorDescription) {
      if (isMounted) {
        setSessionErrorMessage(
          errorDescription?.replace(/\+/g, " ") ||
            "Your password reset link has expired or is invalid. Please request a new one."
        );
        setSessionError(true);
        setCheckingSession(false);
      }
      return;
    }

    async function verifyRecoverySession() {
      try {
        // ── Step A: Direct PKCE Code Exchange (if arrived with ?code=...) ───────
        if (code) {
          console.log("[RESET PASSWORD] Authorization code detected in URL, exchanging...");
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError && data.session) {
            console.log("[RESET PASSWORD] Code exchanged successfully.");
            if (isMounted) {
              setCheckingSession(false);
              setSessionError(false);
            }
            return;
          } else if (exchangeError) {
            console.warn("[RESET PASSWORD] Code exchange failed:", exchangeError.message);
          }
        }

        // ── Step B: Check Active Session (e.g. from SSR /auth/callback cookies) ──
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          console.log("[RESET PASSWORD] Active recovery session confirmed.");
          if (isMounted) {
            setCheckingSession(false);
            setSessionError(false);
          }
          return;
        }

        // ── Step C: Listen to Auth State Change (e.g. hash token parsing) ───────
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("[RESET PASSWORD] Auth state change event:", event);
          if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session) {
            if (isMounted) {
              setCheckingSession(false);
              setSessionError(false);
            }
          }
        });

        // ── Step D: Allow brief window for hash/async token hydration ──────────
        const timer = setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (isMounted) {
            if (retrySession) {
              setCheckingSession(false);
              setSessionError(false);
            } else {
              console.warn("[RESET PASSWORD] No recovery session detected after verification window.");
              setSessionError(true);
              setCheckingSession(false);
            }
          }
          subscription.unsubscribe();
        }, 1200);

        return () => {
          clearTimeout(timer);
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("[RESET PASSWORD] Session verification exception:", err);
        if (isMounted) {
          setSessionError(true);
          setCheckingSession(false);
        }
      }
    }

    verifyRecoverySession();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

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
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <h3 className="text-sm font-extrabold text-foreground">Verifying recovery token...</h3>
          <p className="text-xs text-text-secondary font-medium">
            Please wait while we establish your secure session.
          </p>
        </div>
      </AuthCard>
    );
  }

  // ─── 5. RENDER INVALID / EXPIRED LINK STATE ───────────────────────────────────
  if (sessionError) {
    return (
      <AuthCard className="max-w-[460px] text-center p-8">
        <div className="flex flex-col items-center gap-5 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error ring-1 ring-error/20">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-foreground">Invalid or Expired Link</h3>
            <p className="text-xs text-text-secondary font-medium leading-relaxed max-w-xs mx-auto">
              {sessionErrorMessage}
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <Button variant="primary" className="w-full justify-center h-11 text-xs font-bold" asChild>
              <Link href="/forgot-password">
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Request New Reset Link
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-center h-11 text-xs font-bold" asChild>
              <Link href="/login">
                <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                Return to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  // ─── 6. RENDER PASSWORD UPDATE PANEL ─────────────────────────────────────────
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
