"use client";
import Script from "next/script";
import { useContent } from "@/app/lib/ContentContext";

export default function PixelScript() {
  const { content } = useContent();
  const code = content.meta?.facebookPixelCode?.trim();
  if (!code) return null;
  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
