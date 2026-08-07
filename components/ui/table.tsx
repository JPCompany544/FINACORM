"use client";

import * as React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Base Components ---
export const TableContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative w-full overflow-x-auto rounded-custom-lg border border-border bg-surface", className)} {...props} />
  )
);
TableContainer.displayName = "TableContainer";

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("border-b border-border bg-muted/5 [&_tr]:border-b-0", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t border-border bg-muted/10 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  )
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b border-border/40 hover:bg-muted/5 transition-colors data-[state=selected]:bg-muted/10", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("h-11 px-4 text-left align-middle text-xs font-bold uppercase tracking-wider text-text-secondary select-none", className)} {...props} />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle text-xs font-semibold text-foreground", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

// --- Table Sort Header Component ---
export interface TableSortHeaderProps {
  className?: string;
  children: React.ReactNode;
  direction?: "asc" | "desc" | null;
  onSort?: (direction: "asc" | "desc" | null) => void;
}

export const TableSortHeader: React.FC<TableSortHeaderProps> = ({
  className,
  children,
  direction = null,
  onSort,
}) => {
  const handleToggle = () => {
    if (direction === null) onSort?.("asc");
    else if (direction === "asc") onSort?.("desc");
    else onSort?.(null);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-1.5 hover:text-foreground transition-colors font-bold uppercase tracking-wider text-xs cursor-pointer text-left",
        direction && "text-foreground",
        className
      )}
    >
      <span>{children}</span>
      {direction === "asc" && <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />}
      {direction === "desc" && <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />}
      {direction === null && <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100 transition-opacity shrink-0" />}
    </button>
  );
};

// --- Table Pagination Component ---
export interface TablePaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  totalItems,
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2", className)}>
      {/* Items count metadata */}
      <div className="text-xs text-muted-foreground font-semibold">
        {totalItems !== undefined ? (
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </span>
        ) : (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-6">
        {/* Page size select options */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-semibold">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded border border-border bg-surface px-1.5 text-xs text-foreground cursor-pointer font-bold focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Next / Prev buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
          </button>
          <div className="text-xs font-bold text-foreground min-w-[3rem] text-center select-none">
            {currentPage} / {totalPages}
          </div>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
