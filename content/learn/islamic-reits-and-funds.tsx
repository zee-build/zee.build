import ArabicPill from '@/components/learn/ArabicPill';
import QuoteBlock from '@/components/learn/QuoteBlock';
import ContextBox from '@/components/learn/ContextBox';
import type { ModuleContent } from './types';

function Body() {
  return (
    <div className="space-y-5 text-[15px] leading-[1.75] text-zinc-300">
      <p>
        A real estate investment trust (REIT) pools investor capital to own and operate
        income-producing property — offices, malls, warehouses, residential towers — and
        distributes the rental income to unit holders. An{' '}
        <ArabicPill arabic="صندوق استثمار عقاري إسلامي" transliteration="I-REIT" /> applies the
        same basic structure with two added Shariah constraints: what the properties are used for,
        and how the REIT itself is financed.
      </p>

      <p className="font-medium text-white">Constraint 1: tenant and property screening</p>
      <p>
        A conventional REIT will lease space to any creditworthy tenant. An I-REIT's underlying
        properties — and critically, their tenants — must themselves be Shariah-compliant. A
        property leased to a bar, a conventional bank branch, a casino, or another business on the
        excluded-sector list (covered in the equity screening modules) disqualifies that property
        from the trust, even if the building itself is a perfectly ordinary office tower. In
        practice, I-REIT managers screen prospective tenants' business activities the same way an
        equity screen evaluates a company's revenue mix — and if a small, incidental amount of
        non-compliant tenant income slips in, it is typically purified (donated) rather than kept,
        echoing the purification mechanic used in equity screening.
      </p>

      <p className="font-medium text-white">Constraint 2: financing structure</p>
      <p>
        Conventional REITs routinely use mortgage debt and interest-bearing credit facilities to
        leverage returns. An I-REIT cannot raise interest-bearing debt to finance acquisitions —
        any debt-like financing has to be structured through Shariah-compliant instruments such as
        Ijarah-based financing or Sukuk al-Ijarah (covered in the Sukuk module), and providers
        typically cap the trust's overall leverage and non-compliant income under similar ratio
        thresholds to those used in equity screening (commonly around the ~33% range used
        elsewhere in Islamic finance, though specific caps vary by regulator and index provider).
      </p>

      <QuoteBlock citation="AAOIFI Shariah Standard No. 17 (Investment Sukuk), as applied to real estate funds">
        Investment may not be undertaken in real estate that is used, or intended to be used, for
        an activity prohibited by Shariah, regardless of the creditworthiness of the tenant.
      </QuoteBlock>

      <ContextBox title="What this looks like operationally">
        An I-REIT's Shariah board reviews prospective acquisitions before they close, checks the
        existing tenant roll for compliance during ongoing operations, and reviews any proposed
        financing facility before it is drawn. This adds a layer of governance conventional REIT
        managers don't carry — but the day-to-day asset management (leasing, maintenance,
        valuation, distribution mechanics) is otherwise identical to a conventional REIT.
      </ContextBox>

      <p className="font-medium text-white">Performance versus conventional REITs</p>
      <p>
        Because the underlying asset class — income-producing real estate — is the same, I-REITs
        tend to track conventional REIT performance fairly closely over time; the return driver in
        both cases is rental yield plus property value appreciation, not the Shariah screen
        itself. The practical difference shows up mainly in composition: I-REITs are structurally
        underweight (or fully excluded from) certain property types — hotels with significant
        alcohol-driven F&amp;B revenue, properties anchored by conventional bank branches or
        casinos — and carry lower average leverage than conventional peers, since interest-bearing
        debt is constrained. Lower leverage can mean slightly lower volatility in a downturn but
        also slightly muted upside in a strong rate-cutting cycle, since conventional REITs can
        lean more aggressively on cheap debt.
      </p>

      <ContextBox title="Western parallel" variant="western-parallel">
        The tenant-screening layer is structurally similar to "impact" or ESG-tilted real estate
        funds that exclude certain property uses (e.g. funds that won't hold private prison
        assets, or that exclude properties leased to fossil fuel extraction tenants). The
        financing-leverage cap has a rough parallel in conservative, low-leverage REIT mandates
        that some conventional institutional investors specifically seek out for lower balance
        sheet risk — the motivation differs, but the balance-sheet effect (lower debt, more
        equity-funded growth) looks similar.
      </ContextBox>

      <p>
        Most major Islamic finance hubs now host listed I-REITs — Malaysia's exchange has several
        long-running examples (Al-Aqar Healthcare REIT, Al-Salam REIT), and the GCC markets have
        increasingly introduced Shariah-compliant REIT structures as part of broader sukuk and
        real estate capital markets development.
      </p>
    </div>
  );
}

export const islamicReitsAndFunds: ModuleContent = {
  Body,
  glossary: [
    { arabic: 'صندوق استثمار عقاري إسلامي', transliteration: 'I-REIT', definition: 'An Islamic real estate investment trust — a REIT whose properties, tenants, and financing must all meet Shariah screening requirements.' },
    { arabic: 'تطهير', transliteration: 'Tatheer', definition: 'Purification — donating any incidental non-compliant income (e.g. from a small non-compliant tenant) rather than retaining it.' },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'What is the key additional screen an I-REIT applies that a conventional REIT does not?',
      options: [
        { id: 'a', text: 'A minimum property age requirement', correct: false },
        { id: 'b', text: 'Screening of the underlying properties and their tenants for Shariah compliance, plus restrictions on interest-bearing financing', correct: true },
        { id: 'c', text: 'A requirement that all properties be located in Muslim-majority countries', correct: false },
      ],
      feedback: {
        correct: 'Correct — I-REITs add tenant/property compliance screening and constrain financing to non-interest-bearing structures.',
        wrong: 'I-REITs screen properties and tenants for Shariah compliance and restrict financing away from conventional interest-bearing debt — geography and property age are not the relevant screens.',
      },
    },
    {
      id: 'q2',
      question: 'How does I-REIT performance generally compare to conventional REIT performance?',
      options: [
        { id: 'a', text: 'It tends to track fairly closely, since the underlying return driver (rental income and property appreciation) is the same asset class', correct: true },
        { id: 'b', text: 'I-REITs structurally cannot generate any income and exist purely for capital preservation', correct: false },
        { id: 'c', text: 'I-REITs always outperform because they avoid all leverage entirely', correct: false },
      ],
      feedback: {
        correct: 'Correct — performance tends to track conventional REITs closely since both rely on the same real estate income fundamentals; the main practical difference is composition and leverage levels.',
        wrong: 'Because the underlying asset class is the same, I-REITs broadly track conventional REIT performance; they are not income-incapable, nor do they eliminate leverage entirely (they constrain it to non-interest-bearing structures).',
      },
    },
  ],
};
