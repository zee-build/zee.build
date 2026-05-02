"use client";

import { useEffect, useState, useCallback } from "react";
import { getDubaiDate } from "@/lib/ascend/schedule";
import {
  HabitLog,
  Streak,
  fetchTodayHabits,
  fetchStreaks,
  toggleHabit,
  saveJournalEntry,
} from "@/lib/ascend/supabase";

const HABITS = [
  { id: "fajr", label: "Fajr Prayer", icon: "🌙", type: "boolean" as const },
  { id: "water", label: "2L Water", icon: "💧", type: "counter" as const, max: 8 },
  { id: "workout", label: "GYM", icon: "🏋️", type: "boolean" as const },
  { id: "leetcode", label: "LeetCode", icon: "💻", type: "boolean" as const },
  { id: "reading", label: "30 min Reading", icon: "📚", type: "boolean" as const },
  { id: "tarbiya", label: "tarbiya.ai task", icon: "📈", type: "boolean" as const },
  { id: "job", label: "Job application/task", icon: "💼", type: "boolean" as const },
  { id: "sleep", label: "Sleep by 10:30pm", icon: "😴", type: "boolean" as const },
];

const SHAME_LINES: Record<string, string> = {
  fajr: "You missed Fajr. This is how decline starts.",
  workout: "No gym today. Your future self noticed.",
  leetcode: "No LeetCode. That job upgrade stays a dream.",
  water: "You're dehydrated and wondering why you're tired.",
  reading: "People who don't read stay exactly where they are.",
  tarbiya: "tarbiya.ai won't grow itself. You know this.",
  job: "No job search today. That AED 18K role won't find you.",
  sleep: "Still awake? Tomorrow's already ruined.",
};

const MILESTONE_MSGS: Record<number, string> = {
  7: "One week. Don't break it.",
  14: "Two weeks. This is becoming identity.",
  30: "30 days. You're not the same person.",
};

const BOOKS = [
  "Atomic Habits",
  "Deep Work",
  "The Lean Startup",
  "Zero to One",
  "The Psychology of Money",
  "Thinking, Fast and Slow",
  "The 4-Hour Workweek",
  "Rich Dad Poor Dad",
  "Start with Why",
  "The Hard Thing About Hard Things",
];

export default function Habits() {
  const [habits, setHabits] = useState<HabitLog[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [milestone, setMilestone] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState(BOOKS[0]);
  const [booksCompleted, setBooksCompleted] = useState(0);

  const loadData = useCallback(async () => {
    const [h, s] = await Promise.all([fetchTodayHabits(), fetchStreaks()]);
    setHabits(h);
    setStreaks(s);

    // Check milestones
    for (const st of s) {
      const msg = MILESTONE_MSGS[st.current_streak];
      if (msg) {
        setMilestone(`🏆 ${st.habit_id.toUpperCase()} — ${msg}`);
        setTimeout(() => setMilestone(null), 5000);
        break;
      }
    }

    // Books count
    const saved = localStorage.getItem("ascend-books-done");
    if (saved) setBooksCompleted(Number(saved));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (habitId: string) => {
    const existing = habits.find((h) => h.habit_id === habitId);
    const newVal = !(existing?.completed);
    await toggleHabit(habitId, newVal, newVal ? 1 : 0);
    loadData();
  };

  const handleWaterIncrement = async () => {
    const existing = habits.find((h) => h.habit_id === "water");
    const currentVal = existing?.value || 0;
    const newVal = Math.min(currentVal + 1, 8);
    await toggleHabit("water", newVal >= 8, newVal);
    loadData();
  };

  const handleBookComplete = async () => {
    await saveJournalEntry("reading_note", `Completed: ${selectedBook}`, selectedBook);
    const newCount = booksCompleted + 1;
    setBooksCompleted(newCount);
    localStorage.setItem("ascend-books-done", String(newCount));
  };

  const hour = getDubaiDate().getHours();
  const showShame = hour >= 20;

  return (
    <div className="ascend-habits">
      {/* Milestone banner */}
      {milestone && <div className="ascend-milestone">{milestone}</div>}

      {/* Habit list */}
      <div className="ascend-section-label">DAILY HABITS</div>
      {HABITS.map((h) => {
        const log = habits.find((l) => l.habit_id === h.id);
        const done = log?.completed;
        const streak = streaks.find((s) => s.habit_id === h.id);
        const streakCount = streak?.current_streak || 0;
        const streakColor =
          streakCount === 0 ? "var(--ascend-red)" : streakCount < 7 ? "#f59e0b" : "var(--ascend-green)";

        return (
          <div key={h.id} className={`ascend-habit-row ${done ? "done" : ""}`}>
            <span className="ascend-habit-icon">{h.icon}</span>
            <div className="ascend-habit-info">
              <span className="ascend-habit-name">{h.label}</span>
              <span className="ascend-habit-streak" style={{ color: streakColor }}>
                🔥 {streakCount}d
              </span>
            </div>
            {h.type === "counter" ? (
              <div className="ascend-water-counter">
                <span>{log?.value || 0}/{h.max}</span>
                <button className="ascend-water-btn" onClick={handleWaterIncrement}>+</button>
              </div>
            ) : (
              <button
                className={`ascend-habit-check ${done ? "checked" : ""}`}
                onClick={() => handleToggle(h.id)}
              >
                {done ? "✓" : "○"}
              </button>
            )}
            {/* Shame line */}
            {showShame && !done && (
              <div className="ascend-habit-shame">{SHAME_LINES[h.id]}</div>
            )}
          </div>
        );
      })}

      {/* Book tracker */}
      <div className="ascend-section-label" style={{ marginTop: 16 }}>
        BOOK TRACKER
      </div>
      <div className="ascend-book-tracker">
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="ascend-book-select"
        >
          {BOOKS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <button className="ascend-book-done-btn" onClick={handleBookComplete}>
          Mark Complete
        </button>
        <div className="ascend-book-count">{booksCompleted} books completed</div>
      </div>
    </div>
  );
}
