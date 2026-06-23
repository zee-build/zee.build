import { createCourseRouteClient } from '@/lib/course/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const supabase = await createCourseRouteClient();
  const { error } = await supabase.from('waitlist').insert({ email });

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
