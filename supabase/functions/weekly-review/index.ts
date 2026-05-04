// ASCEND — Weekly Review Edge Function
// Cron: "30 16 * * 6" (4:30 PM UTC on Saturdays = 8:30 PM Dubai Saturday, UTC+4, no DST)
// Sends weekly summary email via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ZEE_EMAIL = Deno.env.get("ZEE_EMAIL") || "contactzventures@gmail.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/** Dubai date as YYYY-MM-DD, offset by `offsetDays` days */
function getDubaiISO(offsetDays = 0): string {
  const DUBAI_OFFSET_MS = 4 * 60 * 60 * 1000;
  const d = new Date(Date.now() + DUBAI_OFFSET_MS + offsetDays * 86400000);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

Deno.serve(async () => {
  try {
    // Get past 7 days of dates in Dubai timezone
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(getDubaiISO(-i));
    }

    const todayISO = weekDates[0];
    const month = todayISO.slice(0, 7); // YYYY-MM

    // Fetch this week's habits
    const { data: habits } = await supabase
      .from("habit_logs")
      .select("*")
      .in("date", weekDates);

    const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
    const totalPossible = ALL.length * 7;
    const totalDone =
      habits?.filter((h: { completed: boolean }) => h.completed).length || 0;
    const habitPct =
      totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    // Gym days this week
    const gymDays = weekDates.filter((d) =>
      habits?.find(
        (h: { date: string; habit_id: string; completed: boolean }) =>
          h.date === d && h.habit_id === "workout" && h.completed
      )
    ).length;

    // Fajr days this week
    const fajrDays = weekDates.filter((d) =>
      habits?.find(
        (h: { date: string; habit_id: string; completed: boolean }) =>
          h.date === d && h.habit_id === "fajr" && h.completed
      )
    ).length;

    // Monthly income
    const { data: income } = await supabase
      .from("income_entries")
      .select("*")
      .eq("month", month);
    const totalIncome =
      income?.reduce(
        (s: number, e: { amount_aed: number }) => s + Number(e.amount_aed),
        0
      ) || 0;

    // tarbiya.ai income this month
    const tarbiyaIncome =
      income
        ?.filter(
          (e: { stream: string }) =>
            e.stream === "tarbiya.ai" || e.stream === "tarbiya"
        )
        .reduce(
          (s: number, e: { amount_aed: number }) => s + Number(e.amount_aed),
          0
        ) || 0;

    const weekNum = Math.ceil(
      parseInt(todayISO.split("-")[2], 10) / 7
    );

    const habitColor = habitPct >= 70 ? "#4ade80" : "#ef4444";
    const gymColor = gymDays >= 4 ? "#4ade80" : gymDays >= 2 ? "#f59e0b" : "#ef4444";

    const tarbiyaHtml =
      tarbiyaIncome < 5000
        ? `<p style="color:#ef4444;font-size:12px;margin:6px 0 0;">⚠️ tarbiya.ai at AED ${tarbiyaIncome.toLocaleString()} — still at $2.99? Raise to $9.99 this week.</p>`
        : `<p style="color:#4ade80;font-size:12px;margin:6px 0 0;">✓ tarbiya.ai: AED ${tarbiyaIncome.toLocaleString()} this month.</p>`;

    const emailBody = `
      <div style="font-family:'Inter',sans-serif;background:#0a0a0c;color:#f2f2f3;padding:24px;max-width:480px;">
        <h1 style="font-family:'Bebas Neue',sans-serif;color:#C9A84C;font-size:24px;margin:0;letter-spacing:0.08em;">📊 WEEK ${weekNum} REVIEW</h1>
        <p style="color:#9a9aa3;font-size:12px;margin:4px 0 16px;">Where did you actually land this week?</p>

        <div style="background:#111114;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px;margin-bottom:12px;">
          <p style="margin:0 0 8px;font-size:14px;">Habit completion: <strong style="color:${habitColor}">${habitPct}%</strong> (${totalDone}/${totalPossible})</p>
          <p style="margin:0 0 8px;font-size:14px;">Gym sessions: <strong style="color:${gymColor}">${gymDays}/5</strong>${gymDays < 5 ? " — what happened?" : " ✓"}</p>
          <p style="margin:0 0 8px;font-size:14px;">Fajr streak this week: <strong>${fajrDays}/7</strong></p>
          <p style="margin:0 0 8px;font-size:14px;">Income this month: <strong>AED ${totalIncome.toLocaleString()}</strong> / AED 367,000</p>
          ${tarbiyaHtml}
        </div>

        <a href="https://zeebuild.com" style="display:inline-block;padding:10px 24px;background:#C9A84C;color:#000;text-decoration:none;border-radius:6px;font-weight:600;font-size:13px;margin-top:8px;">Open ASCEND — Start Weekly Review →</a>
      </div>
    `;

    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_KEY}`,
        },
        body: JSON.stringify({
          from: "ASCEND <coach@zeebuild.com>",
          to: [ZEE_EMAIL],
          subject: `📊 Week ${weekNum} Review — Where did you actually land?`,
          html: emailBody,
        }),
      });
    }

    return new Response(
      JSON.stringify({ ok: true, habitPct, gymDays, totalIncome }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
});
