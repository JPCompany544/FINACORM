"use client";

import * as React from "react";
import { Lock, Key, ShieldCheck, LifeBuoy, AlertCircle, CheckCircle2, ShieldOff, Camera } from "lucide-react";
import Image from "next/image";
import { PageContainer, PageHeader, PageBody } from "@/components/app-shell";
import { DashboardCard } from "@/components/ui/card";
import { OTPInputWrapper } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useProfile, useSetProfile } from "@/components/app-shell/context";
import { createBrowserClient } from "@/lib/supabase";
import { useToast } from "@/components/app-shell";
import {
  checkHasPinAction,
  setupPinAction,
  changePinAction,
} from "@/app/actions/pin";

type SettingsStatus = "idle" | "loading" | "success" | "error";

// ─── Setup PIN Section (no existing PIN) ─────────────────────────────────────

function SetupPinSection({ onSuccess }: { onSuccess: () => void }) {
  const [newPin, setNewPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [status, setStatus] = React.useState<SettingsStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setErrorMsg("PIN must be exactly 4 digits.");
      return;
    }
    if (confirmPin !== newPin) {
      setErrorMsg("PINs do not match.");
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    const result = await setupPinAction(newPin, confirmPin);

    if (result.success) {
      setStatus("success");
      setNewPin("");
      setConfirmPin("");
      onSuccess();
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Failed to set PIN. Please try again.");
    }
  };

  return (
    <DashboardCard
      title="Set Up Transaction PIN"
      subtitle="Create a 4-digit PIN to authorize transfers. You do not have one configured yet."
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {status === "success" && (
          <div className="flex items-center gap-2 p-3 rounded-custom-lg bg-success/5 border border-success/15 text-success text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Transaction PIN set successfully.
          </div>
        )}

        <div className="flex flex-col gap-4">
          <OTPInputWrapper
            label="New Transaction PIN"
            length={4}
            value={newPin}
            onChange={(val) => { setNewPin(val); setErrorMsg(null); setStatus("idle"); }}
            helperText="4-digit numeric PIN"
            mask
          />
          <OTPInputWrapper
            label="Confirm Transaction PIN"
            length={4}
            value={confirmPin}
            onChange={(val) => { setConfirmPin(val); setErrorMsg(null); setStatus("idle"); }}
            helperText="Re-enter to confirm"
            mask
          />
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-custom-lg bg-error/5 border border-error/10 text-error text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === "loading" || newPin.length < 4 || confirmPin.length < 4}
            className="px-5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft disabled:opacity-50 cursor-pointer outline-none flex items-center gap-1.5"
          >
            {status === "loading" ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Setting PIN…
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                Set Transaction PIN
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardCard>
  );
}

// ─── Change PIN Section (user already has a PIN) ─────────────────────────────

