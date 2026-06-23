import ArabicPill from '@/components/learn/ArabicPill';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>Every ruling in this course — every prohibition and every permitted contract — comes from four sources, in order of authority:</p>

      <ol className="list-decimal pl-5 space-y-2">
        <li><strong className="text-white"><ArabicPill arabic="القرآن" transliteration="Qur'an" /></strong> — the primary text, directly revealed.</li>
        <li><strong className="text-white"><ArabicPill arabic="السنة" transliteration="Sunnah" /></strong> — the practice and sayings of the Prophet Muhammad ﷺ, recorded in Hadith.</li>
        <li><strong className="text-white"><ArabicPill arabic="إجماع" transliteration="Ijma" /></strong> — scholarly consensus on a matter not explicitly addressed in the first two sources.</li>
        <li><strong className="text-white"><ArabicPill arabic="قياس" transliteration="Qiyas" /></strong> — analogical reasoning, extending a known ruling to a new but similar case.</li>
      </ol>

      <p>
        <ArabicPill arabic="اجتهاد" transliteration="Ijtihad" /> is the broader exercise of
        independent reasoning that draws on all four — and it's the reason Islamic finance can
        exist at all in its modern form. None of the four classical sources mention Sukuk,
        diminishing Musharakah home finance, or robo-advisory portfolios by name. Contemporary
        scholars use Qiyas and Ijma (through bodies like AAOIFI's Shariah Board) to extend
        classical contract principles — sale, lease, partnership — to these new instruments.
      </p>

      <ContextBox title="Why Ijtihad is the key to fintech">
        A blockchain-based Sukuk or an AI-driven Zakat calculator is not "in the Quran." What is in
        the Quran and Sunnah are the underlying principles — no Riba, no Gharar, real assets behind
        financing, fair dealing. Ijtihad is the bridge: scholars trained in both classical
        jurisprudence and modern finance apply those fixed principles to genuinely new technology.
        This is also why you'll see different Shariah boards reach different conclusions on the same
        new product (e.g. Bitcoin, covered in Part 6) — Ijtihad permits reasoned disagreement.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        This four-source hierarchy is structurally similar to how common law systems use statute
        (Qur'an/Sunnah-equivalent: the fixed primary authority), binding precedent (Ijma-like:
        settled interpretation), and reasoning by analogy from precedent to new facts (directly
        analogous to Qiyas) to decide novel cases.
      </ContextBox>
    </div>
  );
}

export const sourcesOfIslamicLaw: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'إجماع', transliteration: 'Ijma', definition: 'Scholarly consensus on a matter not explicitly addressed in the Qur\'an or Sunnah.' },
    { arabic: 'قياس', transliteration: 'Qiyas', definition: 'Analogical reasoning extending a known ruling to a new, similar case.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Put these in order of primary authority: Sunnah, Qur\'an, Qiyas, Ijma.',
      options: [
        { id: 'a', text: "Qur'an → Sunnah → Ijma → Qiyas", correct: true },
        { id: 'b', text: "Sunnah → Qur'an → Qiyas → Ijma", correct: false },
        { id: 'c', text: "Ijma → Qur'an → Sunnah → Qiyas", correct: false },
      ],
      feedback: { correct: 'Correct.', wrong: "The order is Qur'an, Sunnah, Ijma, then Qiyas." },
    },
    {
      id: 'q2',
      question: 'Why is Ijtihad described as "the key to Islamic fintech"?',
      options: [
        { id: 'a', text: 'It lets scholars apply fixed principles to genuinely new financial technology', correct: true },
        { id: 'b', text: 'It replaces the need for the Qur\'an and Sunnah', correct: false },
        { id: 'c', text: 'It only applies to historical contracts, not new ones', correct: false },
      ],
      feedback: {
        correct: 'Correct — modern instruments aren\'t named in classical texts, so Ijtihad bridges fixed principles to new cases.',
        wrong: 'Ijtihad applies fixed Islamic principles to new situations — that\'s exactly why it matters for fintech.',
      },
    },
  ],
};
