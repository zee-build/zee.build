import Link from 'next/link';
import type { CourseModule } from '@/lib/course/modules';
import ProgressBar from './ProgressBar';

interface ModuleShellProps {
  module: CourseModule;
  status: 'not_started' | 'in_progress' | 'completed';
  children: React.ReactNode;
}

export default function ModuleShell({ module, status, children }: ModuleShellProps) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/learn" className="text-xs text-zinc-500 hover:text-zinc-300">
        ← Back to course
      </Link>

      <div className="mt-4 mb-1 flex items-center gap-2">
        <h1 className="text-2xl font-medium text-white">{module.title}</h1>
        {status === 'completed' && <span style={{ color: 'var(--c-teal)' }}>✓</span>}
      </div>
      <p className="text-sm text-zinc-400 mb-3">{module.description}</p>
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-5">
        {module.estimated_minutes} min
      </p>

      <ProgressBar percent={status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0} />

      <div className="mt-8">{children}</div>
    </div>
  );
}
