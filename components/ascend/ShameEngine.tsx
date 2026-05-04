"use client";

import { useEffect, useState } from "react";
import {
  getDubaiHour,
  getCurrentBlock,
  getMinutesIntoBlock,
  getCurrentBlockIndex,
} from "@/lib/ascend/schedule";
import { HabitLog, BlockLog } from "@/lib/ascend/supabase";

interface Props {
  habits: HabitLog[];
  blocks: BlockLog[];
}

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

export default function ShameEngine({ habits, blocks }: Props) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    function check() {
      const hour = getDubaiHour();
      const msgs: string[] = [];

      // Block overdue check — 10+ minutes into a block with no log
      const blockIdx = getCurrentBlockIndex();
      const block = getCurrentBlock();
      const minsIn = getMinutesIntoBlock();

      if (block && minsIn > 10 && blockIdx >= 0) {
        const blockDone = blocks.find(
          (b) => b.block_index === blockIdx && b.completed
        );
        if (!blockDone) {
          msgs.push(`⚠️ ${minsIn}m late to ${block.icon} ${block.label}. Start NOW.`);
        }
      }

      // Evening habit shame fires after 8 PM Dubai time
      if (hour >= 20) {
        const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
        const missed = ALL.filter(
          (h) => !habits.find((l) => l.habit_id === h && l.completed)
        );
        missed.forEach((h) => {
          if (SHAME_LINES[h]) msgs.push(SHAME_LINES[h]);
        });
      }

      setMessages(msgs);
    }

    check();
    const interval = setInterval(check, 60000); // re-check every minute (not 10min)
    return () => clearInterval(interval);
  }, [habits, blocks]);

  if (messages.length === 0) return null;

  return (
    <div className="ascend-shame ascend-shame-pulse">
      {messages.map((m, i) => (
        <div key={i} className="ascend-shame-line">
          {m}
        </div>
      ))}
    </div>
  );
}
