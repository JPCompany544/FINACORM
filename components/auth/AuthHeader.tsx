"use client";

import * as React from "react";

interface AuthHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="space-y-2 text-center select-none">
      {title && (
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-sans">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-sm text-text-secondary font-medium leading-relaxed font-sans">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};
