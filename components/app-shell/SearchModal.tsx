"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, CreditCard, HelpCircle, History, Receipt, Users, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "./context";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  category: "Shortcuts" | "Transactions" | "Beneficiaries" | "Cards" | "Payments" | "Support";
  title: string;
  subtitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Shortcuts
  { id: "s-dash", category: "Shortcuts", title: "Go to Dashboard", subtitle: "Overview of your checking & savings", href: "/dashboard", icon: Compass },
  { id: "s-acc", category: "Shortcuts", title: "Go to Accounts", subtitle: "Manage accounts & view details", href: "/dashboard/accounts", icon: Compass },
  { id: "s-tran", category: "Shortcuts", title: "Go to Transfers", subtitle: "Move funds instantly", href: "/dashboard/transfers", icon: Compass },
  { id: "s-card", category: "Shortcuts", title: "Go to Cards", subtitle: "Freeze, unfreeze or order cards", href: "/dashboard/cards", icon: CreditCard },
  { id: "s-set", category: "Shortcuts", title: "Go to Settings", subtitle: "Security, notifications & profile", href: "/dashboard/settings", icon: Compass },
  
  // Transactions
  { id: "t-1", category: "Transactions", title: "Transfer to Sarah Jenkins", subtitle: "- $1,250.00 • Completed", href: "/dashboard/transactions", icon: History },
  { id: "t-2", category: "Transactions", title: "Netflix Membership", subtitle: "- $15.49 • Subscription", href: "/dashboard/transactions", icon: History },
  { id: "t-3", category: "Transactions", title: "APY Interest Credit", subtitle: "+ $42.15 • Earned Yield", href: "/dashboard/transactions", icon: History },
  { id: "t-4", category: "Transactions", title: "ATM Withdrawal Cash", subtitle: "- $100.00 • Completed", href: "/dashboard/transactions", icon: History },

  // Beneficiaries
  { id: "b-1", category: "Beneficiaries", title: "Sarah Jenkins", subtitle: "sarah.jenkins@example.com • Checking", href: "/dashboard/transfers", icon: Users },
  { id: "b-2", category: "Beneficiaries", title: "Alex Rivera", subtitle: "alex.rivera@example.com • Chase Bank", href: "/dashboard/transfers", icon: Users },
  { id: "b-3", category: "Beneficiaries", title: "David Miller", subtitle: "d.miller@example.com • Wells Fargo", href: "/dashboard/transfers", icon: Users },

  // Cards
  { id: "c-1", category: "Cards", title: "Northstar Black Metal Debit Card", subtitle: "Ending in •••• 4821 • Active", href: "/dashboard/cards", icon: CreditCard },
  { id: "c-2", category: "Cards", title: "Virtual Marketing Card", subtitle: "Ending in •••• 9210 • Frozen", href: "/dashboard/cards", icon: CreditCard },

  // Payments
  { id: "p-1", category: "Payments", title: "Pay Utility Bill", subtitle: "Electricity & gas standing order", href: "/dashboard/payments", icon: Receipt },
  { id: "p-2", category: "Payments", title: "Setup Rent Standing Order", subtitle: "Monthly recurring payment to landlord", href: "/dashboard/payments", icon: Receipt },

  // Support
  { id: "su-1", category: "Support", title: "Dispute a Card Charge", subtitle: "Report unauthorized debit transaction", href: "/dashboard/support", icon: HelpCircle },
  { id: "su-2", category: "Support", title: "Reset Card PIN Security", subtitle: "Change your physical card PIN code", href: "/dashboard/support", icon: HelpCircle },
  { id: "su-3", category: "Support", title: "Find Routing & Swift Code", subtitle: "Wire routing information for deposits", href: "/dashboard/support", icon: HelpCircle },
];

const ROTATING_PLACEHOLDERS = [
  "Search transactions...",
  "Search beneficiaries...",
  "Search cards...",
  "Search payments...",
  "Search support...",
];

export const SearchModal: React.FC = () => {
  const router = useRouter();
  const { searchOpen, setSearchOpen } = useSearch();
  const [query, setQuery] = React.useState("");
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Rotate placeholders every 3 seconds
  React.useEffect(() => {
    if (!searchOpen) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [searchOpen]);

  // Focus input on open
  React.useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [searchOpen]);

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return SEARCH_DATABASE.slice(0, 8); // show initial recommendations
    const normalized = query.toLowerCase().trim();
    return SEARCH_DATABASE.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized)
    );
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          router.push(filteredItems[selectedIndex].href);
          setSearchOpen(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSearchOpen(false);
      }
    },
    [filteredItems, selectedIndex, router, setSearchOpen]
  );

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-dark/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl rounded-custom-xl border border-border bg-surface shadow-modal overflow-hidden flex flex-col max-h-[70vh] outline-none"
            onKeyDown={handleKeyDown}
          >
            {/* Input Wrapper */}
            <div className="flex items-center px-4 py-3.5 border-b border-border/40 gap-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm font-semibold border-none focus:ring-0"
                aria-label="Search banking database"
              />
              <kbd className="hidden sm:inline-flex items-center h-5 select-none rounded border border-border bg-muted/20 px-1.5 font-mono text-[9px] font-bold text-muted-foreground shrink-0 uppercase">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="overflow-y-auto p-2 flex-1 max-h-[50vh] scrollbar-thin">
              {filteredItems.length > 0 ? (
                <div className="space-y-4">
                  {/* Group items by category if we are filtering, or just general lists */}
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
                      {query.trim() ? "Search Results" : "Suggested Actions"}
                    </div>
                    {filteredItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isSelected = idx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            router.push(item.href);
                            setSearchOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-custom-md text-left transition-all duration-150 group cursor-pointer outline-none",
                            isSelected
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-surface-hover text-foreground"
                          )}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={cn(
                                "p-2 rounded-xl border transition-colors shrink-0",
                                isSelected
                                  ? "bg-primary/10 border-primary/20 text-primary"
                                  : "bg-muted/10 border-border/40 text-muted-foreground"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{item.title}</div>
                              <div className="text-[11px] font-medium text-text-secondary truncate mt-0.5">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border/60 bg-muted/10 text-muted-foreground group-hover:border-primary/20 group-hover:text-primary transition-colors">
                              {item.category}
                            </span>
                            {isSelected && <ArrowRight className="h-4.5 w-4.5 text-primary shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <Search className="h-8 w-8 stroke-[1.5] text-muted-foreground/65" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">No matches found</p>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      We couldn't find anything matching "{query}".
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Hints */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/10 text-[10px] font-semibold text-muted-foreground select-none">
              <div className="flex items-center gap-3.5">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded border border-border bg-surface font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded border border-border bg-surface font-mono">Enter</kbd> Select
                </span>
              </div>
              <div>Northstar Global Ledger Search</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
