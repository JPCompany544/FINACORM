"use client";

import * as React from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionType, TransactionStatus, TransactionDirection } from "@/constants/mock-transactions";

export interface TransactionFiltersState {
  search: string;
  type: TransactionType | "all";
  status: TransactionStatus | "all";
  direction: TransactionDirection | "all";
  sortBy: "newest" | "oldest" | "highest" | "lowest";
  amountMin: string;
  amountMax: string;
}

export const DEFAULT_FILTERS: TransactionFiltersState = {
  search: "",
  type: "all",
  status: "all",
  direction: "all",
  sortBy: "newest",
  amountMin: "",
  amountMax: "",
};

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  onChange: (filters: TransactionFiltersState) => void;
  totalCount: number;
  filteredCount: number;
}

const TYPE_OPTIONS: Array<{ value: TransactionType | "all"; label: string }> = [
  { value: "all", label: "All Types" },
  { value: "salary", label: "Income / Salary" },
  { value: "shopping", label: "Shopping" },
  { value: "food", label: "Food & Drink" },
  { value: "subscription", label: "Subscriptions" },
  { value: "transfer", label: "Transfers" },
  { value: "utilities", label: "Utilities" },
  { value: "travel", label: "Travel" },
  { value: "transport", label: "Transport" },
  { value: "investment", label: "Investments" },
  { value: "refund", label: "Refunds" },
];

const STATUS_OPTIONS: Array<{ value: TransactionStatus | "all"; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
];

const DIRECTION_OPTIONS: Array<{ value: TransactionDirection | "all"; label: string }> = [
  { value: "all", label: "All Directions" },
  { value: "credit", label: "Credits (Money In)" },
  { value: "debit", label: "Debits (Money Out)" },
];

const SORT_OPTIONS: Array<{ value: TransactionFiltersState["sortBy"]; label: string }> = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
];

const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  id: string;
  label: string;
}> = ({ value, onChange, options, id, label }) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="appearance-none w-full bg-surface border border-border/80 rounded-custom-lg pl-3 pr-8 py-2 text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
  </div>
);

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onChange,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.direction !== "all" ||
    filters.amountMin !== "" ||
    filters.amountMax !== "";

  const set = <K extends keyof TransactionFiltersState>(
    key: K,
    value: TransactionFiltersState[K]
  ) => onChange({ ...filters, [key]: value });

  const reset = () => onChange(DEFAULT_FILTERS);

  return (
    <div className="space-y-3">
      {/* ─── ROW 1: SEARCH + SORT ───────────────────────────────────────────────── */}
      <div className="flex gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            id="tx-search"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search merchant, reference, description, amount..."
            aria-label="Search transactions"
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

        {/* Sort */}
        <div className="shrink-0 w-40">
          <SelectField
            id="tx-sort"
            label="Sort transactions"
            value={filters.sortBy}
            onChange={(v) => set("sortBy", v as TransactionFiltersState["sortBy"])}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* ─── ROW 2: FILTER CHIPS ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2.5 items-center">
        <SelectField
          id="tx-type"
          label="Filter by type"
          value={filters.type}
          onChange={(v) => set("type", v as TransactionFiltersState["type"])}
          options={TYPE_OPTIONS}
        />
        <SelectField
          id="tx-status"
          label="Filter by status"
          value={filters.status}
          onChange={(v) => set("status", v as TransactionFiltersState["status"])}
          options={STATUS_OPTIONS}
        />
        <SelectField
          id="tx-direction"
          label="Filter by direction"
          value={filters.direction}
          onChange={(v) => set("direction", v as TransactionFiltersState["direction"])}
          options={DIRECTION_OPTIONS}
        />

        {/* Amount range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="tx-amount-min"
            value={filters.amountMin}
            onChange={(e) => set("amountMin", e.target.value)}
            placeholder="Min $"
            aria-label="Minimum amount"
            className="w-20 bg-surface border border-border/80 rounded-custom-lg px-3 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
          <span className="text-muted-foreground text-xs">–</span>
          <input
            type="number"
            id="tx-amount-max"
            value={filters.amountMax}
            onChange={(e) => set("amountMax", e.target.value)}
            placeholder="Max $"
            aria-label="Maximum amount"
            className="w-20 bg-surface border border-border/80 rounded-custom-lg px-3 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ml-auto"
            aria-label="Clear all filters"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* ─── RESULT COUNT ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground">
          Showing{" "}
          <span className="font-extrabold text-foreground">{filteredCount}</span>{" "}
          of{" "}
          <span className="font-extrabold text-foreground">{totalCount}</span>{" "}
          transactions
        </p>
      </div>
    </div>
  );
};
