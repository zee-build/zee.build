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
        const all = d.feedback || [];
        const initial = all.map((item: any, i: number) => ({
          id: item.id,
          name: item.name,
          message: item.message.slice(0, 60) + (item.message.length > 60 ? "..." : ""),
          x: 45 + Math.random() * 40,
          y: 10 + (i * 18) % 75,
          opacity: Math.max(0.4, 0.9 - i * 0.06),
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
      setBubbles((prev) => [newBubble, ...prev]);
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
