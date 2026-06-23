'use client';

import { useState } from 'react';
import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

type MethodologyKey = 'djim' | 'msci' | 'ftse';

const methodologyData: Record<MethodologyKey, {
  label: string;
  denominator: string;
  debtRatio: string;
  result: string;
  resultColor: string;
}> = {
  djim: {
    label: 'DJIM (Dow Jones Islamic Market)',
    denominator: 'Total assets (trailing 24-month average market cap for some ratios)',
    debtRatio: '~28%',
    result: 'Compliant',
    resultColor: 'var(--c-teal-dk)',
  },
  msci: {
    label: 'MSCI Islamic',
    denominator: 'Market capitalization',
    debtRatio: '~41%',
    result: 'Non-compliant',
    resultColor: '#501313',
  },
  ftse: {
    label: 'FTSE Shariah',
    denominator: 'Total assets',
    debtRatio: '~28%',
    result: 'Compliant',
    resultColor: 'var(--c-teal-dk)',
  },
};

function MethodologyToggle() {
  const [active, setActive] = useState<MethodologyKey>('djim');
  const data = methodologyData[active];

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
        Sample company screening result by methodology
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(methodologyData) as MethodologyKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
              active === key
                ? 'border-[#1D9E75] bg-[#1D9E75]/10 text-white'
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            {methodologyData[key].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Ratio denominator</p>
          <p className="text-white font-medium">{data.denominator}</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Sample company debt ratio</p>
          <p className="text-white font-medium">{data.debtRatio}</p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Screening result</p>
          <p className="font-medium" style={{ color: data.resultColor }}>{data.result}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Illustrative example only: the same hypothetical company can pass under an assets-based
        methodology (DJIM, FTSE Shariah) and fail under a market-cap-based methodology (MSCI
        Islamic) purely because of how leverage is measured — not because the business itself
        changed.
      </p>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Several major providers publish Islamic equity indices, and a growing set of US-listed
        ETFs track them. They agree on the broad architecture covered in the equity screening
        module — sector exclusion, then financial ratio thresholds — but differ enough in the
        details that the same stock is sometimes included in one index and excluded from another
        at the very same time.
      </p>

      <p className="font-medium text-white">The major index methodologies</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-white">DJIM (Dow Jones Islamic Market)</strong> — one of the
          oldest Islamic index families (launched 1999), advised by a dedicated Shariah
          supervisory board. Uses total assets as the denominator for its debt and
          cash/receivables ratio screens.
        </li>
        <li>
          <strong className="text-white">MSCI Islamic</strong> — built on MSCI's standard global
          equity universe, re-screened for Shariah compliance. Notably uses{' '}
          <strong className="text-white">market capitalization</strong> rather than total assets
          as the denominator for several of its financial ratio screens — a methodological choice
          that makes its compliance results more sensitive to share price movements than
          assets-based methodologies.
        </li>
        <li>
          <strong className="text-white">FTSE Shariah</strong> — developed with Yasaar Limited as
          Shariah advisor, applied across FTSE's global index families (FTSE Shariah Global
          Equity Index Series). Uses an assets-based ratio approach broadly similar to DJIM.
        </li>
      </ul>

      <ContextBox title="The denominator difference, concretely">
        Total-assets-based screens (DJIM, FTSE Shariah) are relatively stable day to day — total
        assets on a balance sheet don't move with the stock market. Market-cap-based screens
        (MSCI Islamic) can flip a company's compliance status purely because its share price rose
        or fell, even though nothing about its actual debt or cash position changed. This is the
        single most consequential methodological divergence across the major Islamic index
        families, and it's the reason index providers occasionally publish different
        compliant/non-compliant lists for the same underlying stock universe.
      </ContextBox>

      <p className="font-medium text-white">US-listed Islamic ETFs</p>
      <p>
        Retail and institutional investors in the US can access Shariah-screened equity exposure
        through several listed ETFs, each tracking (or loosely following) one of these
        methodologies:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong className="text-white">SPUS</strong> (SP Funds S&amp;P 500 Sharia Industry
          Exclusions ETF) — tracks a Shariah-screened version of the S&amp;P 500, applying sector
          exclusions and financial ratio screens to the S&amp;P 500 universe rather than building
          an index from scratch.
        </li>
        <li>
          <strong className="text-white">HLAL</strong> (Wahed FTSE USA Shariah ETF) — tracks the
          FTSE USA Shariah Index, applying FTSE's assets-based screening methodology to the US
          large- and mid-cap universe.
        </li>
        <li>
          <strong className="text-white">UMMA</strong> (Wahed Dow Jones Islamic World ETF) —
          tracks a Dow Jones Islamic Market index, giving investors broader global (rather than
          US-only) Shariah-compliant equity exposure under the DJIM methodology.
        </li>
      </ul>

      <QuoteBlock citation="FTSE Russell, Ground Rules: FTSE Shariah Global Equity Index Series">
        A company's eligibility for inclusion is determined by an independent Shariah
        consultancy, applying both qualitative business screening and quantitative financial
        ratio screening on a periodic basis.
      </QuoteBlock>

      <MethodologyToggle />

      <ContextBox title="Western parallel" variant="western-parallel">
        This is directly analogous to how different conventional ESG index providers (MSCI ESG,
        FTSE4Good, S&amp;P ESG) can rate the same company differently — same broad goal,
        different proprietary scoring methodology, occasionally divergent conclusions about the
        same underlying company. Investors choosing between SPUS, HLAL, and UMMA are implicitly
        choosing which provider's screening philosophy they trust more, in addition to choosing a
        geography (US-only vs. global) and an underlying benchmark (S&amp;P 500 vs. broader
        large/mid-cap vs. global).
      </ContextBox>
    </div>
  );
}

