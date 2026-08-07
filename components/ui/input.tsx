"use client";

import * as React from "react";
import { Eye, EyeOff, Search as SearchIcon, X, Calendar, Loader2 } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";

// --- Form Field Wrapper Component ---
export interface FormFieldWrapperProps {
  id?: string;
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  id,
  label,
  error,
  success,
  helperText,
  isLoading,
  disabled,
  children,
}) => {
  return (
    <div className={cn("w-full flex flex-col space-y-1.5", disabled && "opacity-60")}>
      {label && (
        <label htmlFor={id} className="text-label text-text-secondary select-none">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {children}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pr-1.5 select-none pointer-events-none z-10">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-error">{error}</p>}
      {!error && success && <p className="text-xs font-semibold text-success">{success}</p>}
      {!error && !success && helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

// --- Input Component ---
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  isLoading?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      success,
      helperText,
      isLoading,
      prefixIcon,
      suffixIcon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        success={success}
        helperText={helperText}
        isLoading={isLoading}
        disabled={disabled}
      >
        <div className="relative w-full">
          {prefixIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none">
              {prefixIcon}
            </div>
          )}
          <input
            id={id}
            type={type}
            disabled={disabled}
            className={cn(
              "flex h-11 w-full rounded-custom-md border border-border bg-surface px-3.5 py-2 text-sm text-foreground shadow-soft transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5",
              prefixIcon && "pl-10",
              (suffixIcon || isLoading) && "pr-10",
              error && "border-error focus:border-error focus:ring-error/20",
              !error && success && "border-success focus:border-success focus:ring-success/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffixIcon && !isLoading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
              {suffixIcon}
            </div>
          )}
        </div>
      </FormFieldWrapper>
    );
  }
);
Input.displayName = "Input";

// --- Password Component ---
export type PasswordProps = Omit<InputProps, "type" | "suffixIcon">;

export const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({ className, error, label, success, helperText, isLoading, disabled, id, ...props }, ref) => {
    const [show, setShow] = React.useState(false);

    return (
      <Input
        ref={ref}
        id={id}
        type={show ? "text" : "password"}
        label={label}
        error={error}
        success={success}
        helperText={helperText}
        isLoading={isLoading}
        disabled={disabled}
        className={className}
        suffixIcon={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    );
  }
);
Password.displayName = "Password";

// --- Search Component ---
export interface SearchProps extends Omit<InputProps, "prefixIcon"> {
  onClear?: () => void;
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onClear, value, id, label, error, success, helperText, isLoading, disabled, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        id={id}
        type="text"
        label={label}
        error={error}
        success={success}
        helperText={helperText}
        isLoading={isLoading}
        disabled={disabled}
        value={value}
        prefixIcon={<SearchIcon className="h-4 w-4" />}
        suffixIcon={
          value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    );
  }
);
Search.displayName = "Search";

// --- Textarea Component ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  isLoading?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, success, helperText, isLoading, disabled, id, ...props }, ref) => {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        success={success}
        helperText={helperText}
        isLoading={isLoading}
        disabled={disabled}
      >
        <textarea
          id={id}
          disabled={disabled}
          className={cn(
            "flex min-h-[80px] w-full rounded-custom-md border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground shadow-soft transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5",
            error && "border-error focus:border-error focus:ring-error/20",
            !error && success && "border-success focus:border-success focus:ring-success/20",
            className
          )}
          ref={ref}
          {...props}
        />
      </FormFieldWrapper>
    );
  }
);
Textarea.displayName = "Textarea";

// --- Date Picker Placeholder Component ---
export type DatePickerPlaceholderProps = InputProps;

export const DatePickerPlaceholder = React.forwardRef<HTMLInputElement, DatePickerPlaceholderProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        prefixIcon={<Calendar className="h-4 w-4" />}
        className={cn("appearance-none [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer", className)}
        {...props}
      />
    );
  }
);
DatePickerPlaceholder.displayName = "DatePickerPlaceholder";

// --- Phone Number Input Component ---
export interface PhoneNumberInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

export const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      countryCode = "+1",
      onCountryCodeChange,
      label,
      error,
      success,
      helperText,
      isLoading,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const codes = ["+1", "+44", "+33", "+49", "+81", "+86"];

    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        success={success}
        helperText={helperText}
        isLoading={isLoading}
        disabled={disabled}
      >
        <div className="flex w-full gap-2 relative">
          <select
            disabled={disabled}
            value={countryCode}
            onChange={(e) => onCountryCodeChange?.(e.target.value)}
            className="flex h-11 w-20 rounded-custom-md border border-border bg-surface px-2.5 text-sm text-foreground shadow-soft transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5 cursor-pointer font-semibold"
          >
            {codes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <input
              ref={ref}
              id={id}
              type="tel"
              disabled={disabled}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                "flex h-11 w-full rounded-custom-md border border-border bg-surface px-3.5 py-2 text-sm text-foreground shadow-soft transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5",
                error && "border-error focus:border-error focus:ring-error/20",
                !error && success && "border-success focus:border-success focus:ring-success/20",
                className
              )}
              {...props}
            />
          </div>
        </div>
      </FormFieldWrapper>
    );
  }
);
PhoneNumberInput.displayName = "PhoneNumberInput";

