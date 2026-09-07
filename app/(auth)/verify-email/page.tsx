"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { BRAND_NAME } from "@/constants";

const STEPS = (brand: string) => [
  `Open the email sent from ${brand}.`,
  'Click the "Verify Email Address" button inside.',
  "You will be securely redirected to complete your account setup.",
];

export default function VerifyEmailPage() {
  const [resent, setResent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  const handleResend = () => {
    setResent(true);
    setCountdown(60);
  };

  React.useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <AuthCard className="max-w-[460px]">
      {/* Animated envelope */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20"
        >
          <Mail className="h-7 w-7 stroke-[1.75]" aria-hidden="true" />
        </motion.div>
      </div>

      <AuthHeader
        title="Check Your Inbox"
        description={`We've dispatched a secure verification link to your email address. Please follow the instructions to activate your ${BRAND_NAME} account.`}
      />

      {/* Step-by-step instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" as const }}
        className="rounded-xl border border-border bg-muted/5 p-4 space-y-3"
      >
        {STEPS(BRAND_NAME).map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-extrabold text-primary">
              {i + 1}
            </span>
            <p className="text-xs font-medium text-text-secondary leading-relaxed pt-0.5">
              {step}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Professional Spam / Delivery Notice Box */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1.5 text-left"
      >
        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Email Delivery Notice</span>
        </div>
        <p className="text-xs text-text-secondary font-medium leading-relaxed">
          If you do not see the email in your primary inbox within 1–2 minutes, please inspect your <strong className="text-foreground font-bold">spam</strong>, <strong className="text-foreground font-bold">junk</strong>, or <strong className="text-foreground font-bold">promotions</strong> folder. Automated security messages may occasionally be misfiltered by email service providers.
        </p>
      </motion.div>

      {/* Resend Action */}
      <div className="space-y-3">
        <p className="text-center text-xs text-muted-foreground font-medium">
          {resent
            ? "Verification link dispatched. Please check your inbox and spam folder."
            : "Have not received your verification link yet?"}
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center h-11 font-bold"
          onClick={handleResend}
          disabled={countdown > 0}
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend Verification Email"}
        </Button>
      </div>

      <SecurityNotice message="Your account credentials and personal information are protected under bank-grade security standards." />

      <AuthFooter>
        <Link href="/login" className="text-primary hover:underline font-bold">
          ← Back to Sign In
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}

