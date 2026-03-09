import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";
import { siteContent as defaultContent } from "@/app/lib/content";

export async function GET() {
  const url = (process.env.TURSO_DATABASE_URL || "").replace("libsql://", "https://");
  const token = process.env.TURSO_AUTH_TOKEN || "";

  try {
    const client = createClient({ url, authToken: token });
    await client.execute("CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, data TEXT NOT NULL)");

    // Reset DB with proper default content
    await client.execute("DELETE FROM site_content");
    await client.execute({
      sql: "INSERT INTO site_content (id, data) VALUES (1, ?)",
      args: [JSON.stringify(defaultContent)],
    });

    return NextResponse.json({ ok: true, message: "DB reset with default content" });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
