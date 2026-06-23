'use client';

import { useState } from 'react';
import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function DiminishingMusharakahCalculator() {
  const [propertyValue, setPropertyValue] = useState(1000000);
  const [clientStartShare, setClientStartShare] = useState(20);
  const [years, setYears] = useState(5);

  const periods = Array.from({ length: years }, (_, i) => i + 1);
  const buyoutPerYear = (100 - clientStartShare) / years;

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
        Diminishing Musharakah home finance — equity reduction
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="text-sm text-zinc-400">
          Property value (AED)
          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Client's starting equity (%)
          <input
            type="number"
            value={clientStartShare}
            onChange={(e) => setClientStartShare(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Buyout term (years)
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 text-xs uppercase tracking-wider">
              <th className="py-1.5 pr-4">Year</th>
              <th className="py-1.5 pr-4">Bank's equity %</th>
              <th className="py-1.5 pr-4">Client's equity %</th>
              <th className="py-1.5">Client buys out (AED)</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((year) => {
              const clientShare = Math.min(100, clientStartShare + buyoutPerYear * year);
              const bankShare = 100 - clientShare;
              const buyoutThisYear = propertyValue * (buyoutPerYear / 100);
              return (
                <tr key={year} className="border-t border-zinc-800">
                  <td className="py-1.5 pr-4 text-zinc-300">{year}</td>
                  <td className="py-1.5 pr-4 text-zinc-300">{bankShare.toFixed(1)}%</td>
                  <td className="py-1.5 pr-4 text-zinc-300">{clientShare.toFixed(1)}%</td>
                  <td className="py-1.5 text-white">
                    AED {buyoutThisYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Alongside each equity buyout installment, the client also pays the bank rent on the bank's
        remaining share of the property (since the bank is a co-owner using the property is the
        client's, not the bank's). That rental income is separate from the equity buyout shown above.
      </p>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="مشاركة" transliteration="Musharakah" /> is a genuine equity
        partnership: two or more parties contribute capital to a venture and share in its profit —
        and crucially, its loss — rather than one party lending to the other.
      </p>

      <p>There are two distinct flavors used in modern Islamic finance:</p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">Permanent Musharakah.</strong> An ongoing partnership —
          the bank's equity stake stays constant for the life of the venture. Profit is shared by a
          pre-agreed ratio (which can differ from the capital ratio, to reflect one party's labor or
          expertise), but loss must always be shared strictly in proportion to capital contributed.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="مشاركة متناقصة" transliteration="Musharakah Mutanaqisah" /> —
            Diminishing Musharakah.
          </strong>{' '}
          Used overwhelmingly in Islamic home finance. The bank and the client jointly buy a
          property. The client then progressively buys out the bank's equity share over time —
          each installment both reduces the bank's ownership stake and pays rent on the portion the
          bank still owns — until the client owns 100% of the property.
        </li>
      </ol>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 12 (Musharakah)">
        Profit is distributed according to the agreement of the partners, but loss must be
        distributed strictly according to the ratio of capital contribution.
      </QuoteBlock>

      <ContextBox title="Why loss-sharing is non-negotiable">
        This asymmetry — flexible profit ratios but rigid loss ratios — is a direct application of
        the Maqasid principle that capital must bear real risk to earn a real return. If a partner
        could be guaranteed a fixed return regardless of the venture's performance, the arrangement
        would functionally re-create Riba inside a partnership wrapper. AAOIFI is strict on this
        point precisely to prevent Musharakah from being used as a loophole.
      </ContextBox>

      <p>
        In diminishing Musharakah home finance, this matters in a very concrete way: while the bank
        still holds a share of the property, it is genuinely exposed to the property's market risk.
        If the property's value falls and is sold, that loss is shared by the ownership ratio at the
        time of sale — the bank does not have a guaranteed buy-back floor, which is what
        distinguishes this from a conventional mortgage with the bank as a risk-free lienholder.
      </p>

      <DiminishingMusharakahCalculator />

      <ContextBox title="Western parallel" variant="western-parallel">
        Permanent Musharakah is structurally close to a conventional joint-venture equity
        partnership or private equity co-investment — profit splits are negotiable, but losses
        track ownership stakes. Diminishing Musharakah resembles a rent-to-own or shared-equity
        mortgage scheme in conventional finance, where a co-investor's ownership share shrinks as
        the homeowner buys it out in installments.
      </ContextBox>

      <p>
        Diminishing Musharakah is widely regarded by Shariah scholars as one of the cleanest, most
        Maqasid-aligned structures in the entire Islamic finance product suite — because the bank's
        return (rent on its retained share) is tied directly to a real, owned asset, and its
        exposure to loss is genuine for as long as it remains a part-owner.
      </p>
    </div>
  );
}

export const musharakah: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'مشاركة', transliteration: 'Musharakah', definition: 'An equity partnership where capital providers share profit by agreed ratio and loss by capital ratio.' },
    { arabic: 'مشاركة متناقصة', transliteration: 'Musharakah Mutanaqisah', definition: "Diminishing Musharakah — a partnership where one partner's equity share is progressively bought out over time, commonly used in home finance." },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'In Musharakah, how must losses be shared between partners?',
      options: [
        { id: 'a', text: 'Strictly in proportion to each partner\'s capital contribution', correct: true },
        { id: 'b', text: 'Equally, regardless of capital contributed', correct: false },
        { id: 'c', text: 'Entirely by whichever partner contributed labor, not capital', correct: false },
      ],
      feedback: {
        correct: 'Correct — unlike profit ratios, which are negotiable, loss-sharing must track capital contribution exactly.',
        wrong: 'AAOIFI requires losses to be shared strictly by capital ratio, even though profit ratios can be negotiated differently.',
      },
    },
    {
      id: 'q2',
      question: 'What happens to the bank\'s ownership share over time in a Diminishing Musharakah home finance arrangement?',
      options: [
        { id: 'a', text: 'It progressively decreases as the client buys it out in installments', correct: true },
        { id: 'b', text: 'It stays fixed for the life of the mortgage', correct: false },
        { id: 'c', text: 'It increases until the bank owns the whole property', correct: false },
      ],
      feedback: {
        correct: 'Correct — each installment reduces the bank\'s equity share until the client owns 100%.',
        wrong: 'The defining feature of "diminishing" Musharakah is that the bank\'s share shrinks over time as the client buys it out.',
      },
    },
    {
      id: 'q3',
      question: 'Why is flexible profit-sharing combined with rigid loss-sharing important in Musharakah?',
      options: [
        { id: 'a', text: 'It prevents the arrangement from re-creating a guaranteed, risk-free return that resembles Riba', correct: true },
        { id: 'b', text: 'It is required so the bank always profits more than the client', correct: false },
        { id: 'c', text: 'It has no real economic purpose beyond tradition', correct: false },
      ],
      feedback: {
        correct: 'Correct — rigid loss-sharing ensures capital genuinely bears risk, which is the Maqasid basis for permitting a return on capital at all.',
        wrong: 'The rule exists so that a partner cannot be guaranteed a fixed, risk-free return — that would effectively be Riba in a partnership wrapper.',
      },
    },
  ],
};
