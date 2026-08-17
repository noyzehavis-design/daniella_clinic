import { siteContent as defaultContent, type SiteContent } from "./content";

// Server-only: reads the saved content directly from Turso so the very
// first HTML the browser (and Google) sees already has the real, saved
// content instead of the placeholder defaults below. If anything goes
// wrong (env vars missing, Turso down, no row saved yet), we fall back
// to the defaults — same behavior as before this existed, just never worse.
async function tursoQuery(sql: string, args: unknown[] = []) {
  const url = (process.env.TURSO_DATABASE_URL || "").replace("libsql://", "https://");
  const token = process.env.TURSO_AUTH_TOKEN || "";

  const res = await fetch(`${url}/v2/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql, args: args.map((v) => ({ type: "text", value: String(v) })) } },
        { type: "close" },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Turso error ${res.status}`);
  }

  const json = await res.json();
  const result = json.results[0];
  if (result?.type === "error") {
    throw new Error(`Turso SQL error: ${JSON.stringify(result.error)}`);
  }
  return result;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const result = await tursoQuery("SELECT data FROM site_content WHERE id = 1");
    const row = result?.response?.result?.rows?.[0];
    if (!row) return defaultContent;

    const data = JSON.parse(row[0].value);
    return { ...defaultContent, ...data };
  } catch (e) {
    console.error("getSiteContent (server) failed, using defaults:", e);
    return defaultContent;
  }
}
