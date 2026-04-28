import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers.get('user-agent')?.slice(0, 100) || '';

  // Log visit
  await supabase.from('os_visitors').insert({ ip, user_agent: userAgent });

  // Count active (last 5 min)
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: active } = await supabase
    .from('os_visitors')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', fiveMinAgo);

  // Count total unique
  const { data: uniqueData } = await supabase
    .from('os_visitors')
    .select('ip');
  const unique = new Set(uniqueData?.map((r: any) => r.ip)).size;

  // Count total
  const { count: total } = await supabase
    .from('os_visitors')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({
    active: active || 0,
    total: total || 0,
    unique: unique || 0,
  });
}

export async function GET() {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { count: active } = await supabase
    .from('os_visitors')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', fiveMinAgo);

  const { count: total } = await supabase
    .from('os_visitors')
    .select('*', { count: 'exact', head: true });

  const { data: uniqueData } = await supabase
    .from('os_visitors')
    .select('ip');
  const unique = new Set(uniqueData?.map((r: any) => r.ip)).size;

  return NextResponse.json({
    active: active || 0,
    total: total || 0,
    unique: unique || 0,
  });
}
