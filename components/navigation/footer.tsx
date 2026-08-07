"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, Mail, CheckCircle2, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/constants";

// ─── Social icons ────────────────────────────────────────────────────────────

const XIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

// ─── Nav columns data ────────────────────────────────────────────────────────

const NAV_COLUMNS = [
  {
    heading: "Personal Banking",
    links: [
      { label: "Checking", href: "/personal" },
      { label: "Savings", href: "/personal" },
      { label: "Cards", href: "/cards" },
      { label: "Transfers", href: "/personal" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "News", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Security", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
];

const BOTTOM_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Accessibility", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "#", Icon: XIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "GitHub", href: "#", Icon: GitHubIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

const LANGUAGES = ["English", "Français", "Español", "Deutsch", "中文"];

// ─── Theme Toggle ────────────────────────────────────────────────────────────

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-24 rounded-full bg-white/10 animate-pulse" />;

  const options = [
    { value: "light", icon: Sun },
    { value: "system", icon: Monitor },
    { value: "dark", icon: Moon },
  ] as const;

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          aria-label={`Switch to ${value} theme`}
          onClick={() => setTheme(value)}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200",
            theme === value
              ? "bg-white/20 text-white"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
};

// ─── Language Selector ───────────────────────────────────────────────────────

const LanguageSelector: React.FC = () => {
  const [selected, setSelected] = React.useState("English");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="footer-language-selector"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white/90 hover:bg-white/10 transition-all duration-200"
      >
        🌐 {selected}
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select language"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 min-w-[140px] rounded-custom-md border border-white/10 bg-[#0D1929] shadow-floating py-1.5 z-50"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang}>
                <button
                  role="option"
                  aria-selected={selected === lang}
                  onClick={() => { setSelected(lang); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-semibold transition-colors duration-150",
                    selected === lang
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  {lang}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Footer ─────────────────────────────────────────────────────────────

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#070E1A] text-white mt-auto" aria-label="Site footer">

      {/* ── Main footer body ───────────────────────────────────────────── */}
      <Container className="pt-20 pb-16">
        <div className="grid grid-cols-1 gap-12 tablet:grid-cols-2 laptop:grid-cols-[1.8fr_1fr_1fr_1fr_1.6fr]">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-white group"
              aria-label={`${BRAND_NAME} home`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/30 transition-colors group-hover:bg-primary/30 overflow-hidden select-none">
                <img src="/Logo-main.png" alt="Logo" className="h-6 w-6 object-contain" />
              </span>
              <span>{BRAND_NAME}</span>
            </Link>

            {/* Description */}
            <p className="text-sm text-white/50 leading-relaxed max-w-[280px]">
              A modern, production-grade financial platform offering enterprise-grade security, premium investments, and transparent banking.
            </p>

            {/* Social row */}
            <div className="flex items-center gap-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-all duration-200 hover:text-white hover:bg-white/10"
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* FDIC badge */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-wider">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-white/10">
                <CheckCircle2 className="h-3 w-3 text-primary" />
              </div>
              FDIC Insured · Member FINRA/SIPC
            </div>
          </motion.div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col, colIdx) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * (colIdx + 1) }}
              className="flex flex-col gap-5"
            >
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-white/55 transition-colors duration-150 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="flex flex-col gap-5"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30">
              Newsletter
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Get market updates, rate alerts, and product news delivered to your inbox.
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5 rounded-custom-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  You're subscribed!
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col gap-2.5"
                  aria-label="Newsletter sign-up"
                >
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-custom-md border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 focus:border-primary/50 focus:bg-white/8 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 w-full rounded-custom-md bg-primary font-bold text-sm text-primary-foreground transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
                  >
                    Subscribe
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <Container className="py-6">
        <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">

          {/* Left: copyright */}
          <p className="text-xs text-white/30 font-medium">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>

          {/* Centre: bottom links */}
          <nav aria-label="Legal links" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {BOTTOM_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-white/30 font-medium transition-colors duration-150 hover:text-white/70"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: language + theme toggle */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
          </div>

        </div>
      </Container>
    </footer>
  );
};
