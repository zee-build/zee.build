'use client';

import { useState } from 'react';
import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function IjarahCalculator() {
  const [monthlyRental, setMonthlyRental] = useState(8000);
  const [termMonths, setTermMonths] = useState(36);
  const [conventionalRate, setConventionalRate] = useState(7);
  const [principal, setPrincipal] = useState(250000);

  const totalRental = monthlyRental * termMonths;

  const monthlyRate = conventionalRate / 100 / 12;
  const conventionalMonthly =
    monthlyRate > 0
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
      : principal / termMonths;
  const totalConventional = conventionalMonthly * termMonths;

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
        Ijarah rental vs. indicative conventional loan
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm text-zinc-400">
          Monthly rental (AED)
          <input
            type="number"
            value={monthlyRental}
            onChange={(e) => setMonthlyRental(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Lease term (months)
          <input
            type="number"
            value={termMonths}
            onChange={(e) => setTermMonths(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Equivalent asset value (AED)
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Indicative conventional loan rate (%/yr)
          <input
            type="number"
            value={conventionalRate}
            onChange={(e) => setConventionalRate(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Total Ijarah rental over term</p>
          <p style={{ color: 'var(--c-teal)' }} className="font-medium">
            AED {totalRental.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Indicative conventional loan total</p>
          <p className="text-white font-medium">
            AED {totalConventional.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        This comparison is illustrative only — the two structures are not legally equivalent.
        Rental is compensation for the use of an asset the lessor still owns and bears risk for;
        loan interest is compensation for the use of money. They can land at similar headline
        figures while resting on entirely different legal and risk foundations.
      </p>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="إجارة" transliteration="Ijarah" /> is Islamic leasing — and like
        Murabaha, its permissibility rests on a clear separation from interest: rent is paid for the
        usufruct (the right to use) of an asset that someone else continues to own.
      </p>

      <p>Two structures fall under the Ijarah umbrella:</p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">Operating Ijarah.</strong> A straightforward lease — the
          lessor (often the bank) owns the asset throughout, leases it for rental payments, and
          retains the asset (or re-leases or sells it) at the end of the term. Ownership never
          transfers.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="إجارة منتهية بالتمليك" transliteration="Ijarah Muntahia Bittamleek" />
          </strong>{' '}
          — Ijarah ending in ownership transfer. The lease functions much like a finance lease: at
          the end of the term, ownership of the asset transfers to the lessee, either as a gift, for
          a nominal price, or through a separate, optional sale contract agreed upon at the outset
          (but kept legally distinct from the lease itself).
        </li>
      </ol>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 9 (Ijarah and Ijarah Muntahia Bittamleek)">
        The lessor must continue to bear the liabilities arising from ownership of the leased asset
        — such as major maintenance and the risk of total destruction — for the duration of the
        lease.
      </QuoteBlock>

      <p>
        That liability allocation is the crux of the structure. Because rental is compensation for
        usufruct of an asset the lessor still owns, the lessor must continue behaving like an owner:
        carrying insurance, handling major structural maintenance, and absorbing the loss if the
        asset is destroyed through no fault of the lessee. A lease where the lessor has offloaded
        all ownership risk onto the lessee while still calling the payments "rent" would, in
        substance, be a loan.
      </p>

      <ContextBox title="Real-world example: aircraft leasing">
        Aircraft leasing is one of the largest real-world applications of Ijarah in Islamic finance,
        because aircraft are extremely high-value, long-lived assets well suited to lease financing.
        An Islamic Ijarah aircraft lease requires the lessor (often a special-purpose leasing entity
        backed by Islamic financial institutions) to retain ownership risk — for instance, bearing
        the cost if the aircraft suffers damage not caused by the airline's negligence — which is
        precisely the kind of real economic risk-bearing that distinguishes the structure from a
        secured loan against the aircraft.
      </ContextBox>

      <IjarahCalculator />

      <ContextBox title="Western parallel" variant="western-parallel">
        Operating Ijarah is close to a conventional operating lease (rent equipment, return it,
        never own it). Ijarah Muntahia Bittamleek is structurally closer to a conventional finance
        lease or hire-purchase agreement, where the lessee effectively becomes the owner at the end
        of the term — the key Shariah-compliance distinction is that the ownership transfer must be
        a separate, optional step, not baked into a single contract that disguises a sale-on-credit
        as a lease.
      </ContextBox>

      <p>
        Because rental income is tied to a real, owned, risk-bearing asset rather than to the time
        value of money, Ijarah is considered one of the more straightforwardly compliant structures
        — which is part of why it scales well into asset-heavy sectors like aviation, shipping, and
        equipment finance.
      </p>
    </div>
  );
}

export const ijarah: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'إجارة', transliteration: 'Ijarah', definition: 'Islamic leasing — rental paid for the use of an asset the lessor continues to own.' },
    { arabic: 'إجارة منتهية بالتمليك', transliteration: 'Ijarah Muntahia Bittamleek', definition: 'A finance lease structure in which ownership of the leased asset transfers to the lessee at the end of the term.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What must the lessor continue to do throughout an Ijarah lease term?',
      options: [
        { id: 'a', text: 'Bear ownership liabilities such as major maintenance and risk of asset destruction', correct: true },
        { id: 'b', text: 'Transfer all maintenance costs to the lessee from day one', correct: false },
        { id: 'c', text: 'Charge a variable rental tied to a benchmark interest rate', correct: false },
      ],
      feedback: {
        correct: 'Correct — the lessor must keep behaving like a real owner, including bearing major maintenance and destruction risk.',
        wrong: 'AAOIFI requires the lessor to retain ownership-type liabilities (major maintenance, destruction risk) throughout the lease — that is what justifies calling the payment "rent."',
      },
    },
    {
      id: 'q2',
      question: 'How does Ijarah Muntahia Bittamleek differ from a standard operating Ijarah?',
      options: [
        { id: 'a', text: 'It ends with ownership of the asset transferring to the lessee', correct: true },
        { id: 'b', text: 'It does not require the lessor to ever own the asset', correct: false },
        { id: 'c', text: 'It charges no rental payments at all', correct: false },
      ],
      feedback: {
        correct: 'Correct — it is a lease that concludes in an ownership transfer, functioning like a finance lease.',
        wrong: 'Ijarah Muntahia Bittamleek is distinguished by ending in a transfer of ownership to the lessee, unlike operating Ijarah where ownership never transfers.',
      },
    },
    {
      id: 'q3',
      question: 'Why is aircraft leasing often cited as a strong real-world fit for Ijarah?',
      options: [
        { id: 'a', text: 'Aircraft are high-value, long-lived assets well suited to lease structures where the lessor retains real ownership risk', correct: true },
        { id: 'b', text: 'Aircraft cannot be owned by any single legal entity', correct: false },
        { id: 'c', text: 'Airlines are exempt from Shariah ownership-risk requirements', correct: false },
      ],
      feedback: {
        correct: 'Correct — the asset class fits naturally with a lessor genuinely retaining ownership and risk over a long lease term.',
        wrong: 'Aircraft leasing fits Ijarah well because it is a high-value asset class where genuine, long-term lessor ownership and risk-bearing is practical and economically sensible.',
      },
    },
  ],
};
