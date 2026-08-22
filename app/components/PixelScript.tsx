"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useContent } from "@/app/lib/ContentContext";
import { extractPixelJs } from "@/app/lib/pixel";
import { isMeasurableHost } from "@/app/lib/tracking";

export default function PixelScript() {
  const { content } = useContent();

  // Same rule as GA4: never fire the real pixel from localhost or a preview
  // deployment. Decided after mount because the hostname is client-only.
  const [onMeasurableHost, setOnMeasurableHost] = useState(false);
  useEffect(() => {
    setOnMeasurableHost(isMeasurableHost(window.location.hostname));
  }, []);
  // The admin panel value is usually Meta's full HTML snippet; Script renders
  // its children as raw JavaScript, so the markup has to come off first.
  const code = extractPixelJs(content.meta?.facebookPixelCode);
  if (!code || !onMeasurableHost) return null;
  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
