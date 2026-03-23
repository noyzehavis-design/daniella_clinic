"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { FaTooth, FaMedal, FaSmile, FaStar } from "react-icons/fa";
import AmbientBackground from "@/app/components/ui/AmbientBackground";
import GlassCard from "@/app/components/ui/GlassCard";
import GlowButton from "@/app/components/ui/GlowButton";
import { useContent } from "@/app/lib/ContentContext";

const iconMap: Record<string, React.ElementType> = {
  FaTooth,
  FaMedal,
  FaSmile,
  FaStar,
};

export default function AboutDaniela() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content } = useContent();
  const { name, title, bio, image, strengths, ctaText } = content.about;

  return (
    <section aria-label="אודות" className="relative bg-dark py-16 md:py-24 overflow-hidden">
      <AmbientBackground variant="dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden"
              style={{
                borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                boxShadow: "0 0 0 4px #4ABFBF, 0 0 40px rgba(74,191,191,0.35)",
                animation: "float 6s ease-in-out infinite",
              }}
            >
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <h2 style={{ fontSize: { sm: "clamp(1.5rem,3vw,2rem)", md: "clamp(2rem,5vw,3.5rem)", lg: "clamp(2.5rem,6vw,4.5rem)" }[(content.typography?.sectionHeadingSize ?? "md") as "sm"|"md"|"lg"] }} className="font-bold text-textPrimary mb-1">
              {name}
            </h2>
            <p className="text-primary font-semibold mb-4">{title}</p>
            {bio.includes("<") ? (
              <div className="text-textSecondary leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: bio }} />
            ) : (
              <p className="text-textSecondary leading-relaxed mb-8">{bio}</p>
            )}

            {/* Strengths 2×2 grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {strengths.map((s, i) => {
                const Icon = iconMap[s.icon];
                return (
                  <GlassCard key={i} variant="dark" className="flex items-center gap-3 p-4">
                    {Icon && (
                      <Icon className="text-primary text-xl flex-shrink-0" />
                    )}
                    <span className="font-bold text-textPrimary text-sm">
                      {s.label}
                    </span>
                  </GlassCard>
                );
              })}
            </div>

            <GlowButton href="#inline-form">{ctaText}</GlowButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
