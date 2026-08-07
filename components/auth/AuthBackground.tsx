"use client";

import * as React from "react";
import { motion } from "framer-motion";

export const AuthBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0B4F4A] via-[#0F766E] to-[#115E59]">
      {/* Subtle radial light highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.15),transparent_60%)]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft Blurred Floating Circles */}
      <motion.div
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -35, 15, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-16 -left-16 w-[400px] h-[400px] rounded-full bg-accent/15 blur-[120px] pointer-events-none"
      />
      
      <motion.div
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 25, -25, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-24 -right-16 w-[450px] h-[450px] rounded-full bg-teal-400/10 blur-[130px] pointer-events-none"
      />

      {/* Very Subtle Floating Geometric Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 6, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] right-[10%] w-16 h-16 rounded-[20px] border border-white/10 bg-white/[0.02] backdrop-blur-[1px] pointer-events-none"
      />

      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-[20%] left-[8%] w-12 h-12 rounded-full border border-white/5 bg-white/[0.01] pointer-events-none"
      />
    </div>
  );
};
