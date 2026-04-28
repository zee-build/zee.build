"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  { t: 200,  text: "kernel.load", ok: true },
  { t: 500,  text: "mount /builds", ok: true },
  { t: 900,  text: "connect github.com/zee-build", ok: true },
  { t: 1300, text: "hydrate supabase", ok: true },
  { t: 1700, text: "init shader_engine", ok: true },
  { t: 2100, text: "Welcome, Ziyan.", final: true },
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"logo" | "logs" | "flash" | "fadeout">("logo");
  const [logs, setLogs] = useState<typeof BOOT_LINES>([]);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Logo appears with glitch
    timers.push(setTimeout(() => setGlitch(true), 400));
    timers.push(setTimeout(() => setGlitch(false), 550));
    timers.push(setTimeout(() => setGlitch(true), 800));
    timers.push(setTimeout(() => setGlitch(false), 880));

    // Phase 2: Switch to logs
    timers.push(setTimeout(() => setPhase("logs"), 1200));

    // Phase 3: Type out logs
    BOOT_LINES.forEach((l, i) => {
      timers.push(setTimeout(() => setLogs((prev) => [...prev, l]), 1200 + l.t));
    });

    // Phase 4: Flash + fadeout
    timers.push(setTimeout(() => setPhase("flash"), 3500));
    timers.push(setTimeout(() => setPhase("fadeout"), 3600));
    timers.push(setTimeout(onDone, 4000));

    // Skip on interaction (delayed to prevent immediate dismiss)
    const skipTimer = setTimeout(() => {
      const skip = () => {
        setPhase("fadeout");
        setTimeout(onDone, 300);
      };
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("click", skip, { once: true });
    }, 200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(skipTimer);
    };
  }, [onDone]);

  return (
    <div className={`boot ${phase === "fadeout" ? "boot-fadeout" : ""} ${phase === "flash" ? "boot-flash" : ""}`}>
      {/* Glow background */}
      <div className="boot-glow" />

      {/* Logo phase */}
      <div className={`boot-logo-wrap ${phase !== "logo" ? "boot-logo-small" : ""}`}>
        <div className={`boot-logo ${glitch ? "boot-glitch" : ""}`}>
          ZeeBuild
        </div>
        <div className="boot-tag">OS v2.0</div>
      </div>

      {/* Log phase */}
      {(phase === "logs" || phase === "flash" || phase === "fadeout") && (
        <div className="boot-log-wrap">
          {logs.map((l, i) => (
            <div key={i} className={`boot-line ${l.final ? "boot-line-final" : ""}`}>
              <span className="boot-line-prefix">{l.final ? "→" : "›"}</span>
              <span className="boot-line-text">{l.text}</span>
              {l.ok && <span className="boot-line-ok">OK</span>}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="boot-progress">
        <div className={`boot-progress-fill ${phase !== "logo" ? "boot-progress-active" : ""}`} />
      </div>

      <div className="boot-skip">PRESS ANY KEY TO SKIP</div>
    </div>
  );
}
