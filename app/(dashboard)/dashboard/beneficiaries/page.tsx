"use client";

import * as React from "react";
import { PageContainer, PageHeader, PageBody } from "@/components/app-shell";
import { useAuth, createBrowserClient } from "@/lib/supabase";
import { User, Landmark, Globe, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Beneficiary {
  id: string;
  name: string;
  nickname: string;
  bank_name: string;
  account_number: string;
  country: string;
}

export default function BeneficiariesPage() {
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = React.useState<Beneficiary[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    const loadBeneficiaries = async () => {
      const supabase = createBrowserClient();
      try {
        const { data, error } = await supabase
          .from("beneficiaries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (!error && data) {
          setBeneficiaries(data);
        }
      } catch (err) {
        console.error("Error loading beneficiaries:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBeneficiaries();
  }, [user]);

  return (
    <PageContainer>
      <PageHeader
        title="Beneficiaries"
        description="Manage your saved contacts and transfer recipients."
      />
      <PageBody>
        <div className="bg-surface border border-border/60 rounded-custom-xl p-6 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : beneficiaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted/10 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">No Beneficiaries Yet</h3>
                <p className="text-sm font-medium text-text-secondary mt-1">
                  You haven't saved any contacts or recipients.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beneficiaries.map((b) => (
                <div key={b.id} className="p-4 border border-border bg-background rounded-custom-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {b.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="bg-success/10 text-success text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    </div>
                    <h4 className="font-extrabold text-foreground truncate">{b.name}</h4>
                    {b.nickname && <p className="text-xs text-text-secondary truncate font-medium">"{b.nickname}"</p>}
                  </div>
                  
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <Landmark className="h-3.5 w-3.5" />
                      <span className="truncate">{b.bank_name || "Unknown Bank"}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <div className="font-mono bg-muted/20 px-1.5 rounded">{b.account_number}</div>
                    </div>
                    {b.country && (
                      <div className="flex items-center gap-2 truncate">
                        <Globe className="h-3.5 w-3.5" />
                        <span className="truncate">{b.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageBody>
    </PageContainer>
  );
}
