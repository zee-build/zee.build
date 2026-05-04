// ASCEND — Morning Briefing Edge Function
// Cron: "25 1 * * *" (1:25 AM UTC = 5:25 AM Dubai, UTC+4, no DST)
// Sends morning briefing email via Resend

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const ZEE_EMAIL = Deno.env.get("ZEE_EMAIL") || "contactzventures@gmail.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/** Dubai date string helpers — server runs in UTC, Dubai = UTC+4 no DST */
function getDubaiISO(offsetDays = 0): string {
  const DUBAI_OFFSET_MS = 4 * 60 * 60 * 1000;
  const d = new Date(Date.now() + DUBAI_OFFSET_MS + offsetDays * 86400000);
  // d is now a UTC Date that equals Dubai local time
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

Deno.serve(async () => {
  try {
    const DUBAI_OFFSET_MS = 4 * 60 * 60 * 1000;
    const dubaiNow = new Date(Date.now() + DUBAI_OFFSET_MS);

    const dayName = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dubai",
      weekday: "long",
    }).format(new Date());
    const dateStr = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dubai",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const dubaiDay = dubaiNow.getUTCDay(); // 0=Sun, 5=Fri, 6=Sat
    const isWeekend = dubaiDay === 5 || dubaiDay === 6;

    const todayISO = getDubaiISO(0);
    const yesterdayISO = getDubaiISO(-1);

    // Fetch yesterday's habits
    const { data: habits } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("date", yesterdayISO);

    const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
    const done = ALL.filter((h) =>
      habits?.find(
        (l: { habit_id: string; completed: boolean }) =>
          l.habit_id === h && l.completed
      )
    ).length;

    // Monthly income
    const month = todayISO.slice(0, 7); // YYYY-MM
    const { data: income } = await supabase
      .from("income_entries")
      .select("amount_aed")
      .eq("month", month);
    const totalIncome =
      income?.reduce(
        (s: number, e: { amount_aed: number }) => s + Number(e.amount_aed),
        0
      ) || 0;

    // Weather
    let weather = "Weather unavailable";
    try {
      const wxRes = await fetch("https://wttr.in/Dubai?format=%C+%t", {
        headers: { "User-Agent": "curl/7.68.0" },
      });
      weather = (await wxRes.text()).trim();
    } catch { /* ignore */ }

    // AI motivational line (optional)
    let aiLine = "Make today count.";
    if (OPENAI_KEY) {
      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a brutally honest coach. One line, max 20 words. Direct. No punctuation at start.",
              },
              {
                role: "user",
                content: `Yesterday ${done}/8 habits done. Income AED ${totalIncome}/367000. ${
                  isWeekend ? "Weekend" : "Weekday"
                } today. Give one motivational/harsh line.`,
              },
            ],
            max_tokens: 50,
          }),
        });
        const aiData = await aiRes.json();
        aiLine = aiData.choices?.[0]?.message?.content?.trim() || aiLine;
      } catch { /* ignore — email still sends */ }
    }

    const scheduleType = isWeekend
      ? "Weekend (lighter schedule)"
      : "Weekday (full schedule)";

    const emailBody = `
      <div style="font-family:'Inter',sans-serif;background:#0a0a0c;color:#f2f2f3;padding:24px;max-width:480px;">
        <h1 style="font-family:'Bebas Neue',sans-serif;color:#C9A84C;font-size:28px;margin:0;letter-spacing:0.1em;">ASCEND BRIEFING</h1>
        <p style="color:#9a9aa3;font-size:12px;margin:4px 0 16px;">${dayName}, ${dateStr} · ${weather}</p>
        <div style="background:#111114;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px;margin-bottom:12px;">
          <p style="margin:0 0 8px;font-size:14px;">Yesterday: <strong>${done}/8</strong> habits</p>
          <p style="margin:0 0 8px;font-size:14px;">Income: <strong>AED ${totalIncome.toLocaleString()}</strong> / AED 367,000</p>
          <p style="margin:0;font-size:14px;">Schedule: <strong>${scheduleType}</strong></p>
        </div>
        <p style="color:#C9A84C;font-size:13px;font-style:italic;margin:12px 0;">"${aiLine}"</p>
        <a href="https://zeebuild.com" style="display:inline-block;padding:10px 24px;background:#C9A84C;color:#000;text-decoration:none;border-radius:6px;font-weight:600;font-size:13px;margin-top:8px;">Open ASCEND →</a>
      </div>
    `;

    // Skip email send if RESEND_KEY not configured (don't crash)
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
          subject: `☀️ ${dayName}, ${dateStr} — Your ASCEND Briefing`,
          html: emailBody,
        }),
      });
    }

    return new Response(JSON.stringify({ ok: true, done, totalIncome }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
});
