"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IncomeEntry,
  Project,
  fetchMonthlyIncome,
  fetchProjects,
  logIncome,
  fetchPipeline,
  savePipeline,
  PipelineState,
} from "@/lib/ascend/supabase";
import { getDaysLeftInMonth, getCurrentMonth } from "@/lib/ascend/schedule";

const TARGET = 367000;
const FIXED_STREAMS = ["yuze", "freelance", "trading", "other"];
const AED_PER_USD = 3.67;

export default function Income() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stream, setStream] = useState("yuze");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [tarbiyaSubs, setTarbiyaSubs] = useState(50);
  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState<PipelineState>({
    leads: 0,
    calls: 0,
    proposals: 0,
    closed: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    const [e, p, pip] = await Promise.all([
      fetchMonthlyIncome(),
      fetchProjects(),
      fetchPipeline(),
    ]);
    setEntries(e);
    setProjects(p);
    setPipeline(pip);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const total = entries.reduce((s, e) => s + Number(e.amount_aed), 0);
  const pct = total > 0 ? Math.min((total / TARGET) * 100, 100) : 0;
  const daysLeft = getDaysLeftInMonth();
  const dailyNeeded =
    daysLeft > 0 ? Math.ceil((TARGET - total) / daysLeft) : TARGET - total;
  const incomeColor =
    pct < 10 ? "var(--ascend-red)" : pct < 50 ? "#f59e0b" : "var(--ascend-green)";

  // Stream breakdown
  const streamTotals: Record<string, number> = {};
  entries.forEach((e) => {
    streamTotals[e.stream] = (streamTotals[e.stream] || 0) + Number(e.amount_aed);
  });

  const allStreams = [...FIXED_STREAMS, ...projects.map((p) => p.name)];

  const handleLog = async () => {
    if (!amount || Number(amount) <= 0) return;
    await logIncome(stream, Number(amount), note);
    setAmount("");
    setNote("");
    loadData();
  };

  const updatePipeline = async (key: keyof PipelineState, delta: number) => {
    const updated: PipelineState = {
      ...pipeline,
      [key]: Math.max(0, pipeline[key] + delta),
    };
    setPipeline(updated);
    await savePipeline(updated); // persisted to Supabase kv_store
  };

  // tarbiya income this month
  const tarbiyaIncome = entries
    .filter((e) => e.stream === "tarbiya.ai" || e.stream === "tarbiya")
    .reduce((s, e) => s + Number(e.amount_aed), 0);

  const prices = [2.99, 4.99, 9.99, 14.99];

  if (loading) {
    return (
      <div className="ascend-income">
        <div className="ascend-skeleton ascend-skeleton-hero" />
        <div className="ascend-skeleton ascend-skeleton-row" />
        <div className="ascend-skeleton ascend-skeleton-row" />
        <div className="ascend-skeleton ascend-skeleton-row" />
      </div>
    );
  }

  return (
    <div className="ascend-income">
      {/* Monthly dashboard */}
      <div className="ascend-income-hero">
        <div className="ascend-income-number" style={{ color: incomeColor }}>
          AED {total.toLocaleString()}{" "}
          <span className="ascend-income-target">
            / AED {TARGET.toLocaleString()}
          </span>
        </div>
        <div className="ascend-progress-bar">
          <div
            className="ascend-progress-fill"
            style={{ width: `${pct}%`, background: incomeColor }}
          />
        </div>
        <div className="ascend-income-sub">
          Need AED {dailyNeeded.toLocaleString()}/day · {daysLeft} days left ·{" "}
          {getCurrentMonth()}
        </div>
      </div>

      {/* Stream breakdown */}
      <div className="ascend-section-label">BREAKDOWN BY STREAM</div>
      {Object.keys(streamTotals).length === 0 ? (
        <div style={{ color: "var(--ascend-text-faint)", fontSize: 11, marginBottom: 10 }}>
          No income logged this month.
        </div>
      ) : (
        <div className="ascend-stream-bars">
          {Object.entries(streamTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([name, amt]) => (
              <div key={name} className="ascend-stream-bar">
                <span className="ascend-stream-name">{name}</span>
                <div className="ascend-stream-bar-bg">
                  <div
                    className="ascend-stream-bar-fill"
                    style={{
                      width: `${total > 0 ? (amt / total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="ascend-stream-amt">
                  AED {amt.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Log income */}
      <div className="ascend-section-label">LOG INCOME</div>
      <div className="ascend-income-form">
        <select
          className="ascend-input"
          value={stream}
          onChange={(e) => setStream(e.target.value)}
        >
          {allStreams.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          className="ascend-input"
          type="number"
          placeholder="Amount (AED)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="ascend-input"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="ascend-router-go" onClick={handleLog}>
          Log Income
        </button>
      </div>

      {/* tarbiya.ai calculator */}
      <div className="ascend-section-label">TARBIYA.AI CALCULATOR</div>
      <div className="ascend-tarbiya-calc">
        {/* Red nudge when income === 0 (no tarbiya revenue logged yet) */}
        {tarbiyaIncome === 0 && (
          <div className="ascend-tarbiya-zero-nudge">
            Still at $2.99? Raise it to $9.99 today. Every day you wait is money
            left on the table.
          </div>
        )}

        <div className="ascend-tarbiya-slider">
          <label>Subscribers: {tarbiyaSubs}</label>
          <input
            type="range"
            min={0}
            max={500}
            value={tarbiyaSubs}
            onChange={(e) => setTarbiyaSubs(Number(e.target.value))}
            className="ascend-slider"
          />
        </div>
        <div className="ascend-tarbiya-prices">
          {prices.map((p) => {
            const rev = Math.round(tarbiyaSubs * p * AED_PER_USD);
            return (
              <div key={p} className="ascend-tarbiya-price-row">
                <span>${p}/mo</span>
                <span>→ AED {rev.toLocaleString()}/mo</span>
              </div>
            );
          })}
        </div>
        <div className="ascend-tarbiya-need">
          You need {Math.ceil(6000 / (9.99 * AED_PER_USD))} users at $9.99 to
          hit AED 6,000/mo
        </div>
        {tarbiyaIncome > 0 && tarbiyaIncome < 5000 && (
          <div className="ascend-tarbiya-warn">
            ⚠️ Current tarbiya.ai income below AED 5K — raise the price.
          </div>
        )}
      </div>

      {/* Internet Money pipeline — saved to Supabase */}
      <div className="ascend-section-label">INTERNET MONEY PIPELINE</div>
      <div className="ascend-pipeline">
        {(["leads", "calls", "proposals", "closed"] as const).map((key) => (
          <div key={key} className="ascend-pipeline-item">
            <span className="ascend-pipeline-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
            <div className="ascend-pipeline-controls">
              <button onClick={() => updatePipeline(key, -1)}>−</button>
              <span className="ascend-pipeline-count">{pipeline[key]}</span>
              <button onClick={() => updatePipeline(key, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
