"use client";

import { useEffect, useState } from "react";

interface GitEvent {
  hash: string;
  repo: string;
  msg: string;
  ago: string;
}

export default function NotificationCenter({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [events, setEvents] = useState<GitEvent[]>([]);
  const [visitors, setVisitors] = useState({ active: 0, total: 0, unique: 0 });

  useEffect(() => {
    if (!open) return;

    fetch("/api/github/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {});

    fetch("/api/visitors")
      .then((r) => r.json())
      .then((d) => setVisitors(d))
      .catch(() => {});
  }, [open]);

  return (
    <>
      {/* backdrop */}
      {open && <div className="nc-backdrop" onClick={onClose} />}

      <div className={`nc-panel${open ? " open" : ""}`}>
        <div className="nc-header">
          <span className="nc-title">Notification Center</span>
          <button className="nc-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Visitors card */}
        <div className="nc-card">
          <div className="nc-card-header">
            <span className="nc-card-icon">👁</span>
            <span>Visitors</span>
          </div>
          <div className="nc-visitors">
            <div className="nc-visitor-stat">
              <span className="nc-visitor-num">{visitors.active}</span>
              <span className="nc-visitor-label">Active now</span>
            </div>
            <div className="nc-visitor-stat">
              <span className="nc-visitor-num">{visitors.unique}</span>
              <span className="nc-visitor-label">Unique visitors</span>
            </div>
            <div className="nc-visitor-stat">
              <span className="nc-visitor-num">{visitors.total}</span>
              <span className="nc-visitor-label">Total visits</span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="nc-card">
          <div className="nc-card-header">
            <span className="nc-card-icon">⚡</span>
            <span>Recent Commits</span>
          </div>
          <div className="nc-events">
            {events.length === 0 ? (
              <div className="nc-empty">Loading activity...</div>
            ) : (
              events.slice(0, 8).map((ev, i) => (
                <div key={i} className="nc-event">
                  <div className="nc-event-hash">{ev.hash}</div>
                  <div className="nc-event-body">
                    <div className="nc-event-msg">{ev.msg}</div>
                    <div className="nc-event-meta">
                      {ev.repo} · {ev.ago} ago
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status card */}
        <div className="nc-card">
          <div className="nc-card-header">
            <span className="nc-card-icon">🟢</span>
            <span>System Status</span>
          </div>
          <div className="nc-status-list">
            <div className="nc-status-row">
              <span>Vercel</span>
              <span className="nc-status-dot green" />
            </div>
            <div className="nc-status-row">
              <span>GitHub Actions</span>
              <span className="nc-status-dot green" />
            </div>
            <div className="nc-status-row">
              <span>Supabase</span>
              <span className="nc-status-dot green" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
