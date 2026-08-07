"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { BRAND_NAME } from "@/constants";

export const CallToAction: React.FC = () => {
  return (
    <section className="py-20 tablet:py-32 bg-background select-none overflow-hidden">
      <Container className="max-w-[1280px]">
        {/* Main CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="relative rounded-[32px] overflow-hidden"
        >
          {/* === Background Layers === */}

          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B4F4A] via-[#0F766E] to-[#0E9280]" />

          {/* Radial overlay for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(20,184,166,0.35),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(15,118,110,0.4),transparent_60%)]" />

          {/* Large blurred circles */}
          <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-accent/20 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-primary/30 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-teal-400/10 blur-[60px] pointer-events-none" />

          {/* Floating abstract shapes */}
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" as const }}
            className="absolute top-8 right-[12%] w-20 h-20 rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" as const, delay: 1 }}
            className="absolute bottom-10 right-[28%] w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" as const, delay: 0.5 }}
            className="absolute top-1/2 -translate-y-1/2 right-[6%] w-8 h-8 rounded-lg border border-white/15 bg-white/5"
          />
          {/* Left side small shapes */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" as const, delay: 0.3 }}
            className="absolute top-10 left-[6%] w-10 h-10 rounded-full border border-white/10 bg-white/5"
          />
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" as const, delay: 2 }}
            className="absolute bottom-12 left-[15%] w-6 h-6 rounded-md border border-white/10 bg-white/5"
          />

          {/* Fine dot grid texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* === Content === */}
          <div className="relative z-10 px-8 py-20 tablet:px-16 tablet:py-28 laptop:px-24 flex flex-col items-center text-center gap-8">

            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-white/90 tracking-wide uppercase">
                <Sparkles className="h-3 w-3 text-teal-300" />
                Get Started Today
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" as const }}
              className="text-display-l tablet:text-display-xl font-bold text-white leading-[1.1] tracking-tight max-w-3xl"
            >
              Ready to Experience{" "}
              <span className="text-teal-300">Better Banking?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" as const }}
              className="text-body-large text-white/70 leading-relaxed max-w-xl"
            >
              Open your {BRAND_NAME} account today and take control of your financial future with secure, modern banking.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" as const }}
              className="flex flex-col mobile:flex-row items-center gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-primary font-bold text-sm px-8 py-4 shadow-floating transition-all duration-200 hover:bg-white/90 hover:shadow-xl"
                >
                  Open an Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold text-sm px-8 py-4 transition-all duration-200 hover:bg-white/20 hover:border-white/50"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xs text-white/40 font-medium pt-2"
            >
              No credit check · FDIC insured · Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
