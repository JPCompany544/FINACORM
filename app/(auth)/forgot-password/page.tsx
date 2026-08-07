"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { FormError } from "@/components/auth/FormError";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { AUTH_FORGOT_PASSWORD_CONTENT, AUTH_VALIDATION } from "@/constants/auth";

import { usePasswordReset } from "@/hooks/usePasswordReset";

// ─── Validation ───────────────────────────────────────────────────────────────

function validateEmail(value: string): string {
  if (!value.trim()) return AUTH_VALIDATION.emailRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return AUTH_VALIDATION.emailInvalid;
  return "";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerResetLink, loading, success, error, setError } = usePasswordReset();

  const [email, setEmail]           = React.useState("");
  const [touched, setTouched]       = React.useState(false);
  const [resendCountdown, setResendCountdown] = React.useState(0);

  // Surface invalid session token warnings on load
  React.useEffect(() => {
    if (searchParams.get("error") === "invalid_session") {
      setError("Your password reset link has expired or is invalid. Please request a new one.");
    }
  }, [searchParams, setError]);

  // ── Derived state ───────────────────────────────────────────────────────────
  const emailError   = touched ? validateEmail(email) : "";
  const isFormValid  = !validateEmail(email);
  const isLoading    = loading;
  const isSuccess    = success;

  // ── Resend countdown ────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid) return;

    await triggerResetLink(email);
    setResendCountdown(60);
  };

  // ── Resend ──────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCountdown > 0) return;
    await triggerResetLink(email);
    setResendCountdown(60);
  };

  return (
    <AuthCard className="max-w-[460px]">

      {/* ── Badge ─────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary select-none"
        >
          <KeyRound className="h-3 w-3" aria-hidden="true" />
          {AUTH_FORGOT_PASSWORD_CONTENT.badge}
        </motion.span>
      </div>

      {/* ── Main content — form OR success state ──────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ══════════ SUCCESS STATE ══════════ */}
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success ring-1 ring-success/20"
            >
              <MailCheck className="h-7 w-7 stroke-[1.75]" aria-hidden="true" />
            </motion.div>

            {/* Heading & body */}
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {AUTH_FORGOT_PASSWORD_CONTENT.successHeading}
              </h2>
              <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-sm mx-auto">
                {AUTH_FORGOT_PASSWORD_CONTENT.successSupporting}
              </p>
            </div>

            {/* Sent-to indicator */}
            <div className="w-full rounded-xl border border-border bg-muted/5 px-4 py-3 text-sm font-semibold text-foreground text-center">
              {email}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col w-full gap-3">
              <motion.div whileTap={{ scale: 0.985 }} transition={{ duration: 0.12 }}>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full justify-center h-11 font-bold"
                  onClick={handleResend}
                  isLoading={isLoading}
                  disabled={resendCountdown > 0 || isLoading}
                >
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : AUTH_FORGOT_PASSWORD_CONTENT.resendLabel}
                </Button>
              </motion.div>

              <Link
                href={AUTH_FORGOT_PASSWORD_CONTENT.backToLoginHref}
                className="flex h-11 w-full items-center justify-center rounded-custom-md border border-border bg-surface text-sm font-bold text-foreground transition-all duration-150 hover:bg-surface-hover hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {AUTH_FORGOT_PASSWORD_CONTENT.backToLoginLabel}
              </Link>
            </div>

            {/* Helper text */}
            <p className="text-xs text-muted-foreground/80 font-medium leading-relaxed max-w-xs mx-auto">
              {AUTH_FORGOT_PASSWORD_CONTENT.successHelper}
            </p>
          </motion.div>

        ) : (
        /* ══════════ FORM STATE ══════════ */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5"
          >
            {/* Header */}
            <AuthHeader
              title={AUTH_FORGOT_PASSWORD_CONTENT.heading}
              description={AUTH_FORGOT_PASSWORD_CONTENT.supporting}
            />

            {/* Server error */}
            <FormError
              id="forgot-error"
              message={error || undefined}
            />

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Password recovery form"
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <Input
                id="recovery-email"
                name="email"
                type="email"
                label={AUTH_FORGOT_PASSWORD_CONTENT.emailLabel}
                placeholder={AUTH_FORGOT_PASSWORD_CONTENT.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                onBlur={() => setTouched(true)}
                error={emailError}
                autoComplete="email"
                aria-describedby={emailError ? "recovery-email-error" : undefined}
                aria-invalid={!!emailError}
                disabled={isLoading}
                required
              />

              {/* Submit */}
              <motion.div whileTap={isLoading ? {} : { scale: 0.985 }} transition={{ duration: 0.12 }}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center h-12 text-sm font-bold"
                  isLoading={isLoading}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading
                    ? AUTH_FORGOT_PASSWORD_CONTENT.submitLoading
                    : AUTH_FORGOT_PASSWORD_CONTENT.submitIdle}
                </Button>
              </motion.div>

              {/* Back to login */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                <span>{AUTH_FORGOT_PASSWORD_CONTENT.backToLogin}</span>
                <Link
                  href={AUTH_FORGOT_PASSWORD_CONTENT.backToLoginHref}
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-sm"
                >
                  {AUTH_FORGOT_PASSWORD_CONTENT.backToLoginLink}
                </Link>
              </div>
            </form>

            {/* Security notice */}
            <SecurityNotice message={AUTH_FORGOT_PASSWORD_CONTENT.securityNotice} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card footer ───────────────────────────────────────────────── */}
      <AuthFooter>
        © {new Date().getFullYear()} Northstar Bank — All rights reserved.
      </AuthFooter>
    </AuthCard>
  );
}
