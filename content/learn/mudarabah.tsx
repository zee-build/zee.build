import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        <ArabicPill arabic="مضاربة" transliteration="Mudarabah" /> is a silent partnership: one
        party supplies capital and the other supplies expertise and labor, with neither party
        relying on the other's collateral or a fixed promised return.
      </p>

      <p>The two roles are distinct and named:</p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">
            <ArabicPill arabic="رب المال" transliteration="Rab al-Mal" />
          </strong>{' '}
          — the capital provider. Contributes the money but takes no role in managing the venture.
        </li>
        <li>
          <strong className="text-white">
            <ArabicPill arabic="مضارب" transliteration="Mudarib" />
          </strong>{' '}
          — the working partner. Contributes skill, labor, and management, but no capital of their
          own (to this venture).
        </li>
      </ol>

      <QuoteBlock citation="Usmani, An Introduction to Islamic Finance">
        Profit is distributed between the partners in a pre-agreed proportion, while loss, if any,
        is borne by the Rab al-Mal alone, unless the loss is due to the Mudarib's misconduct,
        negligence, or breach of the agreed terms.
      </QuoteBlock>

      <p>
        This loss allocation is the structure's defining feature, and it is easy to misread at
        first glance. It looks asymmetric — why should the capital provider bear all the financial
        loss? — but it is actually consistent with the same principle underlying Musharakah: capital
        bears the risk of capital loss, while labor bears the risk of labor loss. The Mudarib
        invested time and effort that, if the venture fails, are simply gone — uncompensated. The
        Rab al-Mal's money is what is actually destroyed if the venture fails financially. Each
        party loses what they put in.
      </p>

      <ContextBox title="Why this isn't a loan with extra paperwork">
        If the Mudarib were also liable for financial losses out of pocket, the contract would
        start to resemble a loan that the capital provider is guaranteed to get back regardless of
        outcome — precisely the risk-free return Riba prohibits. Mudarabah keeps the asymmetry
        deliberately: the Rab al-Mal accepted genuine downside exposure as the price of a share in
        the upside, which is the Maqasid justification for why a return on the capital is
        permissible at all.
      </ContextBox>

      <p>
        Mudarabah is the structural backbone of how most Islamic banks run savings and investment
        deposit accounts. The depositor is the Rab al-Mal; the bank is the Mudarib, deploying
        pooled depositor funds into the bank's various financing activities (Murabaha, Ijarah,
        Musharakah, and so on) and sharing the resulting profit with depositors at a pre-agreed
        ratio — commonly disclosed as a profit-sharing ratio (PSR) rather than an "interest rate."
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        Mudarabah maps closely onto a limited partnership in venture capital: limited partners (LPs)
        contribute capital and bear the financial risk of the fund's losses, while the general
        partner (GP) contributes management expertise and is compensated through a share of profits
        (carry) rather than a fixed salary tied to fund performance. Islamic savings accounts using
        Mudarabah are conceptually closer to investment fund units than to conventional deposit
        accounts that pay a guaranteed interest rate.
      </ContextBox>

      <p>
        This is also why returns on Islamic Mudarabah-based savings accounts are not guaranteed or
        fixed in advance the way conventional savings interest is — the bank can publish indicative,
        expected profit rates based on historical performance, but the actual payout depends on how
        the underlying pool of financing activities performed that period.
      </p>
    </div>
  );
}

export const mudarabah: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'مضاربة', transliteration: 'Mudarabah', definition: 'A silent partnership where one party provides capital and the other provides labor/expertise, sharing profit by agreed ratio.' },
    { arabic: 'رب المال', transliteration: 'Rab al-Mal', definition: 'The capital provider in a Mudarabah partnership, who bears financial loss.' },
    { arabic: 'مضارب', transliteration: 'Mudarib', definition: 'The managing/working partner in a Mudarabah partnership, who contributes labor and expertise.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'In a standard Mudarabah, who bears financial loss if the venture fails (absent misconduct)?',
      options: [
        { id: 'a', text: 'The Rab al-Mal (capital provider) alone', correct: true },
        { id: 'b', text: 'The Mudarib (working partner) alone', correct: false },
        { id: 'c', text: 'Both partners equally, regardless of contribution', correct: false },
      ],
      feedback: {
        correct: 'Correct — the capital provider bears the financial loss; the Mudarib only loses their uncompensated effort.',
        wrong: 'The Rab al-Mal bears financial loss because they supplied the capital that was lost; the Mudarib\'s "loss" is their unpaid time and effort.',
      },
    },
    {
      id: 'q2',
      question: 'How do Islamic banks typically use Mudarabah for savings accounts?',
      options: [
        { id: 'a', text: 'The depositor is the Rab al-Mal and the bank is the Mudarib, sharing profit by a pre-agreed ratio', correct: true },
        { id: 'b', text: 'The bank lends the depositor money at a fixed interest rate', correct: false },
        { id: 'c', text: 'The depositor manages the bank\'s financing activities directly', correct: false },
      ],
      feedback: {
        correct: 'Correct — depositors supply capital, the bank manages and deploys it, and profit is shared by an agreed ratio rather than a fixed interest rate.',
        wrong: 'In Mudarabah-based deposits, the depositor supplies capital (Rab al-Mal) and the bank manages it (Mudarib), sharing actual profit rather than paying guaranteed interest.',
      },
    },
    {
      id: 'q3',
      question: 'Why doesn\'t having the Mudarib bear no financial loss make Mudarabah equivalent to Riba?',
      options: [
        { id: 'a', text: 'Because the Mudarib still bears the real risk of uncompensated labor, and the capital provider\'s return is not guaranteed', correct: true },
        { id: 'b', text: 'Because Mudarabah always involves a fixed government-set profit rate', correct: false },
        { id: 'c', text: 'Because the Mudarib must personally guarantee the capital provider\'s principal', correct: false },
      ],
      feedback: {
        correct: 'Correct — the capital provider\'s return is genuinely variable and tied to venture performance, and the Mudarib risks real uncompensated effort.',
        wrong: 'The Rab al-Mal\'s return is not fixed or guaranteed — it depends on actual venture profit, which is what keeps Mudarabah distinct from Riba.',
      },
    },
  ],
};
