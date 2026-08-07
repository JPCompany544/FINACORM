"use client";

import * as React from "react";
import { PageContainer, PageHeader, PageBody } from "@/components/app-shell";
import { TransactionsTab } from "@/components/transactions/TransactionsTab";

export default function TransactionsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        description="View your complete transaction history."
      />
      <PageBody>
        <div className="bg-surface border border-border/60 rounded-custom-xl overflow-hidden min-h-[600px]">
          <TransactionsTab />
        </div>
      </PageBody>
    </PageContainer>
  );
}
