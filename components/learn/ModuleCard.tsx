import Link from 'next/link';
import type { CourseModule } from '@/lib/course/modules';

interface ModuleCardProps {
  module: CourseModule;
  status: 'not_started' | 'in_progress' | 'completed';
  locked: boolean;
}

export default function ModuleCard({ module, status, locked }: ModuleCardProps) {
  const content = (
    <div
      className={`rounded-xl border px-4 py-3.5 transition-colors ${
        locked
          ? 'border-zinc-800 bg-zinc-900/40 opacity-50'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-[#1D9E75]/50'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-white">{module.title}</h3>
        {locked && <span className="text-zinc-500 text-xs">🔒</span>}
        {status === 'completed' && <span className="text-[#1D9E75] text-xs">✓</span>}
      </div>
      <p className="mt-1 text-xs text-zinc-500">{module.estimated_minutes} min</p>
    </div>
  );

  if (locked) return content;

  return <Link href={`/learn/${module.slug}`}>{content}</Link>;
}
