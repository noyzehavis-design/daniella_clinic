import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export async function GET() {
  const url = (process.env.TURSO_DATABASE_URL || "").replace("libsql://", "https://");
  const token = process.env.TURSO_AUTH_TOKEN || "";

  try {
    const client = createClient({ url, authToken: token });
    await client.execute("CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, data TEXT NOT NULL)");
    const result = await client.execute("SELECT COUNT(*) as count FROM site_content");
    return NextResponse.json({ ok: true, url, rows: result.rows });
  } catch (e) {
    return NextResponse.json({ ok: false, url, error: String(e) }, { status: 500 });
  }
}
