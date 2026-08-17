"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { useContent } from "@/app/lib/ContentContext";
import { getLeadSource, trackEvent } from "@/app/lib/tracking";

const MOBILE_CTA_TEXT = "לתיאום שיחת ייעוץ";

export default function FloatingButtons() {
  const { content } = useContent();
  const { phone, social } = content.clinic;
  const phoneClean = phone.replace(/-/g, "");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll(); // honour the position the page was restored/loaded at
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // These containers are position:fixed and stay mounted from first paint —
  // they only fade. Mounting them mid-scroll (the old behaviour) made mobile
  // browsers lay them out against the viewport as it was *during* the
  // toolbar collapse animation, which left the bottom bar stuck halfway off
  // the screen. visibility:hidden also keeps them out of the tab order and
  // the accessibility tree while they're faded out.
  const reveal = {
    opacity: visible ? 1 : 0,
    visibility: visible ? ("visible" as const) : ("hidden" as const),
    pointerEvents: visible ? ("auto" as const) : ("none" as const),
    transition: "opacity 0.3s ease, visibility 0.3s ease",
  };

  return (
    <>
      {/* Desktop floating buttons — bottom-left */}
      <div
        className="fixed bottom-6 left-6 z-50 hidden md:flex flex-col gap-3"
        style={reveal}
        data-track-location="floating-desktop"
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
      </div>

      {/* Mobile floating buttons — bottom-left, stacked */}
      <div
        className="md:hidden flex"
        data-track-location="floating-mobile"
        style={{
          ...reveal,
          position: "fixed",
          bottom: 70,
          left: 24,
          zIndex: 9999,
          gap: 12,
          flexDirection: "column",
        }}
      >
        {/* WhatsApp */}
        <div className="relative">
          <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-40" />
          <motion.a
            href={`https://wa.me/${social.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="relative w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl bg-[#25D366]"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp />
          </motion.a>
        </div>
        {/* Phone */}
        <motion.a
          href={`tel:${phoneClean}`}
          aria-label="חייגי עכשיו"
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl bg-primary"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPhone />
        </motion.a>
      </div>

      {/* Mobile CTA bar. The safe-area padding sits on the wrapper and the
          height on the button, so a phone with a home indicator adds space
          below the bar instead of eating into it. */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0"
        style={{
          ...reveal,
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "linear-gradient(to left, #4ABFBF, #2D9E9E)",
          zIndex: 9998,
        }}
      >
        <button
          onClick={() => {
            // Intent signal only — the lead itself is counted on form success.
            trackEvent("cta_click", {
              link_location: "mobile-cta-bar",
              link_text: MOBILE_CTA_TEXT,
              lead_source: getLeadSource(),
            });
            document
              .getElementById("inline-form")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="לתיאום שיחת ייעוץ - גלול לטופס"
          className="w-full font-bold text-white text-lg"
          style={{ height: 52 }}
        >
          {MOBILE_CTA_TEXT}
        </button>
      </div>
    </>
  );
}
