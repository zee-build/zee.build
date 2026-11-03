// Blueprints promised in ZeeBuild posts. Every Instagram CTA points at zeebuild.com/r/<slug>,
// so a post may only go out once its entry exists here.

export interface Resource {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  posted: string; // Dubai local time the post goes out, "YYYY-MM-DDTHH:mm"
  thumb?: string; // cover image shown on the link-in-bio page
  sections: { heading: string; points: string[] }[];
}

export const RESOURCES: Resource[] = [
  {
    slug: "first-five",
    title: "The first five automations",
    kicker: "BLUEPRINT · FROM THE CAROUSEL",
    summary:
      "If these five jobs still need you every week, you're working in the business instead of on it. Here's the order to automate them, and how to do it without losing control.",
    posted: "2026-11-03T15:30",
    thumb: "/posts/first-five/thumb.jpg",
    sections: [
      {
        heading: "The bottleneck test",
        points: [
          "You chase invoices or payments by hand every month.",
          "You copy orders from one app into another.",
          "You answer the same ten questions in DMs and email.",
          "You remind people about bookings, renewals or payments.",
          "You build the weekly report from three spreadsheets.",
        ],
      },
      {
        heading: "Build order (ranked by how fast it pays back)",
        points: [
          "S tier: invoice and payment chasers. A schedule checks what's overdue, sends a polite reminder, then a firmer one, then flags it to you. Money comes in faster from the first month.",
          "S tier: order sync between apps. When an order lands in your shop, it's created in your accounting or delivery tool automatically. No double entry, no typos.",
          "A tier: booking and renewal reminders. A message 24 hours and 2 hours before, and a renewal nudge 14 days out.",
          "A tier: FAQ auto-replies. The ten questions you always get are answered instantly; anything else goes to a person.",
          "B tier: the weekly report. Pulled from the same sources every Monday. Do it after the money jobs.",
        ],
      },
      {
        heading: "Three rules so it never goes wrong quietly",
        points: [
          "Start with the money job: write down every step you do by hand. That list is the automation.",
          "Keep a human in the loop: routine cases run automatically, anything unusual (a dispute, a big refund, a VIP) goes to a person with one click.",
          "Make it visible: every run writes one log row, and a failure sends you one message, so you stop checking.",
        ],
      },
      {
        heading: "Tools that do this",
        points: [
          "Make.com or n8n to connect your apps and run the steps.",
          "A Google Sheet or Airtable as the log.",
          "Email or WhatsApp for the reminders and the failure alert.",
        ],
      },
    ],
  },
];

