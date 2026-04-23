"use client";
import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import SectionHeading from "@/app/components/ui/SectionHeading";
import { useContent } from "@/app/lib/ContentContext";

export default function VideosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { content } = useContent();
  const { eyebrow, heading, items } = content.videos;

  const shouldLoad = (i: number) => Math.abs(i - activeIndex) <= 4;
  const allVisible = isBeginning && isEnd;

  const updateNavState = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  return (
    <section aria-label="סרטונים" className="bg-gray py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading eyebrow={eyebrow} heading={heading} className="mb-8" />

        <motion.div
          ref={ref}
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            "--swiper-pagination-color": "#4ABFBF",
          } as React.CSSProperties}
        >
          {/* Custom left arrow (next in RTL) — hidden when all slides visible */}
          {!allVisible && (
            <button
              aria-label="הבא"
              onClick={() => swiperRef?.slideNext()}
              disabled={isEnd}
              className="hidden md:flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ABFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
          )}

          {/* Custom right arrow (prev in RTL) — hidden when all slides visible */}
          {!allVisible && (
            <button
              aria-label="הקודם"
              onClick={() => swiperRef?.slidePrev()}
              disabled={isBeginning}
              className="hidden md:flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ABFBF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          )}

          <Swiper
            dir="rtl"
            modules={[Navigation]}
            spaceBetween={16}
            grabCursor
            onSwiper={(swiper) => {
              setSwiperRef(swiper);
              updateNavState(swiper);
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              updateNavState(swiper);
            }}
            onResize={updateNavState}
            breakpoints={{
              0: { slidesPerView: 1.3, spaceBetween: 12 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 16 },
            }}
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="aspect-[9/14] max-h-[400px] rounded-2xl overflow-hidden shadow-lg bg-dark relative">
                  {shouldLoad(i) ? (
                    <>
                      <iframe
                        src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`}
                        title={item.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                      <div className="absolute inset-0 md:hidden" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-2xl">▶</span>
                      </div>
                    </div>
                  )}
                </div>
                {item.title && (
                  <p className="text-center text-sm text-textSecondary mt-2 font-medium">
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
