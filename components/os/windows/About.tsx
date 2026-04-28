"use client";

import { useEffect, useState } from "react";
import { ZB_DATA } from "@/lib/os-data";

export default function AboutWindow() {
  const D = ZB_DATA;
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(D.identity.title.slice(0, i));
      if (i >= D.identity.title.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, [D.identity.title]);

  return (
    <div className="about">
      <div className="about-side">
        <div className="about-photo" style={{ backgroundImage: "url(/os/pfp.jpeg)", backgroundSize: "cover", backgroundPosition: "center", fontSize: 0 }}>
          <div className="ring" />
        </div>
        {[
          { k: "Location", v: D.identity.location },
          { k: "Languages", v: `${D.identity.languages} languages` },
          { k: "Experience", v: `${D.identity.years} years` },
          { k: "Focus", v: "FinTech + Research" },
        ].map(({ k, v }) => (
          <div key={k} className="fact-row">
            <span className="k">{k}</span>
            <span className="v">{v}</span>
          </div>
        ))}
      </div>

      <div className="about-main">
        <div className="label">// IDENTITY</div>
        <h1 className="about-name">{D.identity.name}</h1>
        <div className="about-tag cursor-blink">{typed}</div>
        <p className="about-bio">{D.bio}</p>

        {Object.entries(D.skills).map(([cat, list]) => (
          <div key={cat} className="skill-group">
            <span className="label">{cat}</span>
            <div className="chips">
              {list.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        ))}

        <div className="about-links">
          <a className="btn" href={`mailto:${D.identity.email}`}>✉ Email</a>
          <a
            className="btn cyan"
            href={`https://${D.identity.linkedin}`}
            target="_blank"
            rel="noreferrer"
          >
            ⌘ LinkedIn
          </a>
          <a
            className="btn ghost"
            href={`https://${D.identity.github}`}
            target="_blank"
            rel="noreferrer"
          >
            ▣ GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
