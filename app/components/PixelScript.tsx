"use client";
import Script from "next/script";
import { useContent } from "@/app/lib/ContentContext";
import { extractPixelJs } from "@/app/lib/pixel";

export default function PixelScript() {
  const { content } = useContent();
  // The admin panel value is usually Meta's full HTML snippet; Script renders
  // its children as raw JavaScript, so the markup has to come off first.
  const code = extractPixelJs(content.meta?.facebookPixelCode);
  if (!code) return null;
  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
