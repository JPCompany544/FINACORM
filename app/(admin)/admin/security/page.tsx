import { DashboardCard } from "@/components/ui/card";

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Security Audits & Logs</h1>
      <DashboardCard title="Key Policies & Network Logs" subtitle="Adjust gateway threshold policies, rate limits, and view alert states.">
        <p className="text-sm text-muted-foreground">Global threat posture and ledger cryptographic check statuses.</p>
      </DashboardCard>
    </div>
  );
}
