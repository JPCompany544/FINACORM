"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthBackground } from "./AuthBackground";
import { AuthBrand } from "./AuthBrand";
import { SecurityHighlights } from "./SecurityHighlights";
import { AUTH_LEFT_PANEL_CONTENT } from "@/constants/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-screen w-full bg-background overflow-x-hidden"
    >
      {/* ── Left Side: Decorative Branding & Security Highlights (40% on laptop, 45% on tablet, hidden on mobile) ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden tablet:flex w-[45%] laptop:w-[40%] flex-col justify-between p-10 laptop:p-14 text-white overflow-hidden shrink-0 border-r border-white/5"
      >
        {/* Background layer */}
        <AuthBackground />

        {/* Brand/Logo */}
        <div className="relative z-10">
          <AuthBrand light />
        </div>

        {/* Main highlight area */}
        <div className="relative z-10 flex-grow flex flex-col justify-center py-10 max-w-[420px] space-y-10">
          <div className="space-y-4">
            <h2 className="text-heading-xl laptop:text-display-l font-bold text-white leading-tight whitespace-pre-line tracking-tight">
              {AUTH_LEFT_PANEL_CONTENT.headline}
            </h2>
            <p className="text-body-small laptop:text-body-large text-white/70 leading-relaxed font-normal">
              {AUTH_LEFT_PANEL_CONTENT.supportingText}
            </p>
          </div>

          <SecurityHighlights />
        </div>

        {/* Left Side Footer */}
        <div className="relative z-10 flex items-center gap-6 text-xs font-semibold text-white/50">
          {AUTH_LEFT_PANEL_CONTENT.footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Right Side: Main Authentication Page Content ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 min-h-screen bg-background relative z-10">
        
        {/* Mobile Header block (Logo and Headline shown above the auth card, hidden on tablet/desktop) */}
        <div className="w-full max-w-[460px] flex flex-col gap-6 mb-8 tablet:hidden">
          <AuthBrand />
          <div className="space-y-2 mt-2">
            <h2 className="text-heading-l font-extrabold tracking-tight text-foreground">
              Welcome to Northstar Bank
            </h2>
            <p className="text-body-small text-text-secondary leading-relaxed font-medium">
              Secure, modern banking designed to help you manage your money with confidence from anywhere.
            </p>
          </div>
        </div>

        {/* Reusable Authentication content wrapper with slide-up animation */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="w-full flex justify-center"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};
