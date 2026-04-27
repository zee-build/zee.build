// ZeeBuild OS — static data

export const ZB_DATA = {
  identity: {
    name: "Ziyan Bin Anoos",
    title: "Builder. Researcher. FinTech Engineer.",
    location: "Dubai, UAE",
    languages: 6,
    years: "5+",
    email: "ziyanalibusiness@gmail.com",
    phone: "+971 50 270 4146",
    linkedin: "linkedin.com/in/ziyanbinanoos",
    github: "github.com/zee-build",
  },
  bio: "FinTech engineer and builder shipping production systems across .NET, Python, and Next.js. I work at the intersection of finance, automation, and applied research — currently building tarbiya.ai, NoorBot, and QueueFlow while leading engineering at Yuze Digital.",
  skills: {
    "Languages": ["TypeScript", "Python", "C#", "Dart", "SQL"],
    "Frameworks": [".NET", "Next.js", "React", "Flutter", "FastAPI"],
    "Cloud / Infra": ["Azure", "Supabase", "Vercel", "Docker", "Postgres"],
    "Automation": ["Make.com", "n8n", "GitHub Actions", "Resend"],
    "Research": ["LLM Eval", "Risk Modeling", "FinTech Compliance"],
  },
  builds: [
    {
      name: "tarbiya.ai",
      status: "Building",
      desc: "AI story generator for Muslim kids — values-aligned bedtime stories on demand.",
      stack: ["Next.js", "OpenAI", "Supabase"],
    },
    {
      name: "NoorBot",
      status: "Shipped",
      desc: "Telegram bot for Islamic Q&A with sourced citations and prayer reminders. 12k+ users.",
      stack: ["Python", "Telegram", "GPT-4"],
    },
    {
      name: "QueueFlow",
      status: "Shipped",
      desc: "Virtual queueing for clinics in the GCC. Used by 40+ branches.",
      stack: ["Flutter", "Firebase", ".NET"],
    },
    {
      name: "NutriNest",
      status: "Shipped",
      desc: "Macro tracker with image-based meal logging. Personal data lake.",
      stack: ["Next.js", "Vision API"],
    },
    {
      name: "SentinelRisk",
      status: "Building",
      desc: "Real-time AML/KYC risk scoring engine for emerging-market banks.",
      stack: ["C#", ".NET", "Azure"],
    },
    {
      name: "MotoScout",
      status: "Shipped",
      desc: "Used-bike marketplace aggregator for the UAE. Scrapes + scores.",
      stack: ["Python", "Postgres"],
    },
    {
      name: "NeverLate",
      status: "Archived",
      desc: "Calendar guilt-tripper. Killed by Apple's Live Activities.",
      stack: ["Swift", "Firebase"],
    },
  ],
  experience: [
    {
      co: "Yuze Digital",
      role: "Software Engineer",
      when: "Nov 2024 — Present",
      bullets: [
        "Co-built Bank Onboarding Orchestrator APIs in .NET and Azure DevOps, automating OCR-based KYC flows.",
        "Architected Make.com automation pipelines for document expiry alerting using SQL Server, Google Sheets, and SendGrid.",
        "Engineered customer communication infrastructure covering 23 SMS/email templates with SendGrid integration.",
        "Led QA automation for Android app using Maestro and ADB screen capture for AI-assisted test generation.",
      ],
    },
    {
      co: "Kalite Global",
      role: "Finance & Automation Engineer",
      when: "Jan 2023 — Nov 2024",
      bullets: [
        "Automated finance workflows using Power Automate, reducing manual input by 30% across subsidiaries.",
        "Implemented WhatsApp automation for B2B/B2C communication, improving response time by 40%.",
        "Integrated HubSpot CRM for omnichannel support across UAE, Saudi Arabia, and India.",
      ],
    },
    {
      co: "DOTS ERP",
      role: "FinTech Engineer",
      when: "May 2022 — Dec 2022",
      bullets: [
        "Developed FinTech applications increasing payment processing efficiency by 30%.",
        "Built HR and payroll systems in Flutter, reducing processing time by 25%.",
        "Automated financial auditing using Python and Selenium, decreasing processing time by 40%.",
      ],
    },
    {
      co: "SAZN Network",
      role: "Chief Technology Officer & Co-founder",
      when: "Jan 2019 — Jun 2022",
      bullets: [
        "Co-founded and led technical operations of a digital marketing and automation company for 3+ years.",
        "Architected and delivered client-facing web and automation solutions; managed full product delivery lifecycle.",
      ],
    },
  ],
  education: [
    {
      what: "M.Com — International Finance",
      where: "Indira Gandhi National Open University",
      when: "Jan 2023 – Jan 2025",
    },
    {
      what: "BA — Islamic Finance & Business Commerce",
      where: "University of Calicut, SAFI Institute",
      when: "Jul 2019 – Jul 2022",
    },
    {
      what: "Grade 12 — Commerce",
      where: "GEMS Our Own English High School, Sharjah",
      when: "May 2017 – May 2019",
    },
  ],
  certifications: [
    "Entrepreneurship in Emerging Economies — Harvard University",
    "Corporate Finance Fundamentals — CFI",
    "Investment Banking Simulation — JP Morgan Chase",
    "Cloud Engineering — Google Cloud",
    "Azure Fundamentals — Microsoft",
    "Intro to Machine Learning — AWS",
    "Digital Marketing — Google",
    "Financial Reporting for Professionals — Rice University",
    "Managing the Company of the Future — London Business School",
  ],
  research: [
    {
      title: "Role of Islamic Microfinance in Rural Development",
      venue: "SAFI Institute · 2022",
    },
    {
      title: "FinTech: Opportunities and Applications in Islamic Finance",
      venue: "University of Calicut · 2022",
    },
  ],
  extra: [
    "Volunteer · Expo 2020 Dubai",
    "Coordinator · TED Conferences",
    "Walk for Education · Dubai Cares",
    "Volunteer · STEP Conference",
    "United Nations Volunteers",
    "Member · Rotaract",
    "Student Volunteer · Sharjah Book Authority",
    "Volunteer · DigiMarCon Digital Marketing Conference",
  ],
  trash: [
    { nm: "NeverLate", reason: "Calendar guilt app. Apple shipped Live Activities the same week." },
    { nm: "CryptoChores", reason: "Pay your kids in stablecoins. Lawyers said no." },
    { nm: "Halal-GPT", reason: "Folded into NoorBot. Better as a feature than a product." },
    { nm: "DubaiDeals", reason: "Groupon clone. Built it in 2 weeks. Killed it in 1." },
    { nm: "FinFinity", reason: "Personal finance OS. Vaporware twice. Maybe v3." },
  ],
};

