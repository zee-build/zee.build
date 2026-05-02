import { NextRequest, NextResponse } from "next/server";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ASCEND_SECRET = process.env.ASCEND_SECRET || process.env.NEXT_PUBLIC_ADMIN_PASS || "zeebuild2026";

export async function POST(req: NextRequest) {
  // Auth check — only Zee can use this
  const authHeader = req.headers.get("x-ascend-auth");
  if (authHeader !== ASCEND_SECRET) {
    return NextResponse.json({ reply: "Unauthorized." }, { status: 401 });
  }

  if (!OPENAI_KEY) {
    return NextResponse.json({ reply: "AI coach not configured. Add OPENAI_API_KEY to env." });
  }

  const { message, systemPrompt } = await req.json();

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
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "AI temporarily unavailable. Keep working." });
  }
}
