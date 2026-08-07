"use client";

import * as React from "react";
import { ShieldCheck, Globe, Clock, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Bank-Level Security",
    description: "Advanced encryption, fraud monitoring, and secure authentication keep your finances protected.",
  },
  {
    icon: Globe,
    title: "Global Banking",
    description: "Access your money anytime, anywhere with seamless international banking services.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock whenever you need assistance.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Institution",
    description: "Thousands of customers trust Northstar Bank for safe and reliable digital banking.",
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export const TrustIndicators: React.FC = () => {
  return (
    <section className="py-20 tablet:py-28 bg-white select-none">
      <Container className="max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-heading-l tablet:text-heading-xl font-bold text-foreground"
          >
            Trusted by Thousands Worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-body-large text-text-secondary"
          >
            Your money deserves a bank built on security, transparency, and reliability.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-6 laptop:gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center text-center p-8 rounded-custom-xl bg-white border border-border shadow-soft transition-all duration-300 hover:shadow-medium"
            >
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary mb-6">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-heading-s font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-body-small text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
