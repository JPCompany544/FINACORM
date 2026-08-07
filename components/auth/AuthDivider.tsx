"use client";

import * as React from "react";

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label }) => (
  <div className="relative flex items-center gap-3 select-none" role="separator" aria-label={label}>
    <div className="flex-1 h-px bg-divider" />
    {label && (
      <span className="text-xs font-semibold text-muted-foreground shrink-0">
        {label}
      </span>
    )}
    <div className="flex-1 h-px bg-divider" />
  </div>
);
