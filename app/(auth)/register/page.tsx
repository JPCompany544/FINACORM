"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ArrowRight, ArrowLeft, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Input,
  Password,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Combobox,
  PhoneNumberInput,
  DatePickerPlaceholder,
  OTPInputWrapper,
} from "@/components/ui/input";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { PasswordStrength, getStrengthScore } from "@/components/auth/PasswordStrength";
import { signUpUser } from "@/lib/supabase";

// ─── Static data ─────────────────────────────────────────────────────────────

const NATIONALITIES = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "ch", label: "Switzerland" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
  { value: "sg", label: "Singapore" },
  { value: "ae", label: "United Arab Emirates" },
];

const STEP_LABELS = ["Personal Details", "Profile & Jurisdiction", "Security Credentials"] as const;

// ─── Slide variants ─────────────────────────────────────────────────────────

const slideVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit:    { opacity: 0, x: -20, transition: { duration: 0.25, ease: "easeIn" as const } },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = React.useState(1);
  const [authState, setAuthState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("Account Created Successfully");
  const [countryCode, setCountryCode] = React.useState("+1");
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    occupation: "",
    address: "",
    nationality: "",
    sipCode: "",
    dob: "",
    maritalStatus: "",
    gender: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    transactionPin: "",
    confirmTransactionPin: "",
    profileImage: null as File | null,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // ── Field handlers ──────────────────────────────────────────────────────────
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 64;
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
            setPreviewUrl(canvas.toDataURL("image/jpeg", 0.7));
          } else {
            setPreviewUrl(reader.result as string);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Step validation ─────────────────────────────────────────────────────────
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.firstname.trim()) newErrors.firstname = "First name is required";
      if (!formData.lastname.trim())  newErrors.lastname  = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.dob)          newErrors.dob   = "Date of Birth is required";
      if (!formData.gender)       newErrors.gender = "Gender selection is required";
    }

    if (currentStep === 2) {
      if (!formData.nationality)         newErrors.nationality   = "Nationality is required";
      if (!formData.occupation.trim())   newErrors.occupation    = "Occupation is required";
      if (!formData.maritalStatus)       newErrors.maritalStatus = "Marital status is required";
      if (!formData.address.trim())      newErrors.address       = "Address is required";
      if (!formData.sipCode.trim())      newErrors.sipCode       = "Zip code is required";
    }

    if (currentStep === 3) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (getStrengthScore(formData.password) < 3) {
        newErrors.password = "Please choose a stronger password";
      }
      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!formData.transactionPin || formData.transactionPin.length !== 4) {
        newErrors.transactionPin = "Transaction PIN must be exactly 4 digits";
      } else if (!/^\d{4}$/.test(formData.transactionPin)) {
        newErrors.transactionPin = "Transaction PIN must be numeric digits only";
      }
      if (!formData.confirmTransactionPin || formData.confirmTransactionPin.length !== 4) {
        newErrors.confirmTransactionPin = "Please confirm your Transaction PIN";
      } else if (formData.confirmTransactionPin !== formData.transactionPin) {
        newErrors.confirmTransactionPin = "Transaction PINs do not match";
      }
      if (!agree) {
        newErrors.agree = "You must accept the Terms of Service";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const handleBack = () => { setStep((s) => s - 1); };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      console.log("[CLIENT DIAGNOSTIC] Blocked duplicate submission request.");
      return;
    }
    if (!validateStep(3)) {
      console.log("[CLIENT DIAGNOSTIC] Form validation failed on step 3.");
      return;
    }

    console.log("[CLIENT DIAGNOSTIC] Triggering signup flow with email:", formData.email);
    setAuthState("loading");
    setServerError("");

    try {
      const result = await signUpUser({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstname,
        last_name: formData.lastname,
        phone: formData.phone,
        transaction_pin: formData.transactionPin,
        origin: window.location.origin,
        avatar_url: previewUrl || undefined,
      });

      console.log("[CLIENT DIAGNOSTIC] Received server action result:", result);

      if (result.success) {
        setAuthState("success");
        if (result.sessionConfirmed) {
          console.log("[CLIENT DIAGNOSTIC] Signup successful with immediate session confirmation.");
          setSuccessMessage("Account created! Redirecting to your dashboard…");
          await new Promise((r) => setTimeout(r, 1200));
          router.push("/dashboard");
        } else {
          console.log("[CLIENT DIAGNOSTIC] Signup successful. Verification email sent.");
          setSuccessMessage("Check your email to verify your account.");
        }
      } else {
        console.error("[CLIENT DIAGNOSTIC] Signup server action returned failure:", result.error);
        setAuthState("error");
        setServerError(
          result.error?.message ||
            "Something went wrong while creating your account. Please try again."
        );
      }
    } catch (err: any) {
      console.error("[CLIENT DIAGNOSTIC] Client caught unhandled error during registration:", err);
      setAuthState("error");
      setServerError(err.message || "An unexpected error occurred during submission.");
    }
  };

  const isLoading = authState === "loading";
  const isSuccess = authState === "success";

  return (
    <AuthCard className="max-w-[460px] relative overflow-hidden">

      {/* ── Badge ──────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary select-none"
        >
          <UserPlus className="h-3 w-3" aria-hidden="true" />
          Open Your Account
        </motion.span>
      </div>

      {/* ── Header + progress ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <AuthHeader
          title="Create Your Northstar Account"
          description={
            isSuccess
              ? successMessage
              : `Step ${step} of 3 — ${STEP_LABELS[step - 1]}`
          }
        />

        {/* Progress bar — hidden on success */}
        {!isSuccess && (
          <div
            className="w-full h-1 bg-divider rounded-full overflow-hidden flex"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${step} of 3`}
          >
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-full flex-1 transition-all duration-500 ${s <= step ? "bg-primary" : "bg-transparent"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Success state ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
          >
            <FormSuccess visible message={successMessage} />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleRegister}
            noValidate
            aria-label="Create account form"
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Server error */}
            <FormError
              id="register-error"
              message={authState === "error" ? serverError : undefined}
            />

            <AnimatePresence mode="wait">
              {/* ════════════════ STEP 1 — Personal Details ════════════════ */}
              {step === 1 && (
                <motion.div key="step-1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First name"
                      name="firstname"
                      placeholder="John"
                      value={formData.firstname}
                      onChange={handleTextChange}
                      error={errors.firstname}
                      autoComplete="given-name"
                      disabled={isLoading}
                      required
                    />
                    <Input
                      label="Last name"
                      name="lastname"
                      placeholder="Doe"
                      value={formData.lastname}
                      onChange={handleTextChange}
                      error={errors.lastname}
                      autoComplete="family-name"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleTextChange}
                    error={errors.email}
                    autoComplete="email"
                    disabled={isLoading}
                    required
                  />

                  <PhoneNumberInput
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                    error={errors.phone}
                    disabled={isLoading}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <DatePickerPlaceholder
                      label="Date of Birth"
                      name="dob"
                      value={formData.dob}
                      onChange={handleTextChange}
                      error={errors.dob}
                      disabled={isLoading}
                      required
                    />
                    <Select value={formData.gender} onValueChange={(val) => handleSelectChange("gender", val)}>
                      <SelectTrigger label="Gender" error={errors.gender} id="gender-select">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="primary" onClick={handleNext} className="w-full sm:w-auto">
                      Continue
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ════════════════ STEP 2 — Profile & Jurisdiction ══════════ */}
              {step === 2 && (
                <motion.div key="step-2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                  <Combobox
                    label="Nationality"
                    options={NATIONALITIES}
                    value={formData.nationality}
                    onChange={(val) => handleSelectChange("nationality", val)}
                    placeholder="Select nationality..."
                    error={errors.nationality}
                    disabled={isLoading}
                  />

                  <Input
                    label="Occupation"
                    name="occupation"
                    placeholder="Software Architect"
                    value={formData.occupation}
                    onChange={handleTextChange}
                    error={errors.occupation}
                    disabled={isLoading}
                    required
                  />

                  <Select value={formData.maritalStatus} onValueChange={(val) => handleSelectChange("maritalStatus", val)}>
                    <SelectTrigger label="Marital Status" error={errors.maritalStatus}>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Input
                        label="Address"
                        name="address"
                        placeholder="120 Wall St"
                        value={formData.address}
                        onChange={handleTextChange}
                        error={errors.address}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Input
                      label="Zip code"
                      name="sipCode"
                      placeholder="10005"
                      value={formData.sipCode}
                      onChange={handleTextChange}
                      error={errors.sipCode}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button type="button" variant="ghost" onClick={handleBack} disabled={isLoading}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="button" variant="primary" onClick={handleNext} disabled={isLoading}>
                      Continue
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ════════════════ STEP 3 — Security Credentials ════════════ */}
              {step === 3 && (
                <motion.div key="step-3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                  {/* Profile image + username */}
                  <div className="flex items-center gap-6 p-1">
                    <div className="flex flex-col items-center shrink-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-image-upload"
                        disabled={isLoading}
                      />
                      <label htmlFor="profile-image-upload" className="cursor-pointer block">
                        <div className="h-16 w-16 rounded-full border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/10 overflow-hidden relative transition-all hover:border-primary hover:bg-primary/5 group">
                          {previewUrl ? (
                            <img src={previewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                              <Camera className="h-4 w-4" />
                              <span className="text-[8px] font-extrabold uppercase tracking-wide mt-1">Upload</span>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    <div className="flex-1">
                      <Input
                        label="Username"
                        name="username"
                        placeholder="johndoe12"
                        value={formData.username}
                        onChange={handleTextChange}
                        error={errors.username}
                        autoComplete="username"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Password with strength indicator */}
                  <div>
                    <Password
                      label="Password"
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleTextChange}
                      error={errors.password}
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                    />
                    <PasswordStrength
                      password={formData.password}
                      visible={formData.password.length > 0}
                    />
                  </div>

                  <Password
                    label="Confirm password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleTextChange}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                  />

                  {/* Transaction PIN */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-start gap-1">
                      <OTPInputWrapper
                        label="Transaction PIN"
                        length={4}
                        value={formData.transactionPin}
                        onChange={(val) => setFormData((prev) => ({ ...prev, transactionPin: val }))}
                        error={errors.transactionPin}
                        helperText="4-digit numeric PIN used to authorize transfers."
                        mask
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <OTPInputWrapper
                        label="Confirm Transaction PIN"
                        length={4}
                        value={formData.confirmTransactionPin}
                        onChange={(val) => setFormData((prev) => ({ ...prev, confirmTransactionPin: val }))}
                        error={errors.confirmTransactionPin}
                        helperText="Re-enter your 4-digit PIN to confirm."
                        mask
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-1.5">
                    <div className="flex items-start space-x-2.5 pt-1">
                      <Checkbox
                        id="terms"
                        checked={agree}
                        onCheckedChange={(checked) => {
                          setAgree(!!checked);
                          if (errors.agree) setErrors((prev) => ({ ...prev, agree: "" }));
                        }}
                        disabled={isLoading}
                      />
                      <label htmlFor="terms" className="text-xs font-semibold text-muted-foreground leading-relaxed cursor-pointer select-none pt-0.5">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                      </label>
                    </div>
                    {errors.agree && (
                      <p role="alert" className="text-xs font-semibold text-error ml-7">{errors.agree}</p>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-2">
                    <Button type="button" variant="ghost" onClick={handleBack} disabled={isLoading}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" />
                      Back
                    </Button>
                    <motion.div whileTap={isLoading ? {} : { scale: 0.985 }} transition={{ duration: 0.12 }}>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading}
                        aria-busy={isLoading}
                      >
                        {isLoading ? "Creating Your Account…" : "Create Secure Account"}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security notice (Steps 1 & 2 only — Step 3 has its own footer) */}
            {step < 3 && (
              <SecurityNotice message="Your information is protected using bank-level encryption and secure authentication standards." />
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Card footer ────────────────────────────────────────────────── */}
      <AuthFooter>
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-bold">
          Sign in
        </Link>
      </AuthFooter>
    </AuthCard>
  );
}
