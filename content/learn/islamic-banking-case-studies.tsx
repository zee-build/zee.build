import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Theory and standards are easier to absorb against real institutions. This module closes
        Part 3 with four cases — three real, one explicitly fictional — that illustrate how the
        two-tier Mudarabah model, Shariah governance, and regulatory frameworks actually show up in
        practice.
      </p>

      <p>
        <strong className="text-white">Mit Ghamr Savings Bank (Egypt, 1963).</strong> Covered earlier
        in this part as the historical starting point, Mit Ghamr is worth returning to as a case
        study in its own right. It was a rural savings-investment cooperative, not a full bank: it
        accepted small deposits from farmers and tradespeople, profit-shared with them, and financed
        local commerce without interest. It lasted only four years before being absorbed into Egypt's
        National Bank for political reasons unrelated to its financial performance. Its historical
        significance is disproportionate to its size and lifespan — it is the proof-of-concept every
        subsequent Islamic bank, including Dubai Islamic Bank, pointed back to.
      </p>

      <p>
        <strong className="text-white">Dubai Islamic Bank (UAE, 1975).</strong> The first full-scale
        commercial Islamic bank, DIB demonstrated that a Shariah-compliant institution could offer
        the complete suite of retail, corporate, and trade finance services a conventional bank
        offers — current accounts via Wadiah, savings via Mudarabah, home and auto finance via
        Ijarah and Murabaha — at commercial scale and profitability. Its early success in the
        UAE's oil-wealth economy is widely credited with catalyzing the wave of Islamic bank licenses
        across the GCC through the late 1970s and 1980s.
      </p>

      <ContextBox title="Maybank Islamic (Malaysia)">
        Maybank Islamic is the Islamic banking arm of Maybank, Malaysia's largest bank, and is
        consistently ranked among the largest Islamic banking operations globally by assets. It
        illustrates a different organizational model from DIB's: rather than being a standalone
        Islamic bank from inception, it operates as a dedicated Islamic subsidiary within a much
        larger conventional banking group, leveraging the parent's branch network, technology, and
        balance sheet while maintaining a fully separate Shariah governance structure under Bank
        Negara Malaysia's national Shariah Advisory Council framework. This "Islamic window/subsidiary"
        model is now one of the two dominant ways large markets scale Islamic banking, alongside
        standalone banks like DIB.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        Maybank Islamic's relationship to its parent bank resembles how some global banking groups run
        a dedicated wealth-management or private-banking subsidiary under the same brand umbrella —
        sharing infrastructure and customer base with the parent, but operating under a distinct
        regulatory and governance regime tailored to its specific product set.
      </ContextBox>

      <p>
        <strong className="text-white">Noor Digital Bank — a fictional case study.</strong> To
        illustrate digital-native Islamic banking concepts without referencing any real company, this
        course uses "Noor Digital Bank" as a composite, fictional UAE Islamic neobank throughout. Noor
        is not a real institution — it is a teaching device. Imagine a mobile-first bank offering
        Wadiah current accounts and Mudarabah savings pots entirely through an app, instant Murabaha
        approval for personal finance, and a real-time dashboard showing customers exactly which
        underlying Ijarah and Musharakah assets their savings pot is currently funding — a level of
        transparency that's harder to deliver in a traditional branch-based bank, but natural for a
        digital-native one. Noor's SSB structure, in this hypothetical, mirrors the real-world pattern:
        an independent three-scholar board issuing Fatwas before each new in-app product ships, with
        a quarterly Shariah audit report published to customers.
      </p>

      <QuoteBlock citation="A note on Noor Digital Bank">
        Noor Digital Bank is entirely fictional and is not based on, nor does it represent, any real
        institution. It exists purely to give later case-study discussions a concrete, hypothetical
        digital bank to reason about.
      </QuoteBlock>

      <p>
        Read together, these four cases trace the arc of the industry: a small, short-lived
        cooperative proving the concept (Mit Ghamr); a standalone commercial bank proving it scales
        (DIB); a large Islamic-subsidiary-within-a-conventional-group proving it can compete at the
        top of a national market (Maybank Islamic); and a hypothetical digital-native model
        (Noor) pointing at where the industry is likely headed next.
      </p>
    </div>
  );
}

export const islamicBankingCaseStudies: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'نور', transliteration: 'Noor', definition: 'Used here only as the name of a fictional, illustrative UAE Islamic digital bank used as a teaching device in this course.' },
    { arabic: 'بنك إسلامي قائم بذاته', transliteration: 'Standalone Islamic Bank', definition: 'An Islamic bank licensed and operated independently, like Dubai Islamic Bank, rather than as a subsidiary of a conventional bank.' },
    { arabic: 'نافذة إسلامية', transliteration: 'Islamic Window/Subsidiary', definition: 'A dedicated Islamic banking unit operating within or alongside a larger conventional banking group, like Maybank Islamic.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Why is Mit Ghamr Savings Bank historically significant despite lasting only four years?',
      options: [
        { id: 'a', text: 'It was the largest Islamic bank ever created', correct: false },
        { id: 'b', text: 'It proved the interest-free, profit-sharing model could work at the grassroots level', correct: true },
        { id: 'c', text: 'It invented the Murabaha contract', correct: false },
      ],
      feedback: {
        correct: 'Correct — Mit Ghamr was the proof-of-concept that later full-scale Islamic banks built on.',
        wrong: 'Its significance lies in proving the model worked in practice, not its size or contract innovation.',
      },
    },
    {
      id: 'q2',
      question: 'What organizational model does Maybank Islamic illustrate?',
      options: [
        { id: 'a', text: 'A standalone Islamic bank with no parent company', correct: false },
        { id: 'b', text: 'An Islamic banking subsidiary operating within a larger conventional banking group', correct: true },
        { id: 'c', text: 'A purely fictional case study', correct: false },
      ],
      feedback: {
        correct: 'Correct — Maybank Islamic is a dedicated Islamic subsidiary of the larger Maybank group.',
        wrong: 'Maybank Islamic operates as a subsidiary within a conventional banking group, not standalone.',
      },
    },
    {
      id: 'q3',
      question: 'Is Noor Digital Bank a real institution?',
      options: [
        { id: 'a', text: 'Yes, it is a real UAE neobank', correct: false },
        { id: 'b', text: 'No, it is an explicitly fictional composite used for teaching purposes in this course', correct: true },
        { id: 'c', text: 'It is the digital arm of Dubai Islamic Bank', correct: false },
      ],
      feedback: {
        correct: 'Correct — Noor Digital Bank is fictional and not based on any real company.',
        wrong: 'Noor Digital Bank is explicitly fictional, used only as a teaching device in this course.',
      },
    },
  ],
};
