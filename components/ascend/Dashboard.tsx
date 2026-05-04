"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getDubaiDate,
  getDubaiDateStr,
  getTodaySchedule,
  getCurrentBlockIndex,
  getMinutesIntoBlock,
} from "@/lib/ascend/schedule";
import {
  HabitLog,
  BlockLog,
  Streak,
  fetchTodayHabits,
  fetchTodayBlocks,
  fetchStreaks,
  getMonthlyIncomeTotal,
  toggleHabit,
} from "@/lib/ascend/supabase";
import ShameEngine from "./ShameEngine";

const TARGET = 367000;
const HABIT_RINGS = [
  { id: "water", icon: "💧", label: "Water" },
  { id: "workout", icon: "🏋️", label: "Gym" },
  { id: "leetcode", icon: "💻", label: "LeetCode" },
  { id: "fajr", icon: "🌙", label: "Fajr" },
  { id: "reading", icon: "📚", label: "Reading" },
  { id: "sleep", icon: "😴", label: "Sleep" },
];

const STREAK_ITEMS = [
  { id: "fajr", label: "Fajr" },
  { id: "workout", label: "Gym" },
  { id: "leetcode", label: "LeetCode" },
  { id: "water", label: "Water" },
];

interface Props {
  onBlockTap: (blockIndex: number) => void;
}

