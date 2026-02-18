import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistoryItem = {
  id: string;
  ip: string;
  question: string;
  answer: string;
  createdAt: string;
};

const g = globalThis as unknown as { __HISTORY__?: HistoryItem[] };
if (!g.__HISTORY__) g.__HISTORY__ = [];

export async function GET() {
  return NextResponse.json({ items: g.__HISTORY__!.slice(0, 10) });
}
