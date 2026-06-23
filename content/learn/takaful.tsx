import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Conventional insurance is one of the more contested products in Islamic finance — not
        because protecting against risk is objectionable (it isn't), but because of how a
        conventional insurance contract is structured. <ArabicPill arabic="تكافل" transliteration="Takaful" />{' '}
        is the Islamic restructuring of insurance that addresses those objections while still
        delivering real risk protection.
      </p>

      <p className="font-medium text-white">Why conventional insurance is contentious</p>
      <p>
        The objections trace back to two prohibitions covered earlier in the course:{' '}
        <ArabicPill arabic="غرر" transliteration="Gharar" /> (excessive uncertainty) and{' '}
        <ArabicPill arabic="ميسر" transliteration="Maysir" /> (gambling). In a conventional
        insurance policy, the policyholder pays a fixed premium for an uncertain, contingent
        payout — they may pay premiums for decades and receive nothing back if no claim occurs, or
        they may pay one premium and receive a payout many times larger if a claim occurs
        immediately. Critics argue this exchange — a known sum for an unknown, contingent outcome
        — has the same structure as a bet: one party gains exactly what the other loses, determined
        by chance rather than a shared, transparent pooling of risk.
      </p>

      <QuoteBlock citation="Usmani, An Introduction to Islamic Finance">
        The element of Gharar is mostly found in contracts of insurance... the basic objection
        against the contract of insurance, from the Shariah viewpoint, is its dependence on Riba
        and Maysir.
      </QuoteBlock>

      <p className="font-medium text-white">How Takaful restructures the exchange</p>
      <p>
        Takaful removes the buyer/seller, premium/payout framing entirely and replaces it with
        mutual risk-sharing. Participants don't buy a contingent payout from an insurer — they
        contribute to a common fund as a{' '}
        <ArabicPill arabic="تبرع" transliteration="Tabarru'" /> — a donation or gift, not a
        premium paid in exchange for a guaranteed contingent benefit. Because the contribution is
        legally a donation to a shared pool, the Gharar objection dissolves: no one is buying an
        uncertain outcome from a counterparty, they are voluntarily pooling resources with other
        participants who face similar risk, and claims are paid out of that shared pool to whichever
        participant suffers a covered loss.
      </p>

      <ContextBox title="Tabarru' in practice">
        When a participant pays into a Takaful fund, that payment is split (often explicitly, on
        the policy document) into the Tabarru' portion, which enters the shared risk pool, and an
        administrative/management fee retained by the Takaful operator for running the scheme.
        Because the Tabarru' portion is a donation to the collective, not a fee paid to the
        operator for assuming risk, the operator itself is not "selling" risk protection — it is
        managing a fund the participants collectively own.
      </ContextBox>

      <p className="font-medium text-white">The two operating models</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">
            <ArabicPill arabic="وكالة" transliteration="Wakalah" /> model
          </strong>{' '}
          — the Takaful operator acts as a paid agent (Wakeel) managing the fund on behalf of
          participants, charging a fixed or pre-agreed Wakalah fee for administration and claims
          handling, regardless of the fund's underwriting result. This is the dominant model in
          the GCC.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="مضاربة" transliteration="Mudarabah" /> model
          </strong>{' '}
          — the operator acts more like a fund manager than a fixed-fee agent: instead of (or in
          addition to) a fee, the operator shares in any underwriting surplus the fund generates,
          in a pre-agreed ratio with participants. This is more common in Southeast Asian Takaful
          markets (Malaysia in particular). Many operators today use a hybrid Wakalah-Mudarabah
          structure — a Wakalah fee for managing contributions, plus a Mudarabah-style share of
          investment profit on the fund's invested assets.
        </li>
      </ol>

      <p>
        In both models, if the risk pool runs a surplus (contributions and investment income
        exceed claims paid out), that surplus is typically either distributed back to participants,
        retained to strengthen the fund's reserves, or some combination — unlike a conventional
        insurer's underwriting profit, which belongs entirely to shareholders.
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        Takaful's structure resembles mutual insurance companies in conventional finance — entities
        owned by policyholders rather than external shareholders, where underwriting surplus can be
        returned to members as a dividend. The Wakalah/Mudarabah distinction is roughly analogous
        to a mutual choosing between paying its manager a flat administration fee versus a
        performance-linked management fee.
      </ContextBox>

      <p className="font-medium text-white">Family vs. General Takaful</p>
      <p>
        <strong className="text-white">Family Takaful</strong> is the equivalent of life insurance
        and long-term savings/protection plans — it typically combines a protection (Tabarru')
        component with a savings/investment component, since long-duration coverage usually
        involves an investment account building value over time. <strong className="text-white">
        General Takaful</strong> covers property, motor, marine, and other short-term casualty
        risks — structurally closer to a pure risk pool with no savings component, renewed
        annually like conventional general insurance policies.
      </p>
    </div>
  );
}

