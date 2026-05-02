"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Project,
  fetchProjects,
  createProject,
  logBlock,
  logTrade,
} from "@/lib/ascend/supabase";
import { getTodaySchedule } from "@/lib/ascend/schedule";

interface Props {
  blockIndex: number;
  onClose: () => void;
}

type Step = "select" | "focus" | "logging" | "done" | "newProject";

const PROJECT_PROMPTS: Record<string, { question: string; options: string[] }> = {
  "tarbiya.ai": {
    question: "What's the focus? Marketing post, pricing change, new feature, or subscriber outreach?",
    options: ["Marketing post", "Pricing change", "New feature", "Subscriber outreach"],
  },
  "Internet Money": {
    question: "Client work, outreach, or offer building today?",
    options: ["Client work", "Outreach", "Offer building"],
  },
  Yuze: {
    question: "What's the main task today? Let's time-box it.",
    options: [],
  },
  "Job Hunt": {
    question: "Which companies today?",
    options: ["Tabby", "Tamara", "PayBy", "Zeal", "Sarwa", "Hakbah", "Checkout.com Dubai"],
  },
  "OpenClaw Trading": {
    question: "Any open positions? Log today's P&L.",
    options: [],
  },
};

const AI_SUGGESTIONS: Record<string, Record<string, string[]>> = {
  "tarbiya.ai": {
    "Marketing post": [
      "Reddit r/MuslimParents — 'How do you teach Islamic values through stories?'",
      "Facebook Muslim Moms group — share a free sample story",
      "Instagram reel: 30-sec story preview with voiceover",
    ],
    "Pricing change": [
      "Step 1: Change price to $9.99 in Stripe dashboard",
      "Step 2: Update landing page pricing section",
      "Step 3: Email existing users about new features justifying price",
      "Step 4: Grandfather existing users at $2.99 for 30 days",
    ],
    "Subscriber outreach": [
      "Post in Muslim Homeschool Network (Facebook, 45K members)",
      "Reach out to Islamic school teachers on LinkedIn",
      "Partner with Muslim parenting bloggers for reviews",
    ],
  },
  "Internet Money": {
    Outreach: [
      "Cold email 3 UAE restaurants about AI menu optimization",
      "DM 3 Dubai real estate agencies about AI lead qualification",
      "Email 3 clinics about AI appointment scheduling",
    ],
    "Offer building": [
      "Package 1: AI Chatbot Setup — AED 5,000",
      "Package 2: AI Lead Gen System — AED 8,000",
      "Package 3: Full AI Automation Suite — AED 15,000",
    ],
  },
};

const PROJECT_TYPES = ["agency", "saas", "freelance", "learning", "job", "other"];
const EMOJI_OPTIONS = ["⚡", "🚀", "💡", "🎯", "📱", "🌐", "💰", "🔧", "📊", "🎨"];