export const FAKE_COMMITS = [
  { hash: "a3f2c81", repo: "zee-build/tarbiya-ai", msg: "feat(tutor): stream curriculum-aware responses", t: "2h" },
  { hash: "9e4d12b", repo: "zee-build/sentinel-risk", msg: "fix: edge case in transaction velocity scorer", t: "5h" },
  { hash: "1c8b7a3", repo: "zee-build/noorbot", msg: "chore: bump telegram sdk; cleaner webhook errors", t: "1d" },
  { hash: "f0a91d4", repo: "zee-build/zee.build", msg: "feat(os): add terminal app to dock", t: "1d" },
  { hash: "44c0e2f", repo: "zee-build/queueflow", msg: "perf: drop redundant rebuilds in scheduler", t: "2d" },
];

export const ASCII_LOGO = `   ╔═══════════════════════╗
   ║  Z E E B U I L D  OS  ║
   ║   v2.0  ·  Personal   ║
   ╚═══════════════════════╝`;

export const skillScores: Record<string, number> = {
  ".NET / C#": 95,
  "Python": 90,
  "Next.js / React": 92,
  "Azure": 80,
  "Flutter": 78,
  "Make.com": 88,
  "SQL / Postgres": 85,
};

export type BuildStatus = "Shipped" | "Building" | "Archived";

export interface Build {
  name: string;
  status: BuildStatus;
  desc: string;
  stack: string[];
}
