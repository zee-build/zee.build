import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        An Islamic bank cannot simply take deposits and lend them out at interest — every contract
        on both sides of its balance sheet has to avoid <ArabicPill arabic="ربا" transliteration="Riba" />.
        The structure that emerged to solve this is what practitioners call the{' '}
        <strong className="text-white">two-tier Mudarabah model</strong>: the bank is a{' '}
        <ArabicPill arabic="مضارب" transliteration="Mudarib" /> (working partner) to its depositors,
        and then often a <ArabicPill arabic="رب المال" transliteration="Rab al-Mal" /> (capital
        provider) — or trader, or lessor — to the customers it finances.
      </p>

      <p>
        <strong className="text-white">Tier 1 — the liability side.</strong> Depositors place funds
        with the bank under a Mudarabah contract. They are the Rab al-Mal; the bank is the Mudarib
        that puts their capital to work. Depositors are entitled to a share of whatever profit the
        bank's financing activities generate — not a fixed interest rate — and in principle bear the
        risk of loss of their capital if the bank's investments lose money (Part 3 module 2 covers
        the nuances of how this plays out for current vs. savings accounts).
      </p>

      <p>
        <strong className="text-white">Tier 2 — the asset side.</strong> The bank takes the pooled
        depositor funds and deploys them into Shariah-compliant financing: Murabaha (cost-plus sale)
        for a car or a trade transaction, Ijarah (lease) for equipment or property, Musharakah
        (partnership) for a business venture, or — less commonly today — Mudarabah again, this time
        with the bank as Rab al-Mal and the customer as Mudarib. The profit the bank earns here is
        what eventually gets shared back with depositors in Tier 1.
      </p>

      <ContextBox title="A simplified balance sheet">
        Assets: Murabaha receivables (the deferred sale price owed by car/trade-finance customers),
        Ijarah assets (property and equipment leased to customers), Musharakah/Mudarabah investments
        (equity-like stakes in financed ventures). Liabilities: Wadiah current accounts (no return,
        capital-protected by the bank's discretion), Mudarabah savings and investment accounts
        (profit-sharing, risk-bearing). Equity: shareholders' capital, which absorbs losses before
        Mudarabah depositors do in most jurisdictions' practice.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        A conventional bank also borrows short (deposits) and lends long (loans, mortgages), earning
        a spread — the net interest margin. The two-tier Mudarabah model performs the same economic
        function of intermediating between savers and borrowers, but every leg of the chain has to be
        a genuine profit-and-loss-sharing or asset-backed contract rather than a guaranteed-rate loan.
        The bank's income is a profit share or a trade markup, not "interest," even though the net
        effect on a depositor's statement can look superficially similar.
      </ContextBox>

      <p>
        <strong className="text-white">A brief history.</strong> The first modern experiment in
        interest-free banking is usually traced to{' '}
        <strong className="text-white">Mit Ghamr Savings Bank</strong>, founded in a small Egyptian
        town in 1963 by economist Ahmad El Najjar. It operated more like a savings-investment
        cooperative than a full bank, profit-sharing with depositors and financing local traders and
        farmers without charging interest. It was shut down in 1967 for political reasons, but it
        proved the model could work at the grassroots level.
      </p>

      <p>
        The first full-scale, full-service commercial Islamic bank was{' '}
        <strong className="text-white">Dubai Islamic Bank</strong>, established in 1975 in the UAE.
        Unlike Mit Ghamr, DIB was a licensed commercial bank offering the full range of retail and
        corporate banking services on an explicitly Shariah-compliant basis. Its success — and the
        oil-wealth-driven demand for Shariah-compliant capital deployment across the Gulf — triggered
        a wave of Islamic bank licenses through the late 1970s and 1980s across the GCC, Malaysia, and
        beyond.
      </p>

      <QuoteBlock citation="Usmani, An Introduction to Islamic Finance">
        The establishment of Islamic banks was not a theoretical exercise. It was a response to a
        genuine demand: Muslims who wanted to save and borrow without compromising a core religious
        conviction.
      </QuoteBlock>

      <p>
        Today the industry has grown from a handful of experimental institutions to a sector with
        trillions of dollars in Shariah-compliant assets globally, spanning standalone Islamic banks,
        Islamic windows of conventional banks, and an increasing number of digital-native players —
        a trend we return to in the case studies module at the end of this part.
      </p>
    </div>
  );
}

export const islamicBankStructure: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'مضارب', transliteration: 'Mudarib', definition: 'The working partner in a Mudarabah contract who manages the capital and the business.' },
    { arabic: 'رب المال', transliteration: 'Rab al-Mal', definition: 'The capital provider in a Mudarabah contract, who supplies funds but does not manage the business.' },
    { arabic: 'مضاربة', transliteration: 'Mudarabah', definition: 'A profit-sharing partnership between a capital provider and a working partner.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: "In the two-tier Mudarabah model, what role does the bank play with its depositors?",
      options: [
        { id: 'a', text: 'Rab al-Mal (capital provider)', correct: false },
        { id: 'b', text: 'Mudarib (working partner)', correct: true },
        { id: 'c', text: 'Guarantor of a fixed interest rate', correct: false },
      ],
      feedback: {
        correct: 'Correct — the bank is the Mudarib that puts depositors\' capital to work.',
        wrong: 'On the liability side, the bank acts as Mudarib; depositors are the Rab al-Mal.',
      },
    },
    {
      id: 'q2',
      question: 'Which institution is considered the first full-scale commercial Islamic bank?',
      options: [
        { id: 'a', text: 'Mit Ghamr Savings Bank', correct: false },
        { id: 'b', text: 'Dubai Islamic Bank', correct: true },
        { id: 'c', text: 'Maybank Islamic', correct: false },
      ],
      feedback: {
        correct: 'Correct — Dubai Islamic Bank, founded in 1975, was the first full-service commercial Islamic bank.',
        wrong: 'Mit Ghamr (1963) was the first experiment, but Dubai Islamic Bank (1975) was the first full-scale commercial Islamic bank.',
      },
    },
    {
      id: 'q3',
      question: "On the asset side of the two-tier model, what is the bank's income typically structured as?",
      options: [
        { id: 'a', text: 'A fixed interest rate on loans', correct: false },
        { id: 'b', text: 'A profit share or trade markup from financing contracts', correct: true },
        { id: 'c', text: 'A government subsidy', correct: false },
      ],
      feedback: {
        correct: 'Correct — the bank earns profit shares (Musharakah/Mudarabah) or markups (Murabaha/Ijarah), not interest.',
        wrong: 'The bank earns through profit-sharing or trade markups, never a guaranteed interest rate.',
      },
    },
  ],
};
