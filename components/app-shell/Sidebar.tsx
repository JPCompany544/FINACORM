"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, LogOut, ChevronLeft, ChevronRight, Menu, X, ArrowUpRight } from "lucide-react";
import { useSidebar } from "./context";
import { useProfile } from "./context";
import { useToast } from "./Toast";
import { BANKING_NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/constants";
import { useLogout } from "@/hooks/useLogout";
import Image from "next/image";

export const Sidebar: React.FC<{ className?: string; isMobile?: boolean }> = ({
  className,
  isMobile = false,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const { handleLogout, loading } = useLogout();
  const profile = useProfile();

  const initials = profile
    ? `${profile.first_name[0] ?? ""}${profile.last_name[0] ?? ""}`.toUpperCase()
    : "N";
  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : "Northstar User";

  const onLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleLogout();
    if (isMobile) setMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border/40 select-none">
      {/* ─── SIDEBAR HEADER ─────────────────────────────────────────────────── */}
      <div className="h-18 flex items-center px-5 border-b border-border/30 justify-between shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-[15px] tracking-tight text-primary outline-none focus-visible:ring-1 focus-visible:ring-primary/45 rounded-sm"
          onClick={() => {
            if (isMobile) setMobileOpen(false);
          }}
        >
          <img src="/Logo-main.png" alt="Logo" className="h-5.5 w-5.5 object-contain shrink-0" />
          <AnimatePresence mode="wait">
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-black text-foreground text-base tracking-wider uppercase"
              >
                {BRAND_NAME}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>


        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="laptop:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none"
            aria-label="Close sidebar menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ─── NAVIGATION LINKS ───────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 hide-scrollbar">
        {BANKING_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : (pathname === item.href || pathname.startsWith(item.href + "/"));

          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={Icon}
              isActive={isActive}
              collapsed={collapsed && !isMobile}
              badge={item.badge}
              onClick={() => {
                if (isMobile) setMobileOpen(false);
              }}
            />
          );
        })}
      </nav>

      {/* ─── USER PROFILE BOTTOM BLOCK ──────────────────────────────────────── */}
      <div className="p-4 border-t border-border/30 shrink-0 bg-muted/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* User Avatar */}
            <div className="h-10 w-10 rounded-full border border-border/60 bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 relative select-none overflow-hidden">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                initials
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface z-10" />
            </div>

            {/* Profile Detail */}
            <AnimatePresence mode="wait">
              {(!collapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0 flex-grow"
                >
                  <div className="text-xs font-extrabold text-foreground truncate">{displayName}</div>
                  <div className="text-[10px] font-bold text-text-secondary truncate">
                    Premium Account
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button */}
          {(!collapsed || isMobile) && (
            <button
              onClick={onLogoutClick}
              disabled={loading}
              className="p-2 rounded-lg border border-border/40 text-muted-foreground hover:text-error hover:border-error/25 hover:bg-error/5 transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-error/20 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Log Out"
              aria-label="Secure Logout"
            >
              <LogOut className={cn("h-4 w-4", loading && "animate-pulse")} />
            </button>
          )}
        </div>

        {/* Collapsed logout link */}
        {collapsed && !isMobile && (
          <button
            onClick={onLogoutClick}
            disabled={loading}
            className="w-full mt-3 flex justify-center py-2.5 rounded-xl text-muted-foreground hover:text-error hover:bg-error/5 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            title="Log Out"
            aria-label="Secure Logout"
          >
            <LogOut className={cn("h-4.5 w-4.5", loading && "animate-pulse")} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Container */}
      {!isMobile && (
        <aside
          onMouseEnter={() => setCollapsed(false)}
          onMouseLeave={() => setCollapsed(true)}
          className={cn(
            "hidden laptop:flex flex-col sticky top-0 h-screen transition-all duration-300 z-30 shrink-0",
            collapsed ? "w-[88px]" : "w-[280px]",
            className
          )}
        >
          {navContent}
        </aside>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobile && (
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex laptop:hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-dark/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
              />

              {/* Sidebar Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative z-10 w-full max-w-[280px] h-full flex flex-col"
              >
                {navContent}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

// ─── NAV ITEM SUBCOMPONENT ────────────────────────────────────────────────────

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  collapsed: boolean;
  badge?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  label,
  icon: Icon,
  isActive,
  collapsed,
  badge,
  onClick,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex items-center rounded-custom-lg text-sm font-semibold transition-all duration-150 relative group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
        isActive
          ? "bg-primary/5 text-primary"
          : "text-text-secondary hover:bg-surface-hover hover:text-foreground",
        collapsed ? "justify-center py-3 px-0" : "px-3.5 py-2.5 gap-3"
      )}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />

      {/* Expand label */}
      {!collapsed && (
        <span className="flex-grow truncate transition-colors font-bold text-xs tracking-tight">
          {label}
        </span>
      )}

      {/* Item badge */}
      {!collapsed && badge && (
        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/25 shrink-0 uppercase tracking-wide">
          {badge}
        </span>
      )}

      {/* Custom tooltip in collapsed mode */}
      {collapsed && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" as const }}
              className="absolute left-full ml-4 px-3 py-1.5 rounded-lg border border-border/80 bg-surface shadow-modal text-[10px] font-extrabold text-foreground pointer-events-none z-50 whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>{label}</span>
              {badge && (
                <span className="text-[8px] px-1 rounded bg-accent/20 text-accent font-black border border-accent/30 scale-90 origin-left">
                  {badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Link>
  );
};
