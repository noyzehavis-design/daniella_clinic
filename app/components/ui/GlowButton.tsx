"use client";
import { motion } from "framer-motion";

interface GlowButtonProps {
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function GlowButton({
  href,
  onClick,
  children,
  className = "",
  size = "md",
  fullWidth = false,
  type = "submit",
}: GlowButtonProps) {
  const padding =
    size === "sm"
      ? "px-5 py-2 text-sm"
      : size === "lg"
      ? "px-10 py-4 text-lg"
      : "px-8 py-3";

  const cls = `inline-block rounded-[50px] font-semibold text-white cursor-pointer transition-all
    bg-gradient-to-br from-primary to-primaryDark
    shadow-[0_4px_24px_rgba(74,191,191,0.4)] ${padding} ${
    fullWidth ? "w-full text-center" : ""
  } ${className}`;

  const motionProps = {
    whileHover: { scale: 1.05, boxShadow: "0 8px 40px rgba(74,191,191,0.6)" },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.2 },
  };

  if (href)
    return (
      <motion.a href={href} className={cls} {...motionProps}>
        {children}
      </motion.a>
    );

  return (
    <motion.button onClick={onClick} type={type} className={cls} {...motionProps}>
      {children}
    </motion.button>
  );
}
