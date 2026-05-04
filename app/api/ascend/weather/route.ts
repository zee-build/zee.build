import { NextResponse } from "next/server";

// Cache weather response for 1 hour at the CDN/Vercel edge
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://wttr.in/Dubai?format=%C+%t", {
      headers: { "User-Agent": "curl/7.68.0" },
      // Next.js fetch cache — re-fetches at most once per hour server-side
      next: { revalidate: 3600 },
    });
    const text = (await res.text()).trim();
    return NextResponse.json(
      { weather: text },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json({ weather: "" });
  }
}
