"use client";

import { useEffect, useState } from "react";
import { ZB_DATA } from "@/lib/os-data";

export default function AdminPortal() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");

  useEffect(() => {
    // Check if already authed via sessionStorage
    if (sessionStorage.getItem("zb-admin") === "1") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "zeebuild2026";
    if (pass === adminPass) {
      sessionStorage.setItem("zb-admin", "1");
      setAuthed(true);
    } else {
      alert("Invalid password");
    }
  };

  if (!authed) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--mono)", color: "var(--text)",
      }}>
        <form onSubmit={handleLogin} style={{
          display: "flex", flexDirection: "column", gap: 16,
          padding: 40, background: "var(--panel)", border: "1px solid var(--hairline)",
          borderRadius: 14, width: 320,
        }}>
          <h2 style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 22, margin: 0 }}>
            Admin Portal
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-dim)", margin: 0 }}>
            Enter admin password to continue
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              padding: "10px 14px", background: "var(--panel-2)",
              border: "1px solid var(--hairline)", borderRadius: 8,
              color: "var(--text)", fontSize: 14, outline: "none",
            }}
          />
          <button type="submit" style={{
            padding: "10px 14px", background: "var(--accent)",
            border: "none", borderRadius: 8, color: "#000",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>
            Access Portal
          </button>
          <a href="/" style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center" }}>
            ← Back to OS
          </a>
        </form>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000",
      overflow: "auto", fontFamily: "var(--sans)", color: "var(--text)",
      padding: 40,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 28, margin: 0 }}>
            ZeeBuild Admin
          </h1>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{
              padding: "8px 16px", background: "var(--panel-2)",
              border: "1px solid var(--hairline)", borderRadius: 8,
              color: "var(--text-dim)", fontSize: 12, textDecoration: "none",
            }}>
              ← Back to OS
            </a>
            <button onClick={() => { sessionStorage.removeItem("zb-admin"); setAuthed(false); }} style={{
              padding: "8px 16px", background: "var(--panel-2)",
              border: "1px solid var(--hairline)", borderRadius: 8,
              color: "var(--text-dim)", fontSize: 12, cursor: "pointer",
            }}>
              Logout
            </button>
          </div>
        </div>

        {/* Resume Data */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: "0.1em", marginBottom: 16 }}>
            RESUME DATA
          </h2>
          <div style={{ background: "var(--panel)", border: "1px solid var(--hairline)", borderRadius: 12, padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "var(--text-faint)", display: "block", marginBottom: 4 }}>Name</label>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{ZB_DATA.identity.name}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "var(--text-faint)", display: "block", marginBottom: 4 }}>Title</label>
              <div style={{ fontSize: 14 }}>{ZB_DATA.identity.title}</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "var(--text-faint)", display: "block", marginBottom: 4 }}>Bio</label>
              <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>{ZB_DATA.bio}</div>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 16 }}>
              ℹ️ To edit resume data, update <code style={{ background: "var(--panel-2)", padding: "2px 6px", borderRadius: 4 }}>lib/os-data.ts</code> and redeploy.
            </p>
          </div>
        </section>

        {/* Builds */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: "0.1em", marginBottom: 16 }}>
            BUILDS ({ZB_DATA.builds.length})
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ZB_DATA.builds.map((b) => (
              <div key={b.name} style={{
                background: "var(--panel)", border: "1px solid var(--hairline)",
                borderRadius: 10, padding: 16,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 99,
                    background: b.status === "Shipped" ? "rgba(74,222,128,0.1)" : "rgba(0,212,255,0.1)",
                    color: b.status === "Shipped" ? "var(--green)" : "var(--cyan)",
                  }}>
                    {b.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <h2 style={{ fontSize: 16, color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: "0.1em", marginBottom: 16 }}>
            EXPERIENCE ({ZB_DATA.experience.length})
          </h2>
          {ZB_DATA.experience.map((exp) => (
            <div key={exp.co} style={{
              background: "var(--panel)", border: "1px solid var(--hairline)",
              borderRadius: 10, padding: 16, marginBottom: 12,
            }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{exp.role} @ {exp.co}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>{exp.when}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
