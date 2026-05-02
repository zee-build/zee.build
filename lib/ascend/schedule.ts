// ASCEND — Schedule data & time helpers (Dubai UTC+4)

export interface ScheduleBlock {
  time: string;
  label: string;
  duration: number; // minutes
  icon: string;
  projectHint?: string; // maps to project name
}

export const WEEKDAY_SCHEDULE: ScheduleBlock[] = [
  { time: "05:30", label: "Fajr + Quran", duration: 30, icon: "🌙" },
  { time: "06:00", label: "Cold shower", duration: 20, icon: "🚿" },
  { time: "06:20", label: "Water + breakfast", duration: 20, icon: "💧" },
  { time: "06:40", label: "LeetCode — 1 problem", duration: 50, icon: "💻", projectHint: "LeetCode" },
  { time: "07:30", label: "Deep Work — Yuze", duration: 120, icon: "⚡", projectHint: "Yuze" },
  { time: "09:30", label: "Water break + stretch", duration: 10, icon: "💧" },
  { time: "09:40", label: "Deep Work — tarbiya / Internet Money", duration: 110, icon: "📈", projectHint: "tarbiya.ai" },
  { time: "11:30", label: "Reading", duration: 30, icon: "📚" },
  { time: "12:00", label: "Dhuhr + lunch", duration: 30, icon: "🕌" },
  { time: "12:30", label: "Deep Work — Dev/Learning", duration: 120, icon: "🧠" },
  { time: "14:30", label: "Water + walk", duration: 15, icon: "💧" },
  { time: "14:45", label: "Job applications / freelance", duration: 105, icon: "💼", projectHint: "Job Hunt" },
  { time: "16:30", label: "Asr prayer", duration: 15, icon: "🕌" },
  { time: "17:00", label: "GYM", duration: 60, icon: "🏋️" },
  { time: "18:15", label: "Protein meal + water", duration: 15, icon: "🥩" },
  { time: "18:30", label: "OpenClaw trading review", duration: 60, icon: "📊", projectHint: "OpenClaw Trading" },
  { time: "19:30", label: "Maghrib prayer", duration: 15, icon: "🌅" },
  { time: "20:00", label: "Recreation — earned", duration: 60, icon: "🎮" },
  { time: "21:00", label: "Isha prayer", duration: 15, icon: "🌙" },
  { time: "21:20", label: "Journal + wind down", duration: 40, icon: "📖" },
  { time: "22:00", label: "Screens off", duration: 30, icon: "😴" },
  { time: "22:30", label: "SLEEP", duration: 0, icon: "🌛" },
];

export const WEEKEND_SCHEDULE: ScheduleBlock[] = [
  { time: "06:30", label: "Fajr + longer Quran", duration: 45, icon: "🌙" },
  { time: "07:15", label: "Light breakfast + water", duration: 45, icon: "💧" },
  { time: "08:00", label: "ONE project task — max 90 min", duration: 90, icon: "📈", projectHint: "tarbiya.ai" },
  { time: "09:30", label: "Reading", duration: 45, icon: "📚" },
  { time: "10:15", label: "Free time / errands", duration: 135, icon: "🎮" },
  { time: "12:30", label: "Dhuhr", duration: 30, icon: "🕌" },
  { time: "13:00", label: "Optional: 1 LeetCode problem", duration: 60, icon: "💻", projectHint: "LeetCode" },
  { time: "14:00", label: "Pure Bean check-in / admin", duration: 90, icon: "☕", projectHint: "Pure Bean" },
  { time: "15:30", label: "Asr", duration: 30, icon: "🕌" },
  { time: "16:00", label: "Walk / outdoor activity", duration: 90, icon: "🚶" },
  { time: "17:30", label: "Light income review — 15 min only", duration: 120, icon: "💰" },
  { time: "19:30", label: "Maghrib", duration: 30, icon: "🌅" },
  { time: "20:00", label: "Social / family time", duration: 60, icon: "👥" },
  { time: "21:00", label: "Isha", duration: 30, icon: "🌙" },
  { time: "21:30", label: "Weekly journal (Saturdays only)", duration: 60, icon: "📖" },
  { time: "22:30", label: "SLEEP", duration: 0, icon: "🌛" },
];

/** Get current Dubai time */
export function getDubaiDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
}

/** Format Dubai time as HH:MM */
export function getDubaiTimeStr(): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Format Dubai date as readable string */
export function getDubaiDateStr(): string {
  return new Date().toLocaleDateString("en-GB", {
    timeZone: "Asia/Dubai",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Is today a UAE weekend (Friday or Saturday)? */
export function isUAEWeekend(): boolean {
  const d = getDubaiDate();
  const day = d.getDay();
  return day === 5 || day === 6; // 5=Friday, 6=Saturday
}

/** Get today's schedule based on day */
export function getTodaySchedule(): ScheduleBlock[] {
  return isUAEWeekend() ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
}

/** Parse "HH:MM" to minutes since midnight */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Get current block index based on Dubai time */
export function getCurrentBlockIndex(): number {
  const now = getDubaiDate();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const schedule = getTodaySchedule();

  for (let i = schedule.length - 1; i >= 0; i--) {
    if (nowMins >= timeToMinutes(schedule[i].time)) return i;
  }
  return -1;
}

/** Get current block */
export function getCurrentBlock(): ScheduleBlock | null {
  const idx = getCurrentBlockIndex();
  if (idx < 0) return null;
  return getTodaySchedule()[idx];
}

/** Minutes elapsed in current block */
export function getMinutesIntoBlock(): number {
  const idx = getCurrentBlockIndex();
  if (idx < 0) return 0;
  const block = getTodaySchedule()[idx];
  const now = getDubaiDate();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins - timeToMinutes(block.time);
}

/** Get today's date as YYYY-MM-DD in Dubai timezone */
export function getTodayISO(): string {
  const d = getDubaiDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Get yesterday's date as YYYY-MM-DD in Dubai timezone */
export function getYesterdayISO(): string {
  const d = getDubaiDate();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Get current month as YYYY-MM */
export function getCurrentMonth(): string {
  const d = getDubaiDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Days remaining in current month */
export function getDaysLeftInMonth(): number {
  const d = getDubaiDate();
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return lastDay - d.getDate();
}

/** Generate Google Calendar event URL */
export function getGoogleCalendarUrl(block: ScheduleBlock, isWeekend: boolean): string {
  const now = getDubaiDate();
  const [h, m] = block.time.split(":").map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  const end = new Date(start.getTime() + (block.duration || 30) * 60000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const byday = isWeekend ? "FR,SA" : "SU,MO,TU,WE,TH";
  const recur = `RRULE:FREQ=WEEKLY;BYDAY=${byday}`;

  const params = new URLSearchParams({
    text: `${block.icon} ${block.label}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    recur,
    details: `ASCEND OS schedule block\n${block.label}`,
  });

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}
