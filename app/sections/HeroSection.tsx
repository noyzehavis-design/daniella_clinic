"use client";

import { motion } from "framer-motion";
import AmbientBackground from "@/app/components/ui/AmbientBackground";
import GlowButton from "@/app/components/ui/GlowButton";
import { siteContent } from "@/app/lib/content";

const { heading, subheading, ctaText } = siteContent.hero;

function HeadingWithGradient({ text }: { text: string }) {
  const keyword = "מושלם";
  const idx = text.indexOf(keyword);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span
        style={{
          background: "linear-gradient(135deg, #4ABFBF, #7DD8D8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {keyword}
      </span>
      {text.slice(idx + keyword.length)}
    </>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const, delay },
});

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-dark flex flex-col items-center justify-center">
      {/* Ambient orbs */}
      <AmbientBackground variant="dark" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,191,191,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,191,191,0.03) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow pill */}
        <motion.div {...fadeUp(0.1)}>
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6">
            {siteContent.clinic.tagline}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.3)}
          className="font-extrabold text-white leading-[1.1] mb-5"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800 }}
        >
          <HeadingWithGradient text={heading} />
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeUp(0.5)}
          className="text-textSecondary text-xl mb-8 max-w-xl leading-relaxed"
        >
          {subheading}
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...fadeUp(0.7)}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <GlowButton href="#footer-form" size="lg">
            {ctaText}
          </GlowButton>
          <a
            href="#inline-form"
            className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-[50px]
                       hover:border-primary hover:text-primary transition-all duration-300"
          >
            גלי עוד ↓
          </a>
        </motion.div>

        {/* Trust micro-line */}
        <motion.p {...fadeUp(0.9)} className="text-textSecondary text-sm mt-6">
          ⭐ 5.0 · +500 מטופלים מרוצים · 15 שנות ניסיון
        </motion.p>
      </div>
    </section>
  );
}
