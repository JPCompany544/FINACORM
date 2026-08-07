"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Plus,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  User,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useSidebar, useSearch, useNotifications } from "./context";
import { useProfile } from "./context";
import { useToast } from "./Toast";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useLogout";
import Image from "next/image";
import { loadTawkSupport } from "@/lib/tawk";

// Helper to map route path to breadcrumb & page title
function getPageMetaData(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return { breadcrumb: "Home", title: "Welcome" };

  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  // Capitalize segments for breadcrumb
  const formattedBreadcrumb = segments
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("  /  ");

  // Determine friendly titles
  let title = "Overview";
  if (lastSegment === "accounts") title = "Account Ledger";
  else if (lastSegment === "transfers") title = "Money Transfer";
  else if (lastSegment === "cards") title = "Card Center";
  else if (lastSegment === "settings") title = "Account Settings";
  else if (lastSegment === "investments") title = "Yield & Markets";
  else if (lastSegment === "payments") title = "Payments & Bills";
  else if (lastSegment === "loans") title = "Lending & Mortgages";
  else if (lastSegment === "transactions") title = "Activity Journal";
  else if (lastSegment === "beneficiaries") title = "Beneficiaries Contacts";
  else if (lastSegment === "support") title = "Support Center";
  else {
    title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }

  return { breadcrumb: formattedBreadcrumb, title };
}

export const TopNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toggleMobileSidebar } = useSidebar();
  const { toggleSearch } = useSearch();
  const { toggleNotifications, unreadCount } = useNotifications();
  const { success } = useToast();
  const { handleLogout, loading } = useLogout();
  const profile = useProfile();

  const initials = profile
    ? `${profile.first_name[0] ?? ""}${profile.last_name[0] ?? ""}`.toUpperCase()
    : "N";
  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : "Northstar User";

  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = React.useState(false);

  const profileRef = React.useRef<HTMLDivElement>(null);
  const quickRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setQuickCreateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const meta = getPageMetaData(pathname);

  const onLogoutClick = async () => {
    setProfileDropdownOpen(false);
    await handleLogout();
  };

  return (
    <header className="sticky top-0 h-18 bg-surface/85 dark:bg-dark/85 backdrop-blur-md border-b border-border/40 px-5 flex items-center justify-between z-20 shrink-0 select-none">
      
      {/* ─── LEFT: MOBILE HAMBURGER + BREADCRUMBS ─────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Hamburger Mobile Trigger */}
        <button
          onClick={toggleMobileSidebar}
          className="laptop:hidden p-2 -ml-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
          aria-label="Open navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Path Breadcrumbs */}
        <div className="hidden sm:flex flex-col">
          <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">
            {meta.breadcrumb}
          </div>
          <h1 className="text-[15px] font-black text-foreground mt-1 leading-none">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* ─── CENTER: SEARCH BAR TRIGGER ───────────────────────────────────── */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          onClick={toggleSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-custom-lg border border-border/60 bg-muted/5 hover:border-border/80 hover:bg-muted/10 transition-all text-muted-foreground text-xs font-semibold select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span>Search ledger, contacts, cards...</span>
          </div>
          <kbd className="inline-flex items-center h-4.5 rounded border border-border/60 bg-surface px-1.5 font-mono text-[9px] text-muted-foreground font-black uppercase">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* ─── RIGHT: ACTIONS BAR ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        
        {/* Mobile Search Button */}
        <button
          onClick={toggleSearch}
          className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Search"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        {/* Quick Create Dropdown (+) */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
            className="h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-label="Quick action transaction options"
            aria-expanded={quickCreateOpen}
          >
            <Plus className="h-5 w-5" />
          </button>

          <AnimatePresence>
            {quickCreateOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-custom-xl border border-border bg-surface shadow-modal overflow-hidden p-1.5 z-30"
              >
                <div className="px-3 py-1.5 text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest border-b border-border/40 select-none">
                  Quick Actions
                </div>
                {[
                  { label: "Send Outward Wire", sub: "Transfer money to contacts", href: "/dashboard/transfers" },
                  { label: "Pay Utility Invoice", sub: "Clear outstanding bills", href: "/dashboard/payments" },
                  { label: "Request Ledger Payment", sub: "Create deposit link", href: "/dashboard/transfers" },
                  { label: "Order Platinum Card", sub: "Order physical metal", href: "/dashboard/cards" },
                ].map((act, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push(act.href);
                    }}
                    className="w-full text-left px-3 py-2 rounded-custom-lg hover:bg-surface-hover transition-colors group cursor-pointer outline-none"
                  >
                    <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {act.label}
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5 truncate">
                      {act.sub}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Icon Bell */}
        <button
          onClick={toggleNotifications}
          className="relative h-9 w-9 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/10 flex items-center justify-center transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
          aria-label="Open notifications list"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-primary" />
          )}
        </button>

        {/* Messages Drawer Placeholder */}
        <button
          onClick={loadTawkSupport}
          className="h-9 w-9 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/10 flex items-center justify-center transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
          aria-label="Concierge Live Chat"
        >
          <MessageSquare className="h-4.5 w-4.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-xl border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/10 flex items-center justify-center transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
          aria-label="Toggle visual theme mode"
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-border/50 mx-1.5" />

        {/* User Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-1.5 outline-none group cursor-pointer focus-visible:ring-1 focus-visible:ring-primary/20 p-0.5 rounded-xl"
            aria-expanded={profileDropdownOpen}
            aria-label="User Account Menu"
          >
            <div className="h-9 w-9 rounded-xl border border-border bg-primary/5 hover:bg-primary/10 flex items-center justify-center font-extrabold text-xs text-primary transition-all relative select-none overflow-hidden">
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
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </button>

          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 rounded-custom-xl border border-border bg-surface shadow-modal overflow-hidden p-1.5 z-30"
              >
                <div className="px-3.5 py-2 border-b border-border/30 mb-1 select-none">
                  <div className="text-xs font-black text-foreground">{displayName}</div>
                  <div className="text-[10px] font-bold text-text-secondary mt-0.5">
                    nnamdi.o@northstar.bank
                  </div>
                </div>
                {[
                  { label: "My Profile", icon: User, href: "/dashboard/settings" },
                  { label: "Security & PIN", icon: Shield, href: "/dashboard/settings" },
                  { label: "Preferences", icon: Settings, href: "/dashboard/settings" },
                  { label: "Help & FAQ", icon: HelpCircle, href: "/dashboard/support" },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      router.push(item.href);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-custom-lg text-xs font-bold text-foreground hover:bg-surface-hover hover:text-primary transition-colors cursor-pointer outline-none"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="h-px bg-border/40 my-1" />
                <button
                  onClick={onLogoutClick}
                  disabled={loading}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-custom-lg text-xs font-bold text-error hover:bg-error/5 transition-colors cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className={cn("h-4 w-4 shrink-0", loading && "animate-pulse")} />
                  <span>{loading ? "Signing Out..." : "Secure Sign Out"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
};
