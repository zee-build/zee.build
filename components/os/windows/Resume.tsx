"use client";

import { useState } from "react";
import { ZB_DATA, skillScores } from "@/lib/os-data";

type Section = "exp" | "edu" | "skills" | "certs" | "research" | "extra";

const SECTIONS: { id: Section; label: string }[] = [
  { id: "exp", label: "Experience" },
  { id: "edu", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "certs", label: "Certifications" },
  { id: "research", label: "Research" },
  { id: "extra", label: "Volunteering" },
];

export default function ResumeWindow() {
  const D = ZB_DATA;
  const [section, setSection] = useState<Section>("exp");

  return (
    <div className="resume">
      <div className="resume-toc">
        <h4>// Sections</h4>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            className={section === s.id ? "on" : ""}
            onClick={() => setSection(s.id)}
          >
            <span className="marker" />
            {s.label}
          </a>
        ))}
        <div style={{ marginTop: 24 }}>
          <button className="btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => window.open("/os/ziyan-binanoos-resume-2026.pdf", "_blank")}>
            ↓ Export PDF
          </button>
        </div>
      </div>

      <div className="resume-doc">
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          borderBottom: "1px solid var(--hairline)", paddingBottom: 14, marginBottom: 18,
        }}>
          <div>
            <h2 className="h1">{D.identity.name}</h2>
            <div className="label" style={{ marginTop: 4 }}>{D.identity.title}</div>
          </div>
          <div className="label" style={{ textAlign: "right" }}>
            {D.identity.email}<br />
            {D.identity.phone}<br />
            {D.identity.location}
          </div>
        </div>

        {section === "exp" && D.experience.map((e, i) => (
          <div key={i} className="role">
            <div className="top">
              <div className="title-row">
                {e.role} <span className="at">@</span> {e.co}
              </div>
              <div className="when">{e.when}</div>
            </div>
            <ul>
              {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
            </ul>
          </div>
        ))}

        {section === "edu" && D.education.map((e, i) => (
          <div key={i} className="role">
            <div className="top">
              <div className="title-row">
                {e.what} <span className="at">·</span> {e.where}
              </div>
              <div className="when">{e.when}</div>
            </div>
          </div>
        ))}

        {section === "skills" && (
          <div style={{ marginTop: 8 }}>
            {Object.entries(skillScores).map(([k, v]) => (
              <div key={k} className="skill-bar">
                <div className="name">{k}</div>
                <div className="bar"><i style={{ width: `${v}%` }} /></div>
                <div className="pct">{v}</div>
              </div>
            ))}
          </div>
        )}

        {section === "certs" && (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {D.certifications.map((c, i) => (
              <li key={i} style={{
                padding: "10px 0", borderBottom: "1px dashed var(--hairline)",
                display: "flex", justifyContent: "space-between",
              }}>
                <span>{c}</span>
                <span className="label">VERIFIED</span>
              </li>
            ))}
          </ul>
        )}

        {section === "research" && D.research.map((r, i) => (
          <div key={i} className="role">
            <div className="title-row">{r.title}</div>
            <div className="label" style={{ marginTop: 4 }}>{r.venue}</div>
          </div>
        ))}

        {section === "extra" && (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {D.extra.map((c, i) => (
              <li key={i} style={{ padding: "8px 0", color: "var(--text-dim)" }}>
                · {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
