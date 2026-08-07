"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, id }) => (
  <AnimatePresence mode="wait">
    {message && (
      <motion.div
        key={message}
        id={id}
        role="alert"
        aria-live="polite"
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" as const }}
        className="flex items-start gap-3 rounded-xl border border-error/25 bg-error/8 px-4 py-3 text-sm font-medium text-error"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);
