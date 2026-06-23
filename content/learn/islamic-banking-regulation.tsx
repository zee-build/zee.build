import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        A single Islamic bank's internal Shariah board (covered in the previous module) governs that
        bank's own products. But an entire industry also needs cross-border standards — for
        accounting, for Shariah methodology, and for prudential safety — so that an Islamic bank in
        Dubai, Kuala Lumpur, and Manama are all recognizably playing by comparable rules. Two
        institutions do most of that work.
      </p>

      <p>
        <strong className="text-white">AAOIFI</strong> — the Accounting and Auditing Organization for
        Islamic Financial Institutions, based in Bahrain since 1991 — sets Shariah standards
        (defining how Murabaha, Ijarah, Mudarabah, Tawarruq etc. must be structured to be compliant)
        and accounting/financial-reporting standards (how those contracts should be recognized and
        disclosed on a bank's books). Its Shariah standards function as the closest thing the industry
        has to a shared rulebook — when this course cites "AAOIFI requires X," it is citing one of
        these standards.
      </p>

      <p>
        <strong className="text-white">IFSB</strong> — the Islamic Financial Services Board,
        headquartered in Kuala Lumpur since 2002 — is the prudential counterpart: it sets capital
        adequacy, risk management, and supervisory standards, playing roughly the role the Basel
        Committee plays for conventional banks. The IFSB's standards are explicitly designed to
        adapt Basel-style prudential concepts to instruments that don't exist in conventional
        banking.
      </p>

      <ContextBox title="Adapting Basel III to Islamic balance sheets">
        Basel III's capital adequacy framework assumes a clean separation between debt (fixed
        claims, like deposits) and equity (loss-absorbing capital). Islamic banks complicate this:
        Mudarabah-based investment deposits are contractually loss-bearing, which makes them behave
        more like quasi-equity than like conventional deposits — yet depositors still expect
        liquidity and a degree of capital protection in practice (via the smoothing reserves covered
        in the deposits module). The IFSB's capital adequacy standard (IFSB-15 and predecessors)
        gives banks partial capital relief for the loss-absorbing portion of these accounts, while
        still requiring banks to hold capital against the displaced commercial risk — the risk that a
        bank chooses to absorb depositor losses itself, for competitive reasons, rather than passing
        them through.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        This is conceptually similar to how contingent convertible bonds ("CoCos") are treated under
        Basel III for conventional banks — instruments that sit between debt and equity and get
        partial capital-adequacy credit precisely because they can absorb losses under stress. The
        IFSB had to build an equivalent classification for Mudarabah deposits, which are economically
        loss-absorbing by contract but commercially expected to behave like deposits.
      </ContextBox>

      <p>
        <strong className="text-white">National approaches differ meaningfully.</strong> The{' '}
        <strong className="text-white">UAE's Central Bank (CBUAE)</strong> operates a Higher Shariah
        Authority that issues binding Shariah standards (largely adopting AAOIFI's standards) across
        all licensed Islamic banks and windows — a centralized national-level Shariah governance
        layer on top of each bank's own SSB.{' '}
        <strong className="text-white">Malaysia's central bank, Bank Negara Malaysia (BNM)</strong>,
        runs one of the most developed regulatory ecosystems globally, with its own Shariah Advisory
        Council acting as the apex Shariah authority for the entire financial system, plus a dedicated
        Islamic Financial Services Act. <strong className="text-white">
          Bahrain's Central Bank (CBB)
        </strong>{' '}
        has historically been one of the most AAOIFI-aligned regulators, given AAOIFI's own
        headquarters are in Manama, and mandates AAOIFI accounting standards for its Islamic banks
        directly.
      </p>

      <QuoteBlock citation="IFSB, Guiding Principles on Capital Adequacy">
        The capital adequacy framework for institutions offering Islamic financial services must
        recognize the unique risk-sharing characteristics of Islamic contracts, while remaining
        broadly consistent with international standards applicable to conventional banks.
      </QuoteBlock>

      <p>
        The net effect: an Islamic bank operating across the GCC and Southeast Asia faces a layered
        compliance task — AAOIFI/IFSB international standards as a baseline, then each national
        regulator's specific adoption and adaptation of those standards, then its own SSB's
        institution-specific rulings on top.
      </p>
    </div>
  );
}

export const islamicBankingRegulation: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'هيئة شرعية عليا', transliteration: 'Higher Shariah Authority', definition: 'A national-level Shariah governance body, such as the UAE\'s, that issues binding standards across all Islamic banks.' },
    { arabic: 'كفاية رأس المال', transliteration: 'Capital Adequacy', definition: 'The regulatory requirement that a bank hold sufficient capital relative to its risk-weighted assets.' },
    { arabic: 'مخاطر تجارية معلقة', transliteration: 'Displaced Commercial Risk', definition: 'The risk a bank absorbs depositor investment losses itself rather than passing them through, for competitive reasons.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Which organization is the Basel-equivalent prudential standard-setter for Islamic banks?',
      options: [
        { id: 'a', text: 'AAOIFI', correct: false },
        { id: 'b', text: 'IFSB', correct: true },
        { id: 'c', text: 'CBUAE', correct: false },
      ],
      feedback: {
        correct: 'Correct — the Islamic Financial Services Board sets prudential and capital adequacy standards.',
        wrong: 'IFSB plays the Basel Committee\'s role for Islamic banks; AAOIFI focuses on Shariah and accounting standards.',
      },
    },
    {
      id: 'q2',
      question: 'Why are Mudarabah-based investment deposits treated as quasi-equity under IFSB capital adequacy rules?',
      options: [
        { id: 'a', text: 'Because they pay a fixed guaranteed dividend', correct: false },
        { id: 'b', text: 'Because they are contractually loss-bearing, similar to capital', correct: true },
        { id: 'c', text: 'Because they cannot be withdrawn by depositors', correct: false },
      ],
      feedback: {
        correct: 'Correct — their loss-absorbing nature makes them behave more like equity than fixed-claim debt.',
        wrong: 'The quasi-equity treatment stems from their contractual loss-bearing character, not withdrawal restrictions.',
      },
    },
    {
      id: 'q3',
      question: 'Which regulator runs a centralized Shariah Advisory Council acting as the apex Shariah authority for its entire financial system?',
      options: [
        { id: 'a', text: 'Bank Negara Malaysia (BNM)', correct: true },
        { id: 'b', text: 'The Central Bank of Bahrain (CBB)', correct: false },
        { id: 'c', text: 'AAOIFI', correct: false },
      ],
      feedback: {
        correct: 'Correct — BNM\'s Shariah Advisory Council is the apex national Shariah authority in Malaysia.',
        wrong: 'BNM operates the Shariah Advisory Council as Malaysia\'s apex Shariah authority.',
      },
    },
  ],
};
