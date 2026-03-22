"use client";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { useContent } from "@/app/lib/ContentContext";

const SOCIAL_ICON_CLASS =
  "w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-[#4ABFBF] hover:border-[#4ABFBF] transition-colors text-base";

export default function Footer() {
  const { content } = useContent();
  const { clinic, footer } = content;

  const services = ["יישור שיניים", "רופאת ילדים", "שיננית", "iTero"];

  return (
    <footer aria-label="כותרת תחתונה" dir="rtl" style={{ backgroundColor: "#0F1923" }} className="text-white">
      {/* ── Main row ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* RIGHT — Logo + name + tagline */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Image
              src="/clinic-logo.png"
              alt={clinic.name}
              width={52}
              height={52}
              className="object-contain rounded-full"
            />
            <div>
              <p className="font-bold text-white text-base leading-tight">{clinic.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{clinic.tagline}</p>
            </div>
          </div>

          {/* CENTER — Contact + services */}
          <div className="flex flex-col gap-1.5 text-sm text-center">
            <a
              href={`tel:${clinic.phone.replace(/-/g, "")}`}
              dir="ltr"
              className="text-white/80 hover:text-[#4ABFBF] transition-colors font-medium"
            >
              {clinic.phone}
            </a>
            {clinic.email && (
              <a
                href={`mailto:${clinic.email}`}
                className="text-white/60 hover:text-[#4ABFBF] transition-colors"
              >
                {clinic.email}
              </a>
            )}
            <div className="flex items-center justify-center gap-2 text-white/40 text-xs mt-1 flex-wrap">
              {services.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  {i > 0 && <span>•</span>}
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          {/* LEFT — Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className={SOCIAL_ICON_CLASS}
            >
              <FaTiktok />
            </a>
            <a
              href={clinic.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={SOCIAL_ICON_CLASS}
            >
              <FaInstagram />
            </a>
            <a
              href={clinic.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={SOCIAL_ICON_CLASS}
            >
              <FaFacebook />
            </a>
            <a
              href={`https://wa.me/${clinic.social.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={SOCIAL_ICON_CLASS}
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>{footer.copyright}</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white/70 transition-colors">מדיניות פרטיות</a>
            <span>|</span>
            <a href="#" className="hover:text-white/70 transition-colors">הצהרת נגישות</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
