"use client";

import * as React from "react";
import { Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_DOWNLOAD_HISTORY } from "@/constants/mock-statements";

const FORMAT_COLORS: Record<string, string> = {
  PDF: "bg-error/8 border-error/20 text-error",
  CSV: "bg-success/8 border-success/20 text-success",
  OFX: "bg-info/8 border-info/20 text-info",
};

export const DownloadHistory: React.FC = () => {
  if (MOCK_DOWNLOAD_HISTORY.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          Recent Downloads
        </h4>
      </div>

      <div className="rounded-custom-xl border border-border bg-surface overflow-hidden shadow-soft">
        {MOCK_DOWNLOAD_HISTORY.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 px-4 py-3 hover:bg-surface-hover/40 transition-colors",
              i < MOCK_DOWNLOAD_HISTORY.length - 1 && "border-b border-border/40"
            )}
          >
            {/* Doc icon */}
            <div className="p-1.5 rounded-lg bg-muted/10 shrink-0" aria-hidden="true">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-xs font-bold text-foreground truncate">
                {item.statementTitle}
              </p>
              <p className="text-[10px] font-semibold text-text-secondary truncate">
                {item.downloadedOn} · {item.downloadedBy}
              </p>
            </div>

            {/* Format badge */}
            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full shrink-0",
                FORMAT_COLORS[item.format] ?? "bg-muted/10 border-border text-muted-foreground"
              )}
            >
              {item.format}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
