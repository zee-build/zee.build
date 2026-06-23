import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Every Islamic bank needs a mechanism to actually guarantee that what it sells is
        Shariah-compliant — not just at launch, but on an ongoing basis as products, markets, and
        staff change. That mechanism is the{' '}
        <strong className="text-white">
          <ArabicPill arabic="هيئة الرقابة الشرعية" transliteration="Shariah Supervisory Board" />
        </strong>{' '}
        (SSB), sometimes called a Shariah board or Shariah committee.
      </p>

      <p>
        <strong className="text-white">Composition.</strong> An SSB is typically made up of three to
        five qualified Shariah scholars — individuals trained in{' '}
        <ArabicPill arabic="فقه المعاملات" transliteration="Fiqh al-Mu'amalat" /> (Islamic
        transactional jurisprudence), often holding advanced degrees from institutions with strong
        Shariah faculties, and frequently sitting on the boards of multiple banks simultaneously
        (which has itself become a regulatory concern, discussed below). Many also have exposure to
        modern finance, accounting, or law, since interpreting whether a structured product complies
        with Shariah requires understanding both the classical rulings and the product's actual
        economic mechanics.
      </p>

      <p>
        <strong className="text-white">Role.</strong> The SSB's core functions are: (1) reviewing and
        approving — or rejecting — every new product before it launches, often issuing a written{' '}
        <ArabicPill arabic="فتوى" transliteration="Fatwa" /> that documents the ruling and its
        reasoning; (2) conducting ongoing Shariah audits of the bank's actual operations, to confirm
        that products are being executed in practice the way they were approved on paper (a Murabaha
        that skips the bank's momentary ownership step, for instance, would fail even if the
        documentation says otherwise); and (3) signing off annually on a Shariah compliance report
        that typically accompanies the bank's financial statements.
      </p>

      <ContextBox title="Why ongoing audit matters as much as approval">
        A product can be approved by the SSB in its documented form and still be executed
        non-compliantly on the ground — a branch employee skipping a required step in a Murabaha
        sale sequence, for example, or a profit-distribution calculation that quietly deviates from
        the approved ratio. This is why AAOIFI's Governance Standards require internal Shariah
        review/audit functions that report to the SSB, independent of the bank's normal management
        chain, much like an internal audit function reports to an audit committee rather than to the
        CEO.
      </ContextBox>

      <p>
        <strong className="text-white">Independence.</strong> Because the SSB's rulings can make or
        kill a profitable product, independence is taken seriously. Members generally cannot be bank
        employees in a capacity that would compromise their judgment, cannot be remunerated in ways
        tied to a product's commercial success, and are expected to disclose conflicts — including
        memberships on competing banks' boards. AAOIFI's Governance Standard No. 1 on Shariah
        Supervisory Boards sets out qualification, appointment, and independence requirements that
        most Gulf and Southeast Asian regulators now reference directly or indirectly in their own
        rules.
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        An SSB plays a role structurally similar to a corporate audit committee or an external
        auditor's sign-off — except its subject matter is religious-legal compliance rather than
        financial accuracy, and its "opinion" (the Fatwa) is the difference between a product being
        sellable at all and not. A closer analogy in spirit is a clinical ethics board: a body of
        independent experts whose approval is a precondition for an institution to proceed, and whose
        independence from management is treated as essential to the credibility of that approval.
      </ContextBox>

      <QuoteBlock citation="AAOIFI Governance Standard for Islamic Financial Institutions No. 1">
        The Shariah Supervisory Board shall be independent in its decisions, and no party shall
        influence its rulings, including the institution's management or shareholders.
      </QuoteBlock>

      <p>
        Standardizing SSB composition and conduct across institutions and jurisdictions is one of
        AAOIFI's central contributions to the industry — without it, the same product could
        plausibly receive a Fatwa of approval from one bank's board and outright rejection from
        another's, undermining customer trust in the label "Islamic" itself.
      </p>
    </div>
  );
}

export const shariahGovernance: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'هيئة الرقابة الشرعية', transliteration: 'Shariah Supervisory Board', definition: 'A board of qualified scholars that approves and audits a bank\'s Shariah compliance.' },
    { arabic: 'فتوى', transliteration: 'Fatwa', definition: 'A formal religious ruling, here documenting an SSB\'s approval or rejection of a product.' },
    { arabic: 'فقه المعاملات', transliteration: "Fiqh al-Mu'amalat", definition: 'Islamic jurisprudence governing financial and commercial transactions.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What are the two core ongoing functions of a Shariah Supervisory Board?',
      options: [
        { id: 'a', text: 'Setting interest rates and approving loans', correct: false },
        { id: 'b', text: 'Approving new products before launch and auditing ongoing compliance', correct: true },
        { id: 'c', text: 'Managing the bank\'s investment portfolio directly', correct: false },
      ],
      feedback: {
        correct: 'Correct — pre-launch approval (Fatwa) and ongoing Shariah audit are the SSB\'s core roles.',
        wrong: 'The SSB approves products before launch and audits ongoing operational compliance.',
      },
    },
    {
      id: 'q2',
      question: 'Why does ongoing Shariah audit matter even after a product is approved?',
      options: [
        { id: 'a', text: 'Because approved products automatically expire after a year', correct: false },
        { id: 'b', text: 'Because a product can be executed non-compliantly in practice even if approved on paper', correct: true },
        { id: 'c', text: 'Because regulators require re-approval daily', correct: false },
      ],
      feedback: {
        correct: 'Correct — execution can drift from the approved structure, which is why ongoing audit is required.',
        wrong: 'Audit matters because real-world execution can deviate from the approved documentation.',
      },
    },
    {
      id: 'q3',
      question: 'Which organization sets standardized governance requirements for Shariah Supervisory Boards?',
      options: [
        { id: 'a', text: 'AAOIFI', correct: true },
        { id: 'b', text: 'The World Bank', correct: false },
        { id: 'c', text: 'The IMF', correct: false },
      ],
      feedback: {
        correct: 'Correct — AAOIFI\'s Governance Standards set SSB qualification and independence requirements.',
        wrong: 'AAOIFI issues the Governance Standards that standardize SSB composition and conduct.',
      },
    },
  ],
};
