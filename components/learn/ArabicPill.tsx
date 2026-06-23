interface ArabicPillProps {
  arabic: string;
  transliteration: string;
}

export default function ArabicPill({ arabic, transliteration }: ArabicPillProps) {
  return (
    <span
      className="inline-flex items-baseline gap-1.5 rounded px-[9px] py-[2px] text-sm"
      style={{ backgroundColor: 'var(--c-teal-lt)', color: 'var(--c-teal-dk)' }}
    >
      <span dir="rtl" lang="ar">{arabic}</span>
      <span className="italic">{transliteration}</span>
    </span>
  );
}
