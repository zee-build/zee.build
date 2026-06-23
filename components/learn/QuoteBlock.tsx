interface QuoteBlockProps {
  children: React.ReactNode;
  citation?: string;
}

export default function QuoteBlock({ children, citation }: QuoteBlockProps) {
  return (
    <blockquote
      className="my-5 pl-4 italic font-serif text-[15px] leading-[1.75] text-zinc-300"
      style={{ borderLeft: '3px solid var(--c-teal)' }}
    >
      <p>{children}</p>
      {citation && <footer className="mt-1.5 text-xs text-zinc-500 not-italic">— {citation}</footer>}
    </blockquote>
  );
}
