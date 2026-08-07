"use client";

import * as React from "react";
import { BILL_CATEGORIES, BillCategory } from "@/constants/mock-bills";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface BillCategoryGridProps {
  onSelectCategory: (cat: BillCategory) => void;
}

export const BillCategoryGrid: React.FC<BillCategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <div className="space-y-3.5 select-none">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-0.5">
        Bill Categories
      </h3>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 laptop:grid-cols-9">
        {BILL_CATEGORIES.map((cat) => {
          // Resolve icon name to lucide react element
          const IconComponent = (LucideIcons as any)[cat.iconName] || LucideIcons.HelpCircle;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center justify-center p-3.5 rounded-custom-xl border border-border bg-surface hover:border-primary/20 hover:bg-primary/[0.01] hover:shadow-soft transition-all text-center cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <div className={cn("p-2.5 rounded-xl border mb-2.5 shrink-0 transition-transform group-hover:scale-105", cat.color)}>
                <IconComponent className="h-4.5 w-4.5" />
              </div>
              <span className="text-[9px] font-extrabold text-foreground leading-none group-hover:text-primary transition-colors">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
