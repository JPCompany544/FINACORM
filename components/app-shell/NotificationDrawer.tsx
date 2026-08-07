"use client";

import * as React from "react";
import { X, CheckCircle2, AlertTriangle, Info, Bell, Trash2, CheckCheck, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "./context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const NotificationDrawer: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    unreadCount,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Prevent scroll on body when open
  React.useEffect(() => {
    if (notificationsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [notificationsOpen]);

  // Group notifications by category
  const grouped = React.useMemo(() => {
    const today = notifications.filter((n) => n.category === "Today");
    const yesterday = notifications.filter((n) => n.category === "Yesterday");
    const earlier = notifications.filter((n) => n.category === "Earlier");
    return { Today: today, Yesterday: yesterday, Earlier: earlier };
  }, [notifications]);

  const IconMap = {
    success: CheckCircle2,
    warning: AlertTriangle,
    info: Info,
    error: AlertTriangle,
  };

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 bg-dark/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide from Right Panel */}
          <div className="fixed inset-y-0 right-0 z-10 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="w-screen max-w-md bg-surface border-l border-border/40 shadow-modal flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="h-5 w-5 text-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-extrabold text-primary-foreground border-2 border-surface">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider select-none">
                    Notifications
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded cursor-pointer"
                  aria-label="Close notifications panel"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Controls */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between px-6 py-2.5 bg-muted/10 border-b border-border/40 shrink-0 select-none">
                  <span className="text-[11px] font-bold text-text-secondary">
                    {unreadCount} unread alerts
                  </span>
                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-primary hover:text-primary/80 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer outline-none"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all as read
                  </button>
                </div>
              )}

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                {notifications.length > 0 ? (
                  (Object.keys(grouped) as Array<keyof typeof grouped>).map((groupKey) => {
                    const groupItems = grouped[groupKey];
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={groupKey} className="space-y-3">
                        <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest px-2">
                          {groupKey}
                        </div>
                        <div className="space-y-2">
                          <AnimatePresence mode="popLayout">
                            {groupItems.map((notif) => {
                              const Icon = IconMap[notif.type];
                              return (
                                <motion.div
                                  layout
                                  key={notif.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className={cn(
                                    "p-3 rounded-xl border flex gap-3 transition-all group relative",
                                    notif.read
                                      ? "bg-surface border-border/30 hover:border-border/60"
                                      : "bg-primary/4 border-primary/10 hover:border-primary/20"
                                  )}
                                >
                                  {/* Icon indicator */}
                                  <div
                                    className={cn(
                                      "p-1.5 rounded-full shrink-0 h-8 w-8 flex items-center justify-center border",
                                      notif.type === "success" && "bg-success/10 border-success/15 text-success",
                                      notif.type === "warning" && "bg-warning/10 border-warning/15 text-warning",
                                      notif.type === "info" && "bg-info/10 border-info/15 text-info",
                                      notif.type === "error" && "bg-error/10 border-error/15 text-error"
                                    )}
                                  >
                                    <Icon className="h-4 w-4 shrink-0" />
                                  </div>

                                  {/* Details */}
                                  <div className="flex-1 min-w-0 pr-6 space-y-1">
                                    <h4 className="text-xs font-bold text-foreground leading-snug">
                                      {notif.title}
                                    </h4>
                                    <p className="text-[11px] font-semibold text-text-secondary leading-relaxed">
                                      {notif.description}
                                    </p>
                                    <span className="inline-block text-[9px] font-semibold text-muted-foreground">
                                      {notif.time}
                                    </span>
                                  </div>

                                  {/* Trash Button */}
                                  <button
                                    onClick={() => deleteNotification(notif.id)}
                                    className="absolute top-3 right-3 text-muted-foreground/60 hover:text-error transition-colors p-1 rounded opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-error/20"
                                    aria-label="Delete notification"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>

                                  {/* Unread blue dot */}
                                  {!notif.read && (
                                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary group-hover:opacity-0 transition-opacity" />
                                  )}
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6 space-y-4 select-none">
                    <div className="p-4 bg-muted/10 border border-border/40 rounded-full text-muted-foreground">
                      <Inbox className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="text-sm font-bold text-foreground">Inbox is empty</h4>
                      <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                        You're all caught up! When transactional alerts or news updates occur, they'll show up here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
