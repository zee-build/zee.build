'use client';

import { useEffect, useState } from 'react';

interface Visitor {
  name: string;
  city: string | null;
  on_hajj: boolean;
  fasting: boolean;
  joined_at: string;
}

export default function ArafahVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/arafah-visitors')
      .then((r) => r.json())
      .then((d) => { setVisitors(d.visitors ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '2rem', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=Cormorant+Garamond:ital,wght@1,600&display=swap');`}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <p style={{ color: '#a3a3a3', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          Arafah 1447 — Admin
        </p>
        <h1 style={{ color: '#f5f5f5', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 36, marginBottom: 4 }}>
          Who Joined Today
        </h1>
        <p style={{ color: '#a3a3a3', fontSize: 14, marginBottom: 32 }}>
          {loading ? 'Loading…' : `${visitors.length} soul${visitors.length !== 1 ? 's' : ''} joined so far`}
        </p>

        {loading ? (
          <div style={{ color: '#3f3f3f' }}>Loading…</div>
        ) : visitors.length === 0 ? (
          <div style={{ color: '#3f3f3f', textAlign: 'center', padding: '4rem 0' }}>
            No visitors yet. Share the link! 🤲
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visitors.map((v, i) => (
              <div
                key={i}
                style={{
                  background: '#0f0f0f',
                  border: '1px solid #1f1f1f',
                  borderRadius: 12,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#f97316',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#f5f5f5', fontWeight: 600, fontSize: 15, margin: 0 }}>{v.name}</p>
                  {v.city && (
                    <p style={{ color: '#a3a3a3', fontSize: 12, margin: '2px 0 0' }}>{v.city}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {v.fasting && (
                    <span style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', fontSize: 10, padding: '2px 8px', borderRadius: 999 }}>
                      Fasting
                    </span>
                  )}
                  {v.on_hajj && (
                    <span style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', fontSize: 10, padding: '2px 8px', borderRadius: 999 }}>
                      On Hajj
                    </span>
                  )}
                </div>
                <p style={{ color: '#3f3f3f', fontSize: 11, flexShrink: 0 }}>
                  {new Date(v.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: '#1f1f1f', fontSize: 11, marginTop: 40, textAlign: 'center' }}>
          zeebuild.com/arafah/visitors
        </p>
      </div>
    </div>
  );
}
