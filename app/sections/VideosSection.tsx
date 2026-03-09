"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { useContent } from "@/app/lib/ContentContext";

export default function VideosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const { content } = useContent();
  const { heading, items } = content.videos;

  const shouldLoad = (i: number) => Math.abs(i - activeIndex) <= 1;

  return (
    <section className="bg-gray py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading eyebrow="הסרטונים שלנו" heading={heading} className="mb-12" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            "--swiper-navigation-color": "#4ABFBF",
            "--swiper-pagination-color": "#4ABFBF",
          } as React.CSSProperties}
        >
          <Swiper
            dir="rtl"
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            centeredSlides
            grabCursor
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-lg bg-dark">
                  {shouldLoad(i) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-2xl">▶</span>
                      </div>
                    </div>
                  )}
                </div>
                {item.title && (
                  <p className="text-center text-sm text-textSecondary mt-3 font-medium">
                    {item.title}
                  </p>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