export const indexMethodologyAndEtfs: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'صكوك', transliteration: 'Shariah index', definition: 'A published equity index that applies sector exclusion and financial ratio screening to an underlying conventional equity universe.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What is the key methodological difference between MSCI Islamic and DJIM/FTSE Shariah?',
      options: [
        { id: 'a', text: 'MSCI Islamic uses market capitalization as the ratio denominator, while DJIM and FTSE Shariah use total assets', correct: true },
        { id: 'b', text: 'MSCI Islamic does not apply any sector exclusions', correct: false },
        { id: 'c', text: 'DJIM only screens companies outside the United States', correct: false },
      ],
      feedback: {
        correct: 'Correct — this denominator choice is the most consequential methodological divergence among the major Islamic index families.',
        wrong: 'The key difference is the ratio denominator: MSCI Islamic uses market capitalization, while DJIM and FTSE Shariah use total assets — both still apply sector exclusion screens.',
      },
    },
    {
      id: 'q2',
      question: 'Why can a market-cap-based screening methodology flip a company’s compliance status without any change to its balance sheet?',
      options: [
        { id: 'a', text: 'Because the ratio moves whenever the share price moves, even if debt and assets stay constant', correct: true },
        { id: 'b', text: 'Because market-cap-based methodologies are re-screened only once per decade', correct: false },
        { id: 'c', text: 'Because market capitalization is fixed by regulators and never changes', correct: false },
      ],
      feedback: {
        correct: 'Correct — a falling share price raises a debt/market-cap ratio even if actual debt is unchanged, which can push a company over a compliance threshold.',
        wrong: 'Market capitalization fluctuates with share price; since it sits in the denominator of the ratio, the ratio (and thus compliance status) can change without any change to the company’s actual debt or assets.',
      },
    },
    {
      id: 'q3',
      question: 'Which US-listed ETF tracks a Shariah-screened version of the S&P 500 specifically?',
      options: [
        { id: 'a', text: 'SPUS', correct: true },
        { id: 'b', text: 'HLAL', correct: false },
        { id: 'c', text: 'UMMA', correct: false },
      ],
      feedback: {
        correct: 'Correct — SPUS applies Shariah screening to the S&P 500 universe specifically.',
        wrong: 'SPUS tracks a Shariah-screened S&P 500; HLAL tracks the FTSE USA Shariah Index; UMMA tracks a Dow Jones Islamic World index with global exposure.',
      },
    },
  ],
};
