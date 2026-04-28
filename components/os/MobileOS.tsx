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
import FeedbackWindow from "@/components/os/windows/Feedback";

/* ── app registry ─────────────────────────────────────── */
const APPS: { id: string; label: string; render: () => React.ReactNode }[] = [
  { id: "about",    label: "About",    render: () => <AboutWindow /> },
  { id: "builds",   label: "Builds",   render: () => <BuildsWindow /> },
  { id: "resume",   label: "Resume",   render: () => <ResumeWindow /> },
  { id: "contact",  label: "Contact",  render: () => <ContactWindow /> },
  { id: "feedback", label: "Feedback", render: () => <FeedbackWindow /> },
  { id: "terminal", label: "Terminal", render: () => <TerminalWindow /> },
  { id: "notes",    label: "Notes",    render: () => <NotesWindow /> },
  { id: "trash",    label: "Trash",    render: () => <TrashWindow /> },
];

const DOCK_IDS = ["about", "builds", "feedback", "terminal"];

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
      <span className="mob-status-right">●●●● WiFi 🔋</span>
    </div>
  );
}

/* ── today widget ─────────────────────────────────────── */
function TodayWidget() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }));
  }, []);

  return (
    <div className="mob-today">
      <div className="mob-today-date">{date}</div>
      <div className="mob-today-greeting">Welcome back.</div>
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
        <div className="mob-sheet-header">
          <button className="mob-sheet-back" onClick={dismiss}>
            ‹ Home
          </button>
          <span className="mob-sheet-title">{app.label}</span>
          <span className="mob-sheet-spacer" />
        </div>
        <div className="mob-sheet-pill" />
        <div className="mob-sheet-body" ref={bodyRef}>
          {app.render()}
        </div>
      </div>
    </div>
  );
}

/* ── mobile boot sequence (upgraded) ──────────────────── */
function MobileBoot({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"logo" | "loading" | "fade">("logo");
  const [progress, setProgress] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Glitch effect on logo
    timers.push(setTimeout(() => setGlitch(true), 300));
    timers.push(setTimeout(() => setGlitch(false), 420));
    timers.push(setTimeout(() => setGlitch(true), 700));
    timers.push(setTimeout(() => setGlitch(false), 780));

    // Start loading phase
    timers.push(setTimeout(() => setPhase("loading"), 1000));

    // Progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 12 + 4;
      });
    }, 150);

    // Fade out and done
    timers.push(setTimeout(() => setPhase("fade"), 3200));
    timers.push(setTimeout(onDone, 3600));

    // Tap to skip (delayed)
    const skipTimer = setTimeout(() => {
      const skip = () => {
        setPhase("fade");
        setTimeout(onDone, 300);
      };
      window.addEventListener("touchstart", skip, { once: true });
    }, 200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(skipTimer);
      clearInterval(interval);
    };
  }, [onDone]);

  return (
    <div className={`mob-boot ${phase === "fade" ? "mob-boot-fade" : ""}`}>
      <div className="mob-boot-glow" />
      <div className={`mob-boot-logo ${glitch ? "mob-boot-glitch" : ""}`}>
        ZeeBuild
      </div>
      <div className="mob-boot-sub">OS v2.0 · Personal</div>
      {phase !== "logo" && (
        <div className="mob-boot-bar">
          <div
            className="mob-boot-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
      <div className="mob-boot-skip">TAP TO SKIP</div>
    </div>
  );
}

/* ── main component ───────────────────────────────────── */
export default function MobileOS() {
  const [booting, setBooting] = useState(true);
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [recent, setRecent] = useState<Set<string>>(new Set());
  const [pressed, setPressed] = useState<string | null>(null);

  const launch = (id: string) => {
    setPressed(id);
    setTimeout(() => {
      setRecent((prev) => new Set(prev).add(id));
      setOpenApp(id);
      setPressed(null);
    }, 100);
  };

  const activeApp = APPS.find((a) => a.id === openApp) ?? null;

  if (booting) {
    return <MobileBoot onDone={() => setBooting(false)} />;
  }

  return (
    <div className="mob-root">
      <div className="mob-wallpaper" />

      <StatusBar />

      {/* wordmark */}
      <div className="mob-wordmark">ZeeBuild OS</div>

      {/* Today widget */}
      <TodayWidget />

      {/* app grid */}
      <div className="mob-grid">
        {APPS.map((app) => (
          <button
            key={app.id}
            className={`mob-icon-cell ${pressed === app.id ? "mob-icon-pressed" : ""}`}
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
          {DOCK_IDS.map((id) => (
            <button
              key={id}
              className="mob-dock-icon"
              onClick={() => launch(id)}
            >
              <Glyph kind={id} />
              {recent.has(id) && <span className="mob-dock-dot" />}
            </button>
          ))}
        </div>
        {/* Home indicator */}
        <div className="mob-home-indicator" />
      </div>

      {/* sheet */}
      {activeApp && (
        <Sheet app={activeApp} onClose={() => setOpenApp(null)} />
      )}
    </div>
  );
}
