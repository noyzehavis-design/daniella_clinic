"use client";
import { useEffect } from "react";
import Script from "next/script";
import { useContent } from "@/app/lib/ContentContext";
import {
  captureCampaignParams,
  getLeadSource,
  isValidMeasurementId,
  trackEvent,
} from "@/app/lib/tracking";

const WHATSAPP_HOSTS = ["wa.me", "api.whatsapp.com", "whatsapp.com"];

/**
 * Labels where a click happened. Prefers an explicit data-track-location on
 * an ancestor; falls back to the enclosing section so links added later are
 * still attributed to something meaningful rather than dropping out of the
 * report entirely.
 */
function resolveLocation(anchor: HTMLAnchorElement): string {
  const tagged = anchor.closest<HTMLElement>("[data-track-location]");
  if (tagged?.dataset.trackLocation) return tagged.dataset.trackLocation;

  const section = anchor.closest<HTMLElement>("section[id], section, footer, header, nav");
  if (section) {
    if (section.id) return section.id;
    return section.tagName.toLowerCase();
  }
  return "unknown";
}

/** Icon-only links have no text, so fall back to their accessible name. */
function resolveLinkText(anchor: HTMLAnchorElement): string {
  const text = (anchor.innerText || anchor.getAttribute("aria-label") || "").trim();
  return text.replace(/\s+/g, " ").slice(0, 100);
}

function classifyLink(href: string): "phone_click" | "whatsapp_click" | null {
  const value = href.trim().toLowerCase();
  if (value.startsWith("tel:")) return "phone_click";
  if (WHATSAPP_HOSTS.some((host) => value.includes(host))) return "whatsapp_click";
  return null;
}

export default function Analytics() {
  const { content } = useContent();
  const measurementId = content.meta?.ga4MeasurementId?.trim();
  const enabled = isValidMeasurementId(measurementId);

  // Attribution capture runs regardless of GA4 — the lead payload sent to
  // Make depends on it, and that works with or without analytics configured.
  useEffect(() => {
    captureCampaignParams();
  }, []);

  // One delegated listener covers every phone/WhatsApp link on the site,
  // including any added later, and fires exactly once per click.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const eventName = classifyLink(href);
      if (!eventName) return;

      trackEvent(eventName, {
        link_location: resolveLocation(anchor),
        link_text: resolveLinkText(anchor),
        lead_source: getLeadSource(),
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
