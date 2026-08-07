"use client";

import * as React from "react";
import Image from "next/image";
import { ShieldCheck, Landmark, Globe2, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";

const features = [
  {
    icon: ShieldCheck,
    title: "Bank-Level Security",
    description: "Your accounts are protected with advanced encryption, continuous fraud monitoring and industry-leading security standards.",
  },
  {
    icon: Landmark,
    title: "Financial Strength",
    description: "Backed by a stable financial foundation, Northstar delivers dependable banking solutions you can rely on every day.",
  },
  {
    icon: Globe2,
    title: "Global Banking",
    description: "Manage your finances internationally with secure transfers, multi-currency support and worldwide banking access.",
  },
  {
    icon: Handshake,
    title: "Dedicated Relationship Banking",
    description: "Receive personalized financial guidance from experienced banking professionals committed to your long-term success.",
  },
];

const featureContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // 100ms stagger
    },
  },
};

const featureVariants = {
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

export const WhyNorthstar: React.FC = () => {
  return (
    <section className="py-[120px] bg-[#FFFFFF] select-none overflow-hidden">
      <Container className="max-w-[1280px]">
        <div className="flex flex-col laptop:flex-row gap-[80px] items-center">
          
          {/* Left Column: Image (45%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full laptop:w-[45%] relative h-[400px] tablet:h-[500px] laptop:h-[620px] rounded-[24px] overflow-hidden shadow-soft"
          >
            <Image
              src="/Why.jpg"
              alt="Northstar banking professionals"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </motion.div>

          {/* Right Column: Content (55%) */}
          <div className="w-full laptop:w-[55%] max-w-[620px] space-y-12">
            
            <div className="space-y-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="inline-block text-xs font-bold uppercase tracking-widest text-[#0F766E]"
              >
                WHY NORTHSTAR
              </motion.span>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-3xl tablet:text-4xl laptop:text-5xl font-bold text-foreground leading-[1.15]"
              >
                Why Customers Bank With Confidence.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-lg text-text-secondary leading-relaxed"
              >
                For decades, Northstar Bank has combined financial strength, personalized service and advanced digital banking to help individuals, families and businesses achieve their financial goals with confidence.
              </motion.p>
            </div>

            <motion.div
              variants={featureContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-1 gap-8"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={featureVariants}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#ECFDF5] shrink-0">
                    <feature.icon className="h-7 w-7 text-[#0F766E]" strokeWidth={1.75} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[17px] font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </Container>
    </section>
  );
};
