'use client';

import { useState, useEffect } from 'react';

export default function AudienceToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('zif-audience-toggle');
    if (saved === 'true') {
      setOn(true);
      document.querySelectorAll('.context-box, .western-parallel').forEach((el) => {
        (el as HTMLElement).style.display = 'block';
      });
    }
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    localStorage.setItem('zif-audience-toggle', String(next));
    document.querySelectorAll('.context-box, .western-parallel').forEach((el) => {
      (el as HTMLElement).style.display = next ? 'block' : 'none';
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm mb-6">
      <div className="flex-1 text-zinc-400">
        <span className="font-medium text-white">New to Islam?</span>{' '}
        Switch on for plain-English context and Western finance parallels.
      </div>
      <button
        role="switch"
        aria-checked={on}
        onClick={toggle}
        className="relative w-10 h-5 rounded-full border transition-colors"
        style={{
          backgroundColor: on ? 'var(--c-teal)' : 'transparent',
          borderColor: on ? 'var(--c-teal)' : '#3f3f46',
        }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform bg-white ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
