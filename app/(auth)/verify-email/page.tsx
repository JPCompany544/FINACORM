"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { SecurityNotice } from "@/components/auth/SecurityNotice";

const STEPS = [
  "Open the email from Northstar Bank.",
  'Click the "Verify Email Address" button.',
  "You'll be redirected to complete your account setup.",
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
        title="Check Your Email"
        description="We've sent a verification link to your email address. Click the link to activate your Northstar Bank account."
      />

      {/* Step-by-step instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" as const }}
        className="rounded-xl border border-border bg-muted/5 p-4 space-y-3"
      >
        {STEPS.map((step, i) => (
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

      {/* Resend */}
      <div className="space-y-3">
        <p className="text-center text-xs text-muted-foreground font-medium">
          {resent
            ? "Verification email resent. Please check your inbox."
            : "Didn't receive the email? Check your spam folder or resend below."}
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

      <SecurityNotice message="Your information is protected using bank-level encryption and secure authentication standards." />

      <AuthFooter>
        <Link href="/login" className="text-primary hover:underline font-bold">
          ← Back to Sign In
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}
