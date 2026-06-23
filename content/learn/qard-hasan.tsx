import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="قرض حسن" transliteration="Qard Hasan" /> is the simplest contract in
        this entire course, and arguably the purest expression of what Islamic finance is trying to
        protect against Riba: a loan where the lender expects back exactly what they lent, nothing
        more, nothing less.
      </p>

      <p>
        There is no profit margin, no rental, no profit-sharing ratio. The borrower repays only the
        principal — and even that repayment obligation can, in genuine hardship, be deferred or
        waived by the lender entirely. Qard Hasan is structured as an act of benevolence, not a
        commercial transaction.
      </p>

      <QuoteBlock citation="Quran 2:245">
        Who is it that will loan Allah a beautiful loan, which Allah will double unto his credit and
        multiply many times?
      </QuoteBlock>

      <p>
        This verse is the textual basis for the term: a "Qard Hasan" — a goodly, beautiful loan — is
        framed not as a financial instrument with a return, but as an act of charity that earns
        spiritual reward instead of monetary interest. Because the lender takes on credit risk
        (the borrower might not repay) with zero compensating return, Qard Hasan only makes sense as
        a genuinely charitable or social-purpose instrument, not a profit-seeking banking product.
      </p>

      <ContextBox title="Where Qard Hasan is actually used">
        Qard Hasan shows up in Islamic microfinance (small interest-free loans to low-income
        entrepreneurs to start or stabilize a small business), in emergency relief lending (disaster
        relief, medical emergencies, where speed and zero burden matter more than any return), and
        as an internal product some Islamic banks offer alongside their commercial financing —
        often funded out of a Zakat or charity pool rather than the bank's commercial balance sheet,
        since a zero-return loan cannot be funded the same way an interest-bearing or profit-sharing
        product is.
      </ContextBox>

      <p>
        This funding distinction matters operationally: a bank cannot scale Qard Hasan the way it
        scales Murabaha or Ijarah, because Qard Hasan generates no return to replenish the capital
        pool. It survives on dedicated charitable funding, Zakat allocations, or CSR-style social
        impact budgets — which is also why it tends to stay relatively small in absolute size next
        to a bank's commercial Islamic financing book.
      </p>

      <ContextBox title="Qard Hasan meets fintech: COVID-19 relief lending" variant="western-parallel">
        During the COVID-19 pandemic, several Islamic fintechs and digital banks used Qard Hasan
        structures paired with AI-driven credit scoring to disburse fast, interest-free relief
        loans to small businesses and individuals facing sudden income loss. The AI models were used
        to quickly assess repayment capacity and prioritize the most urgent cases for limited
        charitable lending pools — a case where modern credit-risk technology served a purely
        benevolent, zero-return lending structure rather than a profit-maximizing one. It illustrates
        Ijtihad in practice: applying new technology (AI credit scoring) to a centuries-old
        charitable contract without changing the contract's core character.
      </ContextBox>

      <p>
        Qard Hasan is a useful reminder that not every Islamic financial structure is designed to
        generate a return for the capital provider. Some — like this one — exist specifically to
        meet a social or charitable need where the absence of return is the entire point.
      </p>
    </div>
  );
}

export const qardHasan: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'قرض حسن', transliteration: 'Qard Hasan', definition: 'A benevolent, zero-return loan where the borrower repays only the principal.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What does the lender expect to receive back under a Qard Hasan?',
      options: [
        { id: 'a', text: 'Exactly the principal amount lent, with no additional return', correct: true },
        { id: 'b', text: 'The principal plus a small disclosed profit margin', correct: false },
        { id: 'c', text: 'A share of the borrower\'s business profit', correct: false },
      ],
      feedback: {
        correct: 'Correct — Qard Hasan is principal-only, with no markup, profit share, or rental attached.',
        wrong: 'Qard Hasan involves repayment of principal only — any additional charge would turn it into Riba.',
      },
    },
    {
      id: 'q2',
      question: 'Why can\'t Islamic banks fund Qard Hasan the same way they fund Murabaha or Ijarah?',
      options: [
        { id: 'a', text: 'Qard Hasan generates no return to replenish the lending pool, so it typically relies on charitable or Zakat funding', correct: true },
        { id: 'b', text: 'Qard Hasan is illegal for banks to offer', correct: false },
        { id: 'c', text: 'Qard Hasan requires a government subsidy by law', correct: false },
      ],
      feedback: {
        correct: 'Correct — without a return, the product cannot self-fund the way commercial financing products do, so it is usually funded through dedicated charitable pools.',
        wrong: 'Because Qard Hasan earns no return, it cannot replenish its own capital pool the way profit-generating products can — it relies on charitable or Zakat-based funding instead.',
      },
    },
    {
      id: 'q3',
      question: 'How did some Islamic fintechs use AI alongside Qard Hasan during COVID-19?',
      options: [
        { id: 'a', text: 'To quickly assess repayment capacity and prioritize urgent cases for fast, interest-free relief loans', correct: true },
        { id: 'b', text: 'To automatically convert Qard Hasan loans into interest-bearing loans', correct: false },
        { id: 'c', text: 'To replace Zakat-based funding with conventional bank capital', correct: false },
      ],
      feedback: {
        correct: 'Correct — AI credit scoring sped up triage and disbursement of charitable, zero-return relief loans.',
        wrong: 'The AI was used for fast credit assessment to prioritize and disburse Qard Hasan relief loans quickly, not to change the loan\'s zero-return nature.',
      },
    },
  ],
};
