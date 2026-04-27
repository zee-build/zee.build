"use client";

import { useState } from "react";
import { ZB_DATA } from "@/lib/os-data";

export default function ContactWindow() {
  const D = ZB_DATA;
  const [sent, setSent] = useState(false);

  return (
    <div className="contact">
      <div className="contact-info">
        <div className="label">// CHANNELS</div>
        {[
          { k: "Email",    v: D.identity.email },
          { k: "Phone",    v: D.identity.phone },
          { k: "LinkedIn", v: D.identity.linkedin },
          { k: "GitHub",   v: D.identity.github },
        ].map(({ k, v }) => (
          <div key={k} className="contact-card">
            <span className="k">{k}</span>
            <span className="v">{v}</span>
          </div>
        ))}
        <div style={{
          marginTop: "auto", fontFamily: "var(--mono)", fontSize: 10,
          color: "var(--text-faint)", letterSpacing: "0.1em",
        }}>
          ◆ STATUS · OPEN TO BUILDS
        </div>
      </div>

      <div className="contact-form">
        <div className="label">// SEND TRANSMISSION</div>
        <h2 className="h2" style={{ marginTop: 6 }}>Get in touch.</h2>
        <div className="form-field">
          <label>Name</label>
          <input placeholder="your name" />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input placeholder="you@domain.com" type="email" />
        </div>
        <div className="form-field">
          <label>Message</label>
          <textarea placeholder="tell me about the build..." />
        </div>
        <button className="btn" onClick={() => setSent(true)}>
          {sent ? "✓ TRANSMITTED" : "▸ TRANSMIT"}
        </button>
      </div>
    </div>
  );
}
