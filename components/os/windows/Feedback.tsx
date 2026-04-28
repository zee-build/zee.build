"use client";

import { useState } from "react";

const STORAGE_KEY = "zb-feedback";

export interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export function getFeedbackItems(): FeedbackItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveFeedback(items: FeedbackItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function FeedbackWindow() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const item: FeedbackItem = {
      id: Date.now().toString(36),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const existing = getFeedbackItems();
    saveFeedback([item, ...existing]);

    // Dispatch event for bubble animation
    window.dispatchEvent(new CustomEvent("os-feedback", { detail: item }));

    setSubmitted(true);
    setName("");
    setMessage("");

    setTimeout(() => setSubmitted(false), 4000);
  };

  if (submitted) {
    return (
      <div className="feedback submitted">
        <div className="feedback-thanks">
          <div className="feedback-thanks-emoji">🙏</div>
          <h2>Thank you!</h2>
          <p>
            Appreciate you taking the time to share your thoughts.
            <br />— Ziyan
          </p>
          <button className="feedback-another" onClick={() => setSubmitted(false)}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback">
      <div className="feedback-header">
        <h2>Leave Feedback</h2>
        <p>Let me know what you think of this site, my work, or anything else.</p>
      </div>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="feedback-field">
          <label>Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous visitor"
            maxLength={50}
          />
        </div>
        <div className="feedback-field">
          <label>Your feedback</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="This OS is sick..."
            rows={4}
            maxLength={500}
            required
          />
        </div>
        <button type="submit" className="feedback-submit">
          Send Feedback ↗
        </button>
      </form>
    </div>
  );
}
