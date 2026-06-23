import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Part 2 covered the underlying contracts —{' '}
        <ArabicPill arabic="مرابحة" transliteration="Murabaha" />,{' '}
        <ArabicPill arabic="إجارة" transliteration="Ijarah" />,{' '}
        <ArabicPill arabic="مشاركة" transliteration="Musharakah" />, and{' '}
        <ArabicPill arabic="سلم" transliteration="Salam" /> /{' '}
        <ArabicPill arabic="استصناع" transliteration="Istisna" /> — in the abstract. This module maps
        them onto the actual consumer and SME products an Islamic bank sells, and shows how each one
        differs structurally, not just terminologically, from its conventional counterpart.
      </p>

      <p>
        <strong className="text-white">Home finance.</strong> Two structures dominate.{' '}
        <ArabicPill arabic="إجارة منتهية بالتمليك" transliteration="Ijarah Muntahia Bittamleek" /> —
        lease ending in ownership — has the bank buy the property and lease it to the customer, with
        ownership transferring at the end of the lease term. Diminishing Musharakah has the bank and
        customer jointly own the property from day one; the customer buys out the bank's share in
        installments while paying rent on the portion the bank still owns, so the bank's equity stake
        — and the rental charge on it — shrinks over time.
      </p>

      <p>
        <strong className="text-white">Auto finance</strong> is almost universally structured as
        Murabaha: the bank buys the car from the dealer and immediately resells it to the customer at
        a disclosed cost-plus-markup price, payable in installments. The markup is fixed at contract
        signing — it does not float with a benchmark rate the way a conventional auto loan's APR
        sometimes does.
      </p>

      <p>
        <strong className="text-white">Personal finance</strong> typically uses Murabaha over a
        commodity (often called <ArabicPill arabic="تورق" transliteration="Tawarruq" />) when the
        customer needs cash rather than a specific asset: the bank buys a commodity and sells it to
        the customer on deferred payment, the customer then sells it for cash. It is a more
        controversial structure among scholars precisely because it most closely resembles a cash
        loan, and AAOIFI's standards impose strict sequencing and ownership requirements to keep it
        distinct from a disguised interest-bearing loan.
      </p>

      <p>
        <strong className="text-white">Trade finance</strong> uses Murabaha for import/export
        financing (the bank buys goods on the customer's behalf and resells them at a markup) and{' '}
        <ArabicPill arabic="وكالة" transliteration="Wakalah" /> (agency) where the bank appoints the
        customer as its agent to execute a transaction on the bank's behalf for a fee.{' '}
        <strong className="text-white">SME finance</strong> often blends Murabaha for working capital
        and equipment purchases with Musharakah or Mudarabah for growth capital where the bank takes
        a genuine equity-like stake.
      </p>

      <ContextBox title="Structure, not just naming">
        <table className="w-full text-sm border-collapse my-2">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th className="text-left py-2 pr-3 font-medium">Need</th>
              <th className="text-left py-2 pr-3 font-medium">Conventional</th>
              <th className="text-left py-2 font-medium">Islamic</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-3">Home</td>
              <td className="py-2 pr-3">Mortgage — bank lends cash, charges interest, takes a lien</td>
              <td className="py-2">Diminishing Musharakah / IMB — bank co-owns or leases the actual property</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-3">Car</td>
              <td className="py-2 pr-3">Auto loan — cash lent against the car as collateral</td>
              <td className="py-2">Murabaha — bank buys and resells the car at a fixed markup</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-2 pr-3">Cash / personal</td>
              <td className="py-2 pr-3">Personal loan — unsecured cash with interest</td>
              <td className="py-2">Tawarruq — commodity bought and resold to generate cash, deferred payment</td>
            </tr>
            <tr>
              <td className="py-2 pr-3">SME growth capital</td>
              <td className="py-2 pr-3">Business loan — fixed repayment regardless of performance</td>
              <td className="py-2">Musharakah — bank holds genuine equity, shares profit and loss</td>
            </tr>
          </tbody>
        </table>
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        A diminishing Musharakah mortgage and a conventional amortizing mortgage can produce a
        strikingly similar monthly payment schedule and similar total cost over the life of the loan
        — which is exactly why critics sometimes call Islamic finance "interest by another name." The
        rebuttal is structural: in a diminishing Musharakah the bank actually owns a shrinking share
        of the property and bears the risks of ownership (insurance, certain maintenance obligations,
        exposure if the property is destroyed before full transfer) in a way a mortgage lender never
        does. The economic substance, not just the cash flow shape, is what Shariah scholars assess.
      </ContextBox>

      <QuoteBlock citation="Usmani, An Introduction to Islamic Finance">
        A Murabaha transaction is not a loan with a different name. It is a genuine sale, and the
        bank must actually own the asset — even if only momentarily — before it can sell it to the
        customer. Skipping that step is exactly the loophole AAOIFI's standards are designed to
        close.
      </QuoteBlock>

      <p>
        The common thread across every product here: the bank's return is always tied to owning,
        leasing, or co-investing in a real asset or venture — never to lending cash for a fee alone.
      </p>
    </div>
  );
}

export const islamicBankFinancing: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'إجارة منتهية بالتمليك', transliteration: 'Ijarah Muntahia Bittamleek', definition: 'A lease ending in ownership transfer, commonly used for home finance.' },
    { arabic: 'تورق', transliteration: 'Tawarruq', definition: 'A commodity Murabaha structure used to generate cash for personal financing.' },
    { arabic: 'وكالة', transliteration: 'Wakalah', definition: 'An agency contract where one party acts on behalf of another for a fee.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Which structure is most commonly used for Islamic auto finance?',
      options: [
        { id: 'a', text: 'Murabaha', correct: true },
        { id: 'b', text: 'Diminishing Musharakah', correct: false },
        { id: 'c', text: 'Salam', correct: false },
      ],
      feedback: {
        correct: 'Correct — the bank buys the car and resells it at a fixed cost-plus markup.',
        wrong: 'Auto finance is almost universally structured as Murabaha.',
      },
    },
    {
      id: 'q2',
      question: 'In a diminishing Musharakah home finance arrangement, what does the bank actually hold?',
      options: [
        { id: 'a', text: 'A lien on the customer\'s collateral only', correct: false },
        { id: 'b', text: 'A genuine, shrinking ownership share in the property', correct: true },
        { id: 'c', text: 'A fixed-rate promissory note', correct: false },
      ],
      feedback: {
        correct: 'Correct — the bank co-owns the property and its ownership share shrinks as the customer buys it out.',
        wrong: 'The bank holds real, diminishing equity in the property, not just a security interest.',
      },
    },
    {
      id: 'q3',
      question: 'Why is Tawarruq considered more controversial among scholars than standard Murabaha?',
      options: [
        { id: 'a', text: 'It involves no real assets at all', correct: false },
        { id: 'b', text: 'It most closely resembles a disguised cash loan and requires strict sequencing to remain valid', correct: true },
        { id: 'c', text: 'It is banned by AAOIFI entirely', correct: false },
      ],
      feedback: {
        correct: 'Correct — Tawarruq generates cash via commodity trades, which raises concerns about resembling interest-bearing lending if not properly sequenced.',
        wrong: 'Tawarruq is controversial precisely because of its resemblance to a cash loan, requiring strict AAOIFI sequencing rules.',
      },
    },
  ],
};
