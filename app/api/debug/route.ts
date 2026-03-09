import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export async function GET() {
  const url = (process.env.TURSO_DATABASE_URL || "").replace("libsql://", "https://");
  const token = process.env.TURSO_AUTH_TOKEN || "";

  try {
    const client = createClient({ url, authToken: token });
    await client.execute("CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, data TEXT NOT NULL)");

    // Test write
    await client.execute({
      sql: "UPDATE site_content SET data = ? WHERE id = 1",
      args: [JSON.stringify({ test: "write_works_" + Date.now() })],
    });

    // Read back
    const result = await client.execute("SELECT data FROM site_content WHERE id = 1");
    return NextResponse.json({ ok: true, url, data: result.rows[0]?.data });
  } catch (e) {
    return NextResponse.json({ ok: false, url, error: String(e) }, { status: 500 });
  }
}
