"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import GlowButton from "@/app/components/ui/GlowButton";
import { useContent } from "@/app/lib/ContentContext";

const navLinks = [
  { label: "שירותים", href: "#services" },
  { label: "אודות", href: "#about" },
  { label: "תוצאות", href: "#results" },
  { label: "המרפאה", href: "#clinic" },
  { label: "ביקורות", href: "#testimonials" },
  { label: "צור קשר", href: "#inline-form" },
];

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
          : { backgroundColor: "rgba(0,0,0,0)" }
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
            src="/clinic-logo.png"
            alt="לוגו קליניקת דניאלה"
            width={584}
            height={104}
            className="h-10 md:h-12 w-auto object-contain"
            priority
            quality={90}
          />
        </a>

        {/* Center nav links — desktop only */}
        <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

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
            <div className="flex flex-col gap-1 py-4 px-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 px-4 text-white/80 hover:text-white text-base border-b border-white/10"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 flex justify-center">
                <GlowButton href={`tel:${phone.replace(/-/g, "")}`} size="sm">
                  <span className="flex items-center gap-2" dir="ltr">
                    <FaPhone className="text-xs" />
                    <span>{phone}</span>
                  </span>
                </GlowButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