// --- Combobox Component ---
export interface ComboboxProps {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  isLoading?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  label,
  error,
  success,
  helperText,
  isLoading,
  disabled,
  className,
  id,
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = React.useMemo(() => {
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      success={success}
      helperText={helperText}
      isLoading={isLoading}
      disabled={disabled}
    >
      <div ref={containerRef} className="relative w-full">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-custom-md border border-border bg-surface px-3.5 py-2 text-sm text-foreground shadow-soft transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5 text-left",
            error && "border-error focus:border-error focus:ring-error/20",
            !error && success && "border-success focus:border-success focus:ring-success/20",
            className
          )}
        >
          <span className={cn(!selectedOption && "text-muted-foreground")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="text-muted-foreground text-[10px] select-none ml-2">▼</span>
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1.5 bg-surface border border-border rounded-custom-md shadow-dropdown max-h-56 overflow-y-auto p-1 animate-in fade-in-50 slide-in-from-top-1.5 duration-100">
            <div className="relative p-1 border-b border-divider mb-1">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-8 pl-7 pr-2 rounded text-xs bg-muted/10 border-0 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
            {filteredOptions.length === 0 ? (
              <div className="py-2.5 px-3 text-xs text-muted-foreground text-center">No options found.</div>
            ) : (
              filteredOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded px-3 py-2 text-xs text-foreground hover:bg-surface-hover transition-colors font-semibold text-left",
                    o.value === value && "text-primary bg-primary/5"
                  )}
                >
                  <span>{o.label}</span>
                  {o.value === value && <span className="text-primary text-[10px]">✓</span>}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </FormFieldWrapper>
  );
};

// --- Select Component ---
export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    label?: string;
    error?: string;
    success?: string;
    helperText?: string;
    isLoading?: boolean;
  }
>(({ className, children, error, success, label, helperText, isLoading, disabled, id, ...props }, ref) => (
  <FormFieldWrapper
    id={id}
    label={label}
    error={error}
    success={success}
    helperText={helperText}
    isLoading={isLoading}
    disabled={disabled}
  >
    <SelectPrimitive.Trigger
      ref={ref}
      id={id}
      disabled={disabled}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-custom-md border border-border bg-surface px-3.5 py-2 text-sm text-foreground shadow-soft transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted/5",
        error && "border-error focus:border-error focus:ring-error/20",
        !error && success && "border-success focus:border-success focus:ring-success/20",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="text-muted-foreground ml-2 text-[10px] select-none">▼</span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  </FormFieldWrapper>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-custom-md border border-border bg-surface text-foreground shadow-medium data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm outline-none focus:bg-surface-hover focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 font-semibold",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <span className="text-primary text-xs font-bold">✓</span>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// --- Checkbox Component ---
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: string;
    error?: string;
  }
>(({ className, label, error, id, ...props }, ref) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center space-x-2.5">
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded border border-border bg-surface shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary cursor-pointer",
          error && "border-error focus-visible:ring-error",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
          <span className="text-xs font-bold text-white">✓</span>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-foreground cursor-pointer select-none leading-none">
          {label}
        </label>
      )}
    </div>
    {error && <p className="text-xs font-semibold text-error ml-7">{error}</p>}
  </div>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// --- Radio Component ---
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2.5">
        <input
          type="radio"
          id={id}
          className={cn(
            "h-4.5 w-4.5 border border-border text-primary bg-surface focus:ring-primary focus:ring-offset-2 accent-primary disabled:opacity-50 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-foreground cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";

// --- Switch Component ---
export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    label?: string;
  }
>(({ className, label, id, ...props }, ref) => (
  <div className="flex items-center space-x-3">
    <SwitchPrimitive.Root
      id={id}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted/30",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
    {label && (
      <label htmlFor={id} className="text-sm font-semibold text-foreground cursor-pointer select-none">
        {label}
      </label>
    )}
  </div>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

// --- OTP Input Component ---
export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  label?: string;
  helperText?: string;
  /** When true, filled digits are rendered as bullets (•) to mask the PIN value */
  mask?: boolean;
}

export const OTPInputWrapper: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  error,
  label,
  helperText,
  mask = false,
}) => {
  return (
    <div className="flex flex-col items-center space-y-1.5 w-full">
      {label && <span className="text-label text-text-secondary select-none self-start">{label}</span>}
      <OTPInput
        maxLength={length}
        value={value}
        onChange={onChange}
        containerClassName="group flex items-center gap-2"
        pattern={REGEXP_ONLY_DIGITS}
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <div
                key={idx}
                className={cn(
                  "relative h-12 w-12 flex items-center justify-center text-lg font-bold border border-border bg-surface rounded-custom-md transition-all shadow-soft",
                  slot.isActive && "border-primary ring-2 ring-primary/20",
                  error && "border-error ring-2 ring-error/20"
                )}
              >
                {mask && slot.char ? (
                  <span className="text-foreground select-none">•</span>
                ) : (
                  slot.char
                )}
                {slot.hasFakeCaret && (
                  <span className="absolute inset-0 flex items-center justify-center animate-pulse text-primary font-light">
                    |
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      />
      {error && <p className="text-xs font-semibold text-error">{error}</p>}
      {!error && helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
};
