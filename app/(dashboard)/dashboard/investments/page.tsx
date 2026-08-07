import { DashboardCard } from "@/components/ui/card";

export default function InvestmentsDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Brokerage & Auto-Investments</h1>
      <DashboardCard title="Portfolio Allocation" subtitle="Managed risk assets, stocks, index funds, and crypto options.">
        <p className="text-sm text-muted-foreground">Monitor real-time market value changes and trade history.</p>
      </DashboardCard>
    </div>
  );
}
