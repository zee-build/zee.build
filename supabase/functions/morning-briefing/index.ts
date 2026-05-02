// ASCEND — Morning Briefing Edge Function
// Fires 5:25 AM Dubai time daily via Supabase cron
// Sends email via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const ZEE_EMAIL = Deno.env.get("ZEE_EMAIL") || "contactzventures@gmail.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

Deno.serve(async () => {
  try {
    const now = new Date();
    const dubaiDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
    const dayName = dubaiDate.toLocaleDateString("en-GB", { weekday: "long" });
    const dateStr = dubaiDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const isWeekend = dubaiDate.getDay() === 5 || dubaiDate.getDay() === 6;

    // Yesterday's date
    const yesterday = new Date(dubaiDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yISO = yesterday.toISOString().split("T")[0];

    // Fetch yesterday's habits
    const { data: habits } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("date", yISO);

    const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
    const done = ALL.filter((h) => habits?.find((l: { habit_id: string; completed: boolean }) => l.habit_id === h && l.completed)).length;

    // Fetch income
    const month = `${dubaiDate.getFullYear()}-${String(dubaiDate.getMonth() + 1).padStart(2, "0")}`;
    const { data: income } = await supabase
      .from("income_entries")
      .select("amount_aed")
      .eq("month", month);
    const totalIncome = income?.reduce((s: number, e: { amount_aed: number }) => s + Number(e.amount_aed), 0) || 0;

    // Weather
    let weather = "Weather unavailable";
    try {
      const wxRes = await fetch("https://wttr.in/Dubai?format=%C+%t");
      weather = (await wxRes.text()).trim();
    } catch { /* ignore */ }

    // AI line
    let aiLine = "Make today count.";
    if (OPENAI_KEY) {
      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a brutally honest coach. One line, max 20 words. Direct." },
              { role: "user", content: `Yesterday ${done}/8 habits done. Income AED ${totalIncome}/367000. ${isWeekend ? "Weekend" : "Weekday"} today. Give one motivational/harsh line.` },
            ],
            max_tokens: 50,
          }),
        });
        const aiData = await aiRes.json();
        aiLine = aiData.choices?.[0]?.message?.content || aiLine;
      } catch { /* ignore */ }
    }

    const scheduleType = isWeekend ? "Weekend (lighter schedule)" : "Weekday (full schedule)";

    // Send email
    const emailBody = `
      <div style="font-family: 'Inter', sans-serif; background: #0a0a0c; color: #f2f2f3; padding: 24px; max-width: 480px;">
        <h1 style="font-family: 'Bebas Neue', sans-serif; color: #C9A84C; font-size: 28px; margin: 0;">ASCEND BRIEFING</h1>
        <p style="color: #9a9aa3; font-size: 12px; margin: 4px 0 16px;">${dayName}, ${dateStr} · ${weather}</p>
        <div style="background: #111114; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="margin: 0 0 8px; font-size: 14px;">Yesterday: <strong>${done}/8</strong> habits</p>
          <p style="margin: 0 0 8px; font-size: 14px;">Income: <strong>AED ${totalIncome.toLocaleString()}</strong> / AED 367,000</p>
          <p style="margin: 0; font-size: 14px;">Schedule: <strong>${scheduleType}</strong></p>
        </div>
        <p style="color: #C9A84C; font-size: 13px; font-style: italic; margin: 12px 0;">"${aiLine}"</p>
        <a href="https://zeebuild.com" style="display: inline-block; padding: 10px 24px; background: #C9A84C; color: #000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; margin-top: 8px;">Open ASCEND →</a>
      </div>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: "ASCEND <coach@zeebuild.com>",
        to: [ZEE_EMAIL],
        subject: `☀️ ${dayName}, ${dateStr} — Your ASCEND Briefing`,
        html: emailBody,
      }),
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
