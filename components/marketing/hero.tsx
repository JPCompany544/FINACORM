"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image: "/H. Image 1.jpg",
    headline: "Modern Banking Built Around Your Future.",
    paragraph: "Experience secure digital banking, international transfers, flexible lending and personalized financial services backed by decades of trust.",
  },
  {
    image: "/H. Image 2.jpg",
    headline: "Helping Businesses Grow With Confidence.",
    paragraph: "From entrepreneurs to global enterprises, Northstar Bank delivers financial solutions that scale with your ambitions.",
  },
  {
    image: "/H. Image 4.jpg",
    headline: "Relationships Built on Trust.",
    paragraph: "Every customer deserves personal attention, secure banking and financial guidance for every stage of life.",
  },
];

const RADIUS = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Hero: React.FC = () => {
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto rotate slides every 6 seconds, pause on hover
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Framer Motion variants for staggered text entrance
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as any }, // Premium smooth easeOut
    },
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[88vh] tablet:h-[95vh] flex items-center overflow-hidden bg-slate-950 select-none"
    >
      {/* ─── SLIDESHOW BACKGROUND ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={SLIDES[current].image}
              alt={SLIDES[current].headline}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── PREMIUM OVERLAYS ────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Layer 1: Base dark overlay for readability */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Layer 2: Subtle brand green gradient blending softly to the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E]/40 via-[#0F766E]/15 to-transparent mix-blend-multiply" />
      </div>

      {/* ─── SLIDE CONTENT ────────────────────────────────────────────────── */}
      <Container className="relative z-20 w-full h-full flex flex-col justify-center py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[760px] text-left text-white space-y-6 pt-12 tablet:pt-0"
          >
            {/* Eyebrow */}
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#14B8A6]"
            >
              Secure Banking Across Borders
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-display-l tablet:text-display-xl font-bold tracking-tight text-white leading-[1.08] font-sans"
            >
              {SLIDES[current].headline}
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              variants={itemVariants}
              className="text-body-large text-slate-100/90 leading-relaxed max-w-[620px] font-medium"
            >
              {SLIDES[current].paragraph}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 pt-3 w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 bg-[#0F766E] hover:bg-[#115E59] text-white border-none shadow-medium"
                asChild
              >
                <Link href="/register">Open an Account</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 bg-white/5 backdrop-blur-sm border-white/20 hover:bg-white/10 text-white hover:text-white"
                asChild
              >
                <Link href="/features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* ─── BOTTOM TRUST BAR ────────────────────────────────────────────── */}
      <div className="absolute bottom-16 left-0 right-0 z-20 select-none hidden tablet:block">
        <Container>
          <div className="inline-flex items-center gap-x-8 px-6 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-floating text-white">
            {[
              "FDIC Insured",
              "Bank-Level Encryption",
              "International Banking",
              "24/7 Customer Support",
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2 shrink-0">
                <span className="text-[#14B8A6] font-bold text-xs">✔</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-100">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ─── SLIDE INDICATORS ────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-3">
        {SLIDES.map((_, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className="relative w-5 h-5 flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label={`Go to slide ${idx + 1}`}
            >
              {/* Center Dot */}
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  isActive ? "bg-[#14B8A6]" : "bg-white/35 hover:bg-white/65"
                )}
              />

              {/* Progress Circle Ring (Active only) */}
              {isActive && (
                <svg className="absolute w-5 h-5 -rotate-90">
                  <motion.circle
                    cx="10"
                    cy="10"
                    r={RADIUS}
                    fill="transparent"
                    stroke="#14B8A6"
                    strokeWidth="1.5"
                    strokeDasharray={CIRCUMFERENCE}
                    initial={{ strokeDashoffset: CIRCUMFERENCE }}
                    animate={isPaused ? { strokeDashoffset: 0 } : { strokeDashoffset: 0 }}
                    transition={{ duration: isPaused ? 0 : 6, ease: "linear" }}
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
