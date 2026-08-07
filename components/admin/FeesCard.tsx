"use client";

import * as React from "react";
import { DashboardCard } from "@/components/ui/card";

export function FeesCard() {
  const [cotEnabled, setCotEnabled] = React.useState(true);
  const [vatEnabled, setVatEnabled] = React.useState(true);

  React.useEffect(() => {
    const savedCot = localStorage.getItem("admin_cot_enabled");
    const savedVat = localStorage.getItem("admin_vat_enabled");
    if (savedCot !== null) setCotEnabled(savedCot === "true");
    if (savedVat !== null) setVatEnabled(savedVat === "true");
  }, []);

  const handleCotToggle = () => {
    const nextVal = !cotEnabled;
    setCotEnabled(nextVal);
    localStorage.setItem("admin_cot_enabled", String(nextVal));
  };

  const handleVatToggle = () => {
    const nextVal = !vatEnabled;
    setVatEnabled(nextVal);
    localStorage.setItem("admin_vat_enabled", String(nextVal));
  };

  return (
    <DashboardCard title="System Fees Management" subtitle="Toggle transactional code requirements.">
      <div className="space-y-4">
        {/* COT Code Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-muted/10 border border-border/40 rounded-custom-md">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-foreground">COT Code Verification</span>
            <span className="text-[10px] text-muted-foreground">Require Commission on Turnover code for transfers.</span>
          </div>
          <button
            onClick={handleCotToggle}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
              cotEnabled ? "bg-primary" : "bg-muted"
            }`}
            aria-label="Toggle COT Code"
          >
            <div
              className={`bg-surface w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                cotEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* VAT Code Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-muted/10 border border-border/40 rounded-custom-md">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-foreground">VAT Code Verification</span>
            <span className="text-[10px] text-muted-foreground">Require Value Added Tax code for transfers.</span>
          </div>
          <button
            onClick={handleVatToggle}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
              vatEnabled ? "bg-primary" : "bg-muted"
            }`}
            aria-label="Toggle VAT Code"
          >
            <div
              className={`bg-surface w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                vatEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
