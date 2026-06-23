import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Beyond contract structure, Islamic finance also screens <em>what</em> a business does. A
        perfectly interest-free, Gharar-free contract is still off-limits if it finances a
        fundamentally prohibited activity.
      </p>

      <p className="font-medium text-white">Sector screen (qualitative)</p>
      <p>Businesses primarily engaged in any of the following are excluded outright:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Alcohol production or sale</li>
        <li>Conventional banking and insurance (interest-based)</li>
        <li>Gambling and casinos</li>
        <li>Pork production and processing</li>
        <li>Adult entertainment</li>
        <li>Weapons manufacturing for non-defensive purposes (some indices vary)</li>
        <li>Tobacco (varies by index)</li>
      </ul>

      <p className="font-medium text-white mt-6">Financial ratio screen (quantitative)</p>
      <p>
        A company that passes the sector screen still has to pass financial ratio thresholds, since
        most large companies carry some incidental interest-bearing debt or interest income. The
        commonly used thresholds (used by AAOIFI, DJIM, and most Islamic indices, with minor
        variations):
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Total debt / total assets &lt; 33%</li>
        <li>(Cash + interest-bearing securities) / total assets &lt; 33%</li>
        <li>Accounts receivable / total assets &lt; 33–49% (varies by methodology)</li>
        <li>Impure income (interest, non-compliant revenue) / total revenue &lt; 5%</li>
      </ul>

      <ContextBox title="Purification">
        If a stock passes both screens but still earns a small amount of impure income (e.g. bank
        interest on idle cash), an investor doesn't avoid the stock entirely — they invest, then
        donate the proportional impure income to charity. This is called purification, and it's
        calculated as: <code>(impure income ÷ total income) × dividend received</code>, donated
        rather than kept.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        This two-stage screen (qualitative exclusion + quantitative ratio threshold) is structurally
        identical to ESG and "sin stock" exclusion screening used by conventional ethical funds —
        the difference is the specific list of excluded sectors and the leverage/cash ratio caps.
      </ContextBox>
    </div>
  );
}

export const halalHaramSectors: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'تطهير', transliteration: 'Tatheer', definition: 'Purification — donating the proportion of investment income derived from impure sources.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'A company passes the sector screen but has 40% debt-to-assets. What happens?',
      options: [
        { id: 'a', text: 'It is excluded — it fails the financial ratio screen', correct: true },
        { id: 'b', text: 'It is automatically compliant since it passed the sector screen', correct: false },
        { id: 'c', text: 'Only the dividend is purified, the stock remains investable regardless of ratio', correct: false },
      ],
      feedback: { correct: 'Correct — most methodologies cap debt/assets around 33%.', wrong: 'A company must pass both the sector screen and the financial ratio screen.' },
    },
    {
      id: 'q2',
      question: 'What is "purification" in Islamic equity investing?',
      options: [
        { id: 'a', text: 'Donating the proportion of income derived from impure sources', correct: true },
        { id: 'b', text: 'Paying Zakat on the entire portfolio', correct: false },
        { id: 'c', text: 'Selling a stock the moment any impure income appears', correct: false },
      ],
      feedback: { correct: 'Correct.', wrong: 'Purification means donating the impure-income proportion, not selling the stock.' },
    },
  ],
};
