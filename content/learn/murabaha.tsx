'use client';

import { useState } from 'react';
import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function MurabahaCalculator() {
  const [cost, setCost] = useState(100000);
  const [margin, setMargin] = useState(8);
  const [months, setMonths] = useState(12);

  const totalProfit = cost * (margin / 100);
  const totalPayable = cost + totalProfit;
  const monthly = months > 0 ? totalPayable / months : 0;

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
        Murabaha installment calculator
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="text-sm text-zinc-400">
          Cost price (AED)
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Profit margin (%)
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Term (months)
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Disclosed profit</p>
          <p className="text-white font-medium">AED {totalProfit.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Total payable</p>
          <p className="text-white font-medium">AED {totalPayable.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Monthly installment</p>
          <p style={{ color: 'var(--c-teal)' }} className="font-medium">
            AED {monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Note: the profit margin and total payable are fixed at contract signing — unlike a
        conventional loan, the bank cannot later increase this amount for late payment (it may
        only charge a separate, capped late-payment charity amount under AAOIFI rules).
      </p>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="مرابحة" transliteration="Murabaha" /> is the most widely used Islamic
        financing structure in retail and trade finance — and the one most often mistaken for "a
        loan with a different name." Structurally, it is not a loan at all. It is a cost-plus sale.
      </p>

      <p>
        The mechanics: a client wants to acquire an asset — a car, equipment, a shipment of raw
        materials. Instead of lending the client cash to buy it (which would be Riba), the bank
        itself buys the asset from the supplier, takes ownership of it, and then resells it to the
        client at a disclosed, marked-up price, payable in installments over an agreed term.
      </p>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 8 (Murabaha)">
        The seller must own and possess the commodity, or have constructive possession of it,
        before it can be sold to the customer.
      </QuoteBlock>

      <p>
        That single requirement — real ownership before resale — is what separates Murabaha from a
        disguised interest-bearing loan. AAOIFI's conditions for a valid Murabaha are demanding:
      </p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">Genuine acquisition and risk transfer.</strong> The bank
          must actually take ownership of the asset — and bear the risk of loss or damage — before
          selling it on. If the asset is destroyed while still owned by the bank, the bank absorbs
          the loss, not the client.
        </li>
        <li>
          <strong className="text-white">Disclosed, fixed profit margin.</strong> The cost price and
          the profit margin must both be stated to the client at the time of contract, and the
          total selling price is fixed for the life of the contract — it cannot float with a
          benchmark rate the way conventional variable-rate loans do.
        </li>
        <li>
          <strong className="text-white">No resemblance to a loan.</strong> The sequence matters:
          purchase, then resale. A bank that skips taking title — simply paying the supplier
          directly on the client's behalf and charging the client a "markup" for the privilege —
          has structured a loan with interest dressed up in sale language, which AAOIFI explicitly
          rejects.
        </li>
      </ol>

      <ContextBox title="Worked example">
        Noor Digital Bank buys inventory for a retail client at a cost of AED 100,000. It discloses
        an 8% profit margin and resells the inventory to the client for AED 108,000, repayable over
        12 months. The client pays AED 9,000/month. If the client pays late, Noor Digital Bank
        cannot increase the AED 108,000 — Shariah boards permit only a small, AAOIFI-capped
        late-payment amount that must be donated to charity, not retained as bank income, precisely
        so the bank has no financial incentive to want the client to be late.
      </ContextBox>

      <MurabahaCalculator />

      <ContextBox title="Western parallel" variant="western-parallel">
        Murabaha resembles a conventional installment sale or a "rent-to-own" retail finance
        arrangement more than it resembles a bank loan — the closest analogy is a car dealership
        that buys a vehicle from the manufacturer and sells it to you on a payment plan, rather than
        a bank wiring you cash to buy the car yourself. The legal substance of "who owns the asset,
        and when" is exactly what regulators and Shariah boards scrutinize.
      </ContextBox>

      <p>
        Because of how mechanically simple it is to administer compared to true profit-and-loss
        sharing structures like Mudarabah or Musharakah, Murabaha dominates Islamic retail and trade
        finance balance sheets globally — which is also why critics argue it has drifted toward
        looking economically similar to debt finance, even while remaining structurally a sale. We
        return to this tension when discussing Maqasid-based critiques of modern Islamic banking
        later in the course.
      </p>
    </div>
  );
}

export const murabaha: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'مرابحة', transliteration: 'Murabaha', definition: 'A cost-plus sale: the bank buys an asset and resells it to the client at a disclosed profit margin, payable in installments.' },
    { arabic: 'ربا', transliteration: 'Riba', definition: 'Interest or usury — the guaranteed return Murabaha avoids by structuring the transaction as a real sale.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What must happen before a bank can resell an asset to a client under Murabaha?',
      options: [
        { id: 'a', text: 'The bank must take genuine ownership of the asset and bear its risk', correct: true },
        { id: 'b', text: 'The client must pay a deposit equal to the profit margin', correct: false },
        { id: 'c', text: 'The supplier must agree to a floating interest rate', correct: false },
      ],
      feedback: {
        correct: 'Correct — real ownership and risk transfer to the bank is what makes Murabaha a sale rather than a disguised loan.',
        wrong: 'AAOIFI requires the bank to actually own and bear risk for the asset before reselling it — that ownership step is what makes it a sale, not a loan.',
      },
    },
    {
      id: 'q2',
      question: 'In the worked example (cost AED 100,000, 8% margin, 12 months), what is the fixed monthly installment?',
      options: [
        { id: 'a', text: 'AED 9,000', correct: true },
        { id: 'b', text: 'AED 8,667', correct: false },
        { id: 'c', text: 'AED 10,000', correct: false },
      ],
      feedback: {
        correct: 'Correct — AED 108,000 total payable divided over 12 months is AED 9,000/month.',
        wrong: 'Total payable is AED 108,000 (cost + 8% profit); divided over 12 months that is AED 9,000/month.',
      },
    },
    {
      id: 'q3',
      question: 'Why can a bank not increase the total Murabaha price if a client pays late?',
      options: [
        { id: 'a', text: 'Because the profit margin and total price are fixed at contract signing, unlike a variable-rate loan', correct: true },
        { id: 'b', text: 'Because late payment is not permitted under any circumstances', correct: false },
        { id: 'c', text: 'Because the client legally owns the asset before the bank does', correct: false },
      ],
      feedback: {
        correct: 'Correct — the disclosed, fixed price is a core AAOIFI condition; any late-payment charge is capped and must go to charity, not bank profit.',
        wrong: 'The total selling price is fixed at contract time; any permitted late charge is small, capped, and donated to charity rather than kept as bank income.',
      },
    },
  ],
};
