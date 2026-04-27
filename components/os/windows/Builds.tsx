"use client";

import { useState } from "react";
import { ZB_DATA, Build, BuildStatus } from "@/lib/os-data";

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
        <circle cx="100" cy="45" r="22" fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
        <path d="M100 45 L100 30 M100 45 L114 50" stroke="#8b5cf6" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="100" cy="45" r="3" fill="#8b5cf6" opacity="0.6" />
      </svg>
    ),
    "zee.build": (
      <svg viewBox="0 0 200 90" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <rect x="60" y="20" width="80" height="50" rx="4" fill="none" stroke="#FF8C42" strokeWidth="1.2" />
        <path d="M60 32h80" stroke="#FF8C42" strokeWidth="0.8" opacity="0.5" />
        <circle cx="68" cy="26" r="2" fill="#ff5f57" opacity="0.7" />
        <circle cx="76" cy="26" r="2" fill="#febc2e" opacity="0.7" />
        <circle cx="84" cy="26" r="2" fill="#28c840" opacity="0.7" />
        <path d="M75 48l8-6-8-6" stroke="#FF8C42" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M90 55h30" stroke="#FF8C42" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
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
      <div className="thumb-tag">// {name.toLowerCase().replace(/[\.\s]/g, "-")}.png</div>
    </div>
  );
}

const STATUS_FILTERS: { label: string; value: BuildStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Shipped", value: "Shipped" },
  { label: "Building", value: "Building" },
];

export default function BuildsWindow() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<BuildStatus | "all">("all");

  const filtered = ZB_DATA.builds.filter((b) => {
    const matchesText =
      !q ||
      b.name.toLowerCase().includes(q.toLowerCase()) ||
      b.desc.toLowerCase().includes(q.toLowerCase()) ||
      b.stack.some((s) => s.toLowerCase().includes(q.toLowerCase()));
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const handleCardClick = (b: { url?: string }) => {
    if (b.url) {
      if (b.url.startsWith("http")) {
        window.open(b.url, "_blank", "noopener,noreferrer");
      } else {
        window.open(b.url, "_blank");
      }
    }
  };

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
        <div className="builds-filter-seg">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={statusFilter === f.value ? "on" : ""}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
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
      <div className={view === "grid" ? "builds-grid" : "builds-list"}>
        {filtered.map((b) => (
          <div
            key={b.name}
            className={"build-card" + (b.url ? " clickable" : "")}
            onClick={() => handleCardClick(b)}
            role={b.url ? "link" : undefined}
            tabIndex={b.url ? 0 : undefined}
          >
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
