"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { FaTooth, FaMedal, FaStar, FaChild } from "react-icons/fa";
import { useContent } from "@/app/lib/ContentContext";

const iconMap: Record<string, React.ElementType> = {
  FaTooth,
  FaMedal,
  FaStar,
  FaChild,
};

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <>{value}</>;
}

export default function TrustBar() {
  const { content } = useContent();
  const { items } = content.trustBar;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="text-white py-6 md:py-8 border-y border-[var(--dark-border)]"
      style={{ backgroundColor: "#141E28" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon];
            const numMatch = item.number?.match(/(\d+)/);
            const numVal = numMatch ? parseInt(numMatch[1]) : null;
            const prefix = item.number?.startsWith("+") ? "+" : "";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.15 }}
                whileHover={{ backgroundColor: "var(--primary-glow)" }}
                className="flex flex-col items-center text-center px-4 py-5 md:border-r md:border-[var(--dark-border)] last:border-0 rounded-xl transition-colors duration-300"
              >
                {Icon && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: "var(--primary-glow)" }}
                  >
                    <Icon className="text-primary text-2xl" />
                  </div>
                )}
                {item.number && numVal !== null && (
                  <p
                    className="text-[2rem] font-bold mb-0.5"
                    style={{
                      background: "linear-gradient(135deg, #4ABFBF, #7DD8D8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {prefix}
                    <CountUp target={numVal} inView={isInView} />
                  </p>
                )}
                <p
                  className={
                    item.number
                      ? "text-[0.85rem] text-textSecondary"
                      : "text-base font-bold text-textPrimary"
                  }
                >
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
