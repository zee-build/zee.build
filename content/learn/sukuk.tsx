'use client';

import { useState } from 'react';
import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function SukukCalculator() {
  const [faceValue, setFaceValue] = useState(100000);
  const [profitRate, setProfitRate] = useState(5);
  const [years, setYears] = useState(5);

  const annualDistribution = faceValue * (profitRate / 100);
  const totalDistributions = annualDistribution * years;
  const totalReceived = faceValue + totalDistributions;
  const simpleYield = years > 0 ? (totalDistributions / faceValue / years) * 100 : 0;

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
        Sukuk distribution calculator
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="text-sm text-zinc-400">
          Face value (AED)
          <input
            type="number"
            value={faceValue}
            onChange={(e) => setFaceValue(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Periodic profit rate (% p.a.)
          <input
            type="number"
            value={profitRate}
            onChange={(e) => setProfitRate(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Tenor (years)
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Annual distribution</p>
          <p className="text-white font-medium">AED {annualDistribution.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Total distributions + face value at maturity</p>
          <p className="text-white font-medium">AED {totalReceived.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Simple annualized yield</p>
          <p style={{ color: 'var(--c-teal)' }} className="font-medium">
            {simpleYield.toFixed(2)}%
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Note: this is a simplified illustration. In a real Sukuk al-Ijarah, the "periodic profit
        rate" is really a rental rate tied to the lease of the underlying asset — it can be
        structured to track a benchmark, but it is legally a rental return, not a guaranteed coupon
        on a debt. If the underlying asset underperforms or is destroyed without insurance, Sukuk
        holders bear that risk, unlike conventional bondholders.
      </p>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="صكوك" transliteration="Sukuk" /> are routinely described as "Islamic
        bonds," but that label hides the structural difference that matters most: a conventional
        bond is a certificate of debt — the issuer owes the bondholder a fixed sum plus interest,
        full stop. A Sukuk certificate represents fractional, undivided ownership in a real
        underlying asset, business venture, or project. Sukuk holders are co-owners, not creditors
        collecting interest on a loan.
      </p>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 17 (Investment Sukuk)">
        Sukuk are certificates of equal value representing undivided shares in ownership of
        tangible assets, usufruct, services, or a particular project or investment activity.
      </QuoteBlock>

      <p>
        Because Riba prohibits a guaranteed, risk-free return on money, a Sukuk cannot simply pay
        "interest" on the certificate's face value. Instead, the return Sukuk holders earn must
        come from somewhere real: rental income on a leased asset, profit from a trade, or a share
        of a venture's actual profit. The most common structures:
      </p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">
            <ArabicPill arabic="صكوك الإجارة" transliteration="Sukuk al-Ijarah" />
          </strong>{' '}
          — the issuer (often via a special-purpose vehicle) sells a real asset to Sukuk holders,
          then leases it back. Sukuk holders earn periodic rental payments as the asset's
          beneficial owners, and recover the asset's value (or its sale proceeds) at maturity.
          This is the most widely used structure because rental income is straightforward to
          predict and distribute on a schedule.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="صكوك المرابحة" transliteration="Sukuk al-Murabaha" />
          </strong>{' '}
          — proceeds raised from Sukuk holders fund a cost-plus trade (as in Murabaha financing,
          covered in Part 2); holders earn a share of the disclosed trade profit. Because the
          underlying receivable is a debt created by a real sale, many scholars restrict trading
          these Sukuk on the secondary market at anything other than face value, since trading a
          pure debt obligation at a discount can reintroduce Riba al-Fadl-like concerns.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="صكوك المشاركة" transliteration="Sukuk al-Musharakah" />
          </strong>{' '}
          and{' '}
          <strong className="text-white">
            <ArabicPill arabic="صكوك المضاربة" transliteration="Sukuk al-Mudarabah" />
          </strong>{' '}
          — equity-like structures where Sukuk proceeds fund a partnership or a managed venture.
          Holders share in the actual profit (and loss) the underlying business or project
          generates, in agreed ratios. These carry the most genuine risk-sharing of the major
          structures, and the most variable return.
        </li>
      </ol>

      <ContextBox title="So is the yield 'fixed' or not?">
        In practice, many Ijarah Sukuk are structured so the lease rental is benchmarked to a
        reference rate and reset periodically, which makes the cash flow look a lot like a
        floating-rate bond coupon to an investor reading a term sheet. The legal and Shariah
        distinction AAOIFI insists on is that the payment must still represent real rental income
        on a real asset that Sukuk holders genuinely own and bear risk on — not a payment owed
        regardless of the asset's existence or performance. Where this distinction breaks down in
        practice (sponsors guaranteeing buy-back at par regardless of asset value) is exactly where
        Sukuk structures have drawn the sharpest scholarly criticism, including from Sheikh
        Muhammad Taqi Usmani.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        The closest conventional analogue is asset-backed securitization or a real estate
        income trust — an instrument backed by, and paying out from, a specific income-generating
        asset — rather than a corporate bond, which is simply a claim on the issuer's general
        creditworthiness. A Sukuk al-Ijarah investor's return depends on the leased asset actually
        existing and earning rent, much like an investor in a single-property lease-income vehicle.
      </ContextBox>

      <p>
        The largest and most familiar real-world use case is sovereign Sukuk: governments
        (Malaysia, Saudi Arabia, the UAE, Indonesia, and others have all been large issuers) raise
        Sukuk to fund infrastructure — toll roads, airports, power plants — by structuring the
        government's ownership interest in specific public assets as the underlying basis for the
        certificates, then distributing rental or profit payments to investors from the revenue
        those assets generate or from the government's general budget, depending on structure.
        Sovereign Sukuk now sit alongside conventional sovereign bonds in many emerging-market debt
        indices, traded by the same institutional investors who buy conventional government debt.
      </p>

      <SukukCalculator />
    </div>
  );
}

export const sukuk: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'صكوك', transliteration: 'Sukuk', definition: 'Certificates representing fractional ownership in a real asset, venture, or project — often called "Islamic bonds," though structurally an equity-like ownership claim rather than a debt instrument.' },
    { arabic: 'صكوك الإجارة', transliteration: 'Sukuk al-Ijarah', definition: 'A Sukuk structure based on a leased asset, where holders earn periodic rental income.' },
    { arabic: 'صكوك المشاركة', transliteration: 'Sukuk al-Musharakah', definition: 'An equity-like Sukuk structure where holders fund and share the profit (and loss) of a partnership or venture.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What does a Sukuk certificate fundamentally represent?',
      options: [
        { id: 'a', text: 'A debt obligation identical to a conventional bond', correct: false },
        { id: 'b', text: 'Fractional ownership in a real underlying asset, venture, or project', correct: true },
        { id: 'c', text: 'A government-guaranteed savings account', correct: false },
      ],
      feedback: {
        correct: 'Correct — Sukuk holders are co-owners of a real asset or venture, not creditors owed a fixed sum.',
        wrong: 'A Sukuk represents fractional ownership in a real asset, venture, or project — not a pure debt claim.',
      },
    },
    {
      id: 'q2',
      question: 'In a Sukuk al-Ijarah, where does the periodic payment to Sukuk holders come from?',
      options: [
        { id: 'a', text: 'Guaranteed interest set by the issuer regardless of any underlying asset', correct: false },
        { id: 'b', text: 'Rental income from the leased underlying asset', correct: true },
        { id: 'c', text: 'A government subsidy paid directly to bondholders', correct: false },
      ],
      feedback: {
        correct: 'Correct — Sukuk al-Ijarah holders earn rental income as beneficial owners of the leased asset.',
        wrong: 'Sukuk al-Ijarah pays holders rental income generated by the underlying leased asset.',
      },
    },
    {
      id: 'q3',
      question: 'Why have some Ijarah Sukuk structures drawn scholarly criticism, including from Usmani?',
      options: [
        { id: 'a', text: 'Because they pay no return at all to investors', correct: false },
        { id: 'b', text: 'Because sponsors sometimes guarantee a par buy-back regardless of the asset’s actual value, undermining genuine risk-sharing', correct: true },
        { id: 'c', text: 'Because they are only issued by private companies, never governments', correct: false },
      ],
      feedback: {
        correct: 'Correct — guaranteeing the buy-back price regardless of asset performance reintroduces a debt-like, risk-free return.',
        wrong: 'The criticism centers on sponsor guarantees of par-value buy-backs, which can make the structure economically resemble a guaranteed-return loan rather than genuine asset ownership.',
      },
    },
  ],
};
