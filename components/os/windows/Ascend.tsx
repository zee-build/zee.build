"use client";

import { useState } from "react";
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

export default function AscendWindow() {
  const [showGreeting, setShowGreeting] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [routerBlock, setRouterBlock] = useState<number | null>(null);

  const handleBlockTap = (blockIndex: number) => {
    setRouterBlock(blockIndex);
  };

  return (
    <div className="ascend-window">
      {/* Jarvis Greeting overlay */}
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

      {/* Tab content */}
      <div className="ascend-content">
        {activeTab === "dashboard" && <Dashboard onBlockTap={handleBlockTap} />}
        {activeTab === "schedule" && <Schedule />}
        {activeTab === "habits" && <Habits />}
        {activeTab === "income" && <Income />}
        {activeTab === "coach" && <Coach />}
      </div>

      {/* Bottom tab bar */}
      <div className="ascend-tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ascend-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="ascend-tab-icon">{tab.icon}</span>
            <span className="ascend-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
