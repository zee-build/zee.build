// Blueprints promised in ZeeBuild posts. Every Instagram CTA points at zeebuild.com/r/<slug>,
// so a post may only go out once its entry exists here.

export interface Resource {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  posted: string; // ISO date the post went out (or is scheduled)
  sections: { heading: string; points: string[] }[];
}

export const RESOURCES: Resource[] = [
  {
    slug: "first-five",
    title: "The first five automations",
    kicker: "BLUEPRINT · FROM THE CAROUSEL",
    summary:
      "If these five jobs still need you every week, you're working in the business instead of on it. Here's the order to automate them, and how to do it without losing control.",
    posted: "2026-11-03",
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

export const getResource = (slug: string) => RESOURCES.find((r) => r.slug === slug);
