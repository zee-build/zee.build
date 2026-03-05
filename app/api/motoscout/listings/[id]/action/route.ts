import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkMotoScoutAccess } from '@/lib/motoscout/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { allowed, user } = await checkMotoScoutAccess();
    if (!allowed || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id: listingId } = params;
    const { is_favorite, is_ignored, notes } = body;

    // Upsert action
    const { data, error } = await supabase
      .from('motoscout_listing_actions')
      .upsert(
        {
          user_id: user.id,
          listing_id: listingId,
          is_favorite: is_favorite ?? false,
          is_ignored: is_ignored ?? false,
          notes: notes ?? null,
        },
        {
          onConflict: 'user_id,listing_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ action: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