RESOURCES.push(
  {
    slug: "tool-tiers",
    title: "The automation tool picker",
    kicker: "BLUEPRINT · FROM THE TIER LIST",
    summary: "Which tool for which job, what to expect on cost, and the starter setup I'd use for a small business.",
    posted: "2026-11-04T12:30",
    thumb: "/posts/tool-tiers/thumb.jpg",
    sections: [
      { heading: "S tier: start here", points: [
        "Make.com: visual scenarios, cheap per task, handles branching and messy real-world data. Best all-rounder for a small team.",
        "Google Sheets: the free database behind your first automations, and the log every run writes to.",
      ] },
      { heading: "A tier: great, with a catch", points: [
        "Zapier: the easiest to start with. Costs climb as your task volume grows, so check pricing against your monthly runs.",
        "n8n: free when self-hosted, very powerful, but someone has to host and maintain it.",
        "ChatGPT or Claude: excellent for drafting, summarising and sorting. Keep a human approval before anything moves money or contacts a customer.",
      ] },
      { heading: "B to D tier: use with care", points: [
        "Airtable: lovely interface, but small teams often hit free-plan limits quickly.",
        "Five separate apps that each 'automate' a little: nobody owns the whole flow, so things fall through the gaps.",
        "Reminders in your head: the most expensive system you have.",
      ] },
      { heading: "How to choose", points: [
        "Write down the one task that eats your week.",
        "Pick the cheapest tool that does that job end to end, including the log and a failure alert.",
        "Run it for two weeks before adding the next automation.",
      ] },
    ],
  },
  {
    slug: "owner-or-prisoner",
    title: "Owner or prisoner? The 3 signs",
    kicker: "BLUEPRINT · FROM THE REEL",
    summary: "Three signs your business runs you instead of the other way round, and the first automation to fix each one.",
    posted: "2026-11-04T19:00",
    thumb: "/posts/first-five/thumb.jpg",
    sections: [
      { heading: "Sign 1: no day off is really off", points: [
        "Fix: route routine questions and booking changes to auto-replies, and only escalate what needs you.",
      ] },
      { heading: "Sign 2: every invoice waits for you", points: [
        "Fix: an invoice and payment chaser that sends reminders on a schedule and flags only the overdue exceptions.",
      ] },
      { heading: "Sign 3: only you know the answers", points: [
        "Fix: write down your ten most-asked questions once. Use them for instant replies, and let a person take anything else.",
      ] },
      { heading: "Next step", points: [
        "The full build order is in the first-five blueprint: zeebuild.com/r/first-five",
      ] },
    ],
  },
  {
    slug: "card-fees",
    title: "Card fees: what to check on your statement",
    kicker: "BLUEPRINT · FROM THE CAROUSEL",
    summary: "Where a card payment's fee goes, which part you can negotiate, and the questions to ask your provider. Education, not financial advice.",
    posted: "2026-11-05T12:30",
    thumb: "/posts/card-fees/thumb.jpg",
    sections: [
      { heading: "The four players in one tap", points: [
        "You (the merchant), your acquirer (the provider of your card machine or online checkout), the card network (such as Visa or Mastercard) and your customer's bank (the issuer).",
      ] },
      { heading: "Where the fee goes", points: [
        "Interchange: paid to the customer's bank. Usually the largest part.",
        "Scheme fee: paid to the card network.",
        "Acquirer markup: your provider's margin. This is the part that varies most between providers.",
      ] },
      { heading: "What to look for on your statement", points: [
        "The merchant discount rate (MDR): the total percentage you pay per sale.",
        "Monthly, terminal rental, refund, chargeback and international card fees.",
        "Whether your rate is a single blended number or itemised.",
      ] },
      { heading: "Questions to ask your provider", points: [
        "What is my effective rate across all fees last month?",
        "Can you itemise interchange, scheme fee and your markup?",
        "Will you match this quote from another provider?",
      ] },
    ],
  },
  {
    slug: "four-questions",
    title: "The 4-question automation worksheet",
    kicker: "BLUEPRINT · FROM THE CAROUSEL",
    summary: "Score any task in two minutes and know whether to automate it, keep it, or automate it with a human approval step.",
    posted: "2026-11-06T12:30",
    thumb: "/posts/four-questions/thumb.jpg",
    sections: [
      { heading: "Ask these four questions", points: [
        "1. Does it happen every week? If not, a checklist beats an automation.",
        "2. Is it the same steps every time? Same inputs, same rules, same output means automate.",
        "3. What breaks if it's wrong? If it touches money or a customer, add a one-click human approval.",
        "4. Will you know when it fails? Every run writes a log row; a failure sends you one message.",
      ] },
      { heading: "How to score", points: [
        "Yes to 1 and 2: automate it.",
        "Yes to 1 and 2, and 3 is risky: automate it with an approval step.",
        "No to 4: don't automate until you have a log and an alert.",
      ] },
    ],
  },
  {
    slug: "automate-or-keep",
    title: "Automate it or keep it: the verdicts",
    kicker: "BLUEPRINT · FROM THE TIER LIST REEL",
    summary: "Six common business tasks with a verdict each, and the rule behind them.",
    posted: "2026-11-06T19:00",
    thumb: "/posts/four-questions/thumb.jpg",
    sections: [
      { heading: "Automate", points: [
        "Invoice reminders: on a schedule, escalating politely, logged.",
        "Booking confirmations: instant, with a reminder before the appointment.",
        "The weekly report: pulled from the same sources every Monday.",
      ] },
      { heading: "Keep (with help)", points: [
        "Sales calls: people buy from people. Automate the booking, not the conversation.",
        "Refund decisions: keep the decision, but make it a one-click approve.",
        "Customer complaints: a person handles them, but you get alerted the moment one arrives.",
      ] },
      { heading: "The rule", points: [
        "Repetitive: automate it. Judgment: keep it. Score your own tasks with the 4-question worksheet: zeebuild.com/r/four-questions",
      ] },
    ],
  },
);

// A blueprint is listed on the link page only once its post is live (Dubai is UTC+4, no DST)
export const isLive = (r: Resource, now = new Date()) => new Date(`${r.posted.length === 10 ? r.posted + "T00:00" : r.posted}:00+04:00`) <= now;

export const getResource = (slug: string) => RESOURCES.find((r) => r.slug === slug);
