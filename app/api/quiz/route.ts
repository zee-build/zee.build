import { createCourseRouteClient } from '@/lib/course/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { moduleId, answers, score, passed } = await req.json();

  if (!moduleId || typeof score !== 'number' || typeof passed !== 'boolean') {
    return NextResponse.json({ error: 'Invalid quiz payload' }, { status: 400 });
  }

  const supabase = await createCourseRouteClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: allowed } = await supabase
    .from('allowed_users')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!allowed) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const { error: attemptError } = await supabase.from('quiz_attempts').insert({
    user_id: user.id,
    module_id: moduleId,
    answers: answers ?? {},
    score,
    passed,
  });

  if (attemptError) {
    return NextResponse.json({ error: attemptError.message }, { status: 500 });
  }

  const { data: existing } = await supabase
    .from('user_progress')
    .select('attempts')
    .eq('user_id', user.id)
    .eq('module_id', moduleId)
    .maybeSingle();

  const { error: progressError } = await supabase.from('user_progress').upsert(
    {
      user_id: user.id,
      module_id: moduleId,
      status: passed ? 'completed' : 'in_progress',
      quiz_score: score,
      attempts: (existing?.attempts ?? 0) + 1,
      completed_at: passed ? new Date().toISOString() : null,
      last_accessed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,module_id' }
  );

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
