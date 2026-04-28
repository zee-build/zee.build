"use client";

import { useEffect, useState } from "react";

export interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  visible: boolean;
}

export default function FeedbackWindow() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((d) => setFeedbackList((d.feedback || []).filter((f: FeedbackItem) => f.visible)))
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        name: name.trim() || "Anonymous",
        message: message.trim(),
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        window.dispatchEvent(new CustomEvent("os-feedback", { detail: d.feedback }));
        setFeedbackList((prev) => [d.feedback, ...prev]);
        setSubmitted(true);
        setName("");
        setMessage("");
        setTimeout(() => setSubmitted(false), 4000);
      });
  };

  return (
    <div className="feedback">
      {/* Form section */}
      {submitted ? (
        <div className="feedback-thanks-inline">
          <span>🙏</span> Thanks for your feedback! — Ziyan
        </div>
      ) : (
        <>
          <div className="feedback-header">
            <h2>Leave Feedback</h2>
            <p>Let me know what you think.</p>
          </div>
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="feedback-field">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                maxLength={50}
              />
            </div>
            <div className="feedback-field">
              <label>Feedback</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="This OS is sick..."
                rows={3}
                maxLength={500}
                required
              />
            </div>
            <button type="submit" className="feedback-submit">
              Send Feedback ↗
            </button>
          </form>
        </>
      )}

      {/* Comments section */}
      {feedbackList.length > 0 && (
        <div className="feedback-comments">
          <div className="feedback-comments-header">
            <span>💬</span> Recent feedback ({feedbackList.length})
          </div>
          {feedbackList.map((f) => (
            <div key={f.id} className="feedback-comment">
              <div className="feedback-comment-name">{f.name}</div>
              <div className="feedback-comment-msg">{f.message}</div>
              <div className="feedback-comment-time">
                {new Date(f.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
