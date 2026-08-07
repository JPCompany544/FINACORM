"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, LifeBuoy, Globe, type LucideIcon } from "lucide-react";
import { AUTH_LEFT_PANEL_CONTENT } from "@/constants/auth";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Lock,
  LifeBuoy,
  Globe,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const SecurityHighlights: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {AUTH_LEFT_PANEL_CONTENT.securityHighlights.map((item, idx) => {
        const IconComponent = ICON_MAP[item.iconName] || Shield;

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ x: 4 }}
            className="flex items-start gap-4 p-3 -ml-3 rounded-xl transition-colors hover:bg-white/5 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="h-5 w-5 stroke-[2]" />
            </div>
            <div className="space-y-1 pt-0.5">
              <h4 className="text-sm font-bold text-white tracking-tight">
                {item.title}
              </h4>
              <p className="text-xs text-white/60 leading-relaxed font-normal max-w-sm">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
