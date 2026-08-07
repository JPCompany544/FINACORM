export const AUTH_LEFT_PANEL_CONTENT = {
  headline: "Welcome to\nFINACORM Bank",
  supportingText: "Secure, modern banking designed to help you manage your money with confidence from anywhere in the world.",
  securityHighlights: [
    {
      iconName: "Shield" as const,
      title: "Bank-Level Encryption",
      description: "Your financial data is guarded with the highest standard of 256-bit AES encryption.",
    },
    {
      iconName: "Lock" as const,
      title: "Secure Authentication",
      description: "Multi-factor authentication ensures only you have access to your account.",
    },
    {
      iconName: "LifeBuoy" as const,
      title: "24/7 Support",
      description: "Our dedicated security team is available round-the-clock to assist you.",
    },
    {
      iconName: "Globe" as const,
      title: "Trusted Worldwide",
      description: "Millions of clients globally rely on FINACORM Bank for secure digital banking.",
    },
  ],
  footerLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Support", href: "/contact" },
  ],
};

export const AUTH_LOGIN_CONTENT = {
  badge: "Secure Login",
  heading: "Welcome Back",
  supporting: "Sign in to securely access your FINACORM Bank account.",

  emailLabel: "Email Address",
  emailPlaceholder: "name@example.com",

  passwordLabel: "Password",
  passwordPlaceholder: "Enter your password",

  rememberDevice: "Remember this device",

  forgotPassword: "Forgot password?",
  forgotPasswordHref: "/forgot-password",

  submitIdle: "Sign In",
  submitLoading: "Signing You In\u2026",

  dividerText: "New to FINACORM?",
  createAccount: "Open a free account",
  createAccountHref: "/register",

  securityNotice:
    "Your information is protected using bank-level encryption and secure authentication standards.",

  errorMessage:
    "We couldn\u2019t verify those credentials. Please check your email and password and try again.",

  successMessage: "Signed In Successfully",
};

export const AUTH_VALIDATION = {
  // Shared
  emailRequired: "Email address is required.",
  emailInvalid: "Please enter a valid email address.",
  passwordRequired: "Password is required.",
  passwordMinLength: "Password must be at least 8 characters.",
  // Register-specific
  firstNameRequired: "First name is required.",
  lastNameRequired: "Last name is required.",
  phoneRequired: "Phone number is required.",
  phoneInvalid: "Please enter a valid phone number.",
  confirmPasswordRequired: "Please confirm your password.",
  confirmPasswordMismatch: "Passwords do not match.",
  termsRequired: "You must accept the Terms of Service to continue.",
};

export const AUTH_REGISTER_CONTENT = {
  badge: "Open Your Account",
  heading: "Create Your FINACORM Account",
  supporting:
    "Join thousands of customers who trust FINACORM Bank to securely manage their finances.",

  submitIdle: "Create Secure Account",
  submitLoading: "Creating Your Account\u2026",

  securityNotice:
    "Your information is protected using bank-level encryption and secure authentication standards.",

  successHeading: "Account Created Successfully",
  successBody:
    "Your account has been created. Let\u2019s verify your email to continue.",

  errorMessage:
    "Something went wrong while creating your account. Please try again.",
};

export const PASSWORD_STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"] as const;

export const AUTH_FORGOT_PASSWORD_CONTENT = {
  badge: "Account Recovery",
  heading: "Forgot Your Password?",
  supporting:
    "No worries. Enter the email associated with your account and we\u2019ll send you a secure password reset link.",

  emailLabel: "Email Address",
  emailPlaceholder: "name@example.com",

  submitIdle: "Send Reset Link",
  submitLoading: "Sending Secure Link\u2026",

  backToLogin: "Remember your password?",
  backToLoginLink: "Sign In",
  backToLoginHref: "/login",

  securityNotice:
    "Reset links expire after 15 minutes and can only be used once.",

  // Success state
  successHeading: "Check Your Inbox",
  successSupporting:
    "If an account exists for this email address, we\u2019ve sent password reset instructions.",
  successHelper:
    "Didn\u2019t receive the email? Check your spam folder or try again in a few minutes.",
  resendLabel: "Resend Email",
  backToLoginLabel: "Back to Login",

  // Error
  errorMessage:
    "We ran into a problem sending your reset link. Please try again.",
};

