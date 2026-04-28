import { NextResponse } from 'next/server';

const GITHUB_ORG = 'zee-build';
const CACHE_TTL = 120; // 2 minutes

let cache: { data: any; ts: number } | null = null;

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL * 1000) {
    return NextResponse.json(cache.data);
  }

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Try org events first, then user events as fallback
    let raw: any[] = [];
    
    const orgRes = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/events?per_page=30`,
      { headers, next: { revalidate: CACHE_TTL } }
    );
    
    if (orgRes.ok) {
      raw = await orgRes.json();
    } else {
      // Fallback: try as user
      const userRes = await fetch(
        `https://api.github.com/users/${GITHUB_ORG}/events/public?per_page=30`,
        { headers, next: { revalidate: CACHE_TTL } }
      );
      if (userRes.ok) {
        raw = await userRes.json();
      }
    }

    if (!Array.isArray(raw)) raw = [];

    const events = raw
      .filter((e: any) => e.type === 'PushEvent')
      .flatMap((e: any) => {
        const repo = e.repo?.name || '';
        const commits = e.payload?.commits || [];
        return commits.map((c: any) => ({
          hash: c.sha?.slice(0, 7),
          repo,
          msg: c.message?.split('\n')[0]?.slice(0, 80),
          date: e.created_at,
          ago: timeAgo(e.created_at),
        }));
      })
      .slice(0, 15);

    const data = { events, fetched_at: new Date().toISOString() };
    cache = { data, ts: Date.now() };

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ events: [], error: err.message }, { status: 500 });
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}
