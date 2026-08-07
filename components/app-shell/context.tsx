"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  category: "Today" | "Yesterday" | "Earlier";
  type: "info" | "success" | "warning" | "error";
}

interface AppShellContextType {
  // Sidebar State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;

  // Search Modal State
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  toggleSearch: () => void;

  // Notifications State
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  toggleNotifications: () => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  unreadCount: number;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  // Profile state
  profileData: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null;
  setProfileData: React.Dispatch<React.SetStateAction<{
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null>>;
}

// ─── INITIAL STATE MOCKS ──────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Security Alert: New Login Detected",
    description: "A login was detected from a new device in London, UK.",
    time: "10m ago",
    read: false,
    category: "Today",
    type: "warning",
  },
  {
    id: "notif-2",
    title: "Transfer Completed",
    description: "Your transfer of $1,250.00 to Sarah Jenkins was completed.",
    time: "2h ago",
    read: false,
    category: "Today",
    type: "success",
  },
  {
    id: "notif-3",
    title: "Interest Payment Received",
    description: "You earned $42.15 interest on your High-Yield Savings Account.",
    time: "Yesterday, 4:32 PM",
    read: true,
    category: "Yesterday",
    type: "success",
  },
  {
    id: "notif-4",
    title: "Card Frozen Successfully",
    description: "Your physical debit card ending in •••• 4821 has been frozen.",
    time: "Yesterday, 9:15 AM",
    read: true,
    category: "Yesterday",
    type: "info",
  },
  {
    id: "notif-5",
    title: "Monthly Statement Available",
    description: "Your banking statement for the month of July is now ready for download.",
    time: "3 days ago",
    read: true,
    category: "Earlier",
    type: "info",
  },
];

// ─── CONTEXT CREATION ─────────────────────────────────────────────────────────

const AppShellContext = React.createContext<AppShellContextType | undefined>(undefined);

export const AppShellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [profileData, setProfileData] = React.useState<{
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null>(null);

  // Fetch the user profile once for the shell
  React.useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Core profile fields — must succeed
        const { data: coreData, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (error || !coreData) return;

        // avatar_url — fetched separately, safe to fail if column not yet added
        let avatar_url: string | null = null;
        try {
          const { data: avatarData } = await supabase
            .from("profiles")
            .select("avatar_url")
            .eq("id", user.id)
            .single();
          
          const path = avatarData?.avatar_url ?? null;
          if (path) {
            if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
              avatar_url = path;
            } else {
              const { data: signedData, error: signedError } = await supabase.storage
                .from("avatars")
                .createSignedUrl(path, 3600);
              if (!signedError && signedData) {
                avatar_url = signedData.signedUrl;
              } else {
                avatar_url = path;
              }
            }
          }
        } catch {
          // Column may not exist yet — non-fatal
        }

        setProfileData({ ...coreData, avatar_url });
      } catch {
        // Fail silently — shell still works without profile data
      }
    }
    loadProfile();
  }, []);

  // Sidebar controls
  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const toggleMobileSidebar = React.useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  // Search controls
  const toggleSearch = React.useCallback(() => {
    setSearchOpen((prev) => !prev);
  }, []);

  // Notifications controls
  const toggleNotifications = React.useCallback(() => {
    setNotificationsOpen((prev) => !prev);
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Listen to keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppShellContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        toggleSidebar,
        toggleMobileSidebar,

        searchOpen,
        setSearchOpen,
        toggleSearch,

        notificationsOpen,
        setNotificationsOpen,
        toggleNotifications,
        notifications,
        setNotifications,
        unreadCount,
        markAllAsRead,
        deleteNotification,
        profileData,
        setProfileData,
      }}
    >
      {children}
    </AppShellContext.Provider>
  );
};

// ─── CUSTOM HOOKS ─────────────────────────────────────────────────────────────

export function useSidebar() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error("useSidebar must be used within an AppShellProvider");
  }
  return {
    collapsed: context.sidebarCollapsed,
    setCollapsed: context.setSidebarCollapsed,
    mobileOpen: context.mobileSidebarOpen,
    setMobileOpen: context.setMobileSidebarOpen,
    toggleSidebar: context.toggleSidebar,
    toggleMobileSidebar: context.toggleMobileSidebar,
  };
}

export function useSearch() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error("useSearch must be used within an AppShellProvider");
  }
  return {
    searchOpen: context.searchOpen,
    setSearchOpen: context.setSearchOpen,
    toggleSearch: context.toggleSearch,
  };
}

export function useNotifications() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error("useNotifications must be used within an AppShellProvider");
  }
  return {
    notificationsOpen: context.notificationsOpen,
    setNotificationsOpen: context.setNotificationsOpen,
    toggleNotifications: context.toggleNotifications,
    notifications: context.notifications,
    unreadCount: context.unreadCount,
    markAllAsRead: context.markAllAsRead,
    deleteNotification: context.deleteNotification,
  };
}
export function useProfile() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error("useProfile must be used within an AppShellProvider");
  }
  return context.profileData;
}

export function useSetProfile() {
  const context = React.useContext(AppShellContext);
  if (!context) {
    throw new Error("useSetProfile must be used within an AppShellProvider");
  }
  return context.setProfileData;
}
