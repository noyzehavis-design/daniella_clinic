"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useContent } from "@/app/lib/ContentContext";

export default function PatientsSlider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { content } = useContent();
  const { heading, subheading, images } = content.patients;
  const [activeIndex, setActiveIndex] = useState(0);
  const [total, setTotal] = useState(0);

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">{heading}</h2>
          <p className="text-dark/60 text-lg">{subheading}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          style={{
            "--swiper-navigation-color": "#4ABFBF",
          } as React.CSSProperties}
        >
          <Swiper
            dir="rtl"
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 0, disableOnInteraction: false }}
            speed={4000}
            loop
            allowTouchMove
            spaceBetween={24}
            breakpoints={{
              0:    { slidesPerView: 1 },
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onSwiper={(s) => setTotal(s.slides.length)}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1.5px solid rgba(74,191,191,0.35)",
                    boxShadow: "0 8px 30px rgba(74,191,191,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt={img.caption || `תמונת מטופל ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {img.caption && (
                    <p className="text-center text-sm text-dark/60 py-2 bg-white">
                      {img.caption}
                    </p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Animated pill progress bar */}
          <div className="mt-6 flex items-center gap-2 justify-center">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === activeIndex ? 32 : 8, opacity: i === activeIndex ? 1 : 0.3 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{
                  height: 4,
                  borderRadius: 99,
                  background: "#4ABFBF",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