export const takaful: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'تكافل', transliteration: 'Takaful', definition: 'Islamic insurance structured as mutual risk-sharing rather than a premium-for-payout contract.' },
    { arabic: 'تبرع', transliteration: "Tabarru'", definition: 'A donation or gift — the legal characterization of a Takaful contribution into the shared risk pool.' },
    { arabic: 'وكالة', transliteration: 'Wakalah', definition: 'An agency contract; in Takaful, the operator acts as a paid agent managing the fund for a fee.' },
    { arabic: 'مضاربة', transliteration: 'Mudarabah', definition: 'A profit-sharing partnership; in Takaful, the operator shares in underwriting or investment surplus instead of (or alongside) a fixed fee.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: "Why is a Takaful contribution structured as a Tabarru' rather than a premium?",
      options: [
        { id: 'a', text: "Because it is legally a donation to a shared pool, which avoids the Gharar objection to a fixed sum exchanged for an uncertain payout", correct: true },
        { id: 'b', text: "Because Tabarru contributions are tax-exempt in most jurisdictions", correct: false },
        { id: 'c', text: 'Because it allows the operator to keep all underwriting profit', correct: false },
      ],
      feedback: {
        correct: "Correct — characterizing the contribution as a donation to a mutual pool, not a premium bought for a contingent payout, is what resolves the Gharar concern.",
        wrong: "The Tabarru' structuring is specifically what avoids the Gharar objection: it reframes the contribution as a gift to a shared pool rather than a fixed payment in exchange for an uncertain, contingent benefit.",
      },
    },
    {
      id: 'q2',
      question: 'In the Wakalah model, how is the Takaful operator typically compensated?',
      options: [
        { id: 'a', text: 'A fixed or pre-agreed agency fee for managing the fund, regardless of underwriting results', correct: true },
        { id: 'b', text: 'A guaranteed fixed interest payment on participant contributions', correct: false },
        { id: 'c', text: 'By keeping 100% of any underwriting surplus', correct: false },
      ],
      feedback: {
        correct: 'Correct — the Wakalah model pays the operator a fee for acting as agent, separate from the fund’s underwriting performance.',
        wrong: 'Under Wakalah, the operator earns a pre-agreed agency fee for administration, not a share of underwriting profit (that is the Mudarabah model) and not interest.',
      },
    },
    {
      id: 'q3',
      question: 'What distinguishes Family Takaful from General Takaful?',
      options: [
        { id: 'a', text: 'Family Takaful typically combines protection with a savings/investment component, like life insurance; General Takaful covers short-term property/casualty risk', correct: true },
        { id: 'b', text: 'Family Takaful is only available to immediate family members of the operator', correct: false },
        { id: 'c', text: 'General Takaful does not use a Tabarru-based structure', correct: false },
      ],
      feedback: {
        correct: 'Correct — Family Takaful parallels life/savings insurance, while General Takaful parallels annually renewed property and casualty coverage.',
        wrong: 'Family Takaful is the long-duration, savings-plus-protection analogue to life insurance; General Takaful is the short-term, renewable risk-pool analogue to property/casualty insurance.',
      },
    },
  ],
};
