"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import {
  MOCK_STATEMENTS,
  type StatementItem,
} from "@/constants/mock-statements";
import type { StatementFiltersState } from "./StatementFilters";
import { StatementCard } from "./StatementCard";
import { StatementSkeleton } from "./StatementSkeleton";

interface StatementListProps {
  filters: StatementFiltersState;
  onPreview: (s: StatementItem) => void;
}

function applyFilters(
  stmts: StatementItem[],
  f: StatementFiltersState
): StatementItem[] {
  let result = [...stmts];

  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.period.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.accountName.toLowerCase().includes(q)
    );
  }
  if (f.year !== "all") {
    result = result.filter((s) => s.year === Number(f.year));
  }
  if (f.month !== 0) {
    result = result.filter((s) => s.month === f.month);
  }
  if (f.type !== "all") {
    result = result.filter((s) => s.type === f.type);
  }
  if (f.accountId !== "all") {
    result = result.filter((s) => s.accountId === f.accountId);
  }

  // Sort: newest first by generatedDateISO
  result.sort(
    (a, b) =>
      new Date(b.generatedDateISO).getTime() -
      new Date(a.generatedDateISO).getTime()
  );

  return result;
}

export const StatementList: React.FC<StatementListProps> = ({
  filters,
  onPreview,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [statements, setStatements] = React.useState<StatementItem[]>([]);

  // Simulate data load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStatements(MOCK_STATEMENTS);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = React.useMemo(
    () => applyFilters(statements, filters),
    [statements, filters]
  );

  if (isLoading) return <StatementSkeleton />;

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-16 space-y-4 rounded-custom-xl border border-dashed border-border bg-surface/40"
        role="status"
        aria-label="No statements found"
      >
        <div className="p-4 rounded-full bg-muted/10 border border-border/60 text-muted-foreground">
          <FolderOpen className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-extrabold text-foreground">
            No Statements Available
          </h4>
          <p className="text-xs font-semibold text-text-secondary max-w-xs">
            Statements will automatically appear here once generated, or try adjusting your filters.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className="space-y-2.5"
      role="list"
      aria-label="Statement documents"
    >
      <AnimatePresence mode="popLayout">
        {filtered.map((stmt, i) => (
          <div key={stmt.id} role="listitem">
            <StatementCard
              statement={stmt}
              onPreview={onPreview}
              index={i}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
