"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GlowButton from "@/app/components/ui/GlowButton";
import { siteContent } from "@/app/lib/content";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

type StaffMember = typeof siteContent.staff_split.left;

const bulletVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const bulletItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function StaffPanel({ data }: { data: StaffMember }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showExpanded = isMobile ? isOpen : isHovered;

  return (
    <div
      className="relative flex-1 min-h-[350px] md:min-h-[500px] cursor-pointer overflow-hidden"
      onClick={() => {
        if (isMobile) setIsOpen((p) => !p);
      }}
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsHovered(false);
      }}
    >
      {/* Background image */}
      <Image
        src={data.image}
        alt={data.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Gradient overlay — updated to dark theme */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(15,25,35,0.95) 0%, rgba(15,25,35,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Hover darkening overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: showExpanded ? "rgba(15,25,35,0.5)" : "transparent" }}
      />

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white" dir="rtl">
        <AnimatePresence>
          {showExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mb-4"
            >
              <motion.ul
                variants={bulletVariants}
                initial="hidden"
                animate="visible"
                className="mb-4 space-y-1.5"
              >
                {data.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    variants={bulletItem}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-primary">•</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <GlowButton
                href="#footer-form"
                size="sm"
                onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
              >
                {data.ctaText}
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Teal accent line + name */}
        <div className="w-8 h-[2px] bg-primary mb-2" />
        <p
          className={`font-bold text-white transition-all duration-300 ${
            showExpanded ? "text-xl" : "text-lg"
          }`}
        >
          {data.name}
        </p>
        <p className="text-primary text-sm mt-0.5">{data.role}</p>
      </div>
    </div>
  );
}

export default function StaffSplit() {
  const { left, right } = siteContent.staff_split;
  return (
    <section className="flex flex-col md:flex-row w-full">
      <StaffPanel data={left} />
      <StaffPanel data={right} />
    </section>
  );
}
