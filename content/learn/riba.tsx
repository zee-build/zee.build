import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="ربا" transliteration="Riba" /> is the single most defining prohibition
        in Islamic finance — it is the reason an "Islamic bank" cannot simply be a conventional bank
        with different branding.
      </p>

      <QuoteBlock citation="Quran 2:275">
        Allah has permitted trade and forbidden riba.
      </QuoteBlock>

      <p>Classical jurists split Riba into two categories:</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">
            <ArabicPill arabic="ربا النسيئة" transliteration="Riba al-Nasi'ah" />
          </strong>{' '}
          — interest charged for delaying repayment of a debt. This is the everyday meaning most
          people associate with "interest": lend AED 100,000, demand AED 110,000 back regardless of
          what the borrower did with the money.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="ربا الفضل" transliteration="Riba al-Fadl" />
          </strong>{' '}
          — an unequal exchange of the same commodity (e.g. trading 10g of gold for 12g of gold on
          the spot). Less relevant to modern banking, but foundational to currency exchange rules.
        </li>
      </ol>

      <p>
        The economic objection to Riba al-Nasi'ah is that it guarantees a return to the capital
        provider regardless of whether the underlying venture succeeds or fails — all the
        downside risk sits with the borrower, while the lender is owed a fixed amount no matter
        what. Islamic finance instead insists capital and risk travel together: if you want a
        return on money, you must also bear a share of the risk of loss (as in Mudarabah or
        Musharakah), or you must be financing the sale of a real, identifiable asset (as in
        Murabaha or Ijarah).
      </p>

      <ContextBox title="The compounding problem">
        Compound interest makes the imbalance worse over time. A debt of AED 50,000 at 12% annual
        interest, compounded monthly and left unpaid, grows to roughly AED 56,400 after just one
        year — and the growth accelerates the longer it's unpaid, independent of the borrower's
        actual ability to pay. This is part of why the Quran (3:130) specifically condemns
        "devouring riba, doubled and multiplied."
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        Conventional finance does have an analogous concern — usury laws that cap interest rates
        exist in many jurisdictions precisely because unlimited compounding interest can trap
        borrowers in unpayable debt. Riba's prohibition is broader: it isn't about capping the
        rate, it's about removing the guaranteed, risk-free return on money altogether.
      </ContextBox>

      <p>
        This is why Islamic banks don't "lend money at a lower interest rate" — structurally, they
        cannot lend money for a fixed return at all. Every Islamic financing product (covered in
        Part 2) is built around either a real trade, a real lease, or a real partnership, precisely
        to avoid Riba.
      </p>
    </div>
  );
}

export const riba: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'ربا', transliteration: 'Riba', definition: 'Interest or usury — any guaranteed return on a loan, prohibited in Islamic finance.' },
    { arabic: 'ربا النسيئة', transliteration: "Riba al-Nasi'ah", definition: 'Interest charged for delaying repayment of a debt.' },
    { arabic: 'ربا الفضل', transliteration: 'Riba al-Fadl', definition: 'An unequal exchange of the same commodity in a spot trade.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: "What is Riba al-Nasi'ah?",
      options: [
        { id: 'a', text: 'Interest charged for delaying repayment of a debt', correct: true },
        { id: 'b', text: 'A mandatory charity tax', correct: false },
        { id: 'c', text: 'A type of profit-sharing contract', correct: false },
      ],
      feedback: {
        correct: "Correct — this is the everyday form of interest most people mean by 'Riba.'",
        wrong: "Riba al-Nasi'ah is interest charged for delaying debt repayment.",
      },
    },
    {
      id: 'q2',
      question: 'Why is a guaranteed, risk-free return on a loan considered problematic in Islamic finance?',
      options: [
        { id: 'a', text: 'Because all returns must be paid in gold', correct: false },
        { id: 'b', text: 'Because capital is supposed to share in the risk of the venture it funds', correct: true },
        { id: 'c', text: 'Because loans are entirely forbidden in Islam', correct: false },
      ],
      feedback: {
        correct: 'Correct — risk and reward must travel together; capital cannot be risk-free while debt carries all the risk.',
        wrong: 'The core objection is that Riba separates reward (guaranteed) from risk (borne entirely by the borrower).',
      },
    },
    {
      id: 'q3',
      question: 'Riba al-Fadl refers to:',
      options: [
        { id: 'a', text: 'An unequal exchange of the same commodity in a spot trade', correct: true },
        { id: 'b', text: 'A late payment penalty', correct: false },
        { id: 'c', text: 'An Islamic insurance premium', correct: false },
      ],
      feedback: {
        correct: 'Correct.',
        wrong: 'Riba al-Fadl is an unequal exchange of the same commodity, e.g. unequal weights of gold for gold.',
      },
    },
  ],
};
