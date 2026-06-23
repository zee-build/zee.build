import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Islamic finance generally prohibits selling something you don't yet have, or whose
        existence, quantity, or quality is uncertain at contract time — this is part of the broader{' '}
        <ArabicPill arabic="غرر" transliteration="Gharar" /> prohibition covered earlier in this
        course. <ArabicPill arabic="سلم" transliteration="Salam" /> and{' '}
        <ArabicPill arabic="استصناع" transliteration="Istisna" /> are two narrow, deliberately
        carved-out exceptions to that general rule.
      </p>

      <p>
        Both exceptions exist because a blanket ban on forward sales would shut out two groups of
        people who have a genuine, recurring economic need for upfront capital before they can
        deliver anything: farmers and manufacturers.
      </p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">Salam.</strong> The buyer pays the full price upfront, in
          full, at the time of contract — for a specified quantity and quality of a standardized,
          fungible commodity to be delivered at a future date. Historically used for agricultural
          produce: a buyer pays a farmer now for wheat to be delivered after the harvest, giving the
          farmer working capital to plant the crop in the first place.
        </li>
        <li>
          <strong className="text-white">Istisna.</strong> A manufacturing or construction
          contract for a custom-built, non-standardized asset — a building, a ship, custom
          machinery. Unlike Salam, payment in Istisna can be staged across the construction or
          manufacturing period rather than paid entirely upfront, which suits projects with long
          lead times and incremental costs.
        </li>
      </ol>

      <QuoteBlock citation="Usmani, An Introduction to Islamic Finance">
        Normally, no sale can be effected unless the goods are in existence at the time of the
        bargain. Salam and Istisna are exceptions allowed by the Shariah as a matter of necessity,
        subject to conditions designed to remove excessive Gharar.
      </QuoteBlock>

      <ContextBox title="Why these specific exceptions, and not a general rule against Gharar's strictness">
        Jurists distinguish between Gharar that is excessive and unmanageable (e.g. selling "the
        catch a fisherman will bring in next week," where quantity, quality, and even existence are
        all unknown) and Gharar that is residual but tightly bounded by precise specification.
        Salam requires the commodity's type, quality grade, and quantity to be exactly specified and
        the delivery date fixed — narrowing the uncertainty down to almost nothing beyond ordinary
        commercial risk. Istisna similarly requires the specifications of the manufactured item to
        be fully described in the contract. The remaining uncertainty is no greater than what exists
        in any conventional forward manufacturing order, which is why the exception is tolerated.
      </ContextBox>

      <p>
        Both contracts also serve the same underlying Maqasid logic discussed earlier in this
        course: preservation of wealth is not just about avoiding exploitative structures, it is
        also about enabling productive economic activity. A farmer who cannot get capital before
        harvest, or a manufacturer who cannot get capital before completing a custom order, faces a
        real economic harm that a rigid, absolute Gharar ban would create rather than prevent.
        Salam and Istisna resolve that tension.
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        Salam is structurally similar to a conventional forward contract on a standardized commodity
        (e.g. a wheat forward), where price and delivery terms are fixed today for a future
        delivery. Istisna resembles a conventional pre-construction or build-to-order contract with
        progress payments, common in shipbuilding, real estate development, and large equipment
        manufacturing — the staged payment structure exists in both worlds for the same practical
        reason: large custom builds require funding before completion.
      </ContextBox>

      <p>
        In modern Islamic banking, Istisna is widely used to finance large infrastructure and
        construction projects, often paired with an Ijarah lease once the asset is completed (the
        bank finances construction via Istisna, then leases the completed asset to the end client).
        Salam sees more limited modern use, largely in agricultural and commodity-linked Islamic
        finance products, precisely because it requires full upfront payment, which limits its
        flexibility compared to Istisna's staged payments.
      </p>
    </div>
  );
}

export const salamAndIstisna: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'سلم', transliteration: 'Salam', definition: 'A forward sale of a standardized commodity with full payment upfront and delivery at a future date.' },
    { arabic: 'استصناع', transliteration: 'Istisna', definition: 'A manufacturing or construction contract for a custom asset, with payment that can be staged over the build period.' },
    { arabic: 'غرر', transliteration: 'Gharar', definition: 'Excessive uncertainty or ambiguity in a contract, generally prohibited in Islamic finance.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What is the key payment difference between Salam and Istisna?',
      options: [
        { id: 'a', text: 'Salam requires full payment upfront; Istisna allows staged payments over the build period', correct: true },
        { id: 'b', text: 'Istisna requires full payment upfront; Salam allows staged payments', correct: false },
        { id: 'c', text: 'Both require payment only after delivery', correct: false },
      ],
      feedback: {
        correct: 'Correct — Salam demands the full price at contract signing; Istisna can be paid in stages as construction progresses.',
        wrong: 'Salam requires full upfront payment; Istisna permits staged payments, which suits long manufacturing or construction timelines.',
      },
    },
    {
      id: 'q2',
      question: 'Why are Salam and Istisna permitted despite the general prohibition on selling something not yet in existence?',
      options: [
        { id: 'a', text: 'Because precise specification of the future goods narrows Gharar enough, and they serve a genuine economic need for upfront capital', correct: true },
        { id: 'b', text: 'Because Gharar only applies to spot transactions, never to forward sales', correct: false },
        { id: 'c', text: 'Because farmers and manufacturers are exempt from all Shariah commercial rules', correct: false },
      ],
      feedback: {
        correct: 'Correct — tight specification plus genuine economic necessity is the basis for the exception.',
        wrong: 'The exception rests on narrowing uncertainty through precise specification of quantity/quality/delivery, combined with a real economic need for upfront capital.',
      },
    },
    {
      id: 'q3',
      question: 'Which contract was historically most associated with financing agricultural produce before harvest?',
      options: [
        { id: 'a', text: 'Salam', correct: true },
        { id: 'b', text: 'Istisna', correct: false },
        { id: 'c', text: 'Ijarah', correct: false },
      ],
      feedback: {
        correct: 'Correct — Salam\'s historical use case is exactly this: paying a farmer upfront for produce to be delivered after harvest.',
        wrong: 'Salam is the contract historically used for agricultural produce, with full advance payment funding the farmer before harvest.',
      },
    },
  ],
};
