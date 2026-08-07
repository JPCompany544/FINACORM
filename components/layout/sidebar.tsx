"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ChevronLeft, ChevronRight, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/constants";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarProps {
  items: SidebarItem[];
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, isAdmin = false }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "hidden laptop:flex flex-col border-r border-border/45 bg-surface transition-all duration-300 relative select-none",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center px-4 border-b border-border/40 justify-between overflow-hidden">
        <Link
          href="/"
          className={cn(
            "flex items-center space-x-2 font-extrabold text-lg text-primary tracking-tight shrink-0 transition-all duration-300",
            collapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100"
          )}
        >
          <img src="/Logo-main.png" alt="Logo" className="h-6 w-6 object-contain shrink-0" />
          <span>
            {BRAND_NAME}
            {isAdmin && (
              <span className="text-[9px] bg-primary/10 px-1.5 py-0.5 rounded font-bold uppercase ml-1">
                Admin
              </span>
            )}
          </span>
        </Link>
        {collapsed && (
          <img src="/Logo-main.png" alt="Logo" className="h-6 w-6 object-contain mx-auto shrink-0 transition-all duration-300" />
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-semibold rounded-custom-md transition-all group relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                isActive
                  ? "bg-primary/5 text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-foreground",
                collapsed ? "justify-center" : "space-x-3"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 rounded bg-dark text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap uppercase tracking-wider">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle trigger button */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-20 right-0 translate-x-1/2 p-1.5 rounded-full border border-border bg-surface text-text-secondary hover:text-foreground shadow-soft hover:shadow-medium transition-all cursor-pointer z-40 outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Logout footer button */}
      <div className="p-3 border-t border-border/40">
        <Link
          href="/login"
          className={cn(
            "flex items-center px-3 py-2.5 text-sm font-semibold rounded-custom-md text-text-secondary hover:bg-error/5 hover:text-error transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-error/20",
            collapsed ? "justify-center" : "space-x-3"
          )}
          title={collapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </Link>
      </div>
    </aside>
  );
};
