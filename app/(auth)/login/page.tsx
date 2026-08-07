"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input, Password, Checkbox } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AUTH_LOGIN_CONTENT, AUTH_VALIDATION } from "@/constants/auth";
import { signInUser } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthState = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  email?: string;
  password?: string;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateEmail(value: string): string {
  if (!value.trim()) return AUTH_VALIDATION.emailRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return AUTH_VALIDATION.emailInvalid;
  return "";
}

function validatePassword(value: string): string {
  if (!value) return AUTH_VALIDATION.passwordRequired;
  if (value.length < 8) return AUTH_VALIDATION.passwordMinLength;
  return "";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);
  const [touched, setTouched] = React.useState({ email: false, password: false });
  const [authState, setAuthState] = React.useState<AuthState>("idle");
  const [serverError, setServerError] = React.useState("");

  // ── Surface callback errors from the URL (?error=auth_callback) ────────────
  React.useEffect(() => {
    if (searchParams.get("error") === "auth_callback") {
      setAuthState("error");
      setServerError(
        "We could not verify your email. The link may have expired. Please sign in or request a new link."
      );
    }
  }, [searchParams]);

  // ── Derived validation ──────────────────────────────────────────────────────
  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const isFormValid = !validateEmail(email) && !validatePassword(password);

  // ── Real-time blur handlers ─────────────────────────────────────────────────
  const handleEmailBlur = () => setTouched((t) => ({ ...t, email: true }));
  const handlePasswordBlur = () => setTouched((t) => ({ ...t, password: true }));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Force-touch all fields to surface any remaining errors
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setAuthState("loading");
    setServerError("");

    const result = await signInUser({ email, password });

    if (result.success) {
      setAuthState("success");
      // Brief pause so the user sees the success state, then navigate
      await new Promise((r) => setTimeout(r, 900));
      router.push("/dashboard");
    } else {
      setAuthState("error");
      setServerError(
        result.error?.message ?? AUTH_LOGIN_CONTENT.errorMessage
      );
    }
  };

  // ── Keyboard: Enter submits ─────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && authState !== "loading") {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const isLoading = authState === "loading";
  const isSuccess = authState === "success";

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
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          {AUTH_LOGIN_CONTENT.badge}
        </motion.span>
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <AuthHeader
        title={AUTH_LOGIN_CONTENT.heading}
        description={AUTH_LOGIN_CONTENT.supporting}
      />

      {/* ── Success overlay (replaces form briefly before redirect) ─── */}
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            <FormSuccess
              visible={isSuccess}
              message={AUTH_LOGIN_CONTENT.successMessage}
            />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            noValidate
            aria-label="Sign in form"
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Server error ─────────────────────────────────── */}
            <FormError
              id="login-error"
              message={authState === "error" ? serverError : undefined}
            />

            {/* ── Email ────────────────────────────────────────── */}
            <Input
              id="login-email"
              name="email"
              type="email"
              label={AUTH_LOGIN_CONTENT.emailLabel}
              placeholder={AUTH_LOGIN_CONTENT.emailPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear server error when user starts editing
                if (authState === "error") {
                  setAuthState("idle");
                  setServerError("");
                }
              }}
              onBlur={handleEmailBlur}
              error={emailError}
              autoComplete="email"
              aria-describedby={emailError ? "email-error" : undefined}
              aria-invalid={!!emailError}
              disabled={isLoading}
              required
            />

            {/* ── Password + Forgot link ───────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-label text-text-secondary select-none">
                  {AUTH_LOGIN_CONTENT.passwordLabel}
                </span>
                <Link
                  href={AUTH_LOGIN_CONTENT.forgotPasswordHref}
                  tabIndex={0}
                  className="text-xs font-semibold text-primary transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 rounded-sm"
                >
                  {AUTH_LOGIN_CONTENT.forgotPassword}
                </Link>
              </div>
              <Password
                id="login-password"
                name="password"
                placeholder={AUTH_LOGIN_CONTENT.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authState === "error") {
                    setAuthState("idle");
                    setServerError("");
                  }
                }}
                onBlur={handlePasswordBlur}
                error={passwordError}
                autoComplete="current-password"
                aria-describedby={passwordError ? "password-error" : undefined}
                aria-invalid={!!passwordError}
                disabled={isLoading}
                required
              />
            </div>

            {/* ── Remember device ──────────────────────────────── */}
            <Checkbox
              id="remember-device"
              checked={remember}
              onCheckedChange={(checked) => setRemember(!!checked)}
              label={AUTH_LOGIN_CONTENT.rememberDevice}
              disabled={isLoading}
            />

            {/* ── Submit ───────────────────────────────────────── */}
            <motion.div
              whileTap={isLoading ? {} : { scale: 0.985 }}
              transition={{ duration: 0.12 }}
            >
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center h-12 text-sm font-bold"
                isLoading={isLoading}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading
                  ? AUTH_LOGIN_CONTENT.submitLoading
                  : AUTH_LOGIN_CONTENT.submitIdle}
              </Button>
            </motion.div>

            {/* ── Divider + Register CTA ───────────────────────── */}
            <AuthDivider label={AUTH_LOGIN_CONTENT.dividerText} />

            <Link
              href={AUTH_LOGIN_CONTENT.createAccountHref}
              className="flex h-11 w-full items-center justify-center rounded-custom-md border border-border bg-surface text-sm font-bold text-foreground transition-all duration-150 hover:bg-surface-hover hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {AUTH_LOGIN_CONTENT.createAccount}
            </Link>

            {/* ── Security notice ──────────────────────────────── */}
            <SecurityNotice message={AUTH_LOGIN_CONTENT.securityNotice} />
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Card footer ───────────────────────────────────────────────── */}
      <AuthFooter>
        © {new Date().getFullYear()} Northstar Bank — All rights reserved.
      </AuthFooter>
    </AuthCard>
  );
}
