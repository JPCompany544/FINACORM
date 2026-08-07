"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MOCK_QUICK_ACTIONS } from "@/constants/mock-dashboard";
import { useToast } from "@/components/app-shell";
import { cn } from "@/lib/utils";

export const QuickActions: React.FC = () => {
  const { success, info } = useToast();
  const router = useRouter();

  const handleAction = React.useCallback(
    (actionKey: string, label: string) => {
      if (actionKey === "transfer") {
        router.push("/dashboard/transfers");
      } else if (actionKey === "pay-bills") {
        router.push("/dashboard/payments");
      } else if (actionKey === "deposit") {
        router.push("/dashboard/accounts");
      } else if (actionKey === "exchange") {
        router.push("/dashboard/transfers");
      } else if (actionKey === "cards") {
        router.push("/dashboard/cards");
      } else if (actionKey === "request") {
        router.push("/dashboard/transfers");
      }
    },
    [router]
  );

  // Bind keyboard shortcuts globally
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is holding modifier keys (e.g. Ctrl + R for page refresh)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Ignore if user is typing in form/search input
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const action = MOCK_QUICK_ACTIONS.find((act) => act.shortcut === key);
      if (action) {
        e.preventDefault();
        handleAction(action.actionKey, action.label);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleAction]);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between select-none">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Quick Actions terminal
        </h3>
        <span className="text-[9px] font-bold text-muted-foreground uppercase">
          Press shortcut key directly
        </span>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        {MOCK_QUICK_ACTIONS.map((act, index) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAction(act.actionKey, act.label)}
              className="group flex flex-col items-center justify-center p-5 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:bg-primary/5 transition-all text-center relative select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label={`${act.label} (Press ${act.shortcut})`}
            >
              {/* Shortcut Kbd Key Tag */}
              <kbd className="absolute top-2 right-2 text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded border border-border bg-muted/10 text-muted-foreground group-hover:border-primary/20 group-hover:text-primary transition-colors uppercase">
                {act.shortcut}
              </kbd>

              {/* Icon wrapper */}
              <div className="p-3 bg-muted/10 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary rounded-xl transition-all mb-3.5">
                <Icon className="h-6 w-6 stroke-[1.75]" />
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {act.label}
                </h4>
                <p className="text-[9px] font-medium text-text-secondary leading-none mt-1 group-hover:text-primary/70 transition-colors truncate max-w-[100px]">
                  {act.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
