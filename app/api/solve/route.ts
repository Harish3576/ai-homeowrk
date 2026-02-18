import { NextResponse } from "next/server";
import { checkAndBumpUsage } from "@/src/lib/usage";
import { solveWithGroq } from "@/src/lib/groq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistoryItem = {
  id: string;
  ip: string;
  question: string;
  answer: string;
  createdAt: string;
};

function getIP(request: Request) {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// Global in-memory history (serverless: may reset sometimes)
const g = globalThis as unknown as { __HISTORY__?: HistoryItem[] };
if (!g.__HISTORY__) g.__HISTORY__ = [];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = String(body?.question || "").trim();

    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    const ip = getIP(request);

    // rate limit per ip
    const ok = checkAndBumpUsage(ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Daily limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    const answer = await solveWithGroq(question);

    const item: HistoryItem = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      ip,
      question,
      answer,
      createdAt: new Date().toISOString(),
    };

    // keep latest 50
    g.__HISTORY__!.unshift(item);
    g.__HISTORY__ = g.__HISTORY__!.slice(0, 50);

    return NextResponse.json({ answer });
  } catch (e: any) {
    console.error("SOLVE_ERROR", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
