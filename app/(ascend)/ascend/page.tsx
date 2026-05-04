"use client";

import { useState, useEffect } from "react";
import "@/components/ascend/ascend.css";
import JarvisGreeting from "@/components/ascend/JarvisGreeting";
import Dashboard from "@/components/ascend/Dashboard";
import Calendar from "@/components/ascend/Calendar";
import Habits from "@/components/ascend/Habits";
import Income from "@/components/ascend/Income";
import Coach from "@/components/ascend/Coach";
import WorkRouter from "@/components/ascend/WorkRouter";
import Projects from "@/components/ascend/Projects";
import { startAscendNotifications } from "@/lib/ascend/notifications";
import { getDubaiTimeStr } from "@/lib/ascend/schedule";

type Tab = "dashboard" | "calendar" | "habits" | "income" | "coach" | "projects";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Today", icon: "📊" },
  { id: "calendar", label: "Schedule", icon: "📅" },
  { id: "habits", label: "Habits", icon: "🔥" },
  { id: "income", label: "Income", icon: "💰" },
  { id: "coach", label: "Coach", icon: "🤖" },
  { id: "projects", label: "Projects", icon: "🚀" },
];

export default function AscendPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [routerBlock, setRouterBlock] = useState<number | null>(null);
  const [clock, setClock] = useState("");

  useEffect(() => {
    setClock(getDubaiTimeStr());
    const t = setInterval(() => setClock(getDubaiTimeStr()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as Tab | null;
    if (tab && TABS.some((t) => t.id === tab)) setActiveTab(tab);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ascend-auth") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    const cleanup = startAscendNotifications();
    return cleanup;
  }, [authed]);

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
      {showGreeting && (
        <JarvisGreeting onDismiss={() => setShowGreeting(false)} />
      )}
      {routerBlock !== null && (
        <WorkRouter
          blockIndex={routerBlock}
          onClose={() => setRouterBlock(null)}
        />
      )}

      {/* OS header bar */}
      <header className="ascend-header">
        <div className="ascend-header-brand">
          <span className="ascend-header-logo">ASCEND</span>
          <span className="ascend-header-status-dot" />
          <span className="ascend-header-clock">{clock}</span>
        </div>
        <button
          className="ascend-header-lock"
          onClick={() => {
            sessionStorage.removeItem("ascend-auth");
            setAuthed(false);
          }}
        >
          ⎋ Lock
        </button>
      </header>

      {/* Pill tab bar */}
      <nav className="ascend-tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ascend-tab-pill ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="ascend-tab-pill-icon">{tab.icon}</span>
            <span className="ascend-tab-pill-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="ascend-page-content">
        {activeTab === "dashboard" && <Dashboard onBlockTap={setRouterBlock} />}
        {activeTab === "calendar" && <Calendar />}
        {activeTab === "habits" && <Habits />}
        {activeTab === "income" && <Income />}
        {activeTab === "coach" && <Coach />}
        {activeTab === "projects" && <Projects />}
      </main>
    </div>
  );
}
