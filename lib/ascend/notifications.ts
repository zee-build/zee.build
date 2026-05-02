// ASCEND — Notification engine
// Checks every 5 minutes and pushes to localStorage for NotificationCenter

import {
  getTodaySchedule,
  getCurrentBlockIndex,
  getMinutesIntoBlock,
  getTodayISO,
} from "./schedule";

interface AscendNotif {
  id: string;
  text: string;
  time: string;
}

function getNotifs(): AscendNotif[] {
  try {
    const saved = localStorage.getItem("ascend-notifications");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function addNotif(text: string) {
  const notifs = getNotifs();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const time = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
  });
  notifs.unshift({ id, text, time });
  // Keep max 20
  localStorage.setItem("ascend-notifications", JSON.stringify(notifs.slice(0, 20)));
}

function alreadySent(key: string): boolean {
  const today = getTodayISO();
  const sentKey = `ascend-notif-sent-${today}`;
  try {
    const sent: string[] = JSON.parse(localStorage.getItem(sentKey) || "[]");
    return sent.includes(key);
  } catch {
    return false;
  }
}

function markSent(key: string) {
  const today = getTodayISO();
  const sentKey = `ascend-notif-sent-${today}`;
  try {
    const sent: string[] = JSON.parse(localStorage.getItem(sentKey) || "[]");
    sent.push(key);
    localStorage.setItem(sentKey, JSON.stringify(sent));
  } catch { /* ignore */ }
}

export function checkAscendNotifications() {
  const schedule = getTodaySchedule();
  const blockIdx = getCurrentBlockIndex();
  const minsIn = getMinutesIntoBlock();

  // Block start notification
  if (blockIdx >= 0 && minsIn <= 5) {
    const block = schedule[blockIdx];
    const key = `block-start-${blockIdx}`;
    if (!alreadySent(key)) {
      addNotif(`⚡ ${block.icon} ${block.label} just started`);
      markSent(key);
    }
  }

  // Block 15 min overdue
  if (blockIdx >= 0 && minsIn >= 15) {
    const block = schedule[blockIdx];
    const key = `block-overdue-${blockIdx}`;
    if (!alreadySent(key)) {
      addNotif(`⚠️ ${block.icon} ${block.label} started 15 mins ago`);
      markSent(key);
    }
  }
}

/** Start the notification check interval. Returns cleanup function. */
export function startAscendNotifications(): () => void {
  // Clear yesterday's notifications
  const today = getTodayISO();
  const lastClear = localStorage.getItem("ascend-notif-clear-date");
  if (lastClear !== today) {
    localStorage.setItem("ascend-notifications", "[]");
    localStorage.setItem("ascend-notif-clear-date", today);
  }

  checkAscendNotifications();
  const interval = setInterval(checkAscendNotifications, 300000); // 5 min
  return () => clearInterval(interval);
}
