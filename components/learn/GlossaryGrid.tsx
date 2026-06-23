interface GlossaryTerm {
  arabic: string;
  transliteration: string;
  definition: string;
}

export default function GlossaryGrid({ terms }: { terms: GlossaryTerm[] }) {
  if (!terms.length) return null;

  return (
    <div className="my-8">
      <h2 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-3">Glossary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {terms.map((t) => (
          <div key={t.transliteration} className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <div className="flex items-baseline gap-2">
              <span dir="rtl" lang="ar" className="text-sm" style={{ color: 'var(--c-teal)' }}>
                {t.arabic}
              </span>
              <span className="text-sm italic text-zinc-300">{t.transliteration}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">{t.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
