"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface FormSuccessProps {
  message?: string;
  visible: boolean;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-success/25 bg-success/8 px-4 py-5 text-sm font-semibold text-success"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 20, delay: 0.05 }}
        >
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </motion.div>
        <span className="text-base font-bold">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);
