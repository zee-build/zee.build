"use client";

import { useEffect, useState, useCallback } from "react";
import {
  WEEKDAY_SCHEDULE,
  WEEKEND_SCHEDULE,
  isUAEWeekend,
  getCurrentBlockIndex,
  getGoogleCalendarUrl,
} from "@/lib/ascend/schedule";
import { BlockLog, fetchTodayBlocks, logBlock } from "@/lib/ascend/supabase";

export default function Schedule() {
  const [mode, setMode] = useState<"weekday" | "weekend">(isUAEWeekend() ? "weekend" : "weekday");
  const [blocks, setBlocks] = useState<BlockLog[]>([]);
  const [calAdded, setCalAdded] = useState(false);
  const currentIdx = getCurrentBlockIndex();

  const schedule = mode === "weekend" ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;

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
    const newVal = !(existing?.completed);
    await logBlock(idx, newVal);
    loadBlocks();
  };

  const completedCount = schedule.filter((_, i) =>
    blocks.find((b) => b.block_index === i && b.completed)
  ).length;
  const pct = schedule.length > 0 ? Math.round((completedCount / schedule.length) * 100) : 0;

  return (
    <div className="ascend-schedule">
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

      {/* Completion */}
      <div className="ascend-schedule-pct">
        <span>{pct}%</span> complete · {completedCount}/{schedule.length} blocks
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
              <span className="ascend-sched-label">{block.label}</span>
              <span className="ascend-sched-dur">
                {block.duration > 0 ? `${block.duration}m` : ""}
              </span>
              <button
                className={`ascend-sched-check ${done ? "checked" : ""}`}
                onClick={() => toggleBlock(i)}
              >
                {done ? "✓" : "○"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Google Calendar */}
      <div className="ascend-section-label" style={{ marginTop: 16 }}>
        GOOGLE CALENDAR
      </div>
      {calAdded ? (
        <div className="ascend-cal-done">✓ All blocks added to calendar</div>
      ) : (
        <div className="ascend-cal-links">
          {schedule.map((block, i) => (
            <a
              key={i}
              href={getGoogleCalendarUrl(block, mode === "weekend")}
              target="_blank"
              rel="noopener noreferrer"
              className="ascend-cal-link"
            >
              {block.icon} {block.time} {block.label}
            </a>
          ))}
          <button
            className="ascend-cal-mark-all"
            onClick={() => {
              setCalAdded(true);
              localStorage.setItem("ascend-cal-added", "true");
            }}
          >
            Mark all as added
          </button>
        </div>
      )}
    </div>
  );
}
