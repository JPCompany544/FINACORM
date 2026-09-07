"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";
import { BRAND_NAME } from "@/constants";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

/**
 * Enterprise-grade, mature loading animation overlay for background auth activities
 * (Sign up, Sign in, Sign out, and Session Hydration).
 * Features glassmorphism, glowing aura rings, shimmer progress line, and dynamic feedback.
 */
export const AuthLoadingOverlay: React.FC<AuthLoadingOverlayProps> = ({
  isVisible,
  message = "Authenticating secure session...",
  subMessage = `${BRAND_NAME} Enterprise Security Vault`,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="auth-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xl select-none p-6 text-white"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex flex-col items-center max-w-sm text-center space-y-6"
          >
            {/* Animated Shield Logo Container */}
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Outer rotating aura ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/40"
              />

              {/* Inner glowing pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 rounded-full bg-primary/20 filter blur-sm"
              />

              {/* Central Badge */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-primary/30 shadow-2xl text-primary">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ShieldCheck className="w-8 h-8 text-primary" aria-hidden="true" />
                </motion.div>
              </div>

              {/* Tiny security badge indicator */}
              <div className="absolute -bottom-1 -right-1 z-20 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
                <Lock className="w-3 h-3" aria-hidden="true" />
              </div>
            </div>

            {/* Status & Subtext */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                {message}
              </h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {subMessage}
              </p>
            </div>

            {/* Glowing Shimmer Progress Bar */}
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
