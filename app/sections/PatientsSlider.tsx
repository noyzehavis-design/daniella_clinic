"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { siteContent } from "@/app/lib/content";

export default function PatientsSlider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { heading, subheading, images } = siteContent.patients;

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
            "--swiper-pagination-color": "#4ABFBF",
          } as React.CSSProperties}
        >
          <Swiper
            dir="rtl"
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
            spaceBetween={24}
            breakpoints={{
              0:    { slidesPerView: 1 },
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={img.src}
                      alt={img.caption || `patient-${i + 1}`}
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
        </motion.div>
      </div>
    </section>
  );
}
