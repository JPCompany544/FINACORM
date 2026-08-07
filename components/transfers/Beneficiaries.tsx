"use client";

import * as React from "react";
import { Beneficiary } from "@/constants/mock-beneficiaries";
import { Search, Star, Trash2, Edit3, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/app-shell";

interface BeneficiariesProps {
  beneficiaries: Beneficiary[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectRecipient: (ben: Beneficiary) => void;
  onCreateNewTransfer?: () => void;
}

export const Beneficiaries: React.FC<BeneficiariesProps> = ({
  beneficiaries,
  onToggleFavorite,
  onDelete,
  onSelectRecipient,
  onCreateNewTransfer,
}) => {
  const { success, info } = useToast();
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return beneficiaries.filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        (b.bankName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [beneficiaries, search]);

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    onDelete(id);
    success("Beneficiary Deleted", `${name} has been removed from directories.`);
  };

  // If there are no beneficiaries overall, render the clean empty state requested
  if (beneficiaries.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-custom-xl bg-surface/50 select-none">
        <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <h4 className="text-xs font-bold text-foreground mb-1">
          You don't have any saved beneficiaries yet.
        </h4>
        <p className="text-[10px] text-text-secondary mb-4">
          Add recipients during your transfers to build your directory.
        </p>
        {onCreateNewTransfer && (
          <button
            onClick={onCreateNewTransfer}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-custom-md shadow-soft hover:opacity-90 transition-all cursor-pointer outline-none"
          >
            Create New Transfer
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex justify-between items-center border-b border-border/40 pb-4 gap-4 select-none">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beneficiary list..."
            aria-label="Search beneficiary list"
            className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
          />
        </div>

        {onCreateNewTransfer && (
          <button
            onClick={onCreateNewTransfer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-[10px] font-extrabold transition-all cursor-pointer outline-none"
          >
            <Plus className="h-3.5 w-3.5" /> Add Beneficiary
          </button>
        )}
      </div>

      {/* Directory items */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((ben) => (
            <div
              key={ben.id}
              onClick={() => onSelectRecipient(ben)}
              className="flex items-center justify-between p-4.5 rounded-custom-xl border border-border bg-surface hover:border-primary/25 hover:shadow-soft transition-all text-left cursor-pointer group select-none"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar */}
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: ben.color || "#2563EB" }}
                >
                  {ben.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {ben.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(ben.id);
                      }}
                      className="p-1 rounded hover:bg-muted/10 shrink-0 outline-none"
                      aria-label={ben.isFavorite ? "Unfavorite beneficiary" : "Favorite beneficiary"}
                    >
                      <Star
                        className={cn(
                          "h-3.5 w-3.5",
                          ben.isFavorite ? "text-warning fill-warning" : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </h4>
                  <p className="text-[10px] font-semibold text-text-secondary mt-0.5 leading-none">
                    {ben.bankName} · <span className="capitalize">{ben.type}</span>
                  </p>
                  <p className="text-[9px] font-mono text-muted-foreground mt-1.5 leading-none">
                    {ben.accountNumber || ben.iban}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    info("Edit Beneficiary", "Modify beneficiary details placeholder.");
                  }}
                  className="p-2 rounded-custom-md hover:bg-muted/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none"
                  aria-label={`Edit ${ben.name}`}
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(e, ben.id, ben.name)}
                  className="p-2 rounded-custom-md hover:bg-error/10 text-muted-foreground hover:text-error transition-colors cursor-pointer outline-none"
                  aria-label={`Delete ${ben.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-custom-xl bg-surface/50 select-none">
          <User className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <h4 className="text-xs font-bold text-foreground mb-1">No matches found</h4>
          <p className="text-[10px] text-text-secondary">Try refining your search filter.</p>
        </div>
      )}
    </div>
  );
};
