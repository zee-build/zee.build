"use client";

import { useEffect, useRef } from "react";

export function Wallpaper({ density = 50 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    let raf: number;
    let w = 0, h = 0;

    const resize = () => {
      w = cv.width = window.innerWidth * devicePixelRatio;
      h = cv.height = window.innerHeight * devicePixelRatio;
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const parts = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.6 + 0.4,
      hue: Math.random() < 0.7 ? "orange" : "cyan",
      a: Math.random() * 0.5 + 0.1,
    }));

    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (paused) return;
      ctx.clearRect(0, 0, w, h);

      // grid
      ctx.strokeStyle = "rgba(255, 140, 66, 0.04)";
      ctx.lineWidth = 1;
      const gs = 80 * devicePixelRatio;
      for (let x = 0; x < w; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === "cyan"
          ? `rgba(0, 212, 255, ${p.a})`
          : `rgba(255, 140, 66, ${p.a})`;
        ctx.fill();
      }

      // connect nearby
      ctx.lineWidth = 0.5;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 * devicePixelRatio) {
            ctx.strokeStyle = `rgba(255, 140, 66, ${0.08 * (1 - d / (120 * devicePixelRatio))})`;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.85, pointerEvents: "none" }}
    />
  );
}

export function Cursor() {
  const mainRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    const cv = trailRef.current;
    if (!main || !cv) return;
    const ctx = cv.getContext("2d")!;
    let w = 0, h = 0;

    const resize = () => {
      w = cv.width = window.innerWidth * devicePixelRatio;
      h = cv.height = window.innerHeight * devicePixelRatio;
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: { x: number; y: number; a: number }[] = [];
    const onMove = (e: MouseEvent) => {
      const mx = e.clientX, my = e.clientY;
      main.style.transform = `translate(${mx}px, ${my}px)`;
      trail.push({ x: mx * devicePixelRatio, y: my * devicePixelRatio, a: 1 });
      if (trail.length > 18) trail.shift();
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, w, h);
      for (const p of trail) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * devicePixelRatio * p.a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 140, 66, ${p.a * 0.4})`;
        ctx.fill();
        p.a *= 0.86;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="cursor-layer">
      <canvas ref={trailRef} className="cursor-trail" />
      <div ref={mainRef} className="cursor-main">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#FF8C42" strokeOpacity="0.4" />
          <circle cx="12" cy="12" r="4" stroke="#FF8C42" strokeWidth="1" />
          <line x1="12" y1="0" x2="12" y2="6" stroke="#FF8C42" strokeWidth="1" />
          <line x1="12" y1="18" x2="12" y2="24" stroke="#FF8C42" strokeWidth="1" />
          <line x1="0" y1="12" x2="6" y2="12" stroke="#FF8C42" strokeWidth="1" />
          <line x1="18" y1="12" x2="24" y2="12" stroke="#FF8C42" strokeWidth="1" />
          <circle cx="12" cy="12" r="1" fill="#FF8C42" />
        </svg>
      </div>
    </div>
  );
}
