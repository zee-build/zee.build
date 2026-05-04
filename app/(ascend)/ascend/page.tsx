"use client";

import { useState, useEffect } from "react";
import JarvisGreeting from "@/components/ascend/JarvisGreeting";
import Dashboard from "@/components/ascend/Dashboard";
import Schedule from "@/components/ascend/Schedule";
import Habits from "@/components/ascend/Habits";
import Income from "@/components/ascend/Income";
import Coach from "@/components/ascend/Coach";
import WorkRouter from "@/components/ascend/WorkRouter";

type Tab = "dashboard" | "schedule" | "habits" | "income" | "coach";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "schedule", label: "Schedule", icon: "📅" },
  { id: "habits", label: "Habits", icon: "🔥" },
  { id: "income", label: "Income", icon: "💰" },
  { id: "coach", label: "Coach", icon: "🤖" },
];

export default function AscendPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [routerBlock, setRouterBlock] = useState<number | null>(null);

  // Check URL params for tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["dashboard", "schedule", "habits", "income", "coach"].includes(tab)) {
      setActiveTab(tab as Tab);
    }
  }, []);

  // Check if already authed
  useEffect(() => {
    if (sessionStorage.getItem("ascend-auth") === "1") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "zeebuild2026";
    if (pass === adminPass) {
      sessionStorage.setItem("ascend-auth", "1");
      sessionStorage.setItem("zb-admin-pass", pass);
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // Auth gate
  if (!authed) {
    return (
      <div className="ascend-auth-page">
        <div className="ascend-auth-card">
          <div className="ascend-auth-logo">ASCEND</div>
          <div className="ascend-auth-sub">Personal AI Operating System</div>
          <form onSubmit={handleLogin} className="ascend-auth-form">
            <input
              type="password"
              className="ascend-auth-input"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
            />
            <button type="submit" className="ascend-auth-btn">
              ENTER →
            </button>
            {error && <div className="ascend-auth-error">Access denied.</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="ascend-page">
      {/* Greeting overlay */}
      {showGreeting && (
        <JarvisGreeting onDismiss={() => setShowGreeting(false)} />
      )}

      {/* Work Router modal */}
      {routerBlock !== null && (
        <WorkRouter
          blockIndex={routerBlock}
          onClose={() => setRouterBlock(null)}
        />
      )}

      {/* Header */}
      <div className="ascend-page-header">
        <span className="ascend-page-logo">ASCEND</span>
        <button
          className="ascend-page-logout"
          onClick={() => {
            sessionStorage.removeItem("ascend-auth");
            setAuthed(false);
          }}
        >
          Lock
        </button>
      </div>

      {/* Tab content */}
      <div className="ascend-page-content">
        {activeTab === "dashboard" && <Dashboard onBlockTap={setRouterBlock} />}
        {activeTab === "schedule" && <Schedule />}
        {activeTab === "habits" && <Habits />}
        {activeTab === "income" && <Income />}
        {activeTab === "coach" && <Coach />}
      </div>

      {/* Bottom tab bar */}
      <div className="ascend-page-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ascend-page-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="ascend-page-tab-icon">{tab.icon}</span>
            <span className="ascend-page-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
