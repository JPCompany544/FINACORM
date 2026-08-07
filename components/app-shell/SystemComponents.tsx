"use client";

import * as React from "react";
import { AlertOctagon, RotateCcw, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

// ─── LOADING OVERLAY ──────────────────────────────────────────────────────────

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Processing secure ledger request...",
  className,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-[99] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md select-none",
            className
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center p-6">
            <Spinner size="lg" />

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm font-bold text-foreground"
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── ERROR STATE PANEL ────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
  retryText?: string;
  backText?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Secure Ledger Interrupted",
  description = "A connection drop occurred while synchronizing ledger records. Please refresh to try again.",
  onRetry,
  onBack,
  retryText = "Try Again",
  backText = "Return to Overview",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-custom-xl border border-border bg-surface/40 max-w-md mx-auto my-12 space-y-5 select-none",
        className
      )}
    >
      <div className="p-4 bg-error/10 border border-error/20 rounded-full text-error">
        <AlertOctagon className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm laptop:text-base font-extrabold text-foreground">{title}</h4>
        <p className="text-xs text-text-secondary leading-relaxed font-semibold">
          {description}
        </p>
      </div>

      {(onRetry || onBack) && (
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-2">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center text-xs font-bold"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backText}
            </Button>
          )}
          {onRetry && (
            <Button
              variant="primary"
              size="sm"
              className="w-full justify-center text-xs font-bold"
              onClick={onRetry}
            >
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              {retryText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
