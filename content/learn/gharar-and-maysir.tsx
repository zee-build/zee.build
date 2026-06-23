import ArabicPill from '@/components/learn/ArabicPill';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Two more prohibitions complete the foundation alongside Riba:{' '}
        <ArabicPill arabic="غرر" transliteration="Gharar" /> (excessive uncertainty) and{' '}
        <ArabicPill arabic="ميسر" transliteration="Maysir" /> (gambling).
      </p>

      <p>
        <strong className="text-white">Gharar</strong> is uncertainty about the subject matter,
        price, or terms of a contract that is severe enough to make one party's outcome essentially
        a matter of chance rather than a known, negotiated exchange. Selling "the catch of tomorrow's
        fishing trip" for a fixed price is the classical example — neither party knows what's
        actually being sold.
      </p>

      <p>
        <strong className="text-white">Maysir</strong> is narrower: a zero-sum game where one
        party's gain is mechanically another's loss, with no productive economic activity in
        between. Gambling, and most derivatives that are pure side-bets with no underlying asset
        changing hands, fall here.
      </p>

      <ContextBox title="Where the line is drawn">
        Not all uncertainty is forbidden — that would make insurance, ordinary commerce, and even
        farming impossible, since every business carries some risk. Jurists distinguish between
        normal commercial risk (Shariah-compliant) and excessive, avoidable uncertainty about the
        core terms of the deal (Gharar). A fixed-price Murabaha sale of a car with a known VIN
        carries commercial risk (the car could be damaged before delivery) but no Gharar (the
        subject, price, and delivery terms are all clear).
      </ContextBox>

      <p>
        This is also why conventional insurance is contentious in classical Islamic jurisprudence —
        a policyholder pays a premium for an uncertain, contingent payout, which can resemble both
        Gharar (uncertain outcome) and Maysir (the insurer profits if no claim is made, the
        policyholder "wins" if a claim is paid). Takaful (Part 4) was developed specifically to
        restructure insurance around mutual risk-sharing instead.
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        Gharar maps loosely onto the legal doctrine of "indefiniteness" that can void a contract in
        common law — a contract too vague about price or subject matter to be enforced. Maysir maps
        onto how many regulators distinguish "hedging" (legitimate risk management) from pure
        speculative betting in derivatives markets.
      </ContextBox>
    </div>
  );
}

export const ghararAndMaysir: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'غرر', transliteration: 'Gharar', definition: 'Excessive uncertainty about the subject, price, or terms of a contract.' },
    { arabic: 'ميسر', transliteration: 'Maysir', definition: 'Gambling — a zero-sum exchange with no underlying productive activity.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Gharar refers to:',
      options: [
        { id: 'a', text: 'Excessive uncertainty about a contract\'s core terms', correct: true },
        { id: 'b', text: 'A fixed profit margin on a sale', correct: false },
        { id: 'c', text: 'A charitable endowment', correct: false },
      ],
      feedback: { correct: 'Correct.', wrong: 'Gharar is excessive, avoidable uncertainty about what is being exchanged.' },
    },
    {
      id: 'q2',
      question: 'Why is ordinary commercial risk (e.g. a car being damaged before delivery) generally acceptable, while Gharar is not?',
      options: [
        { id: 'a', text: 'Commercial risk is unavoidable and the contract terms themselves remain clear', correct: true },
        { id: 'b', text: 'Commercial risk only affects the seller', correct: false },
        { id: 'c', text: 'There is no real distinction — both are forbidden', correct: false },
      ],
      feedback: {
        correct: 'Correct — Gharar is about excessive uncertainty in the contract terms themselves, not all risk.',
        wrong: 'The key distinction is whether the contract terms (subject, price, delivery) are clear, not whether any risk exists at all.',
      },
    },
    {
      id: 'q3',
      question: 'Maysir is best described as:',
      options: [
        { id: 'a', text: 'A zero-sum exchange with no underlying productive activity', correct: true },
        { id: 'b', text: 'A type of profit-sharing partnership', correct: false },
        { id: 'c', text: 'An interest-free loan', correct: false },
      ],
      feedback: { correct: 'Correct — gambling and pure speculative side-bets fall under Maysir.', wrong: 'Maysir is gambling-like, zero-sum exchange.' },
    },
  ],
};
