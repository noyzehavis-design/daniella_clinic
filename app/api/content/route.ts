export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { siteContent as defaultContent } from "@/app/lib/content";

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
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.results[0];
}

export async function GET() {
  try {
    await tursoQuery(
      "CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, data TEXT NOT NULL)"
    );

    const result = await tursoQuery("SELECT data FROM site_content WHERE id = 1");
    const row = result?.response?.result?.rows?.[0];

    if (!row) {
      await tursoQuery(
        "INSERT INTO site_content (id, data) VALUES (1, ?)",
        [JSON.stringify(defaultContent)]
      );
      return NextResponse.json(defaultContent, { headers: { "Cache-Control": "no-store" } });
    }

    const data = JSON.parse(row[0].value);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await tursoQuery(
      "CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, data TEXT NOT NULL)"
    );

    const check = await tursoQuery("SELECT COUNT(*) as count FROM site_content WHERE id = 1");
    const count = Number(check?.response?.result?.rows?.[0]?.[0]?.value ?? 0);

    if (count === 0) {
      await tursoQuery(
        "INSERT INTO site_content (id, data) VALUES (1, ?)",
        [JSON.stringify(body)]
      );
    } else {
      await tursoQuery(
        "UPDATE site_content SET data = ? WHERE id = 1",
        [JSON.stringify(body)]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
