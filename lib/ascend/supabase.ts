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

export async function updateProject(id: string, p: Partial<Project>): Promise<void> {
  await supabase.from("projects").update(p).eq("id", id);
}

export async function deleteProject(id: string): Promise<void> {
  // Soft delete — set active=false
  await supabase.from("projects").update({ active: false }).eq("id", id);
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
  const yesterday = getYesterdayISO();

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
    // Already logged today — don't double-increment
    if (streak.last_completed === today) return;

    const isConsecutive = streak.last_completed === yesterday;
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
    // Unchecking: if habit was completed today, revert the increment
    if (streak.last_completed === today) {
      const reverted = Math.max(0, streak.current_streak - 1);
      await supabase
        .from("streaks")
        .update({
          current_streak: reverted,
          last_completed: reverted > 0 ? yesterday : null,
          updated_at: new Date().toISOString(),
        })
        .eq("habit_id", habitId);
    }
    // If last_completed !== today, streak already accounts for the miss — leave it
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
      .update({
        completed,
        project_id: projectId || null,
        work_description: workDescription || null,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("block_logs").insert({
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

// ─── Pipeline (Internet Money) ───
export interface PipelineState {
  leads: number;
  calls: number;
  proposals: number;
  closed: number;
}

export async function fetchPipeline(): Promise<PipelineState> {
  const { data } = await supabase
    .from("kv_store")
    .select("value")
    .eq("key", "internet_money_pipeline")
    .single();
  if (data?.value) return data.value as PipelineState;
  return { leads: 0, calls: 0, proposals: 0, closed: 0 };
}

export async function savePipeline(state: PipelineState): Promise<void> {
  await supabase.from("kv_store").upsert(
    { key: "internet_money_pipeline", value: state, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
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
  const done = ALL_HABITS.filter((h) =>
    habits.find((l) => l.habit_id === h && l.completed)
  ).length;
  return { done, total: ALL_HABITS.length };
}

/** Fetch habit_logs for a date range — used by weekly review */
export async function fetchHabitsForDates(dates: string[]): Promise<HabitLog[]> {
  const { data } = await supabase
    .from("habit_logs")
    .select("*")
    .in("date", dates);
  return (data as HabitLog[]) || [];
}
