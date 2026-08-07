"use client";

import * as React from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/constants";

interface AuthBrandProps {
  className?: string;
  light?: boolean;
}

export const AuthBrand: React.FC<AuthBrandProps> = ({ className, light = false }) => {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight transition-opacity hover:opacity-90 select-none",
        light ? "text-white" : "text-primary",
        className
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl ring-1 transition-colors select-none overflow-hidden",
          light
            ? "bg-white/10 text-white ring-white/20"
            : "bg-primary/10 text-primary ring-primary/20"
        )}
      >
        <img src="/Logo-main.png" alt="Logo" className="h-6 w-6 object-contain" />
      </span>
      <span>{BRAND_NAME}</span>
    </Link>
  );
};
