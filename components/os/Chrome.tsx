"use client";

import { useEffect, useState } from "react";

type Tone = "orange" | "cyan" | "danger" | undefined;

export function Glyph({ kind, tone }: { kind: string; tone?: Tone }) {
  const stroke =
    tone === "cyan" ? "#00d4ff" : tone === "danger" ? "#ff4757" : "#FF8C42";
  const fill =
    tone === "cyan"
      ? "rgba(0,212,255,0.12)"
      : tone === "danger"
      ? "rgba(255,71,87,0.12)"
      : "rgba(255,140,66,0.12)";

  const icons: Record<string, React.ReactNode> = {
    about: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <path d="M3 8 h10 l2 2 h14 v18 h-26 z" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <circle cx="16" cy="17" r="3" stroke={stroke} strokeWidth="1.3" fill="none" />
        <path d="M10 25c1.5-3 3.5-4 6-4s4.5 1 6 4" stroke={stroke} strokeWidth="1.3" fill="none" />
      </svg>
    ),
    builds: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <path d="M3 8 h10 l2 2 h14 v18 h-26 z" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <path d="M10 16l6-3 6 3-6 3z" stroke={stroke} strokeWidth="1.2" fill="none" />
        <path d="M10 20l6 3 6-3" stroke={stroke} strokeWidth="1.2" fill="none" />
        <path d="M10 24l6 3 6-3" stroke={stroke} strokeWidth="1.2" fill="none" opacity="0.5" />
      </svg>
    ),
    resume: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <path d="M7 3h14l5 5v21H7z" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <path d="M21 3v5h5" stroke={stroke} strokeWidth="1.3" />
        <path d="M11 14h12M11 18h12M11 22h8M11 10h5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    contact: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <rect x="4" y="8" width="24" height="17" rx="1" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <path d="M4 9l12 9 12-9" stroke={stroke} strokeWidth="1.4" fill="none" />
        <path d="M4 24l9-7M28 24l-9-7" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
      </svg>
    ),
    terminal: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <rect x="3" y="5" width="26" height="22" rx="1" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <path d="M3 9h26" stroke={stroke} strokeWidth="1" opacity="0.5" />
        <circle cx="7" cy="7" r="0.8" fill={stroke} />
        <circle cx="10" cy="7" r="0.8" fill={stroke} opacity="0.5" />
        <circle cx="13" cy="7" r="0.8" fill={stroke} opacity="0.5" />
        <path d="M8 14l4 3-4 3" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M14 22h10" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <path d="M5 9h22" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 9V5h10v4" stroke={stroke} strokeWidth="1.4" fill="none" />
        <path d="M7 9l1.5 19h15L25 9z" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <path d="M13 14v10M16 14v10M19 14v10" stroke={stroke} strokeWidth="1.1" opacity="0.7" />
      </svg>
    ),
    home: (
      <svg viewBox="0 0 32 32" fill="none" width={48} height={48}>
        <path d="M5 14L16 5l11 9v13H5z" stroke={stroke} strokeWidth="1.4" fill={fill} />
        <path d="M13 27v-7h6v7" stroke={stroke} strokeWidth="1.3" fill="none" />
      </svg>
    ),
  };

  return <div className="glyph">{icons[kind] ?? null}</div>;
}

export function Menubar({ activeApp }: { activeApp: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";
  const date = now
    ? now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
    : "";

  return (
    <div className="menubar">
      <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
        <div className="menubar-os">ZeeBuild</div>
        <div className={`menubar-tab active`}>{activeApp || "Finder"}</div>
        {["File", "View", "Window", "Help"].map((m) => (
          <div key={m} className="menubar-tab">{m}</div>
        ))}
      </div>
      <div className="menubar-right">
        <div className="menubar-stat">
          <span className="dot" />
          ONLINE
        </div>
        <div className="menubar-stat">
          <span className="dot cyan" />
          GH:LIVE
        </div>
        <div>BAT 87%</div>
        <div className="menubar-clock">{date} · {time}</div>
      </div>
    </div>
  );
}

const DESKTOP_ITEMS = [
  { id: "about",    label: "About/",      kind: "about" },
  { id: "builds",   label: "Builds/",     kind: "builds" },
  { id: "resume",   label: "resume.pdf",  kind: "resume" },
  { id: "contact",  label: "Contact.app", kind: "contact" },
  { id: "terminal", label: "Terminal",    kind: "terminal", tone: "cyan" as Tone },
  { id: "trash",    label: "Trash/",      kind: "trash",    tone: "danger" as Tone },
];

export function DesktopIcons({ onOpen }: { onOpen: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);

  return (
    <>
      <div className="desk-icon-hint">// Double-click to open</div>
      <div className="desktop-icons">
        {DESKTOP_ITEMS.map((it) => (
          <button
            key={it.id}
            className={"desk-icon" + (sel === it.id ? " sel" : "")}
            onClick={() => setSel(it.id)}
            onDoubleClick={() => onOpen(it.id)}
          >
            <div className="desk-icon-img">
              <Glyph kind={it.kind} tone={it.tone} />
            </div>
            <div className="desk-icon-label">{it.label}</div>
          </button>
        ))}
      </div>
    </>
  );
}

const DOCK_ITEMS = [
  { id: "home",     label: "Desktop",  kind: "home" },
  { id: "about",    label: "About",    kind: "about" },
  { id: "builds",   label: "Builds",   kind: "builds" },
  { id: "resume",   label: "Resume",   kind: "resume" },
  { id: "contact",  label: "Contact",  kind: "contact" },
  { id: "terminal", label: "Terminal", kind: "terminal", tone: "cyan" as Tone },
  { id: "divider" },
  { id: "trash",    label: "Trash",    kind: "trash", tone: "danger" as Tone },
];

export function Dock({
  onOpen,
  openApps,
}: {
  onOpen: (id: string) => void;
  openApps: string[];
}) {
  return (
    <div className="dock-wrap">
      <div className="dock">
        {DOCK_ITEMS.map((it, i) =>
          it.id === "divider" ? (
            <div key={i} className="dock-divider" />
          ) : (
            <button
              key={it.id}
              className={"dock-item" + (openApps.includes(it.id) ? " open" : "")}
              onClick={() => onOpen(it.id!)}
            >
              <Glyph kind={it.kind!} tone={it.tone} />
              <span className="dock-tooltip">{it.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