export default function WorkRouter({ blockIndex, onClose }: Props) {
  const [step, setStep] = useState<Step>("select");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFocus, setSelectedFocus] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [tradePnl, setTradePnl] = useState("");
  const [tradeSymbol, setTradeSymbol] = useState("");

  // New project form
  const [npName, setNpName] = useState("");
  const [npType, setNpType] = useState("other");
  const [npGoal, setNpGoal] = useState("");
  const [npHours, setNpHours] = useState(5);
  const [npIcon, setNpIcon] = useState("⚡");
  const [npColor, setNpColor] = useState("#C9A84C");

  const block = getTodaySchedule()[blockIndex];

  const loadProjects = useCallback(async () => {
    const p = await fetchProjects();
    setProjects(p);
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleProjectSelect = (p: Project) => {
    setSelectedProject(p);
    setStep("focus");
  };

  const handleLog = async () => {
    if (selectedProject?.name === "OpenClaw Trading" && tradePnl) {
      await logTrade(tradeSymbol || "N/A", "N/A", Number(tradePnl));
    }
    await logBlock(blockIndex, true, selectedProject?.id, workDesc || selectedFocus);
    setStep("done");
  };

  const handleNewProject = async () => {
    if (!npName.trim()) return;
    await createProject({
      name: npName,
      type: npType,
      goal: npGoal,
      weekly_hours_target: npHours,
      icon: npIcon,
      color: npColor,
    });
    await loadProjects();
    setStep("select");
    setNpName("");
  };

  const prompt = selectedProject ? PROJECT_PROMPTS[selectedProject.name] : null;
  const suggestions = selectedProject && selectedFocus
    ? AI_SUGGESTIONS[selectedProject.name]?.[selectedFocus] || []
    : [];

  return (
    <div className="ascend-router-overlay">
      <div className="ascend-router-modal">
        <button className="ascend-router-close" onClick={onClose}>×</button>

        {block && (
          <div className="ascend-router-block">
            {block.icon} {block.time} — {block.label}
          </div>
        )}

        {/* Step 1: Project select */}
        {step === "select" && (
          <>
            <div className="ascend-router-q">What are you working on?</div>
            <div className="ascend-router-projects">
              {projects.map((p) => (
                <button
                  key={p.id}
                  className="ascend-router-project-btn"
                  style={{ borderColor: p.color }}
                  onClick={() => handleProjectSelect(p)}
                >
                  <span>{p.icon}</span> {p.name}
                </button>
              ))}
              <button
                className="ascend-router-project-btn add"
                onClick={() => setStep("newProject")}
              >
                + Add New Project
              </button>
            </div>
          </>
        )}

        {/* Step 2: Focus question */}
        {step === "focus" && selectedProject && (
          <>
            <div className="ascend-router-selected">
              {selectedProject.icon} {selectedProject.name}
            </div>
            <div className="ascend-router-q">
              {prompt?.question || "What are you working on?"}
            </div>

            {selectedProject.name === "Job Hunt" && (
              <div className="ascend-router-remind">
                Your skills are worth AED 18-25K. Stop underselling.
              </div>
            )}

            {prompt?.options && prompt.options.length > 0 && (
              <div className="ascend-router-options">
                {prompt.options.map((o) => (
                  <button
                    key={o}
                    className={`ascend-router-opt ${selectedFocus === o ? "active" : ""}`}
                    onClick={() => setSelectedFocus(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="ascend-router-suggestions">
                <div className="ascend-section-label">SUGGESTIONS</div>
                {suggestions.map((s, i) => (
                  <div key={i} className="ascend-router-suggestion">{s}</div>
                ))}
              </div>
            )}

            {selectedProject.name === "OpenClaw Trading" && (
              <div className="ascend-trade-inputs">
                <input
                  placeholder="Symbol (e.g. BTC)"
                  value={tradeSymbol}
                  onChange={(e) => setTradeSymbol(e.target.value)}
                  className="ascend-input"
                />
                <input
                  placeholder="P&L in AED"
                  type="number"
                  value={tradePnl}
                  onChange={(e) => setTradePnl(e.target.value)}
                  className="ascend-input"
                />
              </div>
            )}

            <textarea
              className="ascend-input ascend-textarea"
              placeholder="Describe what you'll work on..."
              value={workDesc}
              onChange={(e) => setWorkDesc(e.target.value)}
            />

            <button className="ascend-router-go" onClick={handleLog}>
              Block started. Go. →
            </button>
          </>
        )}

        {/* Done */}
        {step === "done" && (
          <div className="ascend-router-done">
            <div className="ascend-router-done-icon">✓</div>
            <div>Block logged. Go.</div>
            <button className="ascend-router-go" onClick={onClose}>Close</button>
          </div>
        )}

        {/* New Project */}
        {step === "newProject" && (
          <>
            <div className="ascend-router-q">Add New Project</div>
            <input
              className="ascend-input"
              placeholder="Project name"
              value={npName}
              onChange={(e) => setNpName(e.target.value)}
            />
            <select
              className="ascend-input"
              value={npType}
              onChange={(e) => setNpType(e.target.value)}
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              className="ascend-input"
              placeholder="Goal"
              value={npGoal}
              onChange={(e) => setNpGoal(e.target.value)}
            />
            <div className="ascend-np-row">
              <label>Hours/week:</label>
              <input
                type="number"
                className="ascend-input"
                value={npHours}
                onChange={(e) => setNpHours(Number(e.target.value))}
                style={{ width: 60 }}
              />
            </div>
            <div className="ascend-np-row">
              <label>Icon:</label>
              <div className="ascend-emoji-picker">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    className={`ascend-emoji-btn ${npIcon === e ? "active" : ""}`}
                    onClick={() => setNpIcon(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="color"
              className="ascend-color-input"
              value={npColor}
              onChange={(e) => setNpColor(e.target.value)}
            />
            <div className="ascend-np-actions">
              <button className="ascend-router-go" onClick={handleNewProject}>
                Create Project
              </button>
              <button className="ascend-router-cancel" onClick={() => setStep("select")}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
