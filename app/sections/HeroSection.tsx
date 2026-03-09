"use client";

import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import GlowButton from "@/app/components/ui/GlowButton";
import { useContent } from "@/app/lib/ContentContext";

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

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function HeroSection() {
  const { content } = useContent();
  const { heading, subheading, videoUrl } = content.hero;
  const { phone } = content.clinic;
  const phoneClean = phone.replace(/-/g, "");

  return (
    <section className="relative h-screen overflow-hidden bg-dark flex flex-col items-center justify-center">
      {/* Video background */}
      {videoUrl ? (
        (() => {
          const ytId = getYouTubeId(videoUrl);
          return ytId ? (
            <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${ytId}&playsinline=1&modestbranding=1&rel=0`}
                allow="autoplay; encrypted-media"
                className="absolute"
                style={{
                  top: "50%", left: "50%",
                  width: "177.8vh", height: "100vh",
                  minWidth: "100%", minHeight: "56.25vw",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  border: "none",
                }}
                title="hero background"
              />
            </div>
          ) : null;
        })()
      ) : (
        <video
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(10,18,26,0.55) 0%, rgba(10,18,26,0.45) 60%, rgba(10,18,26,0.65) 100%)",
        }}
      />

      {/* Teal tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(74,191,191,0.08) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(45,158,158,0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto w-full">
        {/* Eyebrow pill */}
        <motion.div {...fadeUp(0.1)}>
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6">
            {content.clinic.tagline}
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
            שיחת ייעוץ חינם
          </GlowButton>
          <a
            href={`tel:${phoneClean}`}
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white
                       border-2 border-white/40 rounded-[50px] hover:border-primary hover:text-primary
                       transition-all duration-300"
            dir="ltr"
          >
            <FaPhone className="text-sm" />
            {phone}
          </a>
        </motion.div>

        {/* Trust micro-line */}
        <motion.p {...fadeUp(0.9)} className="text-textSecondary text-sm mt-6">
          ⭐ 5.0 · +500 מטופלים מרוצים · 15 שנות ניסיון
        </motion.p>
      </div>

      {/* Scroll-down arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        onClick={() =>
          document.getElementById("trust-bar")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span className="text-white/50 text-xs">גלול למטה</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
