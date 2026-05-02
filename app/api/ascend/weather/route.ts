import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://wttr.in/Dubai?format=%C+%t", {
      headers: { "User-Agent": "curl/7.68.0" },
    });
    const text = (await res.text()).trim();
    return NextResponse.json({ weather: text });
  } catch {
    return NextResponse.json({ weather: "" });
  }
}
