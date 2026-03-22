"use client";
import Navbar from "@/app/components/Navbar";
import { useContent } from "@/app/lib/ContentContext";

export default function PrivacyPage() {
  const { content } = useContent();
  const { privacyPolicy } = content;

  return (
    <div style={{ backgroundColor: "#0F1923", minHeight: "100vh" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#4ABFBF" }}>
          {privacyPolicy.title}
        </h1>
        <p className="text-base leading-relaxed text-white/80 whitespace-pre-wrap">
          {privacyPolicy.body}
        </p>
      </div>
    </div>
  );
}
