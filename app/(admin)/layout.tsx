"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Users, BarChart3, Send, History, Percent } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { BRAND_NAME } from "@/constants";

import { ToastProvider } from "@/components/app-shell/Toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { label: "Overview", href: "/admin", icon: BarChart3 },
    { label: "Users Control", href: "/admin/users", icon: Users },
    { label: "Transfers Control", href: "/admin/transfers", icon: Send },
    { label: "Fees Control", href: "/admin/fees", icon: Percent },
    { label: "Ledger History", href: "/admin/transactions", icon: History },
    { label: "Security & Audits", href: "/admin/security", icon: ShieldCheck },
  ];

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-background">
      {/* Collapsible Sidebar */}
      <Sidebar items={menuItems} isAdmin={true} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - shown on all screens */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 bg-surface px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-3 laptop:hidden">
            <Link href="/" className="flex items-center space-x-2 font-extrabold text-lg text-primary tracking-tight">
              <img src="/Logo-main.png" alt="Logo" className="h-6 w-6 object-contain shrink-0" />
              <span>
                {BRAND_NAME}{" "}
                <span className="text-[8px] bg-primary/10 px-1.5 py-0.5 rounded font-bold uppercase ml-0.5">
                  Admin
                </span>
              </span>
            </Link>
          </div>

          <h2 className="hidden laptop:block text-base font-bold text-foreground">Global Administration</h2>

          <div className="flex items-center space-x-4 ml-auto">
            {/* User Profile Info */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center font-bold text-xs text-error">
                SA
              </div>
              <div className="hidden tablet:block text-left">
                <p className="text-xs font-bold leading-none text-foreground">System Admin</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Superuser Access</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
