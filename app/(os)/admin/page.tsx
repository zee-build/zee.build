"use client";

import { useEffect, useState } from "react";
import { ZB_DATA } from "@/lib/os-data";

const ADMIN_STORAGE_KEY = "zb-admin-overrides";

function getOverrides(): Record<string, any> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveOverrides(data: Record<string, any>) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
}

export default function AdminPortal() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [title, setTitle] = useState(ZB_DATA.identity.title);
  const [bio, setBio] = useState(ZB_DATA.bio);
  const [location, setLocation] = useState(ZB_DATA.identity.location);
  const [email, setEmail] = useState(ZB_DATA.identity.email);
  const [phone, setPhone] = useState(ZB_DATA.identity.phone);

  useEffect(() => {
    if (sessionStorage.getItem("zb-admin") === "1") {
      setAuthed(true);
    }
    // Load overrides
    const overrides = getOverrides();
    if (overrides.title) setTitle(overrides.title);
    if (overrides.bio) setBio(overrides.bio);
    if (overrides.location) setLocation(overrides.location);
    if (overrides.email) setEmail(overrides.email);
    if (overrides.phone) setPhone(overrides.phone);
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

  const handleSave = () => {
    saveOverrides({ title, bio, location, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setTitle(ZB_DATA.identity.title);
    setBio(ZB_DATA.bio);
    setLocation(ZB_DATA.identity.location);
    setEmail(ZB_DATA.identity.email);
    setPhone(ZB_DATA.identity.phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!authed) {
    return (
      <div className="admin-login-wrap">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Portal</h2>
          <p>Enter admin password to continue</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          <button type="submit">Access Portal</button>
          <a href="/">← Back to OS</a>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-container">
        <div className="admin-header">
          <h1>ZeeBuild Admin</h1>
          <div className="admin-header-actions">
            {saved && <span className="admin-saved">✓ Saved</span>}
            <button onClick={handleSave} className="admin-btn primary">Save Changes</button>
            <button onClick={handleReset} className="admin-btn">Reset to Default</button>
            <a href="/" className="admin-btn">← Back to OS</a>
            <button onClick={() => { sessionStorage.removeItem("zb-admin"); setAuthed(false); }} className="admin-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Identity Section */}
        <section className="admin-section">
          <h2>Identity</h2>
          <div className="admin-grid">
            <div className="admin-field">
              <label>Name (read-only)</label>
              <input value={ZB_DATA.identity.name} disabled />
            </div>
            <div className="admin-field">
              <label>Title / Tagline</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="admin-section">
          <h2>Bio</h2>
          <div className="admin-field full">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
          </div>
        </section>

        {/* Builds Section */}
        <section className="admin-section">
          <h2>Builds ({ZB_DATA.builds.length})</h2>
          <div className="admin-builds-grid">
            {ZB_DATA.builds.map((b) => (
              <div key={b.name} className="admin-build-card">
                <div className="admin-build-header">
                  <span className="admin-build-name">{b.name}</span>
                  <span className={`admin-build-status ${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <p className="admin-build-desc">{b.desc}</p>
                <div className="admin-build-stack">
                  {b.stack.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
          <p className="admin-hint">
            To add/remove builds, edit <code>lib/os-data.ts</code> and redeploy.
          </p>
        </section>

        {/* Experience Section */}
        <section className="admin-section">
          <h2>Experience ({ZB_DATA.experience.length})</h2>
          {ZB_DATA.experience.map((exp) => (
            <div key={exp.co} className="admin-exp-card">
              <strong>{exp.role}</strong> @ {exp.co}
              <span className="admin-exp-when">{exp.when}</span>
            </div>
          ))}
          <p className="admin-hint">
            To edit experience, update <code>lib/os-data.ts</code> and redeploy.
          </p>
        </section>
      </div>
    </div>
  );
}
