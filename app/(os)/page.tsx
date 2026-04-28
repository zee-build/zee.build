"use client";

import { useCallback, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileOS from "@/components/os/MobileOS";
import BootSequence from "@/components/os/Boot";
import { Wallpaper, Cursor } from "@/components/os/Wallpaper";
import ShaderWallpaper, { WallpaperType } from "@/components/os/ShaderWallpaper";
import OsWindow from "@/components/os/Window";
import { Menubar, DesktopIcons, Dock } from "@/components/os/Chrome";
import TweaksPanel from "@/components/os/TweaksPanel";
import AboutWindow from "@/components/os/windows/About";
import BuildsWindow from "@/components/os/windows/Builds";
import ResumeWindow from "@/components/os/windows/Resume";
import ContactWindow from "@/components/os/windows/Contact";
import TerminalWindow from "@/components/os/windows/Terminal";
import TrashWindow from "@/components/os/windows/Trash";
import NotesWindow from "@/components/os/windows/Notes";
import NotepadWindow from "@/components/os/windows/Notepad";
import FeedbackWindow from "@/components/os/windows/Feedback";
import FeedbackBubbles from "@/components/os/FeedbackBubbles";
import FeedbackPrompt from "@/components/os/FeedbackPrompt";
import NotificationCenter from "@/components/os/NotificationCenter";
import PhotoWidget from "@/components/os/PhotoWidget";
import Image from "next/image";

interface WinState {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized?: boolean;
}

const APP_REGISTRY: Record<string, {
  title: string;
  meta: string;
  w: number;
  h: number;
  render: () => React.ReactNode;
}> = {
  about:    { title: "About Ziyan",                   meta: "~/about",       w: 760, h: 500, render: () => <AboutWindow /> },
  builds:   { title: "My Builds",                     meta: "~/builds",      w: 820, h: 560, render: () => <BuildsWindow /> },
  resume:   { title: "Resume — Ziyan Bin Anoos.pdf",  meta: "PDF · 2 pages", w: 780, h: 540, render: () => <ResumeWindow /> },
  contact:  { title: "Contact",                       meta: "~/contact",     w: 720, h: 500, render: () => <ContactWindow /> },
  terminal: { title: "terminal — zsh",                meta: "80×24",         w: 720, h: 460, render: () => <TerminalWindow /> },
  trash:    { title: "Trash — Archived Ideas",        meta: "5 items",       w: 700, h: 460, render: () => <TrashWindow /> },
  notes:    { title: "Notes",                         meta: "~/notes",       w: 800, h: 520, render: () => <NotesWindow /> },
  photo:    { title: "My Corner",                     meta: "photo.jpeg",    w: 520, h: 600, render: () => (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000" }}>
      <Image src="/os/mycorner.jpeg" alt="My Corner" fill style={{ objectFit: "contain" }} sizes="520px" />
    </div>
  )},
  photo2:   { title: "Bike",                          meta: "bike.jpeg",     w: 520, h: 400, render: () => (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000" }}>
      <Image src="/os/bike.jpeg" alt="Bike" fill style={{ objectFit: "contain" }} sizes="520px" />
    </div>
  )},
  photo3:   { title: "Me",                            meta: "small-me.jpeg", w: 420, h: 520, render: () => (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000" }}>
      <Image src="/os/small-me.jpeg" alt="Me" fill style={{ objectFit: "contain" }} sizes="420px" />
    </div>
  )},
  notepad:  { title: "My Notepad",                    meta: "private",       w: 700, h: 480, render: () => <NotepadWindow /> },
  feedback: { title: "Feedback",                      meta: "public",        w: 480, h: 420, render: () => <FeedbackWindow /> },
};

const ALL_APP_IDS = Object.keys(APP_REGISTRY);

export default function OSPage() {
  const isMobile = useIsMobile();
  const [booting, setBooting] = useState(true);
  const [windows, setWindows] = useState<WinState[]>([]);
  const [zCounter, setZCounter] = useState(10);
  const [focused, setFocused] = useState<string | null>(null);

  // Tweaks state
  const [accentMode, setAccentMode] = useState("orange");
  const [wallpaperType, setWallpaperType] = useState<WallpaperType>("aurora");
  const [particleDensity, setParticleDensity] = useState(50);
  const [showCursor, setShowCursor] = useState(true);
  const [showTweaks, setShowTweaks] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [adminMode, setAdminMode] = useState(false);

  // Apply accent CSS vars
  useEffect(() => {
    const root = document.documentElement;
    if (accentMode === "cyan") {
      root.style.setProperty("--accent", "#00d4ff");
      root.style.setProperty("--accent-soft", "rgba(0, 212, 255, 0.18)");
      root.style.setProperty("--accent-glow", "rgba(0, 212, 255, 0.4)");
      root.style.setProperty("--hairline-warm", "rgba(0, 212, 255, 0.2)");
    } else {
      root.style.setProperty("--accent", "#FF8C42");
      root.style.setProperty("--accent-soft", "rgba(255, 140, 66, 0.15)");
      root.style.setProperty("--accent-glow", "rgba(255, 140, 66, 0.35)");
      root.style.setProperty("--hairline-warm", "rgba(255, 140, 66, 0.18)");
    }
  }, [accentMode]);

  // Ping visitor counter
  useEffect(() => {
    fetch("/api/visitors", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setVisitorCount(d.active))
      .catch(() => {});
    const interval = setInterval(() => {
      fetch("/api/visitors")
        .then((r) => r.json())
        .then((d) => setVisitorCount(d.active))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for custom app-open events (from terminal)
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      if (id && APP_REGISTRY[id]) openApp(id);
    };
    const adminHandler = () => setAdminMode(true);
    window.addEventListener("os-open-app", handler);
    window.addEventListener("os-admin-unlock", adminHandler);
    // Check if already admin
    if (sessionStorage.getItem("zb-admin") === "1") setAdminMode(true);
    return () => {
      window.removeEventListener("os-open-app", handler);
      window.removeEventListener("os-admin-unlock", adminHandler);
    };
  });

  const openApp = useCallback((id: string) => {
    if (id === "home") { setWindows([]); setFocused(null); return; }

    const existing = windows.find((w) => w.id === id);
    if (existing) {
      setZCounter((z) => z + 1);
      setFocused(id);
      setWindows((ws) =>
        ws.map((w) => w.id === id ? { ...w, z: zCounter + 1, minimized: false } : w)
      );
      return;
    }

    const cfg = APP_REGISTRY[id];
    if (!cfg) return;
    const offset = windows.length * 24;
    const x = Math.max(40, (window.innerWidth - cfg.w) / 2 + offset - 40);
    const y = Math.max(60, (window.innerHeight - cfg.h) / 2 + offset - 60);
    const newZ = zCounter + 1;
    setZCounter(newZ);
    setFocused(id);
    setWindows((ws) => [...ws, { id, x, y, w: cfg.w, h: cfg.h, z: newZ }]);
  }, [windows, zCounter]);

  const closeWin = (id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    if (focused === id) setFocused(null);
  };

  const minWin = (id: string) =>
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, minimized: true } : w));

  const focusWin = (id: string) => {
    setZCounter((z) => z + 1);
    setFocused(id);
    setWindows((ws) => ws.map((w) => w.id === id ? { ...w, z: zCounter + 1 } : w));
  };

  const openAll = () => {
    ALL_APP_IDS.forEach((id, i) => setTimeout(() => openApp(id), i * 80));
  };

  const openBoot = useCallback(() => setBooting(true), []);
  const doneBoot = useCallback(() => setBooting(false), []);

  const openApps = windows.filter((w) => !w.minimized).map((w) => w.id);
  const activeTitle = focused ? (APP_REGISTRY[focused]?.title ?? "Finder") : "Finder";

  /* ── Mobile: skip boot, render iOS-style home ── */
  if (isMobile) return <MobileOS />;

  return (
    <div className="os-root">
      {/* Wallpaper */}
      {wallpaperType === "particles"
        ? <Wallpaper density={particleDensity} />
        : <ShaderWallpaper type={wallpaperType} />
      }

      {/* OS Chrome */}
      <Menubar activeApp={activeTitle} />
      <DesktopIcons onOpen={openApp} adminMode={adminMode} />

      {/* Windows */}
      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          const cfg = APP_REGISTRY[w.id];
          if (!cfg) return null;
          return (
            <div key={w.id} style={{ position: "absolute", zIndex: w.z }}>
              <OsWindow
                id={w.id}
                title={cfg.title}
                meta={cfg.meta}
                x={w.x} y={w.y} w={w.w} h={w.h}
                focused={focused === w.id}
                unfocused={focused !== null && focused !== w.id}
                onFocus={() => focusWin(w.id)}
                onClose={() => closeWin(w.id)}
                onMin={() => minWin(w.id)}
              >
                {cfg.render()}
              </OsWindow>
            </div>
          );
        })}

      {/* Dock */}
      <Dock onOpen={openApp} openApps={openApps} />

      {/* Feedback bubbles */}
      <FeedbackBubbles />

      {/* Feedback prompt (appears after 30s) */}
      <FeedbackPrompt onOpen={() => openApp("feedback")} />

      {/* Photo widget */}
      <PhotoWidget onClick={(id) => openApp(id)} />

      {/* Custom cursor */}
      {showCursor && <Cursor />}

      {/* Notification Center */}
      <NotificationCenter open={showNotifs} onClose={() => setShowNotifs(false)} />

      {/* Notification bell */}
      <button
        onClick={() => setShowNotifs((v) => !v)}
        style={{
          position: "fixed", top: 14, right: 90, zIndex: 150,
          padding: "8px 12px", borderRadius: 999,
          background: "rgba(13,13,16,0.7)", border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)", color: "var(--text-dim)",
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
          cursor: "none", transition: "color 0.15s",
          display: "flex", alignItems: "center", gap: 6,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
      >
        🔔 {visitorCount > 0 && <span style={{ color: "var(--accent)" }}>{visitorCount}</span>}
      </button>

      {/* Boot sequence */}
      {booting && <BootSequence onDone={doneBoot} />}

      {/* Tweaks toggle button */}
      <button
        onClick={() => setShowTweaks((v) => !v)}
        style={{
          position: "fixed", top: 14, right: 16, zIndex: 150,
          padding: "8px 14px", borderRadius: 999,
          background: "rgba(13,13,16,0.7)", border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)", color: "var(--text-dim)",
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
          cursor: "none", transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
      >
        Tweaks
      </button>

      {/* Tweaks panel */}
      {showTweaks && (
        <TweaksPanel
          accentMode={accentMode}
          setAccent={setAccentMode}
          wallpaperType={wallpaperType}
          setWallpaperType={setWallpaperType}
          particleDensity={particleDensity}
          setParticleDensity={setParticleDensity}
          showCursor={showCursor}
          setShowCursor={setShowCursor}
          onReplayBoot={openBoot}
          onOpenAll={openAll}
          onCloseAll={() => { setWindows([]); setFocused(null); }}
        />
      )}
    </div>
  );
}
