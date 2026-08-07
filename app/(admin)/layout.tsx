"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShieldCheck, Users, BarChart3, Send, History, Percent } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { BRAND_NAME } from "@/constants";
import { ToastProvider } from "@/components/app-shell/Toast";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
        {/* Collapsible Sidebar - Desktop */}
        <Sidebar items={menuItems} isAdmin={true} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - shown on all screens */}
          <header className="flex h-16 items-center justify-between border-b border-border/40 bg-surface px-6 sticky top-0 z-30">
            <div className="flex items-center space-x-3 laptop:hidden">
              {/* Hamburger Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="text-foreground hover:text-primary hover:bg-surface-hover flex items-center justify-center rounded-custom-md w-9 h-9 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                aria-label="Open admin navigation drawer"
              >
                <Menu className="h-5.5 w-5.5" />
              </button>

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

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden laptop:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-dark/30 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-out Drawer Panel (From Left) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-surface border-r border-border/40 shadow-modal flex flex-col h-full z-10"
            >
              {/* Drawer Header */}
              <div className="flex h-16 items-center justify-between px-5 border-b border-border/40 shrink-0">
                <div className="flex items-center space-x-2">
                  <img src="/Logo-main.png" alt="Logo" className="h-6 w-6 object-contain shrink-0" />
                  <span className="font-extrabold text-sm text-primary uppercase tracking-wider">
                    {BRAND_NAME} Admin
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-surface-hover flex items-center justify-center rounded-custom-md w-9 h-9 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  aria-label="Close menu"
                >
                  <X className="h-5.5 w-5.5" />
                </button>
              </div>

              {/* Drawer Body Nav Links */}
              <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-semibold rounded-custom-md transition-all space-x-3 cursor-pointer outline-none",
                        isActive
                          ? "bg-primary/5 text-primary"
                          : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Footer */}
              <div className="p-4 border-t border-border/40 shrink-0">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm font-semibold rounded-custom-md text-text-secondary hover:bg-error/5 hover:text-error transition-all space-x-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-error/20"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Log Out</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastProvider>
  );
}
