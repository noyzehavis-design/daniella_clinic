"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { useContent } from "@/app/lib/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <footer dir="rtl" style={{ backgroundColor: "#3D3D3D" }} className="text-white">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/BLACK_LOGO.jpg"
            alt={content.clinic.name}
            width={160}
            height={60}
            style={{ filter: "invert(1)" }}
            className="object-contain"
          />
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center md:text-right">

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-[#4ABFBF]">צור קשר</h3>
            <p className="text-white/80">{content.clinic.address}</p>
            <p dir="ltr" className="text-right text-white/80">{content.clinic.phone}</p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-[#4ABFBF]">שעות פתיחה</h3>
            <table className="mx-auto md:mx-0 text-sm">
              <tbody>
                {content.clinic.hours.map(({ day, hours }) => (
                  <tr key={day}>
                    <td className="pl-4 text-white/70 text-right">{day}</td>
                    <td className="text-white/90">{hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-[#4ABFBF]">עקבו אחרינו</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <motion.a
                href={content.clinic.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-white/70 hover:text-[#4ABFBF] transition-colors"
                aria-label="Facebook"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <FaFacebook />
              </motion.a>
              <motion.a
                href={content.clinic.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-white/70 hover:text-[#4ABFBF] transition-colors"
                aria-label="Instagram"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href={content.clinic.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-white/70 hover:text-[#4ABFBF] transition-colors"
                aria-label="YouTube"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <FaYoutube />
              </motion.a>
              <motion.a
                href={`https://wa.me/${content.clinic.social.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-white/70 hover:text-[#4ABFBF] transition-colors"
                aria-label="WhatsApp"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <FaWhatsapp />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-white/50 text-sm">
          {content.footer.copyright}
        </div>
      </motion.div>
    </footer>
  );
}
