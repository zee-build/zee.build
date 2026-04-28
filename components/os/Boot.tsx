"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  { t: 80,   text: "> Initializing ZeeBuild OS v2.0..." },
  { t: 280,  text: "> Loading kernel modules...", ok: true },
  { t: 520,  text: "> Mounting /builds...", ok: true },
  { t: 760,  text: "> Connecting to GitHub...", ok: true },
  { t: 1100, text: "> Hydrating Supabase...", ok: true },
  { t: 1500, text: "> Welcome, Ziyan." },
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [logs, setLogs] = useState<typeof BOOT_LINES>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((l) => {
      timers.push(setTimeout(() => setLogs((prev) => [...prev, l]), l.t));
    });
    timers.push(setTimeout(onDone, 2700));

    // Delay adding skip listener to avoid immediate trigger from the click that opened boot
    const skipTimer = setTimeout(() => {
      const skip = () => onDone();
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("click", skip, { once: true });
    }, 100);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(skipTimer);
    };
  }, [onDone]);

  return (
    <div className="boot">
      <div className="boot-logo">ZeeBuild</div>
      <div className="boot-tag">OS v2.0 — Personal Operating System</div>
      <div className="boot-bar-wrap">
        <div className="boot-bar">
          <div className="boot-bar-fill" />
        </div>
        <div className="boot-log">
          {logs.map((l, i) => (
            <div key={i}>
              {l.text}{" "}
              {l.ok && <span className="ok">[ OK ]</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="boot-skip">PRESS ANY KEY TO SKIP</div>
    </div>
  );
}
