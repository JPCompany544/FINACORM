"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

/**
 * Lightweight, simple loading overlay.
 * Replaced heavy full-screen animations with a clean, minimal spinner and optional "Please wait...".
 */
export const AuthLoadingOverlay: React.FC<AuthLoadingOverlayProps> = ({
  isVisible,
  message = "Please wait...",
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-150 select-none p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center justify-center px-6 py-5 rounded-2xl bg-surface border border-border shadow-xl space-y-3 min-w-[160px]">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-xs font-semibold text-text-secondary text-center">
          {message && message.length < 35 ? message : "Please wait..."}
        </p>
      </div>
    </div>
  );
};
