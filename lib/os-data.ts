// ZeeBuild OS — static data

export type BuildStatus = "Shipped" | "Building" | "Archived";

export interface Build {
  name: string;
  status: BuildStatus;
  desc: string;
  stack: string[];
  url?: string;
  image?: string;
}

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
      status: "Building" as BuildStatus,
      desc: "AI story generator for Muslim kids — values-aligned bedtime stories on demand.",
      stack: ["Next.js", "OpenAI", "Supabase"],
      url: "https://github.com/zee-build/tarbiya-ai",
    },
    {
      name: "NoorBot",
      status: "Shipped" as BuildStatus,
      desc: "Telegram bot for Islamic Q&A with sourced citations and prayer reminders. 12k+ users.",
      stack: ["Python", "Telegram", "GPT-4"],
      url: "https://github.com/zee-build/noorbot",
    },
    {
      name: "QueueFlow",
      status: "Shipped" as BuildStatus,
      desc: "Virtual queueing for clinics in the GCC. Used by 40+ branches.",
      stack: ["Flutter", "Firebase", ".NET"],
      url: "https://github.com/zee-build/queueflow",
    },
    {
      name: "NutriNest",
      status: "Shipped" as BuildStatus,
      desc: "Macro tracker with image-based meal logging. Personal data lake.",
      stack: ["Next.js", "Vision API"],
      url: "/builds/nutrinest",
    },
    {
      name: "SentinelRisk",
      status: "Building" as BuildStatus,
      desc: "Real-time AML/KYC risk scoring engine for emerging-market banks.",
      stack: ["C#", ".NET", "Azure"],
      url: "/builds/sentinelrisk",
    },
    {
      name: "MotoScout",
      status: "Shipped" as BuildStatus,
      desc: "Used-bike marketplace aggregator for the UAE. Scrapes + scores + Telegram alerts.",
      stack: ["Next.js", "Supabase", "Telegram"],
      url: "/motoscout",
    },
    {
      name: "NeverLate",
      status: "Building" as BuildStatus,
      desc: "Life admin OS — track passports, visas, licenses, and family renewals.",
      stack: ["Next.js", "TypeScript", "OCR"],
      url: "/neverlate",
    },
    {
      name: "zee.build",
      status: "Shipped" as BuildStatus,
      desc: "This portfolio OS. macOS-style desktop with draggable windows and WebGL shaders.",
      stack: ["Next.js", "TypeScript", "WebGL"],
      url: "https://github.com/zee-build/zee.build",
    },
  ] as Build[],
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
    { nm: "CryptoChores", reason: "Pay your kids in stablecoins. Lawyers said no." },
    { nm: "Halal-GPT", reason: "Folded into NoorBot. Better as a feature than a product." },
    { nm: "DubaiDeals", reason: "Groupon clone. Built it in 2 weeks. Killed it in 1." },
    { nm: "FinFinity", reason: "Personal finance OS. Vaporware twice. Maybe v3." },
    { nm: "AutoPilot HR", reason: "HR automation tool. Market too crowded. Pivoted to QueueFlow." },
  ],
};

export const FAKE_COMMITS = [
  { hash: "bab0b7d", repo: "zee-build/zee.build", msg: "fix: enhance mobile wallpaper with aurora gradients", t: "1h" },
  { hash: "7493841", repo: "zee-build/zee.build", msg: "fix: improve mobile OS layout and content responsiveness", t: "2h" },
  { hash: "1474e86", repo: "zee-build/zee.build", msg: "feat: add iOS-style mobile home screen", t: "4h" },
  { hash: "2b7098c", repo: "zee-build/zee.build", msg: "feat: implement NeverLate life admin OS", t: "6h" },
  { hash: "6a366fb", repo: "zee-build/zee.build", msg: "feat: implement MotoScout motorcycle aggregator", t: "1d" },
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
