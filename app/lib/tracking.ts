"use client";

/**
 * Campaign attribution + analytics event helpers.
 *
 * Everything here degrades to a no-op when GA4 isn't configured, so the site
 * behaves exactly as before until a valid Measurement ID is saved in the
 * admin panel.
 */

export const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
] as const;

export type CampaignKey = (typeof CAMPAIGN_KEYS)[number];
export type CampaignParams = Partial<Record<CampaignKey, string>>;

const STORAGE_KEY = "campaign_params";

export const GOOGLE_PAID_SOURCE = "גוגל ממומן";
const DIRECT_SOURCE = "אורגני / ישיר";

/**
 * Reads campaign parameters off the landing URL and remembers them for the
 * rest of the session, so a visitor who lands on an ad and only fills the
 * form after browsing around is still attributed correctly.
 *
 * Only writes when the URL actually carries campaign data — navigating to a
 * clean URL later must not wipe the original attribution.
 */
export function captureCampaignParams(): CampaignParams {
  if (typeof window === "undefined") return {};

  try {
    const url = new URLSearchParams(window.location.search);
    const fromUrl: CampaignParams = {};
    for (const key of CAMPAIGN_KEYS) {
      const value = url.get(key);
      if (value) fromUrl[key] = value;
    }

    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
  } catch {
    // Private mode / storage disabled — attribution is best-effort, never fatal.
  }

  return getCampaignParams();
}

export function getCampaignParams(): CampaignParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CampaignParams) : {};
  } catch {
    return {};
  }
}

/**
 * A gclid is proof of a paid Google click. The utm_source/utm_medium pair is
 * the fallback for when auto-tagging is off.
 */
export function getLeadSource(params: CampaignParams = getCampaignParams()): string {
  if (params.gclid) return GOOGLE_PAID_SOURCE;
  if (params.utm_source === "google" && params.utm_medium === "cpc") return GOOGLE_PAID_SOURCE;
  if (params.utm_source) return params.utm_source;
  return DIRECT_SOURCE;
}

/** The campaign fields exactly as they get appended to the lead payload. */
export function getLeadAttribution() {
  const params = getCampaignParams();
  return {
    lead_source: getLeadSource(params),
    utm_source: params.utm_source ?? "",
    utm_medium: params.utm_medium ?? "",
    utm_campaign: params.utm_campaign ?? "",
    utm_term: params.utm_term ?? "",
    utm_content: params.utm_content ?? "",
    gclid: params.gclid ?? "",
  };
}

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

/** A GA4 Measurement ID looks like G-XXXXXXXXXX. Anything else stays dormant. */
export function isValidMeasurementId(id?: string | null): boolean {
  return !!id && /^G-[A-Z0-9]{4,}$/i.test(id.trim());
}

/**
 * Single funnel for every analytics event. Uses gtag only — never a parallel
 * dataLayer.push — so an event can't be counted twice.
 *
 * Never pass names, phone numbers or free-text messages in here: GA4 must not
 * receive personally identifying information.
 */
export function trackEvent(name: string, params: Record<string, string> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, params);
  } catch {
    // Analytics must never break the page.
  }
}
