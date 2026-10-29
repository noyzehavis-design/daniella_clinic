"use client";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import Navbar from "@/app/components/Navbar";
import { useContent } from "@/app/lib/ContentContext";

/**
 * Where both lead forms land once the server has confirmed the lead.
 *
 * Meta blocks the standard Lead event for this pixel (health data policy),
 * so the conversion is measured as a custom conversion on this URL instead.
 * The pixel and GA4 both record the client-side navigation here as a page
 * view on their own, so nothing is fired from this page.
 */
export default function ThankYouPage() {
  const { content } = useContent();

  return (
    <div style={{ backgroundColor: "#0F1923", minHeight: "100vh" }}>
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(74,191,191,0.2)" }}
        >
          <FaCheck className="text-2xl" style={{ color: "#4ABFBF" }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "#4ABFBF" }}>
          {content.forms.successMessage}
        </h1>
        <Link
          href="/"
          className="mt-4 px-6 py-3 rounded-xl font-semibold text-white"
          style={{ background: "linear-gradient(to left, #4ABFBF, #2D9E9E)" }}
        >
          חזרה לעמוד הבית
        </Link>
      </div>
    </div>
  );
}
