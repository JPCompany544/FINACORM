"use client";

import * as React from "react";
import { Lock } from "lucide-react";

interface SecurityNoticeProps {
  message: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({ message }) => (
  <div className="flex items-start gap-2.5 text-[11px] font-medium text-muted-foreground/80 leading-relaxed select-none">
    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/50" aria-hidden="true" />
    <span>{message}</span>
  </div>
);
