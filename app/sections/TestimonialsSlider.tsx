"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar, FaGoogle } from "react-icons/fa";
import AmbientBackground from "@/app/components/ui/AmbientBackground";
import GlassCard from "@/app/components/ui/GlassCard";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { siteContent } from "@/app/lib/content";

export default function TestimonialsSlider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { heading, items } = siteContent.testimonials;

  return (
    <section className="relative bg-dark py-16 md:py-24 overflow-hidden">
      <AmbientBackground variant="dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="המטופלים שלנו"
            heading={heading}
            light
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          style={{
            "--swiper-pagination-color": "#4ABFBF",
          } as React.CSSProperties}
        >
          <Swiper
            dir="rtl"
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            grabCursor
            centeredSlides
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1.15 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>
                <GlassCard
                  variant="dark"
                  className="p-6 flex flex-col gap-3 h-full"
                >
                  {/* Opening quote mark */}
                  <div
                    className="text-[80px] leading-none font-serif opacity-30 text-primary"
                    style={{ lineHeight: 1 }}
                  >
                    &ldquo;
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <FaStar key={j} className="text-yellow-400 text-sm" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-textPrimary italic text-sm leading-relaxed flex-1">
                    {item.text}
                  </p>

                  {/* Name + source */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-primary"
                        style={{ backgroundColor: "rgba(74,191,191,0.2)" }}>
                        {item.name.charAt(0)}
                      </div>
                      <p className="font-bold text-textPrimary text-sm">{item.name}</p>
                    </div>
                    {item.source === "google" && (
                      <FaGoogle className="text-[#4285F4] text-lg" />
                    )}
                  </div>
                </GlassCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
