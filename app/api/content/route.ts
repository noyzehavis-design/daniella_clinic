export const dynamic = "force-dynamic";

import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";
import { siteContent as defaultContent } from "@/app/lib/content";

function getClient() {
  // Use https:// instead of libsql:// for Vercel serverless compatibility
  const url = (process.env.TURSO_DATABASE_URL || "").replace("libsql://", "https://");
  return createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

async function ensureTable() {
  const client = getClient();
  await client.execute(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL
    )
  `);
  const result = await client.execute("SELECT COUNT(*) as count FROM site_content");
  const count = Number(result.rows[0].count);
  if (count === 0) {
    await client.execute({
      sql: "INSERT INTO site_content (id, data) VALUES (1, ?)",
      args: [JSON.stringify(defaultContent)],
    });
  }
}

export async function GET() {
  try {
    await ensureTable();
    const client = getClient();
    const result = await client.execute("SELECT data FROM site_content WHERE id = 1");
    const data = result.rows[0]?.data;
    return NextResponse.json(data ? JSON.parse(data as string) : defaultContent);
  } catch {
    return NextResponse.json(defaultContent);
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();
    const client = getClient();
    await client.execute({
      sql: "UPDATE site_content SET data = ? WHERE id = 1",
      args: [JSON.stringify(body)],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
