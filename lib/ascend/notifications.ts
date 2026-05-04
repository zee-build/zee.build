import { getDubaiHour, getTodayISO, WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE, isUAEWeekend, getCurrentBlockIndex } from "./schedule";

let _cleanedUp = false;
let _intervalId: ReturnType<typeof setInterval> | null = null;
let _lastNotifiedBlock = -1;
let _lastShameHour = -1;
let _lastMorningDate = "";

function notify(title: string, body: string) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/favicon.ico" });
}

async function requestPermission() {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

function checkNotifications() {
  const hour = getDubaiHour();
  const today = getTodayISO();
  const schedule = isUAEWeekend() ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
  const currentBlock = getCurrentBlockIndex();

  // Morning briefing nudge at 5 AM
  if (hour === 5 && _lastMorningDate !== today) {
    _lastMorningDate = today;
    notify("ASCEND — Good Morning", "Check your briefing and start your first block.");
  }

  // Block transition nudge (when new block starts)
  if (currentBlock >= 0 && currentBlock !== _lastNotifiedBlock) {
    _lastNotifiedBlock = currentBlock;
    const block = schedule[currentBlock];
    if (block) {
      notify(`Block: ${block.label}`, `${block.time} · ${block.duration > 0 ? `${block.duration}m` : "open"}`);
    }
  }

  // Evening shame at 9 PM
  if (hour === 21 && _lastShameHour !== 21) {
    _lastShameHour = 21;
    notify("ASCEND — Evening Check", "How did today go? Log your blocks before midnight.");
  }
  if (hour !== 21) _lastShameHour = -1;
}

export function startAscendNotifications(): () => void {
  _cleanedUp = false;

  requestPermission();

  _intervalId = setInterval(() => {
    if (!_cleanedUp) checkNotifications();
  }, 60000);

  return () => {
    _cleanedUp = true;
    if (_intervalId !== null) {
      clearInterval(_intervalId);
      _intervalId = null;
    }
  };
}
