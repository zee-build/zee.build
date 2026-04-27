"use client";

import { ZB_DATA } from "@/lib/os-data";

export default function TrashWindow() {
  const D = ZB_DATA;

  return (
    <div className="trash">
      <div className="trash-header">
        <div>
          <div className="label">// /Users/ziyan/.Trash</div>
          <h2 className="h2" style={{ marginTop: 6 }}>Archived Ideas</h2>
        </div>
        <div className="label">{D.trash.length} ITEMS · 0 RESTORABLE</div>
      </div>

      <div className="trash-list">
        {D.trash.map((t, i) => (
          <div key={i} className="trash-row">
            <div className="x">✕</div>
            <div className="nm">{t.nm}</div>
            <div className="reason">{t.reason}</div>
            <div className="restore">restore?</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 18, fontFamily: "var(--mono)", fontSize: 11,
        color: "var(--text-faint)", letterSpacing: "0.04em",
      }}>
        // Every shipped product has a graveyard. These are honest ones.
      </div>
    </div>
  );
}
