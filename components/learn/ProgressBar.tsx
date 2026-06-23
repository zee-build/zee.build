export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
      <div
        className="h-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%`, backgroundColor: 'var(--c-teal)' }}
      />
    </div>
  );
}
