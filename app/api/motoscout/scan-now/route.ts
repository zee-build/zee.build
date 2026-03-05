import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkMotoScoutAccess } from '@/lib/motoscout/auth';

export async function POST(request: NextRequest) {
  try {
    const { allowed, user } = await checkMotoScoutAccess();
    if (!allowed || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a scan request for GitHub Actions to pick up
    const { data, error } = await supabase
      .from('motoscout_scan_requests')
      .insert({
        user_id: user.id,
        status: 'PENDING',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Scan request created. GitHub Actions will process it within 30 minutes.',
      request: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
