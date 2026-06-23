import Link from 'next/link';

interface ModuleGateProps {
  passed: boolean;
  nextSlug: string | null;
}

export default function ModuleGate({ passed, nextSlug }: ModuleGateProps) {
  if (!passed) return null;

  return (
    <div className="mt-8 flex justify-end">
      {nextSlug ? (
        <Link
          href={`/learn/${nextSlug}`}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--c-teal)' }}
        >
          Next module →
        </Link>
      ) : (
        <Link
          href="/learn"
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--c-teal)' }}
        >
          Back to course
        </Link>
      )}
    </div>
  );
}
