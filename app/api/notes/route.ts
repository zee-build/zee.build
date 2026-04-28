import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('os_notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ notes: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notes: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === 'create') {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const { data, error } = await supabase
      .from('os_notes')
      .insert({
        id,
        title: body.title || 'Untitled',
        content: body.content || '',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ note: data });
  }

  if (body.action === 'update') {
    const { data, error } = await supabase
      .from('os_notes')
      .update({ ...body.data, updated_at: new Date().toISOString() })
      .eq('id', body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ note: data });
  }

  if (body.action === 'delete') {
    const { error } = await supabase
      .from('os_notes')
      .delete()
      .eq('id', body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
