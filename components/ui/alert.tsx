"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertProps {
  className?: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  title,
  description,
  variant = "info",
  dismissible = false,
  onDismiss,
}) => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const IconMap = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = IconMap[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex w-full gap-3.5 p-4 rounded-custom-md border transition-all text-sm",
        variant === "success" && "bg-success/5 border-success/20 text-success",
        variant === "error" && "bg-error/5 border-error/20 text-error",
        variant === "warning" && "bg-warning/5 border-warning/20 text-warning",
        variant === "info" && "bg-info/5 border-info/20 text-info",
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <h5 className="font-bold text-foreground leading-none">{title}</h5>
        {description && (
          <p className="text-xs text-text-secondary leading-normal">{description}</p>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors self-start cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
