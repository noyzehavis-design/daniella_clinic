"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  heading,
  className = "",
  light = false,
}: SectionHeadingProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`text-center ${className}`}
    >
      {eyebrow && (
        <p className="uppercase tracking-[0.15em] text-[11px] font-semibold text-primary mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] ${
          light ? "text-textPrimary" : "text-dark"
        }`}
      >
        {heading}
      </h2>
      <div className="w-10 h-[3px] bg-primary mx-auto mt-4" />
    </motion.div>
  );
}
