import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { siteContent as defaultContent } from "@/app/lib/content";

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const content = await redis.get("siteContent");
    return NextResponse.json(content ?? defaultContent);
  } catch {
    return NextResponse.json(defaultContent);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await redis.set("siteContent", body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
