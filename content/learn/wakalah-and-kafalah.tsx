import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        Not every Islamic contract is about financing an asset or a venture. Some are about
        delegating authority or backing someone else's obligation.{' '}
        <ArabicPill arabic="وكالة" transliteration="Wakalah" /> and{' '}
        <ArabicPill arabic="كفالة" transliteration="Kafalah" /> are two such contracts, and they
        show up constantly in the operational plumbing of Islamic banking and Takaful.
      </p>

      <ol className="list-decimal pl-5 space-y-2">
        <li>
          <strong className="text-white">Wakalah — agency.</strong> One party (the{' '}
          <ArabicPill arabic="وكيل" transliteration="Wakil" />, the agent) acts on behalf of another
          (the principal), carrying out a specified task in exchange for an agreed fee. The agent
          does not bear the underlying risk of the principal's affairs — they are compensated for
          performing the task competently, not for guaranteeing an outcome.
        </li>
        <li>
          <strong className="text-white">Kafalah — guarantee.</strong> A third party (the{' '}
          <ArabicPill arabic="كفيل" transliteration="Kafil" />, the guarantor) agrees to be liable
          for someone else's debt or performance obligation if that person defaults or fails to
          perform. It is a Shariah-compliant equivalent to a surety bond or bank guarantee.
        </li>
      </ol>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 23 (Agency)">
        The agent is entitled to a fee for the work performed, and is liable only for negligence or
        breach of the terms of agency, not for the underlying commercial outcome of the principal's
        affairs.
      </QuoteBlock>

      <p>
        That liability boundary is what keeps Wakalah from drifting into something else. An agent
        who is paid a flat fee regardless of outcome, and who is only liable for their own
        negligence, is clearly providing a service. If the agent's compensation instead floated with
        the principal's investment performance the way a partner's would, the arrangement would
        start to look more like Mudarabah — a different contract with different risk allocation.
      </p>

      <ContextBox title="Wakalah in Takaful">
        Takaful — Islamic insurance — is built on participants pooling contributions to cover each
        other against defined risks, mutually, rather than buying a conventional insurance policy
        from a risk-bearing insurer. Most commercial Takaful operators run on a Wakalah model: the
        operator acts as Wakil (agent) for the pool of policyholders, managing the fund, processing
        claims, and investing surplus contributions, in exchange for a disclosed agency fee — not by
        underwriting risk itself the way a conventional insurer does. This is why Takaful operators
        describe themselves as managing the fund on the participants' behalf, rather than being the
        risk-bearing counterparty.
      </ContextBox>

      <p>
        Kafalah, by contrast, is squarely about risk-bearing — but risk-bearing of a specific,
        bounded kind: the guarantor steps in only if a default or non-performance actually occurs,
        and is then entitled to recover what they paid from the original obligor (unless the
        guarantee was given as pure charity). A guarantor cannot charge a fee that effectively
        functions as interest on a contingent loan; AAOIFI permits a fee only where it reflects a
        genuine administrative or service cost, not a charge for assuming the credit risk itself,
        since charging for bearing risk on a debt obligation would reintroduce Riba-like economics.
      </p>

      <ContextBox title="Kafalah in trade finance: letters of credit" variant="western-parallel">
        Kafalah is the Shariah basis for Islamic bank guarantees and Islamic letters of credit in
        trade finance. When Noor Digital Bank issues a guarantee on behalf of an importer to a
        foreign supplier, it is acting as Kafil — promising the supplier payment if the importer
        defaults. This is structurally close to a conventional bank guarantee or standby letter of
        credit, with the key Shariah constraint being that any fee charged must reflect genuine
        administrative cost of issuing and managing the guarantee, not a disguised charge for
        assuming credit risk the way a conventional risk premium would be priced.
      </ContextBox>

      <p>
        Together, Wakalah and Kafalah illustrate something important about Islamic finance beyond
        the financing contracts covered earlier in this part: a modern Islamic financial system
        needs agency and guarantee mechanisms just as much as it needs financing structures, and
        both have been adapted, through Ijtihad, to underpin entire product categories — Takaful and
        Islamic trade finance — that didn't exist in their current form when these contracts were
        first developed.
      </p>
    </div>
  );
}

export const wakalahAndKafalah: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'وكالة', transliteration: 'Wakalah', definition: 'An agency contract where one party acts on behalf of another for a fee.' },
    { arabic: 'وكيل', transliteration: 'Wakil', definition: 'The agent in a Wakalah contract.' },
    { arabic: 'كفالة', transliteration: 'Kafalah', definition: 'A guarantee contract where a third party becomes liable for another\'s debt or performance obligation.' },
    { arabic: 'كفيل', transliteration: 'Kafil', definition: 'The guarantor in a Kafalah contract.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What is an agent (Wakil) under Wakalah liable for?',
      options: [
        { id: 'a', text: 'Only their own negligence or breach of the agency terms, not the underlying commercial outcome', correct: true },
        { id: 'b', text: 'The full investment performance of the principal\'s affairs', correct: false },
        { id: 'c', text: 'Nothing at all, even in cases of clear negligence', correct: false },
      ],
      feedback: {
        correct: 'Correct — the agent is paid a fee for performing the task and is only liable for negligence or breach, not for outcomes beyond their control.',
        wrong: 'The agent\'s liability is limited to negligence or breach of the agency terms — they are not liable for the principal\'s overall commercial outcome.',
      },
    },
    {
      id: 'q2',
      question: 'How do most commercial Takaful operators typically structure their relationship with policyholders?',
      options: [
        { id: 'a', text: 'As a Wakil acting as agent for the policyholder pool, earning a disclosed agency fee', correct: true },
        { id: 'b', text: 'As a Mudarib bearing all underwriting losses personally', correct: false },
        { id: 'c', text: 'As a conventional insurer bearing all risk directly', correct: false },
      ],
      feedback: {
        correct: 'Correct — the Wakalah model has the operator manage the mutual fund as agent for a fee, rather than underwriting risk itself.',
        wrong: 'Takaful operators commonly use a Wakalah model, acting as agent (Wakil) for the policyholder pool and earning a fee, rather than bearing risk as a conventional insurer would.',
      },
    },
    {
      id: 'q3',
      question: 'Why can\'t a Kafil (guarantor) charge a fee that functions like an interest charge on the guarantee?',
      options: [
        { id: 'a', text: 'Because charging for bearing the credit risk itself would reintroduce Riba-like economics; fees must reflect genuine administrative cost', correct: true },
        { id: 'b', text: 'Because Kafalah contracts cannot legally charge any fee under any circumstances', correct: false },
        { id: 'c', text: 'Because the guarantor never has any right to recover what they paid out', correct: false },
      ],
      feedback: {
        correct: 'Correct — a fee tied to assuming credit risk would resemble interest; permitted fees must reflect genuine service or administrative cost.',
        wrong: 'AAOIFI restricts Kafalah fees to genuine administrative/service costs precisely because charging for the risk itself would reproduce Riba-like economics.',
      },
    },
  ],
};
