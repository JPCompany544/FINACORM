"use client";

import * as React from "react";
import { Bell, ShieldAlert, CheckCircle, Info, Trash2, CheckSquare } from "lucide-react";
import { useToast } from "@/components/app-shell";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, fetchNotifications, NotificationItem } from "@/lib/supabase";

export const NotificationsPanel: React.FC = () => {
  const { success } = useToast();
  const { user } = useAuth();
  const [alerts, setAlerts] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    async function loadNotifications() {
      try {
        const data = await fetchNotifications(user!.id);
        setAlerts(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [user]);

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    success("Security logs cleared", "All active notifications marked read.");
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const hasUnread = alerts.some((a) => !a.read);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Bell className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Security Alerts & Logs
          </h3>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={!hasUnread}
            className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline disabled:opacity-50 disabled:pointer-events-none cursor-pointer outline-none"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-custom-xl" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-custom-xl border border-border border-dashed p-6 text-center text-xs font-semibold text-muted-foreground select-none">
          No notifications.
        </div>
      ) : (
        <div className="space-y-2.5 select-none">
          <AnimatePresence initial={false}>
            {alerts.map((a) => {
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group flex items-start gap-3.5 p-3.5 rounded-custom-xl border transition-all text-xs font-semibold leading-relaxed relative",
                    a.read
                      ? "bg-surface/40 border-border/50 text-muted-foreground"
                      : "bg-surface border-border/80 text-foreground shadow-soft"
                  )}
                >
                  {/* Alert Icon wrapper */}
                  <div className="p-1.5 rounded-lg border border-border bg-muted/10 shrink-0 mt-0.5 text-primary">
                    <Info className="h-4 w-4" />
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0 pr-6">
                    <h4 className={cn("font-bold text-xs truncate", !a.read && "text-foreground")}>
                      {a.title}
                    </h4>
                    <p className="text-[10px] text-text-secondary leading-normal">{a.message}</p>
                  </div>

                  {/* Actions buttons */}
                  <div className="absolute right-3.5 top-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDismiss(a.id)}
                      className="p-1 rounded hover:bg-muted/15 text-muted-foreground hover:text-error transition-colors cursor-pointer outline-none"
                      title="Dismiss alert"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
