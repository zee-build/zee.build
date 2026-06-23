import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Islamic banks offer depositors two structurally different kinds of accounts, and the
        difference matters far more than it looks on a marketing brochure. Understanding it is the
        key to understanding why an Islamic bank's liability side cannot be modeled like a
        conventional bank's.
      </p>

      <p>
        <strong className="text-white">
          <ArabicPill arabic="وديعة" transliteration="Wadiah" />
        </strong>{' '}
        means "safekeeping" or "trust deposit." Under a Wadiah arrangement, the depositor hands funds
        to the bank purely for safekeeping — the bank is a trustee, not a partner. The bank may use
        the funds (typically under a sub-variant called{' '}
        <ArabicPill arabic="وديعة يد ضمانة" transliteration="Wadiah Yad Dhamanah" />, "guaranteed
        safekeeping"), but it guarantees to return the full principal on demand. There is no
        contractual profit share — any "gift" (<ArabicPill arabic="هبة" transliteration="Hibah" />)
        the bank pays is discretionary, not promised. This is the structure typically used for
        current accounts: full capital protection, instant access, no expected return.
      </p>

      <p>
        <strong className="text-white">Mudarabah-based savings and investment deposits</strong> work
        differently. Here the depositor is genuinely a Rab al-Mal and the bank is the Mudarib — the
        deposit is capital placed into a profit-sharing venture, not a safekeeping arrangement. The
        bank invests the pooled funds in its financing book (Murabaha, Ijarah, Musharakah) and shares
        the realized profit with depositors according to a pre-agreed ratio. Critically, in principle
        the depositor bears the risk of loss of the principal if the underlying investments lose
        money — there is no guaranteed return and, strictly, no guaranteed return of capital either.
      </p>

      <ContextBox title="Smoothing in practice">
        In practice, most Islamic banks maintain a{' '}
        <ArabicPill arabic="احتياطي معادلة الربح" transliteration="Profit Equalization Reserve" />{' '}
        (PER) and an Investment Risk Reserve, funded by setting aside a portion of gross profit in
        good years, to smooth the payout to Mudarabah depositors and avoid sudden swings that would
        otherwise be a normal feature of a true profit-and-loss-sharing instrument. AAOIFI's
        accounting standards require these reserves to be disclosed transparently — the smoothing is
        permissible as a commercial practice, but it cannot be allowed to quietly convert a
        profit-sharing deposit into a disguised fixed-return one.
      </ContextBox>

      <ContextBox title="Western parallel" variant="western-parallel">
        A Wadiah current account behaves much like a conventional checking account: capital-protected,
        liquid, no interest expectation (interest-bearing checking accounts pay a small rate; Wadiah
        accounts structurally pay none, though a discretionary Hibah gift can resemble one). A
        Mudarabah savings account looks superficially like a conventional high-yield savings account,
        but the resemblance is misleading — a conventional savings account's "interest rate" is a
        contractual promise backed by deposit insurance in most jurisdictions, while a Mudarabah
        account's "profit rate" is a non-guaranteed outcome of an actual investment, and is not
        principal-protected in the way deposit insurance protects conventional deposits.
      </ContextBox>

      <QuoteBlock citation="AAOIFI Financial Accounting Standard 27">
        Unrestricted investment accounts are not the bank's liability in the same sense as
        Wadiah-based current accounts; the bank manages them as an investment manager, and the risk of
        loss, in principle, is borne by the account holders.
      </QuoteBlock>

      <p>
        This is the fundamental reason Islamic deposit products cannot simply be renamed conventional
        products. A conventional bank's deposit insurance scheme exists precisely because a depositor
        is owed a fixed sum regardless of how the bank's loan book performs. A Mudarabah-based
        Islamic deposit removes that guarantee by design — the depositor is a genuine, risk-bearing
        investor in the bank's financing activities, which is also why some regulators (covered in
        the regulation module) have had to design parallel, profit-sharing-aware deposit protection
        schemes rather than simply applying the conventional model unchanged.
      </p>
    </div>
  );
}

export const islamicBankDeposits: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'وديعة', transliteration: 'Wadiah', definition: 'A safekeeping deposit with no guaranteed return, typically used for current accounts.' },
    { arabic: 'هبة', transliteration: 'Hibah', definition: 'A discretionary gift a bank may pay on a Wadiah deposit, not a contractual return.' },
    { arabic: 'احتياطي معادلة الربح', transliteration: 'Profit Equalization Reserve', definition: 'A reserve Islamic banks set aside in good years to smooth profit payouts to Mudarabah depositors.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Which deposit type guarantees the return of the full principal on demand?',
      options: [
        { id: 'a', text: 'Mudarabah-based investment deposits', correct: false },
        { id: 'b', text: 'Wadiah deposits', correct: true },
        { id: 'c', text: 'Both equally', correct: false },
      ],
      feedback: {
        correct: 'Correct — Wadiah is a safekeeping arrangement with guaranteed principal return.',
        wrong: 'Wadiah deposits guarantee principal return; Mudarabah deposits do not, in principle.',
      },
    },
    {
      id: 'q2',
      question: 'In a Mudarabah savings deposit, who bears the risk of loss of the principal in principle?',
      options: [
        { id: 'a', text: 'The bank alone', correct: false },
        { id: 'b', text: 'The depositor, as Rab al-Mal', correct: true },
        { id: 'c', text: 'A government deposit insurance fund', correct: false },
      ],
      feedback: {
        correct: 'Correct — the depositor is the capital provider and bears investment risk in principle.',
        wrong: 'As Rab al-Mal, the depositor bears the risk of loss in a true Mudarabah deposit.',
      },
    },
    {
      id: 'q3',
      question: 'What is the purpose of a Profit Equalization Reserve?',
      options: [
        { id: 'a', text: 'To guarantee a fixed interest rate to depositors', correct: false },
        { id: 'b', text: 'To smooth profit payouts to Mudarabah depositors over time', correct: true },
        { id: 'c', text: 'To pay bank executive bonuses', correct: false },
      ],
      feedback: {
        correct: 'Correct — it sets aside profit in good years to smooth payouts, disclosed under AAOIFI standards.',
        wrong: 'It exists to smooth Mudarabah profit payouts, not to create a guaranteed return.',
      },
    },
  ],
};
