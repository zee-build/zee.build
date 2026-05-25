import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, city, onHajj, fasting } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    await supabase.from('arafah_visitors').insert({
      name: name.trim(),
      city: city?.trim() || null,
      on_hajj: onHajj ?? false,
      fasting: fasting ?? false,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('arafah_visitors')
    .select('name, city, on_hajj, fasting, joined_at')
    .order('joined_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ visitors: data ?? [] });
}
