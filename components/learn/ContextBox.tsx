interface ContextBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'context-box' | 'western-parallel';
}

export default function ContextBox({ title, children, variant = 'context-box' }: ContextBoxProps) {
  return (
    <div
      className={variant}
      style={{ display: 'none', borderLeft: '3px solid var(--c-blue)' }}
    >
      <div className="my-5 pl-4 text-[15px] leading-[1.75] text-zinc-300">
        {title && <p className="font-medium text-zinc-200 mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}
