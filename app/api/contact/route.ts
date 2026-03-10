export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

  if (!res.ok) throw new Error(`Turso error ${res.status}`);
  const json = await res.json();
  const result = json.results[0];
  if (result?.type === "error") throw new Error(`Turso SQL error: ${JSON.stringify(result.error)}`);
  return result;
}

async function getContactEmail(): Promise<string> {
  try {
    const result = await tursoQuery("SELECT data FROM site_content WHERE id = 1");
    const row = result?.response?.result?.rows?.[0];
    if (!row) return defaultContent.forms.contactEmail;
    const data = JSON.parse(row[0].value);
    return data?.forms?.contactEmail || defaultContent.forms.contactEmail;
  } catch {
    return defaultContent.forms.contactEmail;
  }
}

export async function POST(request: Request) {
  try {
    const { name, phone, serviceType } = await request.json();

    const to = await getContactEmail();
    if (!to) {
      return NextResponse.json({ ok: false, error: "no contact email configured" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "פנייה חדשה מהאתר",
      text: `פנייה חדשה מהאתר:\nשם: ${name}\nטלפון: ${phone}\nסוג שירות: ${serviceType}`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">
        <h2 style="color:#4ABFBF">פנייה חדשה מהאתר</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>טלפון:</strong> ${phone}</p>
        <p><strong>סוג שירות:</strong> ${serviceType}</p>
      </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact route error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
