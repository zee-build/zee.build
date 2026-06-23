import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Every ruling in Islamic finance — every prohibition, every permitted contract — traces back
        to a small set of objectives that Islamic law is designed to protect. Scholars call these
        the <ArabicPill arabic="مقاصد الشريعة" transliteration="Maqasid al-Shariah" /> — the
        objectives of Islamic law.
      </p>

      <p>
        Imam al-Ghazali, and later Imam al-Shatibi in his{' '}
        <em>al-Muwafaqat</em>, identified five universal objectives that any legal ruling in Islam
        ultimately serves:
      </p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">Preservation of Religion (</strong>
          <ArabicPill arabic="الدين" transliteration="al-Din" /><strong className="text-white">)</strong>
        </li>
        <li>
          <strong className="text-white">Preservation of Life (</strong>
          <ArabicPill arabic="النفس" transliteration="al-Nafs" /><strong className="text-white">)</strong>
        </li>
        <li>
          <strong className="text-white">Preservation of Intellect (</strong>
          <ArabicPill arabic="العقل" transliteration="al-'Aql" /><strong className="text-white">)</strong>
        </li>
        <li>
          <strong className="text-white">Preservation of Lineage (</strong>
          <ArabicPill arabic="النسل" transliteration="al-Nasl" /><strong className="text-white">)</strong>
        </li>
        <li>
          <strong className="text-white">Preservation of Wealth (</strong>
          <ArabicPill arabic="المال" transliteration="al-Mal" /><strong className="text-white">)</strong>
        </li>
      </ol>

      <p>
        Islamic finance exists almost entirely under the fifth objective — preservation of wealth.
        But it rarely operates alone: a prohibition on a financial structure is usually also
        protecting the first (a scheme built on deception undermines trust, which Islam treats as a
        religious matter) or the second (gambling-like products that wipe out savings threaten
        livelihood and life).
      </p>

      <QuoteBlock citation="Usmani, An Introduction to Islamic Finance">
        Islamic jurisprudence does not view financial transactions in isolation from ethics. A
        contract that is technically valid but economically exploitative still fails the test of
        Maqasid.
      </QuoteBlock>

      <ContextBox title="Why this matters for fintech">
        When a regulator or Shariah board reviews a new Islamic banking product — a BNPL app, a
        robo-advisor, a crypto-backed Sukuk — they are not just checking a list of banned words like
        "interest" or "interest rate." They are asking whether the product, in its real economic
        effect, preserves or undermines wealth, fairness, and trust between the parties. This is why
        two products that look identical on paper can get different Shariah rulings: the intent and
        economic substance matter, not just the contract's name.
      </ContextBox>

      <p>
        Maqasid is also the reason Islamic finance has room to evolve.{' '}
        <ArabicPill arabic="اجتهاد" transliteration="Ijtihad" /> — independent legal reasoning — lets
        scholars apply these five objectives to situations the classical jurists never saw: mobile
        money, embedded finance, tokenized Sukuk. The objectives stay fixed; the application moves
        with the times.
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        Maqasid al-Shariah functions a bit like the "spirit of the law" doctrine in common law
        systems, or like a company's stated mission used to interpret ambiguous clauses in a
        contract. A judge applying purposive interpretation asks "what was this rule meant to
        achieve?" — that is structurally close to what a Shariah scholar does when applying Maqasid
        to a new financial product.
      </ContextBox>
    </div>
  );
}

export const maqasidAlShariah: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'مقاصد الشريعة', transliteration: 'Maqasid al-Shariah', definition: 'The objectives or higher purposes of Islamic law.' },
    { arabic: 'المال', transliteration: 'al-Mal', definition: 'Wealth — one of the five objectives Islamic law protects.' },
    { arabic: 'اجتهاد', transliteration: 'Ijtihad', definition: 'Independent legal reasoning used to apply Islamic principles to new situations.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'How many universal objectives did al-Shatibi identify in Maqasid al-Shariah?',
      options: [
        { id: 'a', text: 'Three', correct: false },
        { id: 'b', text: 'Five', correct: true },
        { id: 'c', text: 'Seven', correct: false },
      ],
      feedback: {
        correct: 'Correct — religion, life, intellect, lineage, and wealth.',
        wrong: 'al-Shatibi identified five: religion, life, intellect, lineage, and wealth.',
      },
    },
    {
      id: 'q2',
      question: 'Which objective does most of Islamic finance fall under?',
      options: [
        { id: 'a', text: 'Preservation of Wealth (al-Mal)', correct: true },
        { id: 'b', text: 'Preservation of Lineage (al-Nasl)', correct: false },
        { id: 'c', text: 'Preservation of Intellect (al-Aql)', correct: false },
      ],
      feedback: {
        correct: 'Correct — financial transactions primarily engage al-Mal.',
        wrong: 'Most financial rulings serve preservation of wealth (al-Mal), though they can engage other objectives too.',
      },
    },
    {
      id: 'q3',
      question: 'What is Ijtihad?',
      options: [
        { id: 'a', text: 'A type of interest-free loan', correct: false },
        { id: 'b', text: 'Independent legal reasoning applied to new situations', correct: true },
        { id: 'c', text: 'A mandatory charity payment', correct: false },
      ],
      feedback: {
        correct: 'Correct — Ijtihad lets scholars apply fixed objectives to new contexts.',
        wrong: 'Ijtihad is independent legal reasoning, not a financial product.',
      },
    },
  ],
};
