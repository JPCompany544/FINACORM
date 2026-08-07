"use client";

import * as React from "react";
import { Search, X, ChevronDown } from "lucide-react";
import {
  STATEMENT_YEARS,
  STATEMENT_MONTHS,
  STATEMENT_TYPES,
  STATEMENT_ACCOUNTS,
  type StatementType,
} from "@/constants/mock-statements";

export interface StatementFiltersState {
  search: string;
  year: number | "all";
  month: number; // 0 = all
  type: StatementType | "all";
  accountId: string; // "all" or account id
}

export const DEFAULT_STATEMENT_FILTERS: StatementFiltersState = {
  search: "",
  year: "all",
  month: 0,
  type: "all",
  accountId: "all",
};

interface StatementFiltersProps {
  filters: StatementFiltersState;
  onChange: (f: StatementFiltersState) => void;
  totalCount: number;
  filteredCount: number;
}

const SelectField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string | number; label: string }>;
}> = ({ id, label, value, onChange, options }) => (
  <div className="relative">
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full bg-surface border border-border/80 rounded-custom-lg pl-3 pr-8 py-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
  </div>
);

export const StatementFilters: React.FC<StatementFiltersProps> = ({
  filters,
  onChange,
  totalCount,
  filteredCount,
}) => {
  const set = <K extends keyof StatementFiltersState>(
    key: K,
    value: StatementFiltersState[K]
  ) => onChange({ ...filters, [key]: value });

  const hasActive =
    filters.search !== "" ||
    filters.year !== "all" ||
    filters.month !== 0 ||
    filters.type !== "all" ||
    filters.accountId !== "all";

  const reset = () => onChange(DEFAULT_STATEMENT_FILTERS);

  return (
    <div className="space-y-3">
      {/* ROW 1: Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          id="stmt-search"
          type="text"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search by statement name, period, or type..."
          aria-label="Search statements"
          className="w-full bg-surface border border-border/80 rounded-custom-lg pl-10 pr-10 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => set("search", "")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ROW 2: Filter selects */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {/* Year */}
        <div className="w-32">
          <SelectField
            id="stmt-year"
            label="Filter by year"
            value={String(filters.year)}
            onChange={(v) => set("year", v === "all" ? "all" : Number(v))}
            options={[
              { value: "all", label: "All Years" },
              ...STATEMENT_YEARS.map((y) => ({ value: y, label: String(y) })),
            ]}
          />
        </div>

        {/* Month */}
        <div className="w-36">
          <SelectField
            id="stmt-month"
            label="Filter by month"
            value={String(filters.month)}
            onChange={(v) => set("month", Number(v))}
            options={STATEMENT_MONTHS.map((m) => ({
              value: m.value,
              label: m.label,
            }))}
          />
        </div>

        {/* Type */}
        <div className="w-48">
          <SelectField
            id="stmt-type"
            label="Filter by statement type"
            value={filters.type}
            onChange={(v) => set("type", v as StatementFiltersState["type"])}
            options={STATEMENT_TYPES.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
        </div>

        {/* Account */}
        <div className="w-52">
          <SelectField
            id="stmt-account"
            label="Filter by account"
            value={filters.accountId}
            onChange={(v) => set("accountId", v)}
            options={STATEMENT_ACCOUNTS.map((a) => ({
              value: a.value,
              label: a.label,
            }))}
          />
        </div>

        {hasActive && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ml-auto"
            aria-label="Clear all filters"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-[10px] font-semibold text-muted-foreground">
        Showing{" "}
        <span className="font-extrabold text-foreground">{filteredCount}</span>{" "}
        of{" "}
        <span className="font-extrabold text-foreground">{totalCount}</span>{" "}
        documents
      </p>
    </div>
  );
};
