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
      .from('motoscout_facebook_watchlist')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ watchlist: data });
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
    const { name, url, notes, is_active = true } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Validate URL is Facebook
    if (!url.includes('facebook.com') && !url.includes('fb.com')) {
      return NextResponse.json(
        { error: 'URL must be a Facebook Marketplace link' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('motoscout_facebook_watchlist')
      .insert({
        user_id: user.id,
        name,
        url,
        notes,
        is_active,
        status: 'OK',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ watchlist: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
