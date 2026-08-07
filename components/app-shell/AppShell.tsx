"use client";

import * as React from "react";
import { AppShellProvider } from "./context";
import { ToastProvider } from "./Toast";
import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";
import { SearchModal } from "./SearchModal";
import { NotificationDrawer } from "./NotificationDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface AppShellInnerProps {
  children: React.ReactNode;
}

const AppShellInner: React.FC<AppShellInnerProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans antialiased text-foreground">

      {/* Dashboard Background Image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/BG 1.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.35,
        }}
      />

      {/* Off-canvas mobile Sidebar Drawer */}
      <Sidebar isMobile={true} />

      {/* Desktop Sticky Sidebar */}
      <Sidebar />

      {/* Main Right Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Sticky Header Topbar */}
        <TopNavigation />

        {/* Scrollable Main Content */}
        <main className="flex-grow overflow-y-auto overflow-x-hidden flex flex-col bg-transparent relative scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" as const }}
              className="flex-1 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <SearchModal />
      <NotificationDrawer />
    </div>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <AppShellProvider>
        <AppShellInner>{children}</AppShellInner>
      </AppShellProvider>
    </ToastProvider>
  );
};
