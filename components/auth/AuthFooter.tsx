"use client";

import * as React from "react";

interface AuthFooterProps {
  children?: React.ReactNode;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ children }) => {
  return (
    <div className="text-center text-xs text-text-secondary font-semibold mt-6 pt-6 border-t border-divider select-none">
      {children}
    </div>
  );
};
