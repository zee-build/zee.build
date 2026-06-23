import { createCourseServerClient } from '@/lib/course/supabase-server';
import { getPublishedModules } from '@/lib/course/modules';
import { getUserProgress } from '@/lib/course/progress';
import ModuleCard from '@/components/learn/ModuleCard';

const PART_NAMES: Record<number, string> = {
  1: 'Foundations',
  2: 'Contracts',
  3: 'Banking',
  4: 'Capital Markets',
  5: 'Corporate Finance Math',
  6: 'Fintech',
  7: 'Social Finance',
  8: 'Capstone',
};

export default async function LearnDashboard() {
  const supabase = await createCourseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  const modules = await getPublishedModules(supabase);
  const progress = session ? await getUserProgress(supabase, session.user.id) : [];
  const progressByModule = new Map(progress.map((p) => [p.module_id, p]));

  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const overallPct = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;

  const byPart = new Map<number, typeof modules>();
  for (const m of modules) {
    byPart.set(m.part, [...(byPart.get(m.part) ?? []), m]);
  }

  let previousCompleted = true;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-medium text-white mb-1">Islamic Finance Mastery Course</h1>
      <p className="text-sm text-zinc-400 mb-6">
        {completedCount} of {modules.length} modules completed — {overallPct}%
      </p>

      <div className="h-1.5 w-full rounded-full bg-zinc-800 mb-10 overflow-hidden">
        <div
          className="h-full bg-[#1D9E75] transition-all"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {Array.from(byPart.entries()).map(([part, partModules]) => {
        const partCompleted = partModules.filter(
          (m) => progressByModule.get(m.module_id)?.status === 'completed'
        ).length;

        return (
          <div key={part} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] uppercase tracking-wider text-zinc-500">
                Part {part} — {PART_NAMES[part] ?? ''}
              </h2>
              <span className="text-xs text-zinc-500">
                {partCompleted}/{partModules.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {partModules.map((m) => {
                const status = progressByModule.get(m.module_id)?.status ?? 'not_started';
                const locked = !previousCompleted;
                if (status === 'completed') previousCompleted = true;
                else previousCompleted = false;

                return (
                  <ModuleCard key={m.module_id} module={m} status={status} locked={locked} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
