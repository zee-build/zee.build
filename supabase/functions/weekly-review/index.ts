// ASCEND — Weekly Review Edge Function
// Fires Saturday 8:30 PM Dubai time
// Sends weekly summary email via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ZEE_EMAIL = Deno.env.get("ZEE_EMAIL") || "zventures@gmail.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

Deno.serve(async () => {
  try {
    const now = new Date();
    const dubaiDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));

    // Get dates for the past 7 days
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(dubaiDate);
      d.setDate(d.getDate() - i);
      weekDates.push(d.toISOString().split("T")[0]);
    }

    // Fetch week's habits
    const { data: habits } = await supabase
      .from("habit_logs")
      .select("*")
      .in("date", weekDates);

    const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
    const totalPossible = ALL.length * 7;
    const totalDone = habits?.filter((h: { completed: boolean }) => h.completed).length || 0;
    const habitPct = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    // Gym sessions this week
    const gymDays = weekDates.filter((d) =>
      habits?.find((h: { date: string; habit_id: string; completed: boolean }) =>
        h.date === d && h.habit_id === "workout" && h.completed
      )
    ).length;

    // Income this month
    const month = `${dubaiDate.getFullYear()}-${String(dubaiDate.getMonth() + 1).padStart(2, "0")}`;
    const { data: income } = await supabase
      .from("income_entries")
      .select("*")
      .eq("month", month);
    const totalIncome = income?.reduce((s: number, e: { amount_aed: number }) => s + Number(e.amount_aed), 0) || 0;

    // tarbiya income
    const tarbiyaIncome = income
      ?.filter((e: { stream: string }) => e.stream === "tarbiya.ai" || e.stream === "tarbiya")
      .reduce((s: number, e: { amount_aed: number }) => s + Number(e.amount_aed), 0) || 0;

    const weekNum = Math.ceil(dubaiDate.getDate() / 7);

    const tarbiyaNudge = tarbiyaIncome < 5000
      ? `<p style="color: #ef4444; font-size: 12px;">⚠️ tarbiya.ai still at $2.99? Raise it to $9.99 this week.</p>`
      : `<p style="color: #4ade80; font-size: 12px;">✓ tarbiya.ai income: AED ${tarbiyaIncome.toLocaleString()}</p>`;

    const emailBody = `
      <div style="font-family: 'Inter', sans-serif; background: #0a0a0c; color: #f2f2f3; padding: 24px; max-width: 480px;">
        <h1 style="font-family: 'Bebas Neue', sans-serif; color: #C9A84C; font-size: 24px; margin: 0;">📊 WEEK ${weekNum} REVIEW</h1>
        <p style="color: #9a9aa3; font-size: 12px; margin: 4px 0 16px;">Where did you actually land?</p>
        
        <div style="background: #111114; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="margin: 0 0 8px; font-size: 14px;">Habit completion: <strong style="color: ${habitPct >= 70 ? '#4ade80' : '#ef4444'}">${habitPct}%</strong></p>
          <p style="margin: 0 0 8px; font-size: 14px;">Income this month: <strong>AED ${totalIncome.toLocaleString()}</strong> / AED 367,000</p>
          <p style="margin: 0 0 8px; font-size: 14px;">Gym sessions: <strong>${gymDays}/5</strong></p>
          ${tarbiyaNudge}
        </div>
        
        <a href="https://zeebuild.com/ascend?tab=coach" style="display: inline-block; padding: 10px 24px; background: #C9A84C; color: #000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; margin-top: 8px;">Start weekly review →</a>
      </div>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: "ASCEND <coach@zeebuild.com>",
        to: [ZEE_EMAIL],
        subject: `📊 Week ${weekNum} Review — Where did you actually land?`,
        html: emailBody,
      }),
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
