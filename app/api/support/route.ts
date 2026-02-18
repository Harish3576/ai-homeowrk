import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    await prisma.submission.create({
      data: {
        question: message,
        answer: "Support Request",
        ip: "support-user",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Support request submitted successfully",
    });

  } catch (error) {
    console.error("Support API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
