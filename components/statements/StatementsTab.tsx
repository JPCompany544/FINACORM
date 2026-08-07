"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { StatementFilters, DEFAULT_STATEMENT_FILTERS, type StatementFiltersState } from "./StatementFilters";
import { StatementList } from "./StatementList";
import { StatementPreviewModal } from "./StatementPreviewModal";
import { DownloadHistory } from "./DownloadHistory";
import { MOCK_STATEMENTS, type StatementItem } from "@/constants/mock-statements";

interface StatementsTabProps {
  accountId: string;
}

export const StatementsTab: React.FC<StatementsTabProps> = ({ accountId }) => {
  const [filters, setFilters] = React.useState<StatementFiltersState>({
    ...DEFAULT_STATEMENT_FILTERS,
    accountId: accountId || "all",
  });
  const [selectedStatement, setSelectedStatement] = React.useState<StatementItem | null>(null);

  // Sync accountId parameter when it changes
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      accountId: accountId || "all",
    }));
  }, [accountId]);

  // Compute filtered count
  const filteredCount = React.useMemo(() => {
    let result = MOCK_STATEMENTS;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.period.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.accountName.toLowerCase().includes(q)
      );
    }
    if (filters.year !== "all") {
      result = result.filter((s) => s.year === Number(filters.year));
    }
    if (filters.month !== 0) {
      result = result.filter((s) => s.month === filters.month);
    }
    if (filters.type !== "all") {
      result = result.filter((s) => s.type === filters.type);
    }
    if (filters.accountId !== "all") {
      result = result.filter((s) => s.accountId === filters.accountId);
    }
    return result.length;
  }, [filters]);

  return (
    <>
      <motion.div
        key="statements-tab-content"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="grid gap-6 laptop:grid-cols-4 items-start"
      >
        {/* Left 3 columns — Filters & Document List */}
        <div className="laptop:col-span-3 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                Statements & Documents
              </h3>
            </div>
            <p className="text-[11px] font-semibold text-text-secondary">
              Download and review your account statements and official banking documents.
            </p>
          </div>

          {/* Filter Panel */}
          <div className="rounded-custom-xl border border-border bg-surface p-4 shadow-soft">
            <StatementFilters
              filters={filters}
              onChange={setFilters}
              totalCount={MOCK_STATEMENTS.length}
              filteredCount={filteredCount}
            />
          </div>

          {/* Statement List */}
          <StatementList filters={filters} onPreview={setSelectedStatement} />
        </div>

        {/* Right 1 column — Recent Downloads / History */}
        <div className="space-y-6">
          <DownloadHistory />
        </div>
      </motion.div>

      {/* Preview Modal */}
      <StatementPreviewModal
        statement={selectedStatement}
        onClose={() => setSelectedStatement(null)}
      />
    </>
  );
};
