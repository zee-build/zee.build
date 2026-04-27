"use client";

import { useState } from "react";
import { ZB_DATA, Build } from "@/lib/os-data";

function BuildThumb({ name, status }: { name: string; status: string }) {
  const isCyan = status === "Building";
  const initials = name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();

  const shapes: Record<string, React.ReactNode> = {
    "tarbiya.ai": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="100" cy="45" r="22" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
        <circle cx="100" cy="45" r="14" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.7" />
        <circle cx="100" cy="45" r="6" fill="#00d4ff" opacity="0.6" />
      </svg>
    ),
    "NoorBot": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M40 60 Q100 20 160 60" fill="none" stroke="#FF8C42" strokeWidth="1.2" opacity="0.7" />
        <circle cx="60" cy="50" r="2" fill="#FF8C42" />
        <circle cx="140" cy="50" r="2" fill="#FF8C42" />
        <path d="M70 65l-6 8h12z" fill="#FF8C42" opacity="0.4" />
      </svg>
    ),
    "QueueFlow": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={50 + i * 22} y={30 + i * 4} width="14" height="30" fill="none" stroke="#FF8C42" strokeWidth="1" opacity={0.3 + i * 0.13} />
        ))}
      </svg>
    ),
    "NutriNest": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="100" cy="45" r="20" fill="none" stroke="#FF8C42" strokeWidth="1.2" />
        <path d="M85 45 a15 15 0 0 1 30 0" fill="#FF8C42" opacity="0.4" />
        <path d="M85 45 L115 45" stroke="#FF8C42" strokeWidth="0.8" opacity="0.6" />
      </svg>
    ),
    "SentinelRisk": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M100 20 L130 35 L130 60 L100 75 L70 60 L70 35 Z" fill="none" stroke="#00d4ff" strokeWidth="1.2" />
        <path d="M88 47 L97 56 L114 38" fill="none" stroke="#00d4ff" strokeWidth="1.4" />
      </svg>
    ),
    "MotoScout": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="65" cy="55" r="14" fill="none" stroke="#FF8C42" strokeWidth="1.2" />
        <circle cx="135" cy="55" r="14" fill="none" stroke="#FF8C42" strokeWidth="1.2" />
        <path d="M65 55 L90 35 L120 35 L135 55" fill="none" stroke="#FF8C42" strokeWidth="1.2" />
      </svg>
    ),
    "NeverLate": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <circle cx="100" cy="45" r="22" fill="none" stroke="#666" strokeWidth="1.2" />
        <path d="M100 45 L100 30 M100 45 L114 50" stroke="#666" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="78" y1="23" x2="122" y2="67" stroke="#ff4757" strokeWidth="1.2" opacity="0.6" />
      </svg>
    ),
  };

  return (
    <div className="thumb">
      <div className="thumb-grid" />
      <div className={`thumb-glow${isCyan ? " cy" : ""}`} />
      {shapes[name]}
      <div className={`thumb-art${isCyan ? " cy" : ""}`} style={{ position: "absolute", right: 10, top: 8, fontSize: 13, opacity: 0.85 }}>
        {initials}
      </div>
      <div className="thumb-tag">// {name.toLowerCase().replace(/\./g, "-")}.png</div>
    </div>
  );
}

export default function BuildsWindow() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");

  const filtered = ZB_DATA.builds.filter(
    (b) =>
      !q ||
      b.name.toLowerCase().includes(q.toLowerCase()) ||
      b.stack.some((s) => s.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="builds">
      <div className="builds-toolbar">
        <span className="label">{filtered.length} BUILDS</span>
        <div className="seg">
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>
            ▦ Grid
          </button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>
            ≡ List
          </button>
        </div>
        <div className="builds-search">
          <span style={{ color: "var(--accent)" }}>›</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="filter..."
          />
        </div>
      </div>
      <div className="builds-grid">
        {filtered.map((b) => (
          <div key={b.name} className="build-card">
            <BuildThumb name={b.name} status={b.status} />
            <div className="name">
              {b.name}
              <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
            </div>
            <div className="desc">{b.desc}</div>
            <div className="stack">
              {b.stack.map((s) => (
                <span key={s} className="chip dim">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
