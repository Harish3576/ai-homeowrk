import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const question = (body?.question || "").toString().trim();

    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    // ✅ If GROQ key missing, still return JSON (no crash in build)
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY missing in Vercel Environment Variables" },
        { status: 500 }
      );
    }

    // ✅ Call Groq (simple fetch)
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful homework solver. Answer in Hindi + English." },
          { role: "user", content: question },
        ],
        temperature: 0.2,
      }),
    });

    const groqJson = await groqRes.json().catch(() => null);

    if (!groqRes.ok) {
      return NextResponse.json(
        { error: "Groq API error", details: groqJson },
        { status: 500 }
      );
    }

    const answer =
      groqJson?.choices?.[0]?.message?.content?.toString() || "No answer";

    // ✅ Save in DB (never crash build)
    try {
      await prisma.submission.create({
        data: { question, answer, ip: "unknown" },
      });
    } catch (e) {
      // DB fail हो भी जाए तो API फिर भी चलती रहे
      console.error("DB save failed:", e);
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Solve API crash:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
