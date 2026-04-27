"use client";

import { useState } from "react";

interface NoteEntry {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  content: string;
}

const NOTES: NoteEntry[] = [
  {
    slug: "building-zeebuild-os",
    title: "Building ZeeBuild OS",
    date: "April 2026",
    readTime: "3 min",
    content: `I wanted my portfolio to feel different. Not another grid of cards with hover effects. Something that shows I actually build things.

**The Idea** — What if your portfolio was an operating system? Draggable windows, a dock, a terminal that actually works.

**Stack** — Next.js 15, pure CSS transitions (no Framer Motion in the OS layer), WebGL shaders for wallpapers, TypeScript strict.

**The Terminal** — It actually processes commands: \`whoami\`, \`ls builds\`, \`cat about\`, \`sudo hire me\`. Command history, cursor blinking, real output formatting.

**Mobile** — Built a completely separate iOS-style home screen. Same content, different UX. CSS gradient wallpaper instead of WebGL. Swipe-to-dismiss sheets.

**What I Learned** — Z-index management is window management. Focus states are window focus. The hardest part wasn't the code — it was making it feel right.`,
  },
  {
    slug: "motoscout-scraping",
    title: "MotoScout: Ethical Scraping",
    date: "April 2026",
    readTime: "2 min",
    content: `MotoScout monitors Dubizzle and Facebook Marketplace for motorcycle listings. Building it taught me where the line is.

**Architecture** — GitHub Actions runs scanners every 30 min. Dubizzle: fetch HTML → parse with cheerio → upsert to Supabase → Telegram alert. Facebook: attempt fetch → gracefully handle blocks.

**What Works** — Dubizzle is scraping-friendly. Semantic HTML, reasonable rate limits, public data. Random jitter keeps it reliable.

**What Doesn't** — Facebook blocks everything. No bypass, no captcha solving. Items get marked BLOCKED. This is by design.

**Key Decisions** — Rate limiting with 1-3s jitter. Deduplication by URL. Graceful degradation. Telegram over email for instant alerts.`,
  },
  {
    slug: "fintech-to-fullstack",
    title: "From FinTech to Full-Stack",
    date: "March 2026",
    readTime: "4 min",
    content: `My career started in Islamic finance — microfinance research, corporate compliance, payment processing. But I kept gravitating toward the engineering side.

**The Finance Years** — Built FinTech apps at DOTS ERP (30% faster payments). Automated workflows at Kalite Global across 3 countries.

**The Pivot** — At Yuze Digital, the role became "Software Engineer." Bank onboarding APIs in .NET, automation pipelines, mobile QA.

**What Finance Taught Me:**
• Precision matters — rounding errors cascade in both finance and distributed systems
• Compliance is architecture — KYC/AML rules are business logic with legal consequences
• Automation is leverage — every manual process freed someone for higher-value work
• Data integrity is non-negotiable

**Now** — Shipping across the full stack. tarbiya.ai, NoorBot (12k+ users), QueueFlow (40+ branches). Each one solves a real problem.`,
  },
];

export default function NotesWindow() {
  const [selected, setSelected] = useState<string | null>(null);

  const activeNote = NOTES.find((n) => n.slug === selected);

  return (
    <div className="notes">
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">
          <span className="notes-count">{NOTES.length} Notes</span>
        </div>
        {NOTES.map((note) => (
          <button
            key={note.slug}
            className={`notes-item${selected === note.slug ? " active" : ""}`}
            onClick={() => setSelected(note.slug)}
          >
            <div className="notes-item-title">{note.title}</div>
            <div className="notes-item-meta">
              {note.date} · {note.readTime}
            </div>
            <div className="notes-item-preview">
              {note.content.slice(0, 80)}...
            </div>
          </button>
        ))}
      </div>
      <div className="notes-content">
        {activeNote ? (
          <>
            <div className="notes-content-header">
              <h1>{activeNote.title}</h1>
              <span className="notes-content-meta">
                {activeNote.date} · {activeNote.readTime} read
              </span>
            </div>
            <div className="notes-content-body">
              {activeNote.content.split("\n\n").map((para, i) => {
                if (para.startsWith("**") && para.includes("—")) {
                  const [bold, rest] = para.split("—", 2);
                  return (
                    <p key={i}>
                      <strong>{bold.replace(/\*\*/g, "")}</strong>
                      {rest ? `— ${rest}` : ""}
                    </p>
                  );
                }
                if (para.startsWith("•")) {
                  return (
                    <ul key={i}>
                      {para.split("\n").map((line, j) => (
                        <li key={j}>{line.replace(/^• /, "")}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{para.replace(/\*\*/g, "")}</p>;
              })}
            </div>
          </>
        ) : (
          <div className="notes-empty">
            <div className="notes-empty-icon">📝</div>
            <p>Select a note to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
