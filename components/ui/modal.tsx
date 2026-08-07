"use client";

import * as React from "react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-10 w-full rounded-custom-lg border border-border bg-surface shadow-modal overflow-hidden flex flex-col max-h-[90vh]",
              size === "sm" && "max-w-sm",
              size === "md" && "max-w-md",
              size === "lg" && "max-w-lg",
              size === "xl" && "max-w-2xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider select-none">
                {title || "Modal Dialog"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Confirmation Modal Content ---
export interface ConfirmationModalProps extends Omit<ModalProps, "children"> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: "primary" | "success" | "danger";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "primary",
  size = "sm",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="space-y-6">
        <p className="text-sm text-text-secondary leading-relaxed font-semibold">{message}</p>
        <div className="flex justify-end gap-2.5 pt-2 border-t border-border/40">
          <Button variant="outline" size="sm" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Delete Alert Modal Content ---
export interface DeleteModalProps extends Omit<ModalProps, "children"> {
  message: string;
  onDelete: () => void;
  confirmText?: string;
  itemName?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  title = "Delete Record",
  message,
  onDelete,
  confirmText = "Delete Permanently",
  itemName,
  size = "sm",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="p-3 bg-error/10 text-error rounded-full shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-text-secondary leading-relaxed font-semibold">
              {message}{" "}
              {itemName && (
                <span className="font-extrabold text-foreground underline decoration-error/50">
                  {itemName}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Warning: This administrative action is permanent and cannot be rolled back in the ledger registry.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-border/40">
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={onClose}>
            Keep Record
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Success Overlay Modal ---
export interface SuccessModalProps extends Omit<ModalProps, "children"> {
  message: string;
  actionText?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Success",
  message,
  actionText = "Continue",
  size = "sm",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="flex flex-col items-center justify-center text-center space-y-5 py-4">
        <div className="p-4 bg-success/10 text-success rounded-full animate-bounce">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h4 className="text-base font-bold text-foreground">Action Completed</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-semibold">{message}</p>
        </div>
        <Button variant="primary" size="sm" className="w-full max-w-[12rem] justify-center mt-2" onClick={onClose}>
          {actionText}
        </Button>
      </div>
    </Modal>
  );
};

// --- Information Overlay Modal ---
export interface InfoModalProps extends Omit<ModalProps, "children"> {
  message: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title = "Notice Details",
  message,
  size = "sm",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="flex flex-col items-center justify-center text-center space-y-5 py-4">
        <div className="p-4 bg-info/10 text-info rounded-full">
          <Info className="h-10 w-10" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h4 className="text-base font-bold text-foreground">Reference Notice</h4>
          <p className="text-xs text-text-secondary leading-relaxed font-semibold">{message}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full max-w-[12rem] justify-center mt-2" onClick={onClose}>
          Acknowledge
        </Button>
      </div>
    </Modal>
  );
};

// --- Side Drawer Component ---
export interface DrawerProps extends Omit<ModalProps, "size"> {
  side?: "left" | "right";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  side = "right",
  children,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Container */}
          <div className={cn("fixed inset-y-0 z-10 flex max-w-full", side === "right" ? "right-0" : "left-0")}>
            <motion.div
              initial={{ x: side === "right" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: side === "right" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-surface border-l border-border/40 shadow-modal flex flex-col h-full animate-in"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider select-none">
                  {title || "Drawer Panel"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
