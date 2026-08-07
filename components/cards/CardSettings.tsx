"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/app-shell";

interface CardSettingsProps {
  card: CardItem;
  onUpdateSettings: (id: string, nickname: string, isDefault: boolean) => void;
}

export const CardSettings: React.FC<CardSettingsProps> = ({
  card,
  onUpdateSettings,
}) => {
  const { success } = useToast();

  const [nickname, setNickname] = React.useState(card.name);
  const [isDefault, setIsDefault] = React.useState(card.isDefault);
  const [travelNotice, setTravelNotice] = React.useState(false);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(false);
  const [pushAlerts, setPushAlerts] = React.useState(true);

  // Sync state if card changes
  React.useEffect(() => {
    setNickname(card.name);
    setIsDefault(card.isDefault);
  }, [card]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(card.id, nickname, isDefault);
    success("Settings saved", "Card configurations updated successfully.");
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean, label: string) => {
    const nextVal = !current;
    setter(nextVal);
    success("Notification updated", `${label} notifications ${nextVal ? "enabled" : "disabled"}.`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1 select-none">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Card Settings
        </h3>
        <p className="text-[10px] font-semibold text-text-secondary leading-normal">
          Change card label names, default payment statuses, and alert parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border p-5 rounded-custom-xl space-y-5 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Card Nickname */}
          <div className="space-y-1.5 select-none">
            <label htmlFor="card-nick" className="text-[10px] font-bold text-text-secondary block">Card Nickname</label>
            <input
              id="card-nick"
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-background border border-border rounded-custom-lg px-3 py-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/45 transition-all"
            />
          </div>

          {/* Default Card */}
          <div className="flex items-center justify-between p-4 rounded-custom-lg border border-border bg-background/50 select-none">
            <div className="space-y-0.5">
              <label htmlFor="card-def" className="text-[10px] font-bold text-foreground block">Primary Default Card</label>
              <span className="text-[9px] font-semibold text-text-secondary">
                Set as default wallet token for internal checking wires.
              </span>
            </div>
            <button
              id="card-def"
              type="button"
              onClick={() => setIsDefault(!isDefault)}
              className={cn(
                "h-5 w-9 rounded-full relative shrink-0 transition-colors duration-200 outline-none cursor-pointer",
                isDefault ? "bg-primary" : "bg-muted-foreground/20"
              )}
            >
              <div
                className={cn(
                  "h-3.5 w-3.5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-soft",
                  isDefault ? "right-0.5" : "left-0.5"
                )}
              />
            </button>
          </div>
        </div>

        <div className="h-px bg-border/40 select-none shrink-0" />

        {/* Travel Notice */}
        <div className="flex items-center justify-between p-4 rounded-custom-lg border border-border bg-background/50 select-none">
          <div className="space-y-0.5">
            <label htmlFor="card-travel" className="text-[10px] font-bold text-foreground block">Travel Notice</label>
            <span className="text-[9px] font-semibold text-text-secondary">
              Let us know if traveling abroad to prevent accidental fraud triggers.
            </span>
          </div>
          <button
            id="card-travel"
            type="button"
            onClick={() => handleToggle(setTravelNotice, travelNotice, "Travel Notice")}
            className={cn(
              "h-5 w-9 rounded-full relative shrink-0 transition-colors duration-200 outline-none cursor-pointer",
              travelNotice ? "bg-primary" : "bg-muted-foreground/20"
            )}
          >
            <div
              className={cn(
                "h-3.5 w-3.5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-soft",
                travelNotice ? "right-0.5" : "left-0.5"
              )}
            />
          </button>
        </div>

        <div className="h-px bg-border/40 select-none shrink-0" />

        {/* Transaction Alerts checkboxes */}
        <div className="space-y-3.5 select-none">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Transaction Alerts Channels
          </h4>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { val: emailAlerts, set: setEmailAlerts, label: "Email Alerts", desc: "Receive receipt copies" },
              { val: smsAlerts, set: setSmsAlerts, label: "SMS Texts", desc: "For security locks alerts" },
              { val: pushAlerts, set: setPushAlerts, label: "Push Indicators", desc: "Mobile popups alerts" },
            ].map((chan) => (
              <button
                key={chan.label}
                type="button"
                onClick={() => handleToggle(chan.set, chan.val, chan.label)}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all outline-none",
                  chan.val
                    ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary"
                    : "border-border bg-surface hover:border-border/80"
                )}
              >
                <div>
                  <h5 className="text-[10px] font-bold text-foreground leading-none">{chan.label}</h5>
                  <p className="text-[9px] font-semibold text-text-secondary mt-1 leading-none">{chan.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end select-none">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            Save Card Nickname
          </button>
        </div>
      </form>
    </div>
  );
};
