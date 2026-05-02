"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getDubaiDate,
  getDubaiTimeStr,
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
  const [clock, setClock] = useState(getDubaiTimeStr());
  const [dateStr] = useState(getDubaiDateStr());
  const [weather, setWeather] = useState("");
  const [income, setIncome] = useState(0);
  const [habits, setHabits] = useState<HabitLog[]>([]);
  const [blocks, setBlocks] = useState<BlockLog[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [currentBlockIdx, setCurrentBlockIdx] = useState(getCurrentBlockIndex());

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
  }, []);

  useEffect(() => {
    loadData();
    // Weather
    const cached = localStorage.getItem("ascend-weather");
    const cachedAt = localStorage.getItem("ascend-weather-at");
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 3600000) {
      setWeather(cached);
    } else {
      fetch("https://wttr.in/Dubai?format=%C+%t")
        .then((r) => r.text())
        .then((t) => {
          const w = t.trim();
          setWeather(w);
          localStorage.setItem("ascend-weather", w);
          localStorage.setItem("ascend-weather-at", String(Date.now()));
        })
        .catch(() => setWeather(""));
    }
  }, [loadData]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => {
      setClock(getDubaiTimeStr());
      setCurrentBlockIdx(getCurrentBlockIndex());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const schedule = getTodaySchedule();
  const pct = income > 0 ? Math.min((income / TARGET) * 100, 100) : 0;
  const daysLeft = (() => {
    const d = getDubaiDate();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
  })();
  const dailyNeeded = daysLeft > 0 ? Math.ceil((TARGET - income) / daysLeft) : TARGET - income;
  const minsInBlock = getMinutesIntoBlock();

  const incomeColor = pct < 10 ? "var(--ascend-red)" : pct < 50 ? "#f59e0b" : "var(--ascend-green)";

  const handleHabitToggle = async (habitId: string) => {
    const existing = habits.find((h) => h.habit_id === habitId);
    const newVal = !(existing?.completed);
    await toggleHabit(habitId, newVal, newVal ? 1 : 0);
    loadData();
  };

  return (
    <div className="ascend-dashboard">
      {/* Top bar */}
      <div className="ascend-top-bar">
        <div className="ascend-clock">{clock}</div>
        <div className="ascend-date">{dateStr}</div>
        <div className="ascend-block-now">
          {currentBlockIdx >= 0 && schedule[currentBlockIdx] && (
            <>
              {schedule[currentBlockIdx].icon} {schedule[currentBlockIdx].label}
              <span className="ascend-mins-in"> · {minsInBlock}m in</span>
            </>
          )}
        </div>
        {weather && <div className="ascend-weather-line">{weather}</div>}
      </div>

      {/* Income hero */}
      <div className="ascend-income-hero">
        <div className="ascend-income-number" style={{ color: incomeColor }}>
          AED {income.toLocaleString()} <span className="ascend-income-target">/ AED {TARGET.toLocaleString()}</span>
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
              className={`ascend-timeline-block ${isPast ? "past" : ""} ${isCurrent ? "current" : ""} ${done ? "done" : ""}`}
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
          const color = count === 0 ? "var(--ascend-red)" : count < 7 ? "#f59e0b" : "var(--ascend-green)";
          return (
            <div key={s.id} className="ascend-streak-item">
              <span className="ascend-streak-count" style={{ color }}>{count}</span>
              <span className="ascend-streak-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
