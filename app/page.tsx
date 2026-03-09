"use client";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/sections/HeroSection";
import TrustBar from "@/app/sections/TrustBar";
import ServiceFormSection from "@/app/sections/ServiceFormSection";
import AboutDaniela from "@/app/sections/AboutDaniela";
import PatientsSlider from "@/app/sections/PatientsSlider";
import ClinicSection from "@/app/sections/ClinicSection";
import TestimonialsSlider from "@/app/sections/TestimonialsSlider";
import StaffSplit from "@/app/sections/StaffSplit";
import VideosSection from "@/app/sections/VideosSection";
import FooterForm from "@/app/sections/FooterForm";
import Footer from "@/app/components/Footer";
import FloatingButtons from "@/app/components/FloatingButtons";

const SectionDivider = () => (
  <div style={{ height: "2px", background: "linear-gradient(to left, transparent, #4ABFBF 50%, transparent)" }} />
);

export default function Home() {
  return (
    <>
      <Navbar />
      <motion.main
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
        <SectionDivider />
        <div id="trust-bar"><TrustBar /></div>
        <SectionDivider />
        <div id="services"><ServiceFormSection /></div>
        <SectionDivider />
        <div id="about"><AboutDaniela /></div>
        <SectionDivider />
        <div id="results"><PatientsSlider /></div>
        <SectionDivider />
        <div id="clinic"><ClinicSection /></div>
        <SectionDivider />
        <div id="testimonials"><TestimonialsSlider /></div>
        <SectionDivider />
        <StaffSplit />
        <SectionDivider />
        <VideosSection />
        <SectionDivider />
        <FooterForm />
        <SectionDivider />
        <Footer />
      </motion.main>
      <FloatingButtons />
    </>
  );
}
