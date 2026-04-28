"use client";

import { useEffect, useState } from "react";
import { FeedbackItem, getFeedbackItems } from "./windows/Feedback";

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

  // Load existing feedback as initial bubbles (show last 3)
  useEffect(() => {
    const items = getFeedbackItems().slice(0, 3);
    const initial = items.map((item, i) => ({
      id: item.id,
      name: item.name,
      message: item.message.slice(0, 60) + (item.message.length > 60 ? "..." : ""),
      x: 60 + Math.random() * 20,
      y: 20 + i * 25,
      opacity: 0.7 - i * 0.15,
    }));
    setBubbles(initial);
  }, []);

  // Listen for new feedback
  useEffect(() => {
    const handler = (e: Event) => {
      const item = (e as CustomEvent<FeedbackItem>).detail;
      const newBubble: Bubble = {
        id: item.id,
        name: item.name,
        message: item.message.slice(0, 60) + (item.message.length > 60 ? "..." : ""),
        x: 50 + Math.random() * 30,
        y: 30 + Math.random() * 40,
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
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <span className="feedback-bubble-name">{b.name}</span>
          <span className="feedback-bubble-msg">{b.message}</span>
        </div>
      ))}
    </div>
  );
}
