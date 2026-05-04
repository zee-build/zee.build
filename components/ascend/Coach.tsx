"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchTodayHabits,
  fetchStreaks,
  getMonthlyIncomeTotal,
  fetchTodayBlocks,
  fetchProjects,
  fetchHabitsForDates,
  saveJournalEntry,
} from "@/lib/ascend/supabase";
import { getTodaySchedule, getDubaiDate } from "@/lib/ascend/schedule";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Negative/lazy phrases that trigger the 5-minute commitment nudge
const LAZY_PATTERNS = [
  /don'?t feel like/i,
  /not feel(ing)? like/i,
  /can'?t be bothered/i,
  /too tired/i,
  /too lazy/i,
  /not motivated/i,
  /procrastinat/i,
  /just want to (chill|relax|sleep|rest|watch)/i,
  /maybe tomorrow/i,
  /skip(ping)? (today|it|this)/i,
  /can'?t do it/i,
  /no energy/i,
  /feeling lazy/i,
];

function isLazyMessage(text: string): boolean {
  return LAZY_PATTERNS.some((p) => p.test(text));
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

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [coachAvailable, setCoachAvailable] = useState(true);
  const [weeklyMode, setWeeklyMode] = useState(false);
  const [weeklyQuestions, setWeeklyQuestions] = useState<string[]>([]);
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
    const habitsDone = ALL.filter((h) =>
      habits.find((l) => l.habit_id === h && l.completed)
    ).length;

    const schedule = getTodaySchedule();
    const blocksDone = schedule.filter((_, i) =>
      blocks.find((b) => b.block_index === i && b.completed)
    ).length;
    const schedPct =
      schedule.length > 0 ? Math.round((blocksDone / schedule.length) * 100) : 0;

    const gymStreak =
      streaks.find((s) => s.habit_id === "workout")?.current_streak || 0;
    const lcStreak =
      streaks.find((s) => s.habit_id === "leetcode")?.current_streak || 0;
    const fajrStreak =
      streaks.find((s) => s.habit_id === "fajr")?.current_streak || 0;
    const lastBlock = blocks
      .filter((b) => b.completed)
      .sort((a, b) => b.block_index - a.block_index)[0];
    const lastBlockLabel =
      lastBlock !== undefined
        ? schedule[lastBlock.block_index]?.label || "unknown"
        : "none yet";

    const projectList = projects
      .map((p) => `${p.icon} ${p.name} (${p.type})`)
      .join(", ");

    return `You are the brutally honest AI coach for Ziyan (Zee), UAE-based builder. LIVE STATS RIGHT NOW:
- Habits today: ${habitsDone}/8 complete
- Streak — gym: ${gymStreak}d, leetcode: ${lcStreak}d, fajr: ${fajrStreak}d
- Monthly income: AED ${income.toLocaleString()} / AED 367,000 target
- Today's schedule: ${schedPct}% complete · last block done: ${lastBlockLabel}
- Active projects: ${projectList}
- tarbiya.ai ($2.99/mo — MUST raise to $9.99), Internet Money (AI agency — no clients yet), Yuze AED 7K salary

Style: Direct. No fluff. Slightly harsh. Never sympathetic about laziness. If the user sounds lazy or unmotivated, push them to commit to just 5 minutes — then they'll keep going. Always end with ONE specific action to take RIGHT NOW. Max 120 words per response.`;
  }, []);

  useEffect(() => {
    buildSystemPrompt().then(setSystemPrompt);
  }, [buildSystemPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Check for lazy/negative sentiment before sending to API
    let enrichedText = text;
    if (isLazyMessage(text)) {
      enrichedText =
        text +
        " [Note: user sounds unmotivated — respond with the 5-minute commitment technique. Ask them to do just 5 minutes of the next block/habit.]";
    }

    const userMsg: Message = { role: "user", content: text }; // display original
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const adminPass =
        typeof window !== "undefined"
          ? sessionStorage.getItem("zb-admin-pass") || "zeebuild2026"
          : "";

      // Send full conversation history so coach has memory
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m === userMsg ? enrichedText : m.content,
      }));

      const res = await fetch("/api/ascend/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ascend-auth": adminPass,
        },
        body: JSON.stringify({ messages: apiMessages, systemPrompt }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Unauthorized. Contact Zee." },
        ]);
        return;
      }

      if (data.unavailable) {
        setCoachAvailable(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Coach unavailable — OPENAI_API_KEY not configured. Add it to your environment variables.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection failed. Keep working anyway.",
        },
      ]);
    }

    setLoading(false);
  };

  const buildWeeklyQuestions = async (): Promise<string[]> => {
    // Fetch this week's habit data to auto-populate questions
    const today = new Date();
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      weekDates.push(
        new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(d)
      );
    }

    const [habitsThisWeek, income] = await Promise.all([
      fetchHabitsForDates(weekDates),
      getMonthlyIncomeTotal(),
    ]);

    const gymDays = weekDates.filter((d) =>
      habitsThisWeek.find(
        (h) => h.date === d && h.habit_id === "workout" && h.completed
      )
    ).length;

    const totalDone = habitsThisWeek.filter((h) => h.completed).length;
    const totalPossible = 8 * 7;
    const habitPct = Math.round((totalDone / totalPossible) * 100);

    return [
      `Income this week contributed to AED ${income.toLocaleString()} this month. What drove it or blocked it?`,
      `Gym sessions this week: ${gymDays}/5. What happened the days you skipped?`,
      `tarbiya.ai — what did you actually do for it this week?`,
      `Internet Money — did you reach out to anyone? If no, why not?`,
      `Habit completion this week: ${habitPct}%. Next week's 3 non-negotiables. Name them.`,
    ];
  };

  const handleWeeklyReview = async () => {
    setLoading(true);
    const questions = await buildWeeklyQuestions();
    setWeeklyQuestions(questions);
    setWeeklyMode(true);
    setWeeklyIdx(0);
    setMessages([{ role: "assistant", content: questions[0] }]);
    setLoading(false);
  };

  const handleWeeklyAnswer = async () => {
    if (!input.trim()) return;

    await saveJournalEntry("weekly_review", weeklyQuestions[weeklyIdx], input);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    const nextIdx = weeklyIdx + 1;
    if (nextIdx < weeklyQuestions.length) {
      setWeeklyIdx(nextIdx);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: weeklyQuestions[nextIdx] },
        ]);
      }, 500);
    } else {
      setWeeklyMode(false);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Weekly review saved. Now go execute on those non-negotiables.",
          },
        ]);
      }, 500);
    }
  };

  const isSaturday = getDubaiDate().getDay() === 6;

  if (!coachAvailable && messages.length === 0) {
    return (
      <div className="ascend-coach">
        <div className="ascend-coach-messages">
          <div className="ascend-coach-empty">
            <div className="ascend-coach-empty-icon">🤖</div>
            <div style={{ color: "var(--ascend-red)" }}>
              Coach unavailable — add OPENAI_API_KEY to your environment.
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="ascend-coach-msg-content ascend-typing">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="ascend-coach-quick">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            className="ascend-quick-btn"
            onClick={() => sendMessage(p)}
          >
            {p}
          </button>
        ))}
        {isSaturday && (
          <button
            className="ascend-quick-btn weekly"
            onClick={handleWeeklyReview}
            disabled={loading}
          >
            📊 Start Weekly Review
          </button>
        )}
      </div>

      {/* Input */}
      <div className="ascend-coach-input-row">
        <input
          className="ascend-coach-input"
          placeholder={
            weeklyMode ? "Answer the question…" : "Ask your coach…"
          }
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
