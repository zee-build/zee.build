"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchTodayHabits,
  fetchStreaks,
  getMonthlyIncomeTotal,
  fetchTodayBlocks,
  fetchProjects,
  saveJournalEntry,
} from "@/lib/ascend/supabase";
import { getTodaySchedule, getDubaiDate } from "@/lib/ascend/schedule";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "I'm feeling lazy right now",
  "What's my #1 focus today?",
  "tarbiya.ai — what should I post today?",
  "Internet Money — how do I get first client?",
  "I skipped the gym",
  "Brutal weekly reality check",
  "Help me raise tarbiya.ai price today",
  "Which UAE fintechs should I apply to?",
];

const WEEKLY_QUESTIONS = [
  "Income this week: AED [X]. What drove it or blocked it?",
  "Gym sessions: [X]/5. What happened the days you skipped?",
  "tarbiya.ai — what did you actually do for it?",
  "Internet Money — did you reach out to anyone?",
  "Next week's 3 non-negotiables. Name them.",
];

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [weeklyMode, setWeeklyMode] = useState(false);
  const [weeklyIdx, setWeeklyIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const buildSystemPrompt = useCallback(async () => {
    const [habits, streaks, income, blocks, projects] = await Promise.all([
      fetchTodayHabits(),
      fetchStreaks(),
      getMonthlyIncomeTotal(),
      fetchTodayBlocks(),
      fetchProjects(),
    ]);

    const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
    const habitsDone = ALL.filter((h) => habits.find((l) => l.habit_id === h && l.completed)).length;

    const schedule = getTodaySchedule();
    const blocksDone = schedule.filter((_, i) =>
      blocks.find((b) => b.block_index === i && b.completed)
    ).length;
    const schedPct = schedule.length > 0 ? Math.round((blocksDone / schedule.length) * 100) : 0;

    const gymStreak = streaks.find((s) => s.habit_id === "workout")?.current_streak || 0;
    const lcStreak = streaks.find((s) => s.habit_id === "leetcode")?.current_streak || 0;
    const fajrStreak = streaks.find((s) => s.habit_id === "fajr")?.current_streak || 0;

    const projectList = projects.map((p) => `${p.icon} ${p.name} (${p.type})`).join(", ");

    return `You are the brutally honest AI coach for Ziyan (Zee), UAE-based builder. Current stats:
- Habits today: ${habitsDone}/8 complete
- Streak — gym: ${gymStreak}d, leetcode: ${lcStreak}d, fajr: ${fajrStreak}d
- Monthly income: AED ${income.toLocaleString()} / AED 367,000 target
- Active projects: ${projectList}
- tarbiya.ai ($2.99/mo — needs raising to $9.99), Internet Money (AI agency — no clients yet), Yuze salary AED 7K
- Today's schedule: ${schedPct}% complete

Style: Direct. No fluff. Slightly harsh. Never sympathetic about laziness. Always end response with ONE specific action to take RIGHT NOW. Max 120 words per response.`;
  }, []);

  useEffect(() => {
    buildSystemPrompt().then(setSystemPrompt);
  }, [buildSystemPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const adminPass = typeof window !== "undefined"
        ? (sessionStorage.getItem("zb-admin-pass") || "zeebuild2026")
        : "";
      const res = await fetch("/api/ascend/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ascend-auth": adminPass,
        },
        body: JSON.stringify({ message: text, systemPrompt }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection failed. Keep working anyway." },
      ]);
    }

    setLoading(false);
  };

  const handleWeeklyReview = () => {
    setWeeklyMode(true);
    setWeeklyIdx(0);
    setMessages([{ role: "assistant", content: WEEKLY_QUESTIONS[0] }]);
  };

  const handleWeeklyAnswer = async () => {
    if (!input.trim()) return;

    await saveJournalEntry("weekly_review", WEEKLY_QUESTIONS[weeklyIdx], input);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    const nextIdx = weeklyIdx + 1;
    if (nextIdx < WEEKLY_QUESTIONS.length) {
      setWeeklyIdx(nextIdx);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: WEEKLY_QUESTIONS[nextIdx] }]);
      }, 500);
    } else {
      setWeeklyMode(false);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Weekly review saved. Now go execute on those non-negotiables." },
        ]);
      }, 500);
    }
  };

  const isSaturday = getDubaiDate().getDay() === 6;

  return (
    <div className="ascend-coach">
      {/* Messages */}
      <div className="ascend-coach-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="ascend-coach-empty">
            <div className="ascend-coach-empty-icon">🤖</div>
            <div>AI Coach ready. Ask anything or tap a quick prompt.</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`ascend-coach-msg ${m.role}`}>
            <div className="ascend-coach-msg-content">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="ascend-coach-msg assistant">
            <div className="ascend-coach-msg-content ascend-typing">Thinking...</div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="ascend-coach-quick">
        {QUICK_PROMPTS.map((p) => (
          <button key={p} className="ascend-quick-btn" onClick={() => sendMessage(p)}>
            {p}
          </button>
        ))}
        {isSaturday && (
          <button className="ascend-quick-btn weekly" onClick={handleWeeklyReview}>
            📊 Start Weekly Review
          </button>
        )}
      </div>

      {/* Input */}
      <div className="ascend-coach-input-row">
        <input
          className="ascend-coach-input"
          placeholder={weeklyMode ? "Answer the question..." : "Ask your coach..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (weeklyMode) handleWeeklyAnswer();
              else sendMessage(input);
            }
          }}
        />
        <button
          className="ascend-coach-send"
          onClick={() => (weeklyMode ? handleWeeklyAnswer() : sendMessage(input))}
        >
          →
        </button>
      </div>
    </div>
  );
}
