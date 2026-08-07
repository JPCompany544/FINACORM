"use client";

import * as React from "react";
import { Shield, KeyRound, Activity, ScanFace, Bell, Landmark, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "256-bit Encryption",
    description: "Every byte of data is protected with enterprise-grade encryption standards.",
  },
  {
    icon: KeyRound,
    title: "Multi-Factor Authentication",
    description: "An extra layer of identity verification to keep your account login secure.",
  },
  {
    icon: Activity,
    title: "Fraud Monitoring",
    description: "Smart systems scanning your account 24/7 to detect and flag anomalies.",
  },
  {
    icon: ScanFace,
    title: "Biometric Login",
    description: "Quick, hands-free authentication using secure face or fingerprint recognition.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get notified instantly about account actions, transactions, and login attempts.",
  },
  {
    icon: Landmark,
    title: "FDIC Insured Deposits",
    description: "Your checking and savings deposits are federally insured for complete safety.",
  },
];

const stats = [
  {
    value: "99.99%",
    label: "Platform Uptime",
  },
  {
    value: "50+",
    label: "Countries Served",
  },
  {
    value: "24/7",
    label: "Fraud Monitoring",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export const Security: React.FC = () => {
  return (
    <section 
      className="min-h-[85vh] flex flex-col justify-center py-12 tablet:py-16 select-none overflow-hidden relative bg-cover bg-center"
      style={{ backgroundImage: "url('/security.svg')" }}
    >
      <Container className="max-w-[1100px]">
        <div className="space-y-10 laptop:space-y-12">
          {/* Header Block */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold bg-white/90 backdrop-blur-md text-primary border border-primary/20 gap-1.5 shadow-sm">
                <Shield className="h-4 w-4" />
                Enterprise Security
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl tablet:text-4xl laptop:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight drop-shadow-sm"
            >
              Your Security Comes First
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-lg font-medium text-slate-800 leading-relaxed drop-shadow-sm"
            >
              Every transaction is protected using enterprise-grade security technologies designed to keep your money and personal information safe.
            </motion.p>
          </div>

          {/* Feature List Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-3 gap-4 tablet:gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center text-center space-y-3 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/95"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-900 font-sans">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Statistics Section */}
          <div className="pt-8 tablet:pt-10 border-t border-slate-900/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="space-y-1.5"
                >
                  <span className="block text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans drop-shadow-sm">
                    {stat.value}
                  </span>
                  <p className="text-xs font-extrabold text-primary uppercase tracking-wider font-sans bg-white/50 inline-block px-2 py-0.5 rounded backdrop-blur-sm">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
