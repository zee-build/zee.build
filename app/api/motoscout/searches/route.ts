import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkMotoScoutAccess } from '@/lib/motoscout/auth';

export async function GET(request: NextRequest) {
  try {
    const { allowed, user } = await checkMotoScoutAccess();
    if (!allowed || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('motoscout_saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ searches: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed, user } = await checkMotoScoutAccess();
    if (!allowed || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      brand,
      model,
      keywords,
      max_price,
      min_year,
      location,
      sources,
      is_active = true,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('motoscout_saved_searches')
      .insert({
        user_id: user.id,
        name,
        brand,
        model,
        keywords,
        max_price,
        min_year,
        location,
        sources: sources || { dubizzle: true },
        is_active,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ search: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
