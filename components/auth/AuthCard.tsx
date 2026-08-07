"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  header?: React.ReactNode;
  description?: React.ReactNode;
  form?: React.ReactNode;
  footer?: React.ReactNode;
  social?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  header,
  description,
  form,
  footer,
  social,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full max-w-[460px] rounded-custom-xl border border-border bg-surface shadow-floating p-8 sm:p-10 flex flex-col gap-6",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          {(header || description) && (
            <div className="space-y-2">
              {header}
              {description}
            </div>
          )}
          {form && <div className="w-full">{form}</div>}
          {social && <div className="w-full">{social}</div>}
          {footer && <div className="w-full">{footer}</div>}
        </>
      )}
    </div>
  );
};
