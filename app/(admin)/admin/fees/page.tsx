import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FeesCard } from "@/components/admin/FeesCard";

export default async function AdminFeesPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    redirect("/login");
  }

  // Verify administrator role from the profiles table
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Fees Administration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Toggle and manage client-side transaction fee configurations.</p>
      </div>

      <div className="max-w-2xl">
        <FeesCard />
      </div>
    </div>
  );
}
