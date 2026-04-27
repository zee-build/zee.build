import { NextResponse } from 'next/server';

const GITHUB_USER = 'zee-build';
const CACHE_TTL = 120; // 2 minutes

let cache: { data: any; ts: number } | null = null;

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL * 1000) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: CACHE_TTL },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ events: [], error: 'GitHub API error' }, { status: 502 });
    }

    const raw = await res.json();

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
