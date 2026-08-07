"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PASSWORD_STRENGTH_LABELS } from "@/constants/auth";

// ─── Rules ────────────────────────────────────────────────────────────────────

export interface PasswordRule {
  id: string;
  label: string;
  test: (v: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length",  label: "At least 8 characters",    test: (v) => v.length >= 8 },
  { id: "upper",   label: "One uppercase letter",      test: (v) => /[A-Z]/.test(v) },
  { id: "lower",   label: "One lowercase letter",      test: (v) => /[a-z]/.test(v) },
  { id: "number",  label: "One number",                test: (v) => /[0-9]/.test(v) },
  { id: "special", label: "One special character",     test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/** Returns 0 (empty) – 5 (all rules met) */
export function getStrengthScore(password: string): number {
  if (!password) return 0;
  return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

// ─── Colour mapping (index = score - 1) ──────────────────────────────────────

const STRENGTH_META = [
  { bar: "bg-error",   text: "text-error",   label: PASSWORD_STRENGTH_LABELS[0] },
  { bar: "bg-warning", text: "text-warning",  label: PASSWORD_STRENGTH_LABELS[1] },
  { bar: "bg-accent",  text: "text-accent",   label: PASSWORD_STRENGTH_LABELS[2] },
  { bar: "bg-success", text: "text-success",  label: PASSWORD_STRENGTH_LABELS[3] },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface PasswordStrengthProps {
  password: string;
  visible: boolean;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, visible }) => {
  const score = getStrengthScore(password);
  const meta  = score > 0 ? STRENGTH_META[Math.min(score - 1, 3)] : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" as const }}
          className="overflow-hidden"
        >
          <div className="pt-3 space-y-3">

            {/* ── Segmented bar ────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <div
                className="flex flex-1 gap-1.5"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={score}
                aria-label="Password strength"
              >
                {[1, 2, 3, 4, 5].map((seg) => (
                  <div key={seg} className="flex-1 h-1 rounded-full bg-divider overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", score >= seg && meta ? meta.bar : "bg-transparent")}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: score >= seg ? 1 : 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" as const, delay: seg * 0.04 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                ))}
              </div>

              {meta && (
                <motion.span
                  key={meta.label}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("text-xs font-bold w-12 text-right shrink-0", meta.text)}
                >
                  {meta.label}
                </motion.span>
              )}
            </div>

            {/* ── Per-rule checklist ───────────────────────────────── */}
            <ul className="grid grid-cols-1 gap-1.5" aria-label="Password requirements">
              {PASSWORD_RULES.map((rule) => {
                const met = rule.test(password);
                return (
                  <li key={rule.id} className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: met ? [1.3, 1] : 1 }}
                      transition={{ duration: 0.22 }}
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        met
                          ? "border-success bg-success/10 text-success"
                          : "border-border bg-muted/10 text-muted-foreground"
                      )}
                    >
                      {met
                        ? <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                        : <X className="h-2.5 w-2.5" />}
                    </motion.span>
                    <span className={cn(
                      "text-xs font-medium transition-colors duration-150",
                      met ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {rule.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
