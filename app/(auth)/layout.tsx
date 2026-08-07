import * as React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthLayout } from "@/components/auth/AuthLayout";

/**
 * Server-side route guard layout for the authentication views.
 * Automatically redirects already logged-in users away from auth pages to /dashboard.
 */
export default async function AuthPageLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout>
      <React.Suspense fallback={null}>
        {children}
      </React.Suspense>
    </AuthLayout>
  );
}
