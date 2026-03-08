"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { siteContent } from "@/app/lib/content";

export default function FloatingButtons() {
  const { phone, social } = siteContent.clinic;
  const phoneClean = phone.replace(/-/g, "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop floating buttons — bottom-left */}
          <motion.div
            key="desktop-buttons"
            className="fixed bottom-6 left-6 z-50 hidden md:flex flex-col gap-3"
            {...fadeUp}
            transition={{ duration: 0.3 }}
          >
            {/* WhatsApp with ping ring */}
            <div className="relative">
              <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-40" />
              <motion.a
                href={`https://wa.me/${social.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl bg-[#25D366]"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp />
              </motion.a>
            </div>

            {/* Phone with tooltip */}
            <div className="relative group">
              <motion.a
                href={`tel:${phoneClean}`}
                aria-label="חייגי עכשיו"
                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl bg-primary"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone />
              </motion.a>
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {phone}
              </span>
            </div>
          </motion.div>

          {/* Mobile CTA bar */}
          <motion.div
            key="mobile-cta"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            {...fadeUp}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() =>
                document
                  .getElementById("footer-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full py-4 font-bold text-white text-lg"
              style={{ background: "linear-gradient(to left, #4ABFBF, #2D9E9E)" }}
            >
              לתיאום ייעוץ חינם
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
