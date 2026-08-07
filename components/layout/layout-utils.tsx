import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Grid Component ---
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsTablet?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsLaptop?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 2 | 4 | 6 | 8 | 10 | 12;
}

export const Grid: React.FC<GridProps> = ({
  className,
  cols = 1,
  colsTablet,
  colsLaptop,
  gap = 4,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-2",
        cols === 3 && "grid-cols-3",
        cols === 4 && "grid-cols-4",
        cols === 12 && "grid-cols-12",
        colsTablet === 2 && "tablet:grid-cols-2",
        colsTablet === 3 && "tablet:grid-cols-3",
        colsTablet === 4 && "tablet:grid-cols-4",
        colsLaptop === 2 && "laptop:grid-cols-2",
        colsLaptop === 3 && "laptop:grid-cols-3",
        colsLaptop === 4 && "laptop:grid-cols-4",
        colsLaptop === 12 && "laptop:grid-cols-12",
        gap === 2 && "gap-2",
        gap === 4 && "gap-4",
        gap === 6 && "gap-6",
        gap === 8 && "gap-8",
        gap === 10 && "gap-10",
        gap === 12 && "gap-12",
        className
      )}
      {...props}
    />
  );
};

// --- Page Wrapper Component ---
export type PageWrapperProps = React.HTMLAttributes<HTMLDivElement>;

export const PageWrapper: React.FC<PageWrapperProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("min-h-[calc(100vh-4rem)] flex flex-col bg-background", className)} {...props}>
      {children}
    </div>
  );
};

// --- Breadcrumb Component ---
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  className?: string;
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ className, items }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1.5 text-xs font-semibold text-text-secondary", className)}>
      <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1 select-none cursor-pointer">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60 text-muted" />
            {isLast || !item.href ? (
              <span className="text-foreground font-bold select-none" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground transition-colors cursor-pointer">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
