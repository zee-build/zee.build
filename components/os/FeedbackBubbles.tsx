"use client";

import { useEffect, useState } from "react";

interface Bubble {
  id: string;
  name: string;
  message: string;
  x: number;
  y: number;
  opacity: number;
}

export default function FeedbackBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Load visible feedback from API
  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((d) => {
        const visible = (d.feedback || []).filter((f: any) => f.visible).slice(0, 4);
        const initial = visible.map((item: any, i: number) => ({
          id: item.id,
          name: item.name,
          message: item.message.slice(0, 60) + (item.message.length > 60 ? "..." : ""),
          x: 55 + Math.random() * 25,
          y: 15 + i * 20,
          opacity: 0.75 - i * 0.12,
        }));
        setBubbles(initial);
      })
      .catch(() => {});
  }, []);

  // Listen for new feedback
  useEffect(() => {
    const handler = (e: Event) => {
      const item = (e as CustomEvent).detail;
      const newBubble: Bubble = {
        id: item.id,
        name: item.name,
        message: item.message.slice(0, 60) + (item.message.length > 60 ? "..." : ""),
        x: 50 + Math.random() * 30,
        y: 25 + Math.random() * 35,
        opacity: 1,
      };
      setBubbles((prev) => [newBubble, ...prev].slice(0, 5));
    };
    window.addEventListener("os-feedback", handler);
    return () => window.removeEventListener("os-feedback", handler);
  }, []);

  if (bubbles.length === 0) return null;

  return (
    <div className="feedback-bubbles">
      {bubbles.map((b, i) => (
        <div
          key={b.id}
          className="feedback-bubble"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            opacity: b.opacity,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          <span className="feedback-bubble-name">{b.name}</span>
          <span className="feedback-bubble-msg">{b.message}</span>
        </div>
      ))}
    </div>
  );
}