function ChangePinSection() {
  const [currentPin, setCurrentPin] = React.useState("");
  const [newPin, setNewPin] = React.useState("");
  const [confirmPin, setConfirmPin] = React.useState("");
  const [status, setStatus] = React.useState<SettingsStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [lockout, setLockout] = React.useState(false);

  const resetForm = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setErrorMsg(null);
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockout) return;

    if (currentPin.length !== 4) {
      setErrorMsg("Please enter your current 4-digit Transaction PIN.");
      return;
    }
    if (newPin.length !== 4) {
      setErrorMsg("New PIN must be exactly 4 digits.");
      return;
    }
    if (confirmPin !== newPin) {
      setErrorMsg("New PINs do not match.");
      return;
    }
    if (currentPin === newPin) {
      setErrorMsg("New PIN must be different from your current PIN.");
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    const result = await changePinAction(currentPin, newPin, confirmPin);

    if (result.success) {
      setStatus("success");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } else {
      setStatus("error");
      if (result.lockout) {
        setLockout(true);
        setErrorMsg("Too many incorrect PIN attempts. Please try again later.");
      } else {
        setErrorMsg(result.error || "Failed to change PIN. Please try again.");
      }
      setCurrentPin("");
    }
  };

  return (
    <DashboardCard
      title="Change Transaction PIN"
      subtitle="Update your 4-digit Transaction PIN. You must verify your current PIN first."
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {status === "success" && (
          <div className="flex items-center gap-2 p-3 rounded-custom-lg bg-success/5 border border-success/15 text-success text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Transaction PIN changed successfully.
          </div>
        )}

        {lockout && (
          <div className="flex items-center gap-2 p-3 rounded-custom-lg bg-error/5 border border-error/10 text-error text-xs font-bold">
            <ShieldOff className="h-4 w-4 shrink-0" />
            Your PIN is temporarily locked. Please try again later.
          </div>
        )}

        {!lockout && (
          <div className="flex flex-col gap-4">
            {/* Divider label */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Current PIN
              </p>
              <OTPInputWrapper
                label="Current Transaction PIN"
                length={4}
                value={currentPin}
                onChange={(val) => { setCurrentPin(val); setErrorMsg(null); setStatus("idle"); }}
                mask
              />
            </div>

            <div className="h-px bg-border/60" />

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                New PIN
              </p>
              <OTPInputWrapper
                label="New Transaction PIN"
                length={4}
                value={newPin}
                onChange={(val) => { setNewPin(val); setErrorMsg(null); setStatus("idle"); }}
                helperText="4-digit numeric PIN"
                mask
              />
              <OTPInputWrapper
                label="Confirm New Transaction PIN"
                length={4}
                value={confirmPin}
                onChange={(val) => { setConfirmPin(val); setErrorMsg(null); setStatus("idle"); }}
                helperText="Re-enter to confirm"
                mask
              />
            </div>
          </div>
        )}

        {errorMsg && status !== "success" && !lockout && (
          <div className="flex items-center gap-2 p-3 rounded-custom-lg bg-error/5 border border-error/10 text-error text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {!lockout && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={status === "loading"}
              className="px-5 py-2.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-xs font-bold text-foreground transition-colors disabled:opacity-50 cursor-pointer outline-none"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={
                status === "loading" ||
                currentPin.length < 4 ||
                newPin.length < 4 ||
                confirmPin.length < 4
              }
              className="px-5 py-2.5 rounded-custom-md bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-all shadow-soft disabled:opacity-50 cursor-pointer outline-none flex items-center gap-1.5"
            >
              {status === "loading" ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Key className="h-3.5 w-3.5" />
                  Save New PIN
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </DashboardCard>
  );
}

// ─── Forgot PIN Section ───────────────────────────────────────────────────────

function ForgotPinSection() {
  return (
    <DashboardCard
      title="Forgot Transaction PIN?"
      subtitle="Contact our support team if you have lost access to your Transaction PIN."
    >
      <div className="flex items-start gap-4 pt-2">
        <div className="p-2.5 rounded-custom-lg bg-muted/10 border border-border/60 text-muted-foreground shrink-0">
          <LifeBuoy className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            Please contact support to reset your Transaction PIN.
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            For security, we do not offer automatic PIN resets. Our team will verify your identity before assisting with a reset.
          </p>
        </div>
      </div>
    </DashboardCard>
  );
}

// ─── Profile Picture Section ──────────────────────────────────────────────────

function ProfilePictureSection() {
  const profile = useProfile();
  const setProfile = useSetProfile();
  const supabase = createBrowserClient();
  const { success: toastSuccess, error: toastError } = useToast();

  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : "User";
  const initials = profile ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase() : "U";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastError("Upload Failed", "Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toastError("Upload Failed", "Image size must be less than 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found. Please log in again.");

      const img = new window.Image();
      const reader = new FileReader();

      const uploadPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDim = 120;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob(async (blob) => {
                if (!blob) {
                  reject(new Error("Canvas compression failed."));
                  return;
                }
                
                const fileExt = file.name.split('.').pop() || 'jpg';
                const filePath = `${user.id}/profile-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                  .from("avatars")
                  .upload(filePath, blob, {
                    contentType: "image/jpeg",
                    upsert: true,
                  });

                if (uploadError) {
                  reject(uploadError);
                } else {
                  resolve(filePath);
                }
              }, "image/jpeg", 0.85);
            } else {
              reject(new Error("Could not construct 2D context."));
            }
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      });

      const filePath = await uploadPromise;

      const { error: dbError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", user.id);

      if (dbError) throw dbError;

      const { data: signedData, error: signedError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 3600);

      if (signedError || !signedData) throw signedError || new Error("Failed to sign new avatar URL.");

      if (profile) {
        setProfile({
          ...profile,
          avatar_url: signedData.signedUrl,
        });
      }

      toastSuccess("Avatar Updated", "Your profile picture has been successfully updated.");
    } catch (err: any) {
      console.error("Upload error details:", err);
      toastError("Upload Failed", err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardCard
      title="Profile Picture"
      subtitle="Update your personal avatar to be displayed across the banking portal."
    >
      <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full border-2 border-border/80 bg-primary/5 hover:bg-primary/10 flex items-center justify-center font-extrabold text-2xl text-primary transition-all relative select-none overflow-hidden shadow-soft">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              initials
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground hover:opacity-90 rounded-full cursor-pointer outline-none shadow-md transition-all hover:scale-105"
            aria-label="Upload profile image"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-foreground">{displayName}</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Recommended: Square JPG or PNG. Max size 2MB. Your avatar will be compressed automatically for fast loading.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 border border-border bg-surface hover:bg-muted/10 text-[10px] font-bold text-foreground transition-colors rounded-custom-md cursor-pointer outline-none inline-flex items-center gap-1.5"
          >
            Choose Image
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsDashboardPage() {
  const [hasPin, setHasPin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function check() {
      const result = await checkHasPinAction();
      if (!cancelled) setHasPin(result);
    }
    check();
    return () => { cancelled = true; };
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Security & Settings"
        description="Manage your Transaction PIN and security preferences."
      />

      <PageBody className="space-y-6">
        {/* PIN Status Banner */}
        {hasPin !== null && (
          <div
            className={cn(
              "flex items-center gap-3 p-3.5 rounded-custom-xl border text-xs font-bold",
              hasPin
                ? "bg-success/5 border-success/15 text-success"
                : "bg-warning/5 border-warning/15 text-warning"
            )}
          >
            {hasPin ? (
              <ShieldCheck className="h-4 w-4 shrink-0" />
            ) : (
              <ShieldOff className="h-4 w-4 shrink-0" />
            )}
            {hasPin
              ? "Your Transaction PIN is active. Transfers require PIN authorization."
              : "No Transaction PIN configured. Set one up below to enable transfer authorization."}
          </div>
        )}

        {/* Loading state */}
        {hasPin === null && (
          <div className="flex items-center gap-3 p-4 rounded-custom-xl border border-border/60 bg-surface">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-muted-foreground">Loading security settings…</span>
          </div>
        )}

        {/* PIN Management Section */}
        <div className="grid gap-6">
          <ProfilePictureSection />

          {hasPin === false && (
            <SetupPinSection onSuccess={() => setHasPin(true)} />
          )}

          {hasPin === true && (
            <ChangePinSection />
          )}

          {/* Forgot PIN — always visible */}
          {hasPin !== null && <ForgotPinSection />}
        </div>
      </PageBody>
    </PageContainer>
  );
}
