'use client';

import { useState } from 'react';
import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function ScreeningCalculator() {
  const [totalDebt, setTotalDebt] = useState(25000);
  const [cashAndSecurities, setCashAndSecurities] = useState(20000);
  const [receivables, setReceivables] = useState(30000);
  const [totalAssets, setTotalAssets] = useState(100000);

  const debtRatio = totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0;
  const cashRatio = totalAssets > 0 ? (cashAndSecurities / totalAssets) * 100 : 0;
  const receivablesRatio = totalAssets > 0 ? (receivables / totalAssets) * 100 : 0;

  const threshold = 33;
  const debtPass = debtRatio < threshold;
  const cashPass = cashRatio < threshold;
  const receivablesPass = receivablesRatio < threshold;
  const overallPass = debtPass && cashPass && receivablesPass;

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-4">
        Financial ratio screen calculator
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="text-sm text-zinc-400">
          Total debt
          <input
            type="number"
            value={totalDebt}
            onChange={(e) => setTotalDebt(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Cash + interest-bearing securities
          <input
            type="number"
            value={cashAndSecurities}
            onChange={(e) => setCashAndSecurities(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Accounts receivable
          <input
            type="number"
            value={receivables}
            onChange={(e) => setReceivables(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
        <label className="text-sm text-zinc-400">
          Total assets
          <input
            type="number"
            value={totalAssets}
            onChange={(e) => setTotalAssets(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
        </label>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Debt / assets</p>
          <p className={debtPass ? 'font-medium' : 'font-medium text-red-400'} style={debtPass ? { color: 'var(--c-teal)' } : undefined}>
            {debtRatio.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Cash+securities / assets</p>
          <p className={cashPass ? 'font-medium' : 'font-medium text-red-400'} style={cashPass ? { color: 'var(--c-teal)' } : undefined}>
            {cashRatio.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg bg-zinc-950 px-3 py-2.5">
          <p className="text-zinc-500">Receivables / assets</p>
          <p className={receivablesPass ? 'font-medium' : 'font-medium text-red-400'} style={receivablesPass ? { color: 'var(--c-teal)' } : undefined}>
            {receivablesRatio.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg px-3 py-2.5 text-sm" style={{ backgroundColor: overallPass ? 'var(--c-teal-lt)' : '#FCEBEB', color: overallPass ? 'var(--c-teal-dk)' : '#501313' }}>
        {overallPass
          ? 'Pass — all ratios are below the ~33% threshold commonly used by Islamic index providers.'
          : 'Fail — at least one ratio exceeds the ~33% threshold; this stock would be excluded under most Islamic index methodologies.'}
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Note: ~33% is a commonly cited approximation across AAOIFI-influenced methodologies. Exact
        thresholds and denominators (total assets vs. market capitalization) vary by index provider
        — see the Index Methodology &amp; ETFs module for the differences that matter most.
      </p>
    </div>
  );
}

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        The earlier module on halal and haram sectors introduced the two-stage screen — a
        qualitative sector exclusion list, followed by quantitative financial ratio thresholds.
        That two-stage logic is the conceptual foundation, but real Islamic index providers — DJIM,
        MSCI Islamic, FTSE Shariah, S&amp;P Shariah — operationalize it through a more structured,
        three-layer pipeline that index committees apply mechanically across thousands of stocks.
      </p>

      <p className="font-medium text-white">Layer 1: sector classification</p>
      <p>
        Before a sector can be excluded, it has to be defined consistently. Most providers start
        from an existing industry classification system — commonly{' '}
        <strong className="text-white">GICS (Global Industry Classification Standard)</strong>,
        the same taxonomy conventional index providers like S&amp;P and MSCI use to classify every
        listed company into a sector, industry group, industry, and sub-industry. Using an
        established classification system means the Shariah screen doesn't need to invent its own
        sector taxonomy from scratch — it just needs to decide which GICS sub-industries to
        exclude.
      </p>

      <p className="font-medium text-white">Layer 2: sector exclusion list</p>
      <p>
        Against that GICS map, the index provider applies its exclusion list — conventional
        banking and insurance, alcohol, gambling, pork, adult entertainment, tobacco, and
        non-defensive weapons, with some variation in exactly where lines are drawn (e.g. whether a
        hotel chain with a small in-house bar is excluded, or only hotel groups deriving a material
        revenue share from alcohol sales). This is a binary pass/fail screen applied at the
        sub-industry or business-activity level.
      </p>

      <p className="font-medium text-white">Layer 3: financial ratio screen</p>
      <p>
        Companies that clear the sector screen still face the ratio thresholds: debt, cash and
        interest-bearing securities, and receivables, each measured against a denominator —
        commonly total assets, though some providers (notably MSCI) use market capitalization
        instead, which can produce different pass/fail results for the same company depending on
        whether its share price is trading above or below book value.
      </p>

      <ContextBox title="Why the denominator choice matters">
        A company with AED 30M in debt and AED 100M in total assets has a 30% debt/assets ratio —
        comfortably under the ~33% threshold. But if that same company's market capitalization has
        fallen to AED 60M (e.g. after a share price decline), a debt/market-cap ratio jumps to 50%,
        which fails. This is exactly why a stock can be Shariah-compliant under an assets-based
        methodology (like DJIM) and non-compliant under a market-cap-based methodology (like MSCI
        Islamic) at the very same point in time, with nothing about the underlying business having
        changed — only its share price.
      </ContextBox>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 21 (Financial Paper)">
        Trading in the shares of a company is permissible if the company's main business is
        permissible and the proportion of non-compliant elements in its operations does not exceed
        the limits set by Shariah supervisory boards.
      </QuoteBlock>

      <ContextBox title="Western parallel" variant="western-parallel">
        This is structurally identical to how conventional ESG index providers operate: start from
        a standard industry taxonomy (GICS), apply a sector exclusion list (e.g. excluding coal
        mining or controversial weapons), then apply quantitative thresholds (e.g. revenue
        percentage from a controversial activity). The committee-driven, rules-based, periodically
        rebalanced structure is the same; only the specific exclusion list and ratio caps differ.
      </ContextBox>

      <ScreeningCalculator />
    </div>
  );
}

export const islamicEquityScreening: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'تطهير', transliteration: 'Tatheer', definition: 'Purification — donating the proportion of investment income derived from impure sources, applied after a stock passes both screening layers.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What classification system do most Islamic index providers use as the base for sector screening?',
      options: [
        { id: 'a', text: 'GICS (Global Industry Classification Standard)', correct: true },
        { id: 'b', text: 'A proprietary taxonomy unique to each Shariah board with no relation to conventional classification', correct: false },
        { id: 'c', text: 'National tax codes', correct: false },
      ],
      feedback: {
        correct: 'Correct — providers build their exclusion list on top of an existing taxonomy like GICS rather than inventing a new one.',
        wrong: 'Most Islamic index providers classify companies using GICS, the same system used by conventional index providers, then apply their exclusion list on top of it.',
      },
    },
    {
      id: 'q2',
      question: 'Why can the same stock be compliant under DJIM but non-compliant under MSCI Islamic at the same moment?',
      options: [
        { id: 'a', text: 'Because they use different denominators for the financial ratio screen — total assets vs. market capitalization', correct: true },
        { id: 'b', text: 'Because DJIM does not apply a sector exclusion list', correct: false },
        { id: 'c', text: 'Because MSCI does not recognize AAOIFI standards at all', correct: false },
      ],
      feedback: {
        correct: 'Correct — a market-cap-based ratio can move with share price even when the underlying business is unchanged, producing different screening outcomes.',
        wrong: 'The key methodological difference is the ratio denominator: total assets (used by some providers) versus market capitalization (used by others), which can yield different results for the same company.',
      },
    },
    {
      id: 'q3',
      question: 'In the three-layer screening pipeline, what is the correct order of layers?',
      options: [
        { id: 'a', text: 'Financial ratio screen, then sector classification, then sector exclusion', correct: false },
        { id: 'b', text: 'Sector classification (e.g. GICS), then sector exclusion list, then financial ratio screen', correct: true },
        { id: 'c', text: 'Purification, then sector exclusion, then sector classification', correct: false },
      ],
      feedback: {
        correct: 'Correct — companies are first classified, then excluded by sector, then tested against financial ratio thresholds.',
        wrong: 'The pipeline runs: classify by sector (GICS), apply the sector exclusion list, then apply the financial ratio thresholds.',
      },
    },
  ],
};
