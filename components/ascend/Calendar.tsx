"use client";

import { useEffect, useState, useCallback } from "react";
import {
  WEEKDAY_SCHEDULE,
  WEEKEND_SCHEDULE,
  isUAEWeekend,
  getCurrentBlockIndex,
  getGoogleCalendarUrl,
  getTodayISO,
} from "@/lib/ascend/schedule";
import { BlockLog, fetchTodayBlocks, logBlock } from "@/lib/ascend/supabase";

function getWeekStrip(): { label: string; date: string; isToday: boolean; isWeekend: boolean }[] {
  const today = getTodayISO();
  const todayDate = new Date(today + "T00:00:00");
  const dayOfWeek = todayDate.getDay(); // 0=Sun

  // Build Mon-Sun strip starting from this week's Monday
  const monday = new Date(todayDate);
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(todayDate.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    return {
      label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      date: iso,
      isToday: iso === today,
      isWeekend: dow === 5 || dow === 6, // Fri-Sat = UAE weekend
    };
  });
}

export default function Calendar() {
  const [mode, setMode] = useState<"weekday" | "weekend">(
    isUAEWeekend() ? "weekend" : "weekday"
  );
  const [blocks, setBlocks] = useState<BlockLog[]>([]);
  const [calAdded, setCalAdded] = useState(false);
  const [showGcal, setShowGcal] = useState(false);
  const currentIdx = getCurrentBlockIndex();
  const gcalSrc = process.env.NEXT_PUBLIC_GCAL_EMBED_SRC || "";

  const schedule = mode === "weekend" ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
  const weekStrip = getWeekStrip();

  const loadBlocks = useCallback(async () => {
    const b = await fetchTodayBlocks();
    setBlocks(b);
  }, []);

  useEffect(() => {
    loadBlocks();
    const saved = localStorage.getItem("ascend-cal-added");
    if (saved === "true") setCalAdded(true);
  }, [loadBlocks]);

  const toggleBlock = async (idx: number) => {
    const existing = blocks.find((b) => b.block_index === idx);
    const newVal = !existing?.completed;
    // Optimistic update — feels instant
    setBlocks((prev) =>
      prev.some((b) => b.block_index === idx)
        ? prev.map((b) => b.block_index === idx ? { ...b, completed: newVal } : b)
        : [...prev, { id: "", date: "", block_index: idx, completed: newVal, project_id: null, work_description: null }]
    );
    await logBlock(idx, newVal);
    loadBlocks();
  };

  const completedCount = schedule.filter((_, i) =>
    blocks.find((b) => b.block_index === i && b.completed)
  ).length;
  const pct =
    schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  return (
    <div className="ascend-calendar">
      {/* Week strip */}
      <div className="ascend-week-strip">
        {weekStrip.map((d) => (
          <div
            key={d.date}
            className={`ascend-week-day ${d.isToday ? "today" : ""} ${d.isWeekend ? "weekend" : ""}`}
          >
            <span className="ascend-week-label">{d.label}</span>
            <span className="ascend-week-date">{d.date.slice(8)}</span>
            {d.isToday && <span className="ascend-week-dot" />}
          </div>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="ascend-mode-toggle">
        <button
          className={mode === "weekday" ? "active" : ""}
          onClick={() => setMode("weekday")}
        >
          WEEKDAY
        </button>
        <button
          className={mode === "weekend" ? "active" : ""}
          onClick={() => setMode("weekend")}
        >
          WEEKEND
        </button>
      </div>

      {/* Progress */}
      <div className="ascend-cal-progress">
        <div className="ascend-cal-progress-bar">
          <div className="ascend-cal-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="ascend-cal-pct-label">
          {pct}% · {completedCount}/{schedule.length} blocks done
        </span>
      </div>

      {/* Schedule list */}
      <div className="ascend-schedule-list">
        {schedule.map((block, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const blockLog = blocks.find((b) => b.block_index === i);
          const done = blockLog?.completed;

          return (
            <div
              key={i}
              className={`ascend-sched-row ${isPast ? "past" : ""} ${isCurrent ? "current" : ""} ${done ? "done" : ""} ${isPast && !done ? "missed" : ""}`}
            >
              <span className="ascend-sched-time">{block.time}</span>
              <span className="ascend-sched-icon">{block.icon}</span>
              <div className="ascend-sched-info">
                <span className="ascend-sched-label">{block.label}</span>
                {block.duration > 0 && (
                  <span className="ascend-sched-dur">{block.duration}m</span>
                )}
              </div>
              <button
                className={`ascend-sched-check ${done ? "checked" : ""}`}
                onClick={() => toggleBlock(i)}
              >
                {done ? "✓" : isPast && !done ? "✗" : "○"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Google Calendar embed */}
      {gcalSrc && (
        <div className="ascend-gcal-embed-section">
          <button
            className="ascend-gcal-toggle-btn"
            onClick={() => setShowGcal((v) => !v)}
          >
            📅 {showGcal ? "Hide" : "Show"} Google Calendar
          </button>
          {showGcal && (
            <iframe
              src={gcalSrc}
              className="ascend-gcal-iframe"
              title="Google Calendar"
              frameBorder="0"
              scrolling="no"
            />
          )}
        </div>
      )}

      {/* Add-to-GCal sync section */}
      <div className="ascend-section-label" style={{ marginTop: 16 }}>
        SYNC TO GOOGLE CALENDAR
      </div>
      {calAdded ? (
        <div className="ascend-cal-done">✓ All blocks added to calendar</div>
      ) : (
        <div className="ascend-cal-links">
          <div className="ascend-cal-group-label">
            {mode === "weekend" ? "Weekend blocks" : "Weekday blocks"}
          </div>
          {schedule.map((block, i) => (
            <a
              key={i}
              href={getGoogleCalendarUrl(block, mode === "weekend")}
              target="_blank"
              rel="noopener noreferrer"
              className="ascend-cal-link"
            >
              {block.icon} {block.time} — {block.label}
            </a>
          ))}
          <button
            className="ascend-cal-mark-all"
            onClick={() => {
              setCalAdded(true);
              localStorage.setItem("ascend-cal-added", "true");
            }}
          >
            Mark all as added ✓
          </button>
        </div>
      )}
    </div>
  );
}
