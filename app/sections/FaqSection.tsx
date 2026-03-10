"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { useContent } from "@/app/lib/ContentContext";

export default function FaqSection() {
  const { content } = useContent();
  const { heading, items } = content.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-dark py-16 md:py-24" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeading heading={heading} eyebrow="שאלות ותשובות" light />
        <div className="mt-10 flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 overflow-hidden"
              style={{ background: "var(--glass-bg)" }}
            >
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-right text-textPrimary font-semibold text-base hover:text-primary transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span>{item.question}</span>
                <span
                  className="text-primary text-xl transition-transform duration-300"
                  style={{ transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-textSecondary text-sm leading-relaxed border-t border-white/10 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
