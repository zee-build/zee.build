"use client";

import { useEffect, useState } from "react";
import {
  getDubaiDate,
  getDubaiHour,
  getDubaiTimeStr,
  getDubaiDateStr,
  getCurrentBlock,
  getMinutesIntoBlock,
  isUAEWeekend,
} from "@/lib/ascend/schedule";
import { fetchYesterdayHabits } from "@/lib/ascend/supabase";

interface Props {
  onDismiss: () => void;
}

const ALL_HABITS = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];

export default function JarvisGreeting({ onDismiss }: Props) {
  const [greeting, setGreeting] = useState("");
  const [weather, setWeather] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if already shown today (once per Dubai calendar day)
    const lastShown = localStorage.getItem("ascend-greeting-date");
    const today = getDubaiDate().toDateString();
    if (lastShown === today) {
      onDismiss();
      return;
    }

    async function load() {
      // Fetch weather — use localStorage cache (1-hour TTL)
      let wx = "";
      try {
        const cached = localStorage.getItem("ascend-weather");
        const cachedAt = localStorage.getItem("ascend-weather-at");
        if (cached && cachedAt && Date.now() - Number(cachedAt) < 3600000) {
          wx = cached;
        } else {
          const r = await fetch("/api/ascend/weather");
          const data = await r.json();
          wx = data.weather || "Weather unavailable";
          localStorage.setItem("ascend-weather", wx);
          localStorage.setItem("ascend-weather-at", String(Date.now()));
        }
      } catch {
        wx = "Weather unavailable";
      }
      setWeather(wx);

      // Fetch yesterday's habits from Supabase (live, not hardcoded)
      const yHabits = await fetchYesterdayHabits();
      const yDone = ALL_HABITS.filter((h) =>
        yHabits.find((l) => l.habit_id === h && l.completed)
      ).length;
      const yPct = Math.round((yDone / ALL_HABITS.length) * 100);

      const now = getDubaiDate();
      const timeStr = getDubaiTimeStr();
      const dateStr = getDubaiDateStr();
      const block = getCurrentBlock();
      const minsIn = getMinutesIntoBlock();
      const weekend = isUAEWeekend();
      const dayName = now.toLocaleDateString("en-GB", { weekday: "long" });
      const hour = getDubaiHour(); // correct Dubai hour, any browser timezone
      const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

      let text = "";
      if (weekend) {
        text = `${dayName}, Zee. ${timeStr} — light day but light doesn't mean zero. `;
        text += `Yesterday: ${yDone}/${ALL_HABITS.length} habits (${yPct}%). `;
        if (yPct < 75) text += "Build on that. ";
        if (block) {
          text += `Current block: ${block.icon} ${block.label}. `;
        }
        text += `${wx}. One tarbiya.ai task. One chapter. That's it. What's the focus?`;
      } else {
        text = `Good ${timeOfDay}, Zee. ${dayName}, ${dateStr} — ${timeStr} Dubai. `;
        text += `${wx}. Yesterday: ${yDone}/${ALL_HABITS.length} habits (${yPct}%). `;
        if (yDone < 6) text += "Not your best. Make today different. ";
        if (block) {
          text += `You should be in your ${block.label} block right now. ${minsIn} minutes in. `;
        }
        text += "What are you working on?";
      }

      setGreeting(text);
      setVisible(true);
    }

    load();
  }, [onDismiss]);

  const handleDismiss = () => {
    localStorage.setItem("ascend-greeting-date", getDubaiDate().toDateString());
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  // Don't render until we know it should show
  if (!visible && !greeting) return null;

  return (
    <div
      className="ascend-greeting-overlay"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div className="ascend-greeting-content">
        <div className="ascend-greeting-label">ASCEND OS</div>
        <div className="ascend-greeting-weather">{weather}</div>
        <p className="ascend-greeting-text">{greeting || "Loading your briefing…"}</p>
        <button className="ascend-greeting-btn" onClick={handleDismiss}>
          LET&apos;S GO →
        </button>
      </div>
    </div>
  );
}
