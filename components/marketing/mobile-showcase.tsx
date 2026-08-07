"use client";

import * as React from "react";
import { CheckCircle2, ArrowUpRight, ArrowDownLeft, ScanFace, Bell, Zap, Building2, Landmark, MoreHorizontal, ArrowRightLeft, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

// Inline SVGs for store buttons
const AppleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
    <path d="M15.42 16.914c-.053.072-1.3 1.776-3.167 1.776-1.848 0-2.368-1.203-4.502-1.203-2.115 0-2.736 1.222-4.52 1.222-1.832 0-3.18-1.796-3.18-1.796C-2.4 11.83 2.593 4.29 7.02 4.29c1.77 0 3.09 1.157 4.542 1.157 1.433 0 2.92-1.272 4.908-1.272 1.832 0 3.81.993 4.887 2.534-4.148 2.378-3.483 8.358.91 10.026-.82 1.96-2.14 4.093-2.846 5.17h.001z" />
    <path d="M12.753 3.996c.803-.984 1.343-2.348 1.196-3.71-1.156.046-2.612.77-3.447 1.782-.746.905-1.378 2.302-1.196 3.633 1.298.1 2.65-.63 3.447-1.705z" />
  </svg>
);

const PlayLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
    <path d="M17.478 14.886l4.248-2.453c.69-.398.69-1.043 0-1.44l-4.248-2.454-3.155 3.173 3.155 3.174zm-4.195-4.21L4.35 1.777C4.12 1.6 3.844 1.5 3.55 1.5c-.247 0-.495.07-.714.22-.44.296-.7.795-.7 1.35v17.86c0 .556.26.1055.7.135.22.15.467.22.714.22.295 0 .57-.1.8-.278l8.932-8.898zm.974.98L2.83 21.944l9.537-5.508-2.31-2.324a180.12 180.12 0 011.082-1.09-114.73 114.73 0 001.077 1.083z" />
    <path d="M14.257 11.656L3.197 2.06 2.83 2.056l11.427 11.393 2.124-2.13-2.124-2.13z" opacity=".2" />
  </svg>
);

export const MobileShowcase: React.FC = () => {
  return (
    <section className="py-20 tablet:py-32 bg-background select-none overflow-hidden">
      <Container className="max-w-[1280px]">
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-16 laptop:gap-24 items-center">
          
          {/* Left Column: Mobile App Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center items-center relative w-full"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Phone Frame */}
            <div className="relative w-[320px] h-[650px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 shadow-2xl flex flex-col overflow-hidden z-10">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
                <div className="w-28 h-7 bg-slate-900 rounded-b-3xl"></div>
              </div>

              {/* Screen Content */}
              <div className="w-full h-full bg-slate-50 flex flex-col pt-12 pb-6 px-5 overflow-y-auto hide-scrollbar rounded-[36px]">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h5 className="text-[11px] font-semibold text-text-secondary">Good morning,</h5>
                    <h3 className="text-base font-bold text-slate-900">Sarah Jenkins</h3>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-900 border border-slate-100">
                    <ScanFace className="h-5 w-5" />
                  </div>
                </div>

                {/* Balance Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-900 text-white rounded-3xl p-5 mb-6 shadow-medium"
                >
                  <p className="text-xs text-slate-400 font-medium mb-1">Total Balance</p>
                  <div className="flex items-end justify-between mb-4">
                    <h2 className="text-3xl font-extrabold tracking-tight">$24,580.25</h2>
                    <div className="flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      +2.4%
                    </div>
                  </div>
                  
                  {/* Mini Chart */}
                  <div className="h-8 w-full flex items-end justify-between gap-1 mt-4 border-t border-white/10 pt-4">
                    {[30, 45, 25, 60, 40, 75, 55].map((height, i) => (
                      <div key={i} className="w-full bg-white/20 rounded-t-sm" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: ArrowUpRight, label: "Send" },
                    { icon: ArrowDownLeft, label: "Receive" },
                    { icon: ArrowRightLeft, label: "Swap" },
                    { icon: MoreHorizontal, label: "More" },
                  ].map((action, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="flex flex-col items-center gap-1.5 cursor-default"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 shadow-soft flex items-center justify-center text-slate-900 transition-transform active:scale-95">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{action.label}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Transactions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-slate-900">Transactions</h4>
                    <span className="text-[10px] font-bold text-primary">See All</span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { icon: Landmark, name: "Apple Store", date: "Today, 10:24 AM", amount: "-$1,299.00", color: "bg-slate-100 text-slate-900" },
                      { icon: Zap, name: "Stripe Payout", date: "Yesterday", amount: "+$4,500.00", color: "bg-emerald-50 text-emerald-600", isPositive: true },
                      { icon: CreditCard, name: "Uber Ride", date: "Yesterday", amount: "-$24.50", color: "bg-slate-100 text-slate-900" },
                    ].map((tx, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + (i * 0.1) }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-soft"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tx.color}`}>
                            <tx.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h5 className="text-[11px] font-bold text-slate-900">{tx.name}</h5>
                            <p className="text-[9px] text-slate-500 font-medium">{tx.date}</p>
                          </div>
                        </div>
                        <span className={`textxs font-bold ${tx.isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.amount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <div className="space-y-10">
            <div className="space-y-6 max-w-xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-heading-l tablet:text-heading-xl font-bold text-foreground leading-tight"
              >
                Your Bank.<br />
                Always in Your Pocket.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-body-large text-text-secondary leading-relaxed"
              >
                Download the Northstar app to manage your entire financial life from anywhere. Designed for speed, security, and simplicity.
              </motion.p>
            </div>

            {/* Feature Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <ul className="space-y-4">
                {[
                  "Instant global transfers",
                  "Mobile check deposits",
                  "Real-time spending notifications",
                  "Biometric login & security",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-foreground font-semibold">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Download Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col mobile:flex-row gap-4 pt-4"
            >
              <button className="group flex items-center justify-center space-x-3 px-6 py-3.5 rounded-xl border border-border bg-white text-foreground shadow-soft hover:shadow-medium hover:bg-surface-hover transition-all">
                <AppleLogo />
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[10px] text-text-secondary font-semibold mb-0.5">Download on the</span>
                  <span className="text-sm font-extrabold tracking-tight">App Store</span>
                </div>
              </button>
              
              <button className="group flex items-center justify-center space-x-3 px-6 py-3.5 rounded-xl border border-border bg-white text-foreground shadow-soft hover:shadow-medium hover:bg-surface-hover transition-all">
                <PlayLogo />
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[10px] text-text-secondary font-semibold mb-0.5">GET IT ON</span>
                  <span className="text-sm font-extrabold tracking-tight">Google Play</span>
                </div>
              </button>
            </motion.div>
          </div>

        </div>
      </Container>
    </section>
  );
};
