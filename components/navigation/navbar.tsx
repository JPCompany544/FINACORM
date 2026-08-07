"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Compass, ChevronRight, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Container } from "@/components/layout/container";
import { MARKETING_NAV_LINKS, BRAND_NAME } from "@/constants";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Scroll detection state
  const [scrolled, setScrolled] = React.useState(false);
  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // Search overlay state
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hydration-safe mounted flag
  const mounted = React.useSyncExternalStore(
    React.useCallback((cb) => {
      window.addEventListener("scroll", cb);
      return () => window.removeEventListener("scroll", cb);
    }, []),
    () => true,
    () => false
  );

  const closeMenu = () => setMobileOpen(false);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full h-20 flex items-center transition-all duration-300",
        scrolled
          ? "bg-surface/95 dark:bg-slate-950/90 border-b border-border/40 shadow-soft backdrop-blur-md"
          : "bg-transparent backdrop-blur-sm"
      )}
      role="banner"
    >
      <Container className="flex items-center justify-between w-full">
        {/* Left Section: Premium Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-3 font-extrabold text-lg text-foreground tracking-tight group outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg p-1"
            title="FINACORM Bank - Secure Banking Without Borders"
          >
            <img src="/Logo-main.png" alt="Logo" className="h-10 w-auto object-contain shrink-0 select-none" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-extrabold text-foreground group-hover:text-primary transition-colors text-base">
                {BRAND_NAME}
              </span>
              <span className="text-[9px] text-text-secondary font-bold tracking-wider mt-0.5 uppercase hidden sm:inline">
                Secure Banking Without Borders
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <nav
          className="hidden laptop:flex items-center justify-center h-full relative"
          aria-label="Primary Navigation"
        >
          <ul className="flex items-center space-x-1.5">
            {MARKETING_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="relative py-2">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2.5 text-nav font-semibold text-text-secondary hover:text-foreground transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-custom-md",
                      isActive && "text-primary"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Section: Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="text-text-secondary hover:text-foreground rounded-full w-10 h-10 shrink-0"
            aria-label="Open search index"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </Button>

          {/* Theme Switcher */}
          {mounted ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-text-secondary hover:text-foreground rounded-full w-10 h-10 shrink-0 hidden tablet:flex"
              aria-label="Toggle visual theme"
            >
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
          ) : (
            <div className="w-10 h-10 hidden tablet:block" aria-hidden="true" />
          )}

          {/* CTA Buttons */}
          <div className="hidden tablet:flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/register">Open Account</Link>
            </Button>
          </div>

          {/* Hamburger Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="laptop:hidden text-foreground w-10 h-10 shrink-0"
            aria-label="Expand mobile navigation drawer"
          >
            <Menu className="h-5.5 w-5.5" />
          </Button>
        </div>
      </Container>

      {/* Interactive Search Modal */}
      <Modal isOpen={searchOpen} onClose={() => setSearchOpen(false)} title="Search FINACORM Registry" size="lg">
        <div className="space-y-4">
          <Search
            placeholder="Type search queries (e.g. wire routing, checking cards)..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onClear={() => setSearchVal("")}
            autoFocus
          />
          <div className="text-caption text-muted-foreground p-1 font-medium">
            Press Esc key to exit modal search registry.
          </div>
        </div>
      </Modal>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden laptop:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-dark/30 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-surface border-l border-border/40 shadow-modal flex flex-col h-full z-10"
            >
              {/* Drawer Header */}
              <div className="flex h-20 items-center justify-between px-6 border-b border-border/40">
                <div className="flex items-center space-x-2.5">
                  <img src="/Logo-main.png" alt="Logo" className="h-4.5 w-auto object-contain shrink-0 select-none" />
                  <span className="font-extrabold text-sm text-primary uppercase tracking-wider">{BRAND_NAME}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={closeMenu} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Drawer Body Nav Links */}
              <div className="flex-1 p-6 overflow-y-auto space-y-8">
                <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
                  {MARKETING_NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={cn(
                          "flex items-center justify-between p-3.5 rounded-custom-md text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                          isActive ? "bg-primary/5 text-primary" : "text-text-secondary hover:bg-surface-hover hover:text-foreground"
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Drawer CTA Actions */}
                <div className="pt-6 border-t border-border/40 space-y-3">
                  <Button variant="outline" className="w-full justify-center text-sm" asChild onClick={closeMenu}>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button variant="primary" className="w-full justify-center text-sm" asChild onClick={closeMenu}>
                    <Link href="/register">Open Account</Link>
                  </Button>
                </div>
              </div>

              {/* Drawer Footer Theme Preference Toggle */}
              <div className="p-6 border-t border-border/40 flex items-center justify-between bg-muted/5">
                <span className="text-xs font-semibold text-text-secondary">Theme Preference</span>
                {mounted ? (
                  <div className="flex items-center gap-1 bg-surface-hover p-1 rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={cn(
                        "p-1.5 rounded-full transition-colors cursor-pointer",
                        theme === "light" ? "bg-surface text-primary shadow-soft" : "text-muted-foreground"
                      )}
                      aria-label="Set light theme"
                    >
                      <Sun className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "p-1.5 rounded-full transition-colors cursor-pointer",
                        theme === "dark" ? "bg-surface text-primary shadow-soft" : "text-muted-foreground"
                      )}
                      aria-label="Set dark theme"
                    >
                      <Moon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-8 w-16" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
