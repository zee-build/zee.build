// ASCEND — Evening Shame Edge Function
// Cron: "30 17 * * *" (5:30 PM UTC = 9:30 PM Dubai, UTC+4, no DST)
// Sends shame email if habits < 6/8

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ZEE_EMAIL = Deno.env.get("ZEE_EMAIL") || "contactzventures@gmail.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SHAME_LINES: Record<string, string> = {
  fajr: "You missed Fajr. This is how decline starts.",
  water: "You're dehydrated and wondering why you're tired.",
  workout: "No gym today. Your future self noticed.",
  leetcode: "No LeetCode. That job upgrade stays a dream.",
  reading: "People who don't read stay exactly where they are.",
  tarbiya: "tarbiya.ai won't grow itself. You know this.",
  job: "No job search today. That AED 18K role won't find you.",
  sleep: "Still awake? Tomorrow's already ruined.",
};

// Habits that can still be done after 9:30 PM
const COMPLETABLE = ["water", "reading", "tarbiya", "job", "sleep"];

/** Dubai date as YYYY-MM-DD — server runs in UTC, Dubai = UTC+4 no DST */
function getDubaiISO(): string {
  const DUBAI_OFFSET_MS = 4 * 60 * 60 * 1000;
  const d = new Date(Date.now() + DUBAI_OFFSET_MS);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

Deno.serve(async () => {
  try {
    const todayISO = getDubaiISO();

    const { data: habits } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("date", todayISO);

    const ALL = ["fajr", "water", "workout", "leetcode", "reading", "tarbiya", "job", "sleep"];
    const completed = ALL.filter((h) =>
      habits?.find(
        (l: { habit_id: string; completed: boolean }) =>
          l.habit_id === h && l.completed
      )
    );
    const missed = ALL.filter((h) => !completed.includes(h));

    // Skip email if 6+ habits completed
    if (completed.length >= 6) {
      return new Response(
        JSON.stringify({ ok: true, skipped: true, reason: "6+ habits done" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const missedLines = missed
      .map(
        (h) =>
          `<p style="color:#ef4444;margin:4px 0;font-size:13px;">• ${
            SHAME_LINES[h] || h
          }</p>`
      )
      .join("");

    const stillCompletable = missed.filter((h) => COMPLETABLE.includes(h));
    const completableHtml =
      stillCompletable.length > 0
        ? `<p style="color:#4ade80;margin:12px 0 0;font-size:12px;">Still completable tonight: ${stillCompletable.join(", ")}</p>`
        : "";

    const emailBody = `
      <div style="font-family:'Inter',sans-serif;background:#0a0a0c;color:#f2f2f3;padding:24px;max-width:480px;">
        <h1 style="font-family:'Bebas Neue',sans-serif;color:#ef4444;font-size:24px;margin:0;letter-spacing:0.08em;">⚠️ ${missed.length} HABITS MISSED TODAY</h1>
        <p style="color:#9a9aa3;font-size:12px;margin:4px 0 16px;">${completed.length}/8 completed · ${todayISO}</p>
        <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:16px;margin-bottom:12px;">
          ${missedLines}
        </div>
        ${completableHtml}
        <a href="https://zeebuild.com" style="display:inline-block;padding:10px 24px;background:#ef4444;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;font-size:13px;margin-top:12px;">Fix it now →</a>
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
          subject: `⚠️ ${missed.length} habits missed today, Zee.`,
          html: emailBody,
        }),
      });
    }

    return new Response(
      JSON.stringify({ ok: true, completed: completed.length, missed: missed.length }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
});
