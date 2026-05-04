"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Project,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/ascend/supabase";

const PROJECT_TYPES = ["agency", "saas", "freelance", "learning", "job", "other"];
const EMOJI_OPTIONS = [
  "⚡","🚀","💡","🎯","📱","🌐","💰","🔧","📊","🎨",
  "📖","🏦","☕","💼","📈","🧠","🌙","🏋️","💻","🎮",
];

type EditState = { [id: string]: Partial<Project> };

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // New project form
  const [npName, setNpName] = useState("");
  const [npType, setNpType] = useState("other");
  const [npGoal, setNpGoal] = useState("");
  const [npHours, setNpHours] = useState(5);
  const [npIcon, setNpIcon] = useState("⚡");
  const [npColor, setNpColor] = useState("#C9A84C");

  const load = useCallback(async () => {
    setLoading(true);
    setProjects(await fetchProjects());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setEditState((prev) => ({ ...prev, [p.id]: { ...p } }));
  };

  const cancelEdit = (id: string) => {
    setEditingId(null);
    setEditState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveEdit = async (id: string) => {
    const edits = editState[id];
    if (!edits) return;
    await updateProject(id, edits);
    setEditingId(null);
    load();
  };

  const patch = (id: string, field: keyof Project, value: unknown) => {
    setEditState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleAdd = async () => {
    if (!npName.trim()) return;
    await createProject({
      name: npName,
      type: npType,
      goal: npGoal,
      weekly_hours_target: npHours,
      icon: npIcon,
      color: npColor,
    });
    setNpName("");
    setNpType("other");
    setNpGoal("");
    setNpHours(5);
    setNpIcon("⚡");
    setNpColor("#C9A84C");
    setShowAdd(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setConfirmDelete(null);
    load();
  };

  if (loading) {
    return (
      <div className="ascend-projects">
        <div className="ascend-skeleton ascend-skeleton-row" />
        <div className="ascend-skeleton ascend-skeleton-row" />
        <div className="ascend-skeleton ascend-skeleton-row" />
      </div>
    );
  }

  return (
    <div className="ascend-projects">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div className="ascend-section-label" style={{ margin: 0 }}>
          ACTIVE PROJECTS
        </div>
        <button
          className="ascend-proj-add-btn"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? "Cancel" : "+ New"}
        </button>
      </div>

      {/* Add project form */}
      {showAdd && (
        <div className="ascend-proj-form">
          <input
            className="ascend-input"
            placeholder="Project name *"
            value={npName}
            onChange={(e) => setNpName(e.target.value)}
          />
          <select
            className="ascend-input"
            value={npType}
            onChange={(e) => setNpType(e.target.value)}
          >
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            className="ascend-input"
            placeholder="Goal / objective"
            value={npGoal}
            onChange={(e) => setNpGoal(e.target.value)}
          />
          <div className="ascend-np-row">
            <label>Hrs/wk:</label>
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
          <div className="ascend-np-row">
            <label>Color:</label>
            <input
              type="color"
              className="ascend-color-input"
              value={npColor}
              onChange={(e) => setNpColor(e.target.value)}
            />
          </div>
          <button className="ascend-router-go" onClick={handleAdd}>
            Create Project
          </button>
        </div>
      )}

      {/* Project list */}
      {projects.length === 0 && (
        <div
          style={{
            color: "var(--ascend-text-faint)",
            fontSize: 11,
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No active projects. Add one above.
        </div>
      )}

      {projects.map((p) => {
        const isEditing = editingId === p.id;
        const e = editState[p.id] || p;

        return (
          <div
            key={p.id}
            className="ascend-proj-card"
            style={{ borderLeftColor: p.color }}
          >
            {isEditing ? (
              /* Edit mode */
              <div className="ascend-proj-edit">
                <div className="ascend-np-row" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{e.icon}</span>
                  <input
                    className="ascend-input"
                    value={e.name || ""}
                    onChange={(ev) => patch(p.id, "name", ev.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <select
                  className="ascend-input"
                  value={e.type || "other"}
                  onChange={(ev) => patch(p.id, "type", ev.target.value)}
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  className="ascend-input"
                  placeholder="Goal"
                  value={e.goal || ""}
                  onChange={(ev) => patch(p.id, "goal", ev.target.value)}
                />
                <div className="ascend-np-row">
                  <label>Hrs/wk:</label>
                  <input
                    type="number"
                    className="ascend-input"
                    value={e.weekly_hours_target || 5}
                    onChange={(ev) =>
                      patch(p.id, "weekly_hours_target", Number(ev.target.value))
                    }
                    style={{ width: 60 }}
                  />
                </div>
                <div className="ascend-np-row">
                  <label>Icon:</label>
                  <div className="ascend-emoji-picker">
                    {EMOJI_OPTIONS.map((em) => (
                      <button
                        key={em}
                        className={`ascend-emoji-btn ${e.icon === em ? "active" : ""}`}
                        onClick={() => patch(p.id, "icon", em)}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ascend-np-row">
                  <label>Color:</label>
                  <input
                    type="color"
                    className="ascend-color-input"
                    value={e.color || "#C9A84C"}
                    onChange={(ev) => patch(p.id, "color", ev.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <button
                    className="ascend-router-go"
                    style={{ flex: 1 }}
                    onClick={() => saveEdit(p.id)}
                  >
                    Save
                  </button>
                  <button
                    className="ascend-router-cancel"
                    style={{ flex: 1 }}
                    onClick={() => cancelEdit(p.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <>
                <div className="ascend-proj-header">
                  <span className="ascend-proj-icon">{p.icon}</span>
                  <div className="ascend-proj-meta">
                    <span className="ascend-proj-name">{p.name}</span>
                    <span className="ascend-proj-type">{p.type}</span>
                  </div>
                  <div className="ascend-proj-actions">
                    <button
                      className="ascend-proj-btn"
                      onClick={() => startEdit(p)}
                    >
                      ✎
                    </button>
                    <button
                      className="ascend-proj-btn delete"
                      onClick={() => setConfirmDelete(p.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                {p.goal && (
                  <div className="ascend-proj-goal">{p.goal}</div>
                )}
                <div className="ascend-proj-hours">
                  {p.weekly_hours_target}h/week target
                </div>

                {/* Delete confirmation */}
                {confirmDelete === p.id && (
                  <div className="ascend-proj-confirm">
                    <span>Archive this project?</span>
                    <button
                      className="ascend-proj-confirm-yes"
                      onClick={() => handleDelete(p.id)}
                    >
                      Yes, archive
                    </button>
                    <button
                      className="ascend-proj-confirm-no"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
