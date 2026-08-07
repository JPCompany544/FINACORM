"use client";

import * as React from "react";
import { MOCK_BENEFICIARIES, PaymentBeneficiary } from "@/constants/mock-payments-beneficiaries";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Star, Plus, Trash2, Pencil, Check, X, Phone, Mail, Globe, Shield, BookUser } from "lucide-react";
import { useToast } from "@/components/app-shell";

interface BeneficiaryManagerProps {
  onPayBeneficiary?: (b: PaymentBeneficiary) => void;
}

export const BeneficiaryManager: React.FC<BeneficiaryManagerProps> = ({ onPayBeneficiary }) => {
  const { success, info } = useToast();
  const [beneficiaries, setBeneficiaries] = React.useState<PaymentBeneficiary[]>(MOCK_BENEFICIARIES);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "favorite" | "domestic" | "international">("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const filtered = beneficiaries.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.nickname.toLowerCase().includes(search.toLowerCase()) ||
      b.bankName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "favorite"
        ? b.isFavorite
        : filter === "domestic"
        ? b.type === "domestic"
        : b.type === "international";
    return matchSearch && matchFilter;
  });

  const toggleFavorite = (id: string) => {
    setBeneficiaries((prev) => prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)));
    info("Favourites Updated", "Beneficiary favourite status changed.");
  };

  const deleteBeneficiary = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    success("Removed", "Beneficiary removed from your directory.");
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Beneficiaries Directory</h3>
          <p className="text-[10px] font-semibold text-text-secondary mt-0.5">Manage your saved payees and recipients.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-custom-md bg-primary text-primary-foreground text-xs font-bold shadow-soft hover:opacity-90 transition-all cursor-pointer outline-none"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Beneficiary
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beneficiaries..."
            className="w-full bg-surface border border-border/80 rounded-custom-xl pl-10 pr-4 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-muted/10 border border-border/60 p-1 rounded-custom-xl select-none">
          {(["all", "favorite", "domestic", "international"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-custom-lg text-[10px] font-bold transition-all cursor-pointer outline-none capitalize",
                filter === f ? "bg-surface text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: beneficiaries.length, icon: <BookUser className="h-3.5 w-3.5" /> },
          { label: "Favourites", value: beneficiaries.filter(b => b.isFavorite).length, icon: <Star className="h-3.5 w-3.5" /> },
          { label: "Domestic", value: beneficiaries.filter(b => b.type === "domestic").length, icon: <Shield className="h-3.5 w-3.5" /> },
          { label: "International", value: beneficiaries.filter(b => b.type === "international").length, icon: <Globe className="h-3.5 w-3.5" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-custom-xl border border-border bg-surface p-3 flex flex-col gap-0.5 select-none">
            <span className="text-muted-foreground">{s.icon}</span>
            <span className="text-lg font-black text-foreground">{s.value}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-4 p-4 rounded-custom-xl border border-border bg-surface hover:shadow-soft transition-all"
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
              style={{ backgroundColor: b.color }}
            >
              {b.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs font-extrabold text-foreground">{b.nickname}</h4>
                <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border",
                  b.type === "international" ? "border-primary/25 bg-primary/5 text-primary" : "border-border bg-muted/10 text-muted-foreground"
                )}>
                  {b.type}
                </span>
                {b.isFavorite && <Star className="h-3 w-3 text-warning fill-warning shrink-0" />}
              </div>
              <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{b.name}</p>
              <p className="text-[10px] font-semibold text-muted-foreground">{b.bankName} · {b.accountNumber}</p>
            </div>
            {b.lastPayment && (
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Last Payment</p>
                <p className="text-xs font-black text-foreground">{formatCurrency(b.lastPayment.amount)}</p>
                <p className="text-[9px] font-semibold text-muted-foreground">{b.lastPayment.date}</p>
              </div>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              {onPayBeneficiary && (
                <button
                  onClick={() => onPayBeneficiary(b)}
                  className="px-3 py-1.5 rounded-custom-md bg-primary text-primary-foreground text-[10px] font-bold hover:opacity-90 transition-all cursor-pointer outline-none"
                  title="Pay this beneficiary"
                >
                  Pay
                </button>
              )}
              <button onClick={() => toggleFavorite(b.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-warning transition-colors cursor-pointer" title="Toggle favourite">
                <Star className={cn("h-4 w-4", b.isFavorite && "fill-warning text-warning")} />
              </button>
              <button onClick={() => setDeleteId(b.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-error transition-colors cursor-pointer" title="Remove beneficiary">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center border border-dashed border-border rounded-custom-xl text-xs font-semibold text-muted-foreground">
            No beneficiaries match your search.
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-custom-xl p-6 space-y-4 max-w-sm w-full shadow-floating">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-error/10 border border-error/20 text-error">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-foreground">Remove Beneficiary?</h4>
                <p className="text-[10px] font-semibold text-text-secondary">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-border rounded-custom-md text-xs font-bold hover:bg-surface-hover transition-all cursor-pointer outline-none">Cancel</button>
              <button onClick={() => deleteBeneficiary(deleteId)} className="flex-1 py-2 bg-error text-error-foreground rounded-custom-md text-xs font-bold hover:opacity-90 transition-all cursor-pointer outline-none shadow-soft">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add beneficiary modal */}
      {addOpen && <AddBeneficiaryModal onClose={() => setAddOpen(false)} onAdd={(b) => {
        setBeneficiaries(prev => [b, ...prev]);
        success("Beneficiary Added", `${b.nickname} added to your directory.`);
        setAddOpen(false);
      }} />}
    </div>
  );
};

interface AddBeneficiaryModalProps {
  onClose: () => void;
  onAdd: (b: PaymentBeneficiary) => void;
}

const COLORS = ["#6366f1","#8b5cf6","#10b981","#f59e0b","#ef4444","#14b8a6","#3b82f6","#ec4899"];

const AddBeneficiaryModal: React.FC<AddBeneficiaryModalProps> = ({ onClose, onAdd }) => {
  const [form, setForm] = React.useState({ name: "", nickname: "", bank: "", account: "", type: "domestic", email: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const initials = form.nickname.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    onAdd({
      id: `ben_${Date.now()}`,
      name: form.name,
      nickname: form.nickname,
      bankName: form.bank,
      accountNumber: form.account,
      type: form.type as "domestic" | "international",
      isFavorite: false,
      color,
      initials,
      email: form.email,
      phone: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-custom-xl shadow-floating w-full max-w-sm space-y-5 p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-foreground">Add Beneficiary</h4>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"><X className="h-4.5 w-4.5" /></button>
        </div>
        <form onSubmit={handleAdd} className="space-y-3">
          {[
            { key: "nickname", label: "Nickname / Alias", placeholder: "e.g. Landlord" },
            { key: "name", label: "Legal Name", placeholder: "Full legal name" },
            { key: "bank", label: "Bank Name", placeholder: "e.g. Chase Bank" },
            { key: "account", label: "Account Number", placeholder: "****1234" },
            { key: "email", label: "Email (Optional)", placeholder: "user@bank.com" },
          ].map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="text-[10px] font-bold text-text-secondary">{f.label}</label>
              <input
                type="text"
                required={f.key !== "email"}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-semibold placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          ))}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-text-secondary">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-background border border-border rounded-custom-lg px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
          </div>
          <div className="flex gap-2.5 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border rounded-custom-md text-xs font-bold hover:bg-surface-hover transition-all cursor-pointer outline-none">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-custom-md text-xs font-bold hover:opacity-90 transition-all cursor-pointer outline-none shadow-soft">
              Add Beneficiary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
