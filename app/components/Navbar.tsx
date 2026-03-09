"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import GlowButton from "@/app/components/ui/GlowButton";
import { useContent } from "@/app/lib/ContentContext";

export default function Navbar() {
  const { content } = useContent();
  const { phone } = content.clinic;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? {
              backgroundColor: "rgba(15,25,35,0.85)",
              backdropFilter: "blur(20px)",
            }
          : { backgroundColor: "transparent" }
      }
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-l from-primary to-[#7DD8D8] origin-right"
      />

      <div
        className="max-w-7xl mx-auto flex items-center justify-between h-[72px]"
        style={{ padding: "0 max(24px, 5vw)" }}
      >
        {/* Logo — right side in RTL */}
        <a href="/" aria-label="לדף הבית">
          <Image
            src="/clinic-logo.jpg"
            alt="לוגו קליניקת דניאלה"
            width={120}
            height={48}
            className="h-10 md:h-12 w-auto object-contain rounded-lg bg-white/90 px-2 py-1"
            priority
          />
        </a>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="פתח תפריט"
        >
          <span className="text-2xl text-white">{menuOpen ? "✕" : "☰"}</span>
        </button>

        {/* Phone button — left side in RTL */}
        <div className="hidden md:flex items-center">
          <GlowButton href={`tel:${phone.replace(/-/g, "")}`} size="sm">
            <span className="flex items-center gap-2" dir="ltr">
              <FaPhone className="text-xs" />
              <span>{phone}</span>
            </span>
          </GlowButton>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10"
            style={{
              backgroundColor: "rgba(15,25,35,0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex justify-center py-4 px-6">
              <GlowButton href={`tel:${phone.replace(/-/g, "")}`} size="sm">
                <span className="flex items-center gap-2" dir="ltr">
                  <FaPhone className="text-xs" />
                  <span>{phone}</span>
                </span>
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