export default function Dashboard({ onBlockTap }: Props) {
  const [dateStr] = useState(getDubaiDateStr());
  const [weather, setWeather] = useState<string | null>(null); // null = loading
  const [income, setIncome] = useState(0);
  const [habits, setHabits] = useState<HabitLog[]>([]);
  const [blocks, setBlocks] = useState<BlockLog[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [currentBlockIdx, setCurrentBlockIdx] = useState(getCurrentBlockIndex());
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [h, b, s, inc] = await Promise.all([
      fetchTodayHabits(),
      fetchTodayBlocks(),
      fetchStreaks(),
      getMonthlyIncomeTotal(),
    ]);
    setHabits(h);
    setBlocks(b);
    setStreaks(s);
    setIncome(inc);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    // Weather — localStorage cache (1 hour TTL)
    const cached = localStorage.getItem("ascend-weather");
    const cachedAt = localStorage.getItem("ascend-weather-at");
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3600000) {
      setWeather(cached);
    } else {
      fetch("/api/ascend/weather")
        .then((r) => r.json())
        .then((data) => {
          const w = data.weather || "";
          setWeather(w);
          localStorage.setItem("ascend-weather", w);
          localStorage.setItem("ascend-weather-at", String(Date.now()));
        })
        .catch(() => setWeather(""));
    }
  }, [loadData]);

  // Block index refresh
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentBlockIdx(getCurrentBlockIndex());
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const schedule = getTodaySchedule();
  const pct = income > 0 ? Math.min((income / TARGET) * 100, 100) : 0;
  const daysLeft = (() => {
    const d = getDubaiDate();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
  })();
  const dailyNeeded =
    daysLeft > 0 ? Math.ceil((TARGET - income) / daysLeft) : TARGET - income;
  const minsInBlock = getMinutesIntoBlock();
  const incomeColor =
    pct < 10
      ? "var(--ascend-red)"
      : pct < 50
      ? "#f59e0b"
      : "var(--ascend-green)";

  const handleHabitToggle = async (habitId: string) => {
    const existing = habits.find((h) => h.habit_id === habitId);
    const newVal = !existing?.completed;
    // Optimistic update — feels instant
    setHabits((prev) =>
      prev.some((h) => h.habit_id === habitId)
        ? prev.map((h) => h.habit_id === habitId ? { ...h, completed: newVal } : h)
        : [...prev, { id: "", date: "", habit_id: habitId, completed: newVal, value: newVal ? 1 : 0 }]
    );
    await toggleHabit(habitId, newVal, newVal ? 1 : 0);
    loadData();
  };

  if (loading) {
    return (
      <div className="ascend-dashboard">
        <div className="ascend-top-bar">
          <div className="ascend-date">{dateStr}</div>
        </div>
        <div className="ascend-skeleton ascend-skeleton-hero" />
        <div className="ascend-skeleton ascend-skeleton-row" />
        <div className="ascend-skeleton ascend-skeleton-row" />
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ascend-skeleton ascend-skeleton-ring" />
          ))}
        </div>
      </div>
    );
  }

  const habitsToday = habits.filter((h) => h.completed).length;
  const bestStreak = streaks.reduce((max, s) => Math.max(max, s.current_streak), 0);
  const blocksPct =
    schedule.length > 0
      ? Math.round(
          (schedule.filter((_, i) => blocks.find((b) => b.block_index === i && b.completed)).length /
            schedule.length) *
            100
        )
      : 0;

  return (
    <div className="ascend-dashboard">
      {/* Top bar */}
      <div className="ascend-top-bar">
        <div className="ascend-date">{dateStr}</div>
        <div className="ascend-block-now">
          {currentBlockIdx >= 0 && schedule[currentBlockIdx] && (
            <>
              {schedule[currentBlockIdx].icon} {schedule[currentBlockIdx].label}
              <span className="ascend-mins-in"> · {minsInBlock}m in</span>
            </>
          )}
        </div>
        {weather !== null && weather && (
          <div className="ascend-weather-line">{weather}</div>
        )}
      </div>

      {/* KPI cards */}
      <div className="ascend-kpi-grid">
        <div className="ascend-kpi-card" style={{ borderColor: incomeColor }}>
          <div className="ascend-kpi-value" style={{ color: incomeColor }}>
            {Math.round(pct)}%
          </div>
          <div className="ascend-kpi-label">Income goal</div>
          <div className="ascend-kpi-sub">AED {income.toLocaleString()}</div>
        </div>
        <div className="ascend-kpi-card" style={{ borderColor: habitsToday >= 6 ? "var(--ascend-green)" : habitsToday >= 3 ? "#f59e0b" : "var(--ascend-red)" }}>
          <div className="ascend-kpi-value" style={{ color: habitsToday >= 6 ? "var(--ascend-green)" : habitsToday >= 3 ? "#f59e0b" : "var(--ascend-red)" }}>
            {habitsToday}/8
          </div>
          <div className="ascend-kpi-label">Habits today</div>
          <div className="ascend-kpi-sub">{habitsToday >= 6 ? "Strong day" : habitsToday >= 3 ? "Keep going" : "Get moving"}</div>
        </div>
        <div className="ascend-kpi-card" style={{ borderColor: bestStreak >= 7 ? "var(--ascend-green)" : bestStreak > 0 ? "#f59e0b" : "var(--ascend-red)" }}>
          <div className="ascend-kpi-value" style={{ color: bestStreak >= 7 ? "var(--ascend-green)" : bestStreak > 0 ? "#f59e0b" : "var(--ascend-red)" }}>
            {bestStreak}d
          </div>
          <div className="ascend-kpi-label">Best streak</div>
          <div className="ascend-kpi-sub">🔥 keep it</div>
        </div>
        <div className="ascend-kpi-card" style={{ borderColor: blocksPct >= 70 ? "var(--ascend-green)" : blocksPct >= 30 ? "#f59e0b" : "var(--ascend-red)" }}>
          <div className="ascend-kpi-value" style={{ color: blocksPct >= 70 ? "var(--ascend-green)" : blocksPct >= 30 ? "#f59e0b" : "var(--ascend-red)" }}>
            {blocksPct}%
          </div>
          <div className="ascend-kpi-label">Blocks done</div>
          <div className="ascend-kpi-sub">Today&apos;s schedule</div>
        </div>
      </div>

      {/* Income hero */}
      <div className="ascend-income-hero">
        <div
          className="ascend-income-number"
          style={{ color: incomeColor }}
        >
          AED {income.toLocaleString()}{" "}
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
          Need AED {dailyNeeded.toLocaleString()}/day · {daysLeft} days left
        </div>
      </div>

      {/* Shame engine */}
      <ShameEngine habits={habits} blocks={blocks} />

      {/* Timeline */}
      <div className="ascend-timeline">
        <div className="ascend-section-label">TODAY&apos;S TIMELINE</div>
        {schedule.map((block, i) => {
          const isPast = i < currentBlockIdx;
          const isCurrent = i === currentBlockIdx;
          const blockLog = blocks.find((b) => b.block_index === i);
          const done = blockLog?.completed;

          return (
            <button
              key={i}
              className={`ascend-timeline-block ${isPast ? "past" : ""} ${
                isCurrent ? "current" : ""
              } ${done ? "done" : ""}`}
              onClick={() => onBlockTap(i)}
            >
              <span className="ascend-tl-time">{block.time}</span>
              <span className="ascend-tl-icon">{block.icon}</span>
              <span className="ascend-tl-label">{block.label}</span>
              <span className="ascend-tl-status">
                {done ? "✓" : isPast && !done ? "✗" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* Habit rings */}
      <div className="ascend-section-label">HABITS</div>
      <div className="ascend-habit-rings">
        {HABIT_RINGS.map((h) => {
          const log = habits.find((l) => l.habit_id === h.id);
          const done = log?.completed;
          return (
            <button
              key={h.id}
              className={`ascend-habit-ring ${done ? "done" : ""}`}
              onClick={() => handleHabitToggle(h.id)}
            >
              <div className="ascend-ring-circle">
                <span>{h.icon}</span>
              </div>
              <span className="ascend-ring-label">{h.label}</span>
            </button>
          );
        })}
      </div>

      {/* Streaks */}
      <div className="ascend-section-label">STREAKS</div>
      <div className="ascend-streaks">
        {STREAK_ITEMS.map((s) => {
          const streak = streaks.find((st) => st.habit_id === s.id);
          const count = streak?.current_streak || 0;
          const color =
            count === 0
              ? "var(--ascend-red)"
              : count < 7
              ? "#f59e0b"
              : "var(--ascend-green)";
          return (
            <div key={s.id} className="ascend-streak-item">
              <span className="ascend-streak-count" style={{ color }}>
                {count}
              </span>
              <span className="ascend-streak-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
