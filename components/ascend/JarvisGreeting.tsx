"use client";

import { useEffect, useState } from "react";
import {
  getDubaiDate,
  getDubaiTimeStr,
  getDubaiDateStr,
  getCurrentBlock,
  getMinutesIntoBlock,
  isUAEWeekend,
  getYesterdayISO,
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
    // Check if already shown today
    const lastShown = localStorage.getItem("ascend-greeting-date");
    const today = getDubaiDate().toDateString();
    if (lastShown === today) {
      onDismiss();
      return;
    }

    async function load() {
      // Fetch weather
      let wx = "";
      try {
        const cached = localStorage.getItem("ascend-weather");
        const cachedAt = localStorage.getItem("ascend-weather-at");
        if (cached && cachedAt && Date.now() - Number(cachedAt) < 3600000) {
          wx = cached;
        } else {
          const r = await fetch("https://wttr.in/Dubai?format=%C+%t");
          wx = await r.text();
          wx = wx.trim();
          localStorage.setItem("ascend-weather", wx);
          localStorage.setItem("ascend-weather-at", String(Date.now()));
        }
      } catch {
        wx = "Weather unavailable";
      }
      setWeather(wx);

      // Fetch yesterday's habits
      const yHabits = await fetchYesterdayHabits();
      const yDone = ALL_HABITS.filter((h) =>
        yHabits.find((l) => l.habit_id === h && l.completed)
      ).length;

      const now = getDubaiDate();
      const timeStr = getDubaiTimeStr();
      const dateStr = getDubaiDateStr();
      const block = getCurrentBlock();
      const minsIn = getMinutesIntoBlock();
      const weekend = isUAEWeekend();
      const dayName = now.toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", weekday: "long" });
      const hour = now.getHours();
      const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

      let text = "";
      if (weekend) {
        text = `${dayName}, Zee. ${timeStr} AM. Light day — but light doesn't mean zero. `;
        text += `Yesterday: ${yDone}/${ALL_HABITS.length} habits. `;
        if (block) {
          text += `Current block: ${block.icon} ${block.label}. `;
        }
        text += `${wx}. One tarbiya.ai task. One chapter. That's it. What's the focus?`;
      } else {
        text = `Good ${timeOfDay} Zee. ${dayName}, ${dateStr} — ${timeStr} in Dubai. `;
        text += `${wx}. Yesterday: ${yDone}/${ALL_HABITS.length} habits. `;
        if (yDone < 6) text += "Not your best. ";
        if (block) {
          text += `You should be in your ${block.label} block right now. ${minsIn} minutes in already. `;
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

  if (!visible && !greeting) return null;

  return (
    <div
      className="ascend-greeting-overlay"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      <div className="ascend-greeting-content">
        <div className="ascend-greeting-label">ASCEND OS</div>
        <div className="ascend-greeting-weather">{weather}</div>
        <p className="ascend-greeting-text">{greeting}</p>
        <button className="ascend-greeting-btn" onClick={handleDismiss}>
          LET&apos;S GO →
        </button>
      </div>
    </div>
  );
}
