import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('os_feedback')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return NextResponse.json({ feedback: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ feedback: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === 'submit') {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const { data, error } = await supabase
      .from('os_feedback')
      .insert({
        id,
        name: body.name || 'Anonymous',
        message: body.message,
        visible: true,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ feedback: data });
  }

  if (body.action === 'toggle') {
    // First get current state
    const { data: current } = await supabase
      .from('os_feedback')
      .select('visible')
      .eq('id', body.id)
      .single();

    const { data, error } = await supabase
      .from('os_feedback')
      .update({ visible: !current?.visible })
      .eq('id', body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ feedback: data });
  }

  if (body.action === 'delete') {
    const { error } = await supabase
      .from('os_feedback')
      .delete()
      .eq('id', body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
