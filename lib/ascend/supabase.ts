// ASCEND — All Supabase data fetching functions
import { supabase } from "@/lib/supabase/client";
import { getTodayISO, getYesterdayISO, getCurrentMonth } from "./schedule";

// ─── Projects ───
export interface Project {
  id: string;
  name: string;
  type: string;
  goal: string;
  weekly_hours_target: number;
  color: string;
  icon: string;
  active: boolean;
}

export async function fetchProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("active", true)
    .order("created_at");
  return (data as Project[]) || [];
}

export async function createProject(p: Partial<Project>): Promise<Project | null> {
  const { data } = await supabase.from("projects").insert(p).select().single();
  return data as Project | null;
}

// ─── Habit Logs ───
export interface HabitLog {
  id: string;
  date: string;
  habit_id: string;
  completed: boolean;
  value: number;
}

export async function fetchTodayHabits(): Promise<HabitLog[]> {
  const { data } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("date", getTodayISO());
  return (data as HabitLog[]) || [];
}

export async function fetchYesterdayHabits(): Promise<HabitLog[]> {
  const { data } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("date", getYesterdayISO());
  return (data as HabitLog[]) || [];
}

export async function toggleHabit(habitId: string, completed: boolean, value = 0): Promise<void> {
  const today = getTodayISO();
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("date", today)
    .eq("habit_id", habitId)
    .single();

  if (existing) {
    await supabase
      .from("habit_logs")
      .update({ completed, value })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("habit_logs")
      .insert({ date: today, habit_id: habitId, completed, value });
  }

  // Update streak
  await updateStreak(habitId, completed);
}

// ─── Streaks ───
export interface Streak {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed: string | null;
}

export async function fetchStreaks(): Promise<Streak[]> {
  const { data } = await supabase.from("streaks").select("*");
  return (data as Streak[]) || [];
}

async function updateStreak(habitId: string, completed: boolean): Promise<void> {
  const today = getTodayISO();
  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("habit_id", habitId)
    .single();

  if (!streak) {
    await supabase.from("streaks").insert({
      habit_id: habitId,
      current_streak: completed ? 1 : 0,
      longest_streak: completed ? 1 : 0,
      last_completed: completed ? today : null,
    });
    return;
  }

  if (completed) {
    const yesterday = getYesterdayISO();
    const isConsecutive = streak.last_completed === yesterday || streak.last_completed === today;
    const newStreak = isConsecutive ? streak.current_streak + 1 : 1;
    const longest = Math.max(newStreak, streak.longest_streak);
    await supabase
      .from("streaks")
      .update({
        current_streak: newStreak,
        longest_streak: longest,
        last_completed: today,
        updated_at: new Date().toISOString(),
      })
      .eq("habit_id", habitId);
  } else {
    // Don't reset streak on uncheck — only reset if day passes without completion
  }
}

// ─── Block Logs ───
export interface BlockLog {
  id: string;
  date: string;
  block_index: number;
  completed: boolean;
  project_id: string | null;
  work_description: string | null;
}

export async function fetchTodayBlocks(): Promise<BlockLog[]> {
  const { data } = await supabase
    .from("block_logs")
    .select("*")
    .eq("date", getTodayISO());
  return (data as BlockLog[]) || [];
}

export async function logBlock(
  blockIndex: number,
  completed: boolean,
  projectId?: string,
  workDescription?: string
): Promise<void> {
  const today = getTodayISO();
  const { data: existing } = await supabase
    .from("block_logs")
    .select("id")
    .eq("date", today)
    .eq("block_index", blockIndex)
    .single();

  if (existing) {
    await supabase
      .from("block_logs")
      .update({ completed, project_id: projectId || null, work_description: workDescription || null })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("block_logs")
      .insert({
        date: today,
        block_index: blockIndex,
        completed,
        project_id: projectId || null,
        work_description: workDescription || null,
      });
  }
}

// ─── Income ───
export interface IncomeEntry {
  id: string;
  month: string;
  stream: string;
  amount_aed: number;
  note: string | null;
}

export async function fetchMonthlyIncome(): Promise<IncomeEntry[]> {
  const { data } = await supabase
    .from("income_entries")
    .select("*")
    .eq("month", getCurrentMonth());
  return (data as IncomeEntry[]) || [];
}

export async function logIncome(stream: string, amount: number, note?: string): Promise<void> {
  await supabase.from("income_entries").insert({
    month: getCurrentMonth(),
    stream,
    amount_aed: amount,
    note: note || null,
  });
}

// ─── Journal ───
export async function saveJournalEntry(
  type: string,
  question: string,
  answer: string,
  projectId?: string
): Promise<void> {
  await supabase.from("journal_entries").insert({
    date: getTodayISO(),
    type,
    question,
    answer,
    project_id: projectId || null,
  });
}

// ─── Trade Logs ───
export async function logTrade(
  symbol: string,
  direction: string,
  pnl: number,
  notes?: string
): Promise<void> {
  await supabase.from("trade_logs").insert({
    date: getTodayISO(),
    symbol,
    direction,
    pnl_aed: pnl,
    notes: notes || null,
  });
}

// ─── Aggregates ───
export async function getMonthlyIncomeTotal(): Promise<number> {
  const entries = await fetchMonthlyIncome();
  return entries.reduce((sum, e) => sum + Number(e.amount_aed), 0);
}

export async function getTodayHabitCount(): Promise<{ done: number; total: number }> {
  const habits = await fetchTodayHabits();
  const ALL_HABITS = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
  const done = ALL_HABITS.filter((h) => habits.find((l) => l.habit_id === h && l.completed)).length;
  return { done, total: ALL_HABITS.length };
}
