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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <TrustBar />
        <ServiceFormSection />
        <AboutDaniela />
        <PatientsSlider />
        <ClinicSection />
        <TestimonialsSlider />
        <StaffSplit />
        <VideosSection />
        <FooterForm />
        <Footer />
      </main>
      <FloatingButtons />
    </>
  );
}
