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
    const {
      name,
      phone,
      serviceType,
      lead_source = "",
      utm_source = "",
      utm_medium = "",
      utm_campaign = "",
      utm_term = "",
      utm_content = "",
      gclid = "",
    } = await request.json();

    // A lead only counts as received if it reached at least one channel.
    // Both failing must surface as an error so the visitor retries and no
    // conversion is reported for a lead that vanished.
    let webhookOk = false;
    let emailOk = false;

    try {
      const webhookRes = await fetch("https://hook.eu1.make.com/urnbkljyfuirbfi6x0cdirvjfehcfe6g", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Existing keys — the live Make scenario maps these, do not rename.
          "full name": name,
          "phone number": phone,
          "service": serviceType,
          "date": new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
          // Attribution
          lead_source,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
          gclid,
        }),
      });
      webhookOk = webhookRes.ok;
      if (!webhookOk) console.error("Webhook rejected the lead, status:", webhookRes.status);
    } catch (webhookErr) {
      console.error("Webhook request failed:", webhookErr);
    }

    const to = await getContactEmail();
    if (to) {
      try {
        const transporter = nodemailer.createTransport({
          host: "in-v3.mailjet.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to,
          subject: "פנייה חדשה מהאתר",
          text: `פנייה חדשה מהאתר:\nשם: ${name}\nטלפון: ${phone}\nסוג שירות: ${serviceType}\nמקור הליד: ${lead_source}`,
          html: `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">
            <h2 style="color:#4ABFBF">פנייה חדשה מהאתר</h2>
            <p><strong>שם:</strong> ${name}</p>
            <p><strong>טלפון:</strong> ${phone}</p>
            <p><strong>סוג שירות:</strong> ${serviceType}</p>
            <p><strong>מקור הליד:</strong> ${lead_source}</p>
          </div>`,
        });
        emailOk = true;
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    if (!webhookOk && !emailOk) {
      // Deliberately vague to the client — no lead details leave the server.
      console.error("Lead delivery failed on every channel.");
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact route error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
