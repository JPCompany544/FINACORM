"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

// Fade preset
export const FadeIn: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Fade Up preset
export const FadeUp: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale preset
export const ScaleIn: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide Left preset
export const SlideLeft: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide Right preset
export const SlideRight: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page Transition preset
export const PageTransition: React.FC<AnimationProps> = ({
  children,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children preset
interface StaggerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
}

export const StaggerChildren: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 0.05,
  ...props
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.25, ease: "easeIn" as const } }
};

export const StaggerItem: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => {
  return (
    <motion.div variants={staggerItemVariants} {...props}>
      {children}
    </motion.div>
  );
};

// Hover Lift preset
export const HoverLift: React.FC<AnimationProps> = ({
  children,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Hover Scale preset
export const HoverScale: React.FC<AnimationProps> = ({
  children,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Button Press preset
export const ButtonPress: React.FC<AnimationProps> = ({
  children,
  ...props
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Modal transition preset
export const ModalTransition: React.FC<AnimationProps> = ({
  children,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Drawer transition preset
export const DrawerTransition: React.FC<AnimationProps & { side?: "left" | "right" }> = ({
  children,
  side = "right",
  ...props
}) => {
  return (
    <motion.div
      initial={{ x: side === "right" ? "100%" : "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: side === "right" ? "100%" : "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 220 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
