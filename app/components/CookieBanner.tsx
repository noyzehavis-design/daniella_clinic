"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("cookie-notice-seen")) return;
    setVisible(true);
    const timer = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setShow(false);
    setTimeout(() => {
      localStorage.setItem("cookie-notice-seen", "1");
      setVisible(false);
    }, 400);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          dir="rtl"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9990,
            background: "rgba(15, 25, 35, 0.97)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(74,191,191,0.25)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/80 leading-relaxed">
              אתר זה משתמש בעוגיות (cookies) לצורך שיפור חוויית הגלישה, ניתוח תנועה ופרסום.
              לפרטים נוספים ראו את{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4ABFBF] underline hover:text-[#3aa8a8] transition-colors"
              >
                מדיניות הפרטיות
              </a>
              .
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={dismiss}
                className="bg-[#4ABFBF] hover:bg-[#3aa8a8] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                אישור וסגירה
              </button>
              <button
                onClick={dismiss}
                aria-label="סגור"
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
