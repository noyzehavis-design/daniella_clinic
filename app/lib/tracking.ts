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
type FbqFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: FbqFn;
  }
}

/**
 * Analytics must only run on the real site. Loading it on localhost or on a
 * Vercel preview sends test traffic — including test conversions — into the
 * same GA4 property and Meta pixel as production, which is exactly how a
 * conversion count drifts above the number of leads actually received.
 *
 * Takes the hostname so it can be unit tested.
 */
export function isMeasurableHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) return false;
  if (host === "localhost" || host.endsWith(".localhost")) return false;
  if (host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") return false;
  if (host.endsWith(".vercel.app")) return false;
  return true;
}

/** A GA4 Measurement ID looks like G-XXXXXXXXXX. Anything else stays dormant. */
export function isValidMeasurementId(id?: string | null): boolean {
  return !!id && /^G-[A-Z0-9]{4,}$/i.test(id.trim());
}

/**
 * Sends once, as soon as the tag is available. A visitor can submit before a
 * slow analytics script has finished loading; without this the event was
 * dropped silently and permanently, which is one way a conversion goes
 * missing. Gives up after the timeout so nothing lingers.
 */
function deliverWhenReady(isReady: () => boolean, send: () => void, timeoutMs = 8000): void {
  if (typeof window === "undefined") return;
  const attempt = () => {
    try {
      send();
    } catch {
      // Analytics must never break the page.
    }
  };
  if (isReady()) {
    attempt();
    return;
  }
  const startedAt = Date.now();
  const timer = window.setInterval(() => {
    if (isReady()) {
      window.clearInterval(timer);
      attempt();
    } else if (Date.now() - startedAt >= timeoutMs) {
      window.clearInterval(timer);
    }
  }, 200);
}

/**
 * Single funnel for every analytics event. Uses gtag only — never a parallel
 * dataLayer.push — so an event can't be counted twice.
 *
 * Never pass names, phone numbers or free-text messages in here: GA4 must not
 * receive personally identifying information.
 */
export function trackEvent(name: string, params: Record<string, string> = {}): void {
  deliverWhenReady(
    () => typeof window.gtag === "function",
    () => window.gtag!("event", name, params)
  );
}

/**
 * Meta's equivalent of trackEvent. Same rules: no personal data, and a silent
 * no-op when the pixel has not loaded.
 */
export function trackMetaEvent(name: string, params: Record<string, string> = {}): void {
  deliverWhenReady(
    () => typeof window.fbq === "function",
    () => window.fbq!("track", name, params)
  );
}

/**
 * The single place a won lead is reported to both platforms. Call it only
 * after the server has confirmed the lead was actually received — never on
 * button click, validation failure, a network error, or a failure response.
 */
export function trackLeadConversion(details: {
  form_name: string;
  form_location: string;
  lead_source: string;
}): void {
  trackEvent("generate_lead", details);
  trackMetaEvent("Lead", {
    content_name: details.form_name,
    lead_source: details.lead_source,
  });
}
