"use client";

import { useEffect, useState } from "react";

export default function FeedbackPrompt({ onOpen }: { onOpen: () => void }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("zb-feedback-dismissed")) return;

    const timer = setTimeout(() => setShow(true), 30000); // 30 seconds
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    setShow(false);
    sessionStorage.setItem("zb-feedback-dismissed", "1");
  };

  const openFeedback = () => {
    dismiss();
    onOpen();
  };

  if (!show || dismissed) return null;

  return (
    <div className="feedback-prompt">
      <div className="feedback-prompt-card">
        <button className="feedback-prompt-close" onClick={dismiss}>×</button>
        <div className="feedback-prompt-emoji">💬</div>
        <h3>Got a sec?</h3>
        <p>I'd love to hear what you think of this site.</p>
        <button className="feedback-prompt-btn" onClick={openFeedback}>
          Give Feedback
        </button>
      </div>
    </div>
  );
}
