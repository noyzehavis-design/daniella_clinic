"use client";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "dark" | "light";
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className = "",
  variant = "dark",
  hover = true,
  style,
}: GlassCardProps) {
  const base =
    variant === "dark"
      ? "bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
      : "bg-white border-[rgba(74,191,191,0.2)] shadow-[0_8px_32px_rgba(74,191,191,0.08)]";

  return (
    <motion.div
      className={`backdrop-blur-[20px] border rounded-[var(--radius-xl)] ${base} ${className}`}
      style={style}
      whileHover={hover ? {
        scale: 1.02,
        y: -4,
        borderColor: "var(--primary)",
        boxShadow: "0 20px 40px rgba(74,191,191,0.2)"
      } : undefined}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
