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

      {/* Deep teal-navy base overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(0,80,90,0.72) 0%, rgba(5,20,35,0.78) 100%)",
        }}
      />

      {/* Vibrant teal accent overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: `
            linear-gradient(to bottom, rgba(74,191,191,0.30) 0%, rgba(74,191,191,0.10) 50%, rgba(45,158,158,0.22) 100%),
            radial-gradient(ellipse at 30% 40%, rgba(74,191,191,0.35) 0%, transparent 55%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto w-full">
        {/* Eyebrow pill */}
        <motion.div {...fadeUp(0.1)}>
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-yellow-400 text-xs">★★★★★</span>
            <span className="text-white/90 font-semibold text-xs">4.8</span>
          </div>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.3)}
          className="font-extrabold text-white leading-[1.1] mb-5"
          style={{ fontSize: { sm: "clamp(2rem,5vw,3.5rem)", md: "clamp(2.5rem,6vw,4.5rem)", lg: "clamp(3rem,8vw,6rem)" }[(content.typography?.heroHeadingSize ?? "lg") as "sm"|"md"|"lg"] ?? "clamp(3rem,8vw,6rem)", fontWeight: 800 }}
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
          <GlowButton href="#inline-form" size="lg">
            {content.hero.ctaText}
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
          +500 מטופלים מרוצים · 15 שנות ניסיון
        </motion.p>

      </div>

      {/* Scroll-down arrow */}
      <motion.div
        dir="ltr"
        className="absolute bottom-8 left-0 right-0 w-full z-10 flex flex-col items-center gap-1 cursor-pointer"
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
