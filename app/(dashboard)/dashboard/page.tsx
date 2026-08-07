"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageContainer, PageHeader, PageBody } from "@/components/app-shell";
import {
  DashboardOverview,
  QuickActions,
  RecentActivity,
  CardsCarousel,
  Insights,
  UpcomingPayments,
  NotificationsPanel,
  GoalsCard,
  RightSidebar,
  DashboardSkeletonPlaceholder
} from "@/components/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/app-shell";
import { fetchDashboardData, DashboardData } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const { error: toastError } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [greeting, setGreeting] = React.useState("Good Morning");
  const [formattedDate, setFormattedDate] = React.useState("");
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Fetch real authenticated customer data on mount
  React.useEffect(() => {
    // Determine greeting based on local time of day
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setFormattedDate(new Date().toLocaleDateString("en-US", options));

    async function loadData() {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Dashboard data load error:", err);
        if (err.message === "UNAUTHORIZED") {
          router.push("/login");
        } else if (err.message === "PROFILE_MISSING") {
          setErrorMsg("SETUP_ERROR");
          toastError("Profile Missing", "Your customer profile could not be located. Please contact support.");
        } else {
          setErrorMsg(err.message || "An unexpected error occurred while loading your account.");
          toastError("Fetch Error", err.message || "Unable to retrieve account details.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router, toastError]);

  const showSkeleton = loading || (!dashboardData && !errorMsg);

  return (
    <PageContainer>
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DashboardSkeletonPlaceholder />
          </motion.div>
        ) : errorMsg ? (
          <motion.div
            key="error-state"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center select-none"
          >
            <div className="rounded-full bg-error/10 p-4 border border-error/20 mb-4 text-error">
              <span className="text-xl font-black">!</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground mb-2">
              {errorMsg === "SETUP_ERROR" ? "Customer Profile Setup Required" : "Failed to load dashboard"}
            </h3>
            <p className="text-xs text-text-secondary max-w-sm mb-6 leading-relaxed font-semibold">
              {errorMsg === "SETUP_ERROR"
                ? "Your registration completed but your profile has not been initialized. Please complete your system registration."
                : errorMsg}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft"
            >
              Retry Sync
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" as const }}
            className="space-y-6"
          >
            {/* ─── PAGE HEADER ────────────────────────────────────────────────── */}
            <PageHeader
              title={`${greeting}, ${dashboardData!.profile.first_name} ${dashboardData!.profile.last_name}`}
              description={formattedDate ? `${formattedDate} • Here's an overview of your finances today.` : "Here's an overview of your finances today."}
            />

            {/* ─── PAGE BODY COLUMN GRID ──────────────────────────────────────── */}
            <PageBody>
              <div className="grid gap-6 laptop:grid-cols-4 items-start">
                
                {/* Left side: Main financial tools (3 cols) */}
                <div className="laptop:col-span-3 space-y-8">
                  {/* Financial Balance Overview */}
                  <DashboardOverview data={dashboardData!} />

                  {/* Quick Shortcut Buttons */}
                  <QuickActions />

                  {/* Active Cards Carousel */}
                  <CardsCarousel />

                  {/* Timeline Activity journal */}
                  <RecentActivity />

                  {/* Savings progress milestones */}
                  <GoalsCard />

                  {/* Security events panel */}
                  <NotificationsPanel />
                </div>

                {/* Right side: exchange rates, contact concierge, support (1 col) */}
                <div className="laptop:col-span-1">
                  <RightSidebar />
                </div>

              </div>
            </PageBody>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
