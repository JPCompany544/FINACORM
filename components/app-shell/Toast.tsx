"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  toasts: ToastMessage[];
  dismiss: (id: string) => void;
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (title: string, options?: { description?: string; type?: ToastType; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const type = options?.type || "info";
      const description = options?.description;
      const duration = options?.duration ?? 5000;

      const newToast: ToastMessage = { id, title, description, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = React.useCallback((title: string, description?: string) => {
    toast(title, { description, type: "success" });
  }, [toast]);

  const error = React.useCallback((title: string, description?: string) => {
    toast(title, { description, type: "error" });
  }, [toast]);

  const warning = React.useCallback((title: string, description?: string) => {
    toast(title, { description, type: "warning" });
  }, [toast]);

  const info = React.useCallback((title: string, description?: string) => {
    toast(title, { description, type: "info" });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, toasts, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// ─── CONTAINER COMPONENT ──────────────────────────────────────────────────────

const ToastContainer: React.FC<{ toasts: ToastMessage[]; dismiss: (id: string) => void }> = ({
  toasts,
  dismiss,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ─── CARD COMPONENT ───────────────────────────────────────────────────────────

const ToastCard: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const IconMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = IconMap[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="pointer-events-auto w-full bg-surface border border-border/80 rounded-custom-lg shadow-modal overflow-hidden p-4 flex gap-3 items-start select-none"
    >
      <div
        className={cn(
          "p-1.5 rounded-full shrink-0",
          toast.type === "success" && "bg-success/15 text-success",
          toast.type === "error" && "bg-error/15 text-error",
          toast.type === "warning" && "bg-warning/15 text-warning",
          toast.type === "info" && "bg-info/15 text-info"
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <h5 className="text-sm font-bold text-foreground leading-tight">{toast.title}</h5>
        {toast.description && (
          <p className="text-xs text-text-secondary leading-relaxed">{toast.description}</p>
        )}
      </div>

      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
};
