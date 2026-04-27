"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Glyph } from "@/components/os/Chrome";
import AboutWindow from "@/components/os/windows/About";
import BuildsWindow from "@/components/os/windows/Builds";
import ResumeWindow from "@/components/os/windows/Resume";
import ContactWindow from "@/components/os/windows/Contact";
import TerminalWindow from "@/components/os/windows/Terminal";
import TrashWindow from "@/components/os/windows/Trash";
import NotesWindow from "@/components/os/windows/Notes";

/* ── app registry ─────────────────────────────────────── */
const APPS: { id: string; label: string; render: () => React.ReactNode }[] = [
  { id: "about",    label: "About",    render: () => <AboutWindow /> },
  { id: "builds",   label: "Builds",   render: () => <BuildsWindow /> },
  { id: "resume",   label: "Resume",   render: () => <ResumeWindow /> },
  { id: "contact",  label: "Contact",  render: () => <ContactWindow /> },
  { id: "terminal", label: "Terminal", render: () => <TerminalWindow /> },
  { id: "notes",    label: "Notes",    render: () => <NotesWindow /> },
  { id: "trash",    label: "Trash",    render: () => <TrashWindow /> },
];

const DOCK_IDS = ["about", "builds", "contact", "terminal"];

/* ── status bar ───────────────────────────────────────── */
function StatusBar() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mob-status">
      <span className="mob-status-time">{time ?? "\u00A0"}</span>
      <span className="mob-status-right">●●●● WiFi 🔋87%</span>
    </div>
  );
}

/* ── full-screen sheet ────────────────────────────────── */
function Sheet({
  app,
  onClose,
}: {
  app: (typeof APPS)[number];
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const touchRef = useRef({ startY: 0, scrollTop: 0 });
  const bodyRef = useRef<HTMLDivElement>(null);

  /* slide in on mount */
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setDragY(0);
  }, []);

  const handleTransitionEnd = () => {
    if (!visible) onClose();
  };

  /* swipe-to-dismiss */
  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.scrollTop = bodyRef.current?.scrollTop ?? 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - touchRef.current.startY;
    if (touchRef.current.scrollTop === 0 && dy > 0) {
      setDragY(dy);
    }
  };

  const onTouchEnd = () => {
    if (dragY > 80) {
      dismiss();
    } else {
      setDragY(0);
    }
  };

  const ty = visible ? dragY : window.innerHeight;

  return (
    <div
      className="mob-sheet-backdrop"
      style={{ opacity: visible && dragY === 0 ? 1 : visible ? 1 - dragY / 400 : 0 }}
    >
      <div
        className="mob-sheet"
        style={{
          transform: `translateY(${ty}px)`,
          transition: dragY > 0 ? "none" : undefined,
        }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* header */}
        <div className="mob-sheet-header">
          <button className="mob-sheet-back" onClick={dismiss}>
            ‹ Home
          </button>
          <span className="mob-sheet-title">{app.label}</span>
          <span className="mob-sheet-spacer" />
        </div>

        {/* pull indicator */}
        <div className="mob-sheet-pill" />

        {/* body */}
        <div className="mob-sheet-body" ref={bodyRef}>
          {app.render()}
        </div>
      </div>
    </div>
  );
}

/* ── main component ───────────────────────────────────── */
export default function MobileOS() {
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [recent, setRecent] = useState<Set<string>>(new Set());

  const launch = (id: string) => {
    setRecent((prev) => new Set(prev).add(id));
    setOpenApp(id);
  };

  const activeApp = APPS.find((a) => a.id === openApp) ?? null;

  return (
    <div className="mob-root">
      {/* CSS gradient wallpaper */}
      <div className="mob-wallpaper" />

      <StatusBar />

      {/* wordmark */}
      <div className="mob-wordmark">ZeeBuild OS</div>

      {/* app grid — 2×3 */}
      <div className="mob-grid">
        {APPS.map((app) => (
          <button
            key={app.id}
            className="mob-icon-cell"
            onClick={() => launch(app.id)}
          >
            <div className="mob-icon-box">
              <Glyph kind={app.id} />
            </div>
            <span className="mob-icon-label">{app.label}</span>
          </button>
        ))}
      </div>

      {/* dock */}
      <div className="mob-dock">
        <div className="mob-dock-pill">
          {DOCK_IDS.map((id) => {
            const app = APPS.find((a) => a.id === id)!;
            return (
              <button
                key={id}
                className="mob-dock-icon"
                onClick={() => launch(id)}
              >
                <Glyph kind={id} />
                {recent.has(id) && <span className="mob-dock-dot" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* sheet */}
      {activeApp && (
        <Sheet app={activeApp} onClose={() => setOpenApp(null)} />
      )}
    </div>
  );
}
