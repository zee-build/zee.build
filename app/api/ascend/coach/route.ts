import { NextRequest, NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ASCEND_SECRET =
  process.env.ASCEND_SECRET ||
  process.env.NEXT_PUBLIC_ADMIN_PASS ||
  "zeebuild2026";

export async function POST(req: NextRequest) {
  // Auth gate — Zee only
  const authHeader = req.headers.get("x-ascend-auth");
  if (authHeader !== ASCEND_SECRET) {
    return NextResponse.json({ reply: "Unauthorized." }, { status: 401 });
  }

  // Graceful degradation when API key is missing
  if (!OPENAI_KEY) {
    return NextResponse.json({
      reply: "Coach unavailable — OPENAI_API_KEY not configured.",
      unavailable: true,
    });
  }

  const body = await req.json();
  const { messages, systemPrompt } = body as {
    messages: { role: string; content: string }[];
    systemPrompt: string;
  };

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ reply: "Invalid request." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          // Send full conversation history so coach has memory
          ...messages,
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("OpenAI error:", data);
      return NextResponse.json({
        reply: "AI temporarily unavailable. Keep working.",
      });
    }

    const reply =
      data.choices?.[0]?.message?.content || "No response from coach.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Coach route error:", err);
    return NextResponse.json({
      reply: "AI temporarily unavailable. Keep working.",
    });
  }
}
