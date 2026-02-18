import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body?.question?.toString().trim();

    if (!question) {
      return NextResponse.json(
        { error: "Question required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    // ✅ Groq call
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful homework solver. Answer in Hindi and English.",
            },
            { role: "user", content: question },
          ],
          temperature: 0.3,
        }),
      }
    );

    const data = await response.json();

    const answer =
      data?.choices?.[0]?.message?.content || "No answer generated";

    // ✅ Prisma dynamic import (build crash prevent)
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      await prisma.submission.create({
        data: {
          question,
          answer,
          ip: "unknown",
        },
      });

      await prisma.$disconnect();
    } catch (e) {
      console.log("Prisma skipped in build:", e);
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Solve error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
