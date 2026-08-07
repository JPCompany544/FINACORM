"use client";

import * as React from "react";
import Link from "next/link";
import { Wallet, PiggyBank, Globe, CreditCard, Landmark, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const products = [
  {
    icon: Wallet,
    title: "Checking Account",
    description: "Everyday banking with no hidden fees, instant transfers, and a premium metal debit card.",
    href: "/products/checking",
  },
  {
    icon: PiggyBank,
    title: "Savings Account",
    description: "Grow your money faster with our high-yield savings accounts and automated saving tools.",
    href: "/products/savings",
  },
  {
    icon: Globe,
    title: "International Transfers",
    description: "Send money globally with zero markup on exchange rates and lightning-fast delivery.",
    href: "/products/transfers",
  },
  {
    icon: CreditCard,
    title: "Debit Cards",
    description: "Manage your spending with virtual cards, robust security controls, and instant notifications.",
    href: "/products/cards",
  },
  {
    icon: Landmark,
    title: "Personal Loans",
    description: "Access flexible financing with competitive rates, instant approval, and zero origination fees.",
    href: "/products/loans",
  },
  {
    icon: TrendingUp,
    title: "Investment Accounts",
    description: "Build your wealth with commission-free trading, automated portfolios, and expert insights.",
    href: "/products/investments",
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

export const BankingProducts: React.FC = () => {
  return (
    <section 
      className="py-20 tablet:py-28 select-none bg-cover bg-center relative"
      style={{ backgroundImage: "url('/BG 2.svg')" }}
    >
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
            Everything You Need to Manage Your Money
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-body-large text-text-secondary"
          >
            Powerful banking products designed for your everyday financial life.
          </motion.p>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 laptop:gap-8"
        >
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group flex flex-col p-8 rounded-custom-xl bg-white border border-border shadow-soft transition-all duration-300 hover:shadow-floating"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-6 transition-transform duration-300 group-hover:scale-110">
                <product.icon className="h-6 w-6" />
              </div>
              <h3 className="text-heading-s font-bold text-foreground mb-3">
                {product.title}
              </h3>
              <p className="text-body-small text-text-secondary leading-relaxed flex-grow">
                {product.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};
