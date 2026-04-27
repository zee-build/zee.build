import { NextRequest, NextResponse } from 'next/server';

// In-memory visitor tracking (resets on cold start)
// Replace with Supabase for persistence later
const visitors = new Map<string, number>();
let totalHits = 0;

function cleanOld() {
  const cutoff = Date.now() - 5 * 60 * 1000; // 5 min window
  for (const [key, ts] of visitors) {
    if (ts < cutoff) visitors.delete(key);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const fingerprint = req.headers.get('user-agent')?.slice(0, 40) || '';
  const key = `${ip}:${fingerprint}`;

  visitors.set(key, Date.now());
  totalHits++;
  cleanOld();

  return NextResponse.json({
    active: visitors.size,
    total: totalHits,
  });
}

export async function GET() {
  cleanOld();
  return NextResponse.json({
    active: visitors.size,
    total: totalHits,
  });
}
