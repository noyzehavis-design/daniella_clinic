"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { FaTooth, FaShieldAlt, FaSearch } from "react-icons/fa";
import GlassCard from "@/app/components/ui/GlassCard";
import SectionHeading from "@/app/components/ui/SectionHeading";
import GlowButton from "@/app/components/ui/GlowButton";
import { useContent } from "@/app/lib/ContentContext";

const iconMap: Record<string, React.ElementType> = {
  FaScan: FaSearch,
  FaShieldAlt,
  FaTooth,
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function ClinicSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content } = useContent();
  const { heading, team, tech, ctaText } = content.clinic_section;

  return (
    <section ref={ref} className="bg-lightBg py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading heading={heading} eyebrow="הצוות שלנו" className="mb-14" />

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {team.map((member, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
            >
              <GlassCard
                variant="light"
                className="flex flex-col items-center text-center p-6"
                style={i === 0 ? { minHeight: "200px" } : undefined}
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-primary/20">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <p className="font-bold text-dark text-lg">{member.name}</p>
                <p className="text-textDark/60 text-sm mt-1">{member.role}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tech Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tech.map((item, i) => {
            const Icon = iconMap[item.icon] ?? FaTooth;
            return (
              <motion.div
                key={i}
                custom={i + team.length}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <GlassCard
                  variant="light"
                  className="flex flex-col items-center text-center p-8"
                >
                  <Icon className="text-primary text-4xl mb-4" />
                  <p className="font-bold text-dark text-lg mb-1">{item.label}</p>
                  <p className="text-textDark/60 text-sm">{item.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Cell — teal gradient */}
        <motion.div
          custom={team.length + tech.length}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={cardVariants}
          className="rounded-[var(--radius-xl)] p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #4ABFBF, #2D9E9E)",
          }}
        >
          <p className="text-white font-bold text-xl mb-6">{ctaText}</p>
          <GlowButton
            href="#footer-form"
            className="!bg-white !text-primary !from-white !to-white shadow-[0_4px_24px_rgba(255,255,255,0.4)]"
          >
            {ctaText}
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
