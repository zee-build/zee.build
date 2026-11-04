// ZeeBuild content engine. Runs hourly on GitHub Actions; the content calendar sheet is the source of truth.
//
//   planned -> idea -> [S3 drafts] -> drafted -> rendered -> review -> [you click Approve] -> approved
//   -> [S5 queues LinkedIn and X] -> slotting -> carousel-ready / reel-ready -> [S8, S9 publish] -> posted
//
// Usage: node automation/engine.mjs plan   prints what this run needs to install
//        node automation/engine.mjs run    does the work
//        node automation/engine.mjs run --only=<row id>   limits drafting to one row, for samples
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, appendFileSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AUTO = join(ROOT, "automation");
const SITE = "https://www.zeebuild.com";
const { MAKE_ENGINE_URL, ENGINE_KEY, APPROVE_URL } = process.env;
const [mode = "plan", ...flags] = process.argv.slice(2);
const ONLY = flags.find((f) => f.startsWith("--only="))?.slice(7);

const COL = Object.fromEntries("id created pillar idea source li ig x slides visual status slot platforms token feedback post_url impressions comments saves dms image video carousel resource draft event".split(" ").map((k, i) => [k, i]));
const letter = (i) => String.fromCharCode(65 + i);
const SLOT_TIME = { carousel: "12:30", reel: "19:00" };
const PROMOTE_DAYS = 4; // a planned post starts drafting this long before its slot
const MAX_RENDERS = { carousel: 3, reel: 2 };
const ILLOS = ["bell-log", "blueprint", "cage-inbox", "card-flow", "clipboard", "gear-button", "invoice-coins", "podium"];

// ---- Make bridge -------------------------------------------------------------------------------
async function api(op, payload = {}) {
  const res = await fetch(MAKE_ENGINE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ k: ENGINE_KEY, op, ...payload }) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Make ${op} failed: ${res.status} ${text.slice(0, 300)}`);
  try { return JSON.parse(text); } catch { return text; }
}

const pending = [];
const setCell = (row, field, value) => { row[field] = value; pending.push({ range: `Calendar!${letter(COL[field])}${row.n}`, values: [[value]] }); };
async function flush() {
  if (!pending.length) return;
  await api("write", { body: JSON.stringify({ valueInputOption: "USER_ENTERED", data: pending.splice(0) }) });
}

const email = (subject, html) => api("email", { subject, html });

async function readRows() {
  const { values = [] } = await api("read", { range: "Calendar!A2:Z" });
  return values.map((v, i) => {
    const row = { n: i + 2 };
    for (const [k, c] of Object.entries(COL)) row[k] = v[c] ?? "";
    return row;
  }).filter((r) => r.id);
}

// ---- Time, always Dubai ------------------------------------------------------------------------
const dubaiNow = () => new Date(Date.now() + 4 * 3600e3);
const slotDate = (s) => new Date(`${s.slice(0, 10)}T${s.slice(11, 16)}:00Z`); // compared against dubaiNow()
const fmtDay = (d) => d.toISOString().slice(0, 10);
const isSlot = (s) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s);

// ---- Files -------------------------------------------------------------------------------------
const BP_PATH = join(ROOT, "lib/blueprints.json");
const readBlueprints = () => JSON.parse(readFileSync(BP_PATH, "utf8"));
const writeBlueprints = (b) => writeFileSync(BP_PATH, JSON.stringify(b, null, 2) + "\n");
const takenSlugs = () => new Set([...readBlueprints().map((b) => b.slug), ...[...readFileSync(join(ROOT, "lib/resources.ts"), "utf8").matchAll(/slug: "([^"]+)"/g)].map((m) => m[1])]);
const run = (cmd, args, cwd = ROOT) => execFileSync(cmd, args, { cwd, stdio: "inherit" });
const out = (cmd, args, cwd = ROOT) => execFileSync(cmd, args, { cwd, encoding: "utf8" });
const slugOf = (url) => url.split("/").filter(Boolean).pop();

// ---- Draft checks ------------------------------------------------------------------------------
function cleanCopy(text, slug) {
  let t = String(text ?? "").replace(/\s[—–]\s/g, ", ").replace(/[—–]/g, ", ").trim();
  // A post may only promise what exists: no comment keywords without a live DM automation
  t = t.split("\n").filter((l) => !/\bcomment\s+[A-Z]{3,}\b/.test(l)).join("\n");
  return slug ? t : t;
}

function withBlueprintLink(caption, slug) {
  if (/link in bio/i.test(caption)) return caption;
  const parts = caption.split("\n");
  const firstTag = parts.findIndex((l) => l.trim().startsWith("#"));
  const line = `Free blueprint: link in bio (zeebuild.com/r/${slug})`;
  if (firstTag < 0) return `${caption}\n\n${line}`;
  parts.splice(firstTag, 0, line, "");
  return parts.join("\n");
}

function parseDraft(row) {
  const raw = String(row.draft).replace(/^```(?:json)?/m, "").replace(/```\s*$/m, "").trim();
  const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
  let d;
  try { d = JSON.parse(raw.slice(start, end + 1)); } catch (e) { throw new Error(`Draft isn't valid JSON: ${e.message}`); }
  const format = /reel/i.test(row.visual) ? "reel" : /carousel/i.test(row.visual) ? "carousel" : d.format === "reel" ? "reel" : "carousel";
  if (!d.title || !d.ig_caption || !d.blueprint?.sections?.length) throw new Error("Draft is missing its title, caption or blueprint");
  const fromRow = row.resource ? slugOf(row.resource) : "";
  let slug = (fromRow || d.slug || d.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
  const taken = takenSlugs();
  if (taken.has(slug)) slug = `${slug}-${row.id.slice(-4).toLowerCase()}`;
  const link = `zeebuild.com/r/${slug}`;

  if (format === "carousel") {
    const s = d.deck?.slides;
    if (!Array.isArray(s) || s.length < 4 || s.length > 10) throw new Error("A carousel needs 4 to 10 slides");
    if (s[0].type !== "cover" || s[s.length - 1].type !== "cta") throw new Error("A carousel must start with a cover and end with a CTA");
    for (const sl of s) {
      if (sl.illo && !ILLOS.includes(sl.illo.src)) delete sl.illo;
      delete sl.keyword;
    }
    Object.assign(s[s.length - 1], { link });
    Object.assign(d.deck, { handle: "@zee.build", site: link, series: d.deck.series || "ZeeBuild" });
  } else {
    const sc = d.reel?.scenes;
    if (!Array.isArray(sc) || sc.length < 3 || sc.length > 14) throw new Error("A reel needs 3 to 14 scenes");
    if (sc[sc.length - 1].kind !== "cta") throw new Error("A reel must end with a CTA scene");
    sc.forEach((x, i) => { x.id = x.id || `s${i}`; if (!x.say) throw new Error(`Scene ${i + 1} has no narration`); });
    sc[sc.length - 1].link = link;
    d.reel.slug = slug;
  }
  const caption = withBlueprintLink(cleanCopy(d.ig_caption, slug), slug);
  return { ...d, format, slug, ig_caption: caption, li_draft: cleanCopy(d.li_draft, slug), x_post: cleanCopy(d.x_post, slug), to_verify: d.to_verify ?? [] };
}

// ---- Rendering ---------------------------------------------------------------------------------
async function ensureLogo(name) {
  const base = String(name).toLowerCase().replace(/\.(svg|png)$/, "");
  for (const ext of ["svg", "png"]) if (existsSync(join(AUTO, "carousel/logos", `${base}.${ext}`))) return `${base}.${ext}`;
  // Real marks only: Simple Icons, or nothing. Never a generated stand-in.
  const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons/icons/${base.replace(/[^a-z0-9]/g, "")}.svg`);
  if (!res.ok) return null;
  writeFileSync(join(AUTO, "carousel/logos", `${base}.svg`), await res.text());
  return `${base}.svg`;
}

async function renderCarousel(d, style, notes) {
  const deck = { ...d.deck, palette: style.carousel };
  for (const s of deck.slides) {
    if (s.logo?.src) {
      const file = await ensureLogo(s.logo.src);
      if (file) s.logo.src = file; else { notes.push(`No real logo found for ${s.logo.src}, so it's left out.`); delete s.logo; }
    }
    for (const r of s.rows ?? []) for (const key of ["logo", "logo2"]) {
      if (!r[key]) continue;
      const file = await ensureLogo(r[key]);
      if (file) r[key] = file; else { notes.push(`No real logo found for ${r[key]}, so it's left out.`); delete r[key]; }
    }
  }
  const outDir = join(ROOT, "public/posts", d.slug);
  mkdirSync(outDir, { recursive: true });
  const tmp = join(AUTO, ".tmp");
  mkdirSync(tmp, { recursive: true });
  const deckFile = join(tmp, `${d.slug}.json`);
  writeFileSync(deckFile, JSON.stringify(deck));
  run("node", [join(AUTO, "carousel/render.mjs"), deckFile, outDir]);
  const report = JSON.parse(readFileSync(join(outDir, "report.json"), "utf8"));
  rmSync(join(outDir, "report.json"));
  if (report.problems.length) notes.push(...report.problems.map((p) => `Layout check: ${p}`));
  const files = Array.from({ length: report.slides }, (_, i) => ({ media_type: "IMAGE", image_url: `${SITE}/posts/${d.slug}/${String(i + 1).padStart(2, "0")}.jpg` }));
  return { carousel: JSON.stringify({ files }), probe: files[files.length - 1].image_url, preview: `${SITE}/posts/${d.slug}/contact.jpg` };
}

async function renderReel(d, style, notes) {
  const reelDir = join(AUTO, "reel");
  const tmp = join(AUTO, ".tmp");
  mkdirSync(tmp, { recursive: true });
  const spec = join(tmp, `${d.slug}.spec.json`), props = join(tmp, `${d.slug}.props.json`);
  writeFileSync(spec, JSON.stringify(d.reel));
  run("uv", ["run", "--no-project", "--with", "kokoro-onnx", "--with", "soundfile", "--with", "faster-whisper", "python", join(reelDir, "build_short.py"), spec, props]);
  const p = JSON.parse(readFileSync(props, "utf8"));
  if (p.total < 15 || p.total > 90) notes.push(`Length check: this reel runs ${Math.round(p.total)} seconds.`);
  writeFileSync(props, JSON.stringify({ ...p, palette: style.reel }));

  mkdirSync(join(reelDir, "out"), { recursive: true });
  const raw = join(reelDir, "out", `${d.slug}-raw.mp4`);
  run("npx", ["remotion", "render", "src/index.ts", "Short", raw, "--codec", "h264", "--crf", "18", "--gl=swangle", "--concurrency=2", "--timeout=120000", `--props=${props}`, "--overwrite"], reelDir);

  // Two-pass loudness to -14 LUFS, encoded the way Instagram expects
  const measured = execFileSync("ffmpeg", ["-hide_banner", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).toString();
  const m = readLoudness(measured, raw);
  mkdirSync(join(ROOT, "public/reels"), { recursive: true });
  const file = `zb-${d.slug}.mp4`;
  run("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", "scale=in_range=full:out_range=tv,format=yuv420p", "-c:v", "libx264", "-profile:v", "high", "-crf", "23", "-preset", "medium", "-r", "30",
    "-af", `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
    "-c:a", "aac", "-ar", "48000", "-b:a", "128k", "-movflags", "+faststart", join(ROOT, "public/reels", file)]);

  const postDir = join(ROOT, "public/posts", d.slug);
  mkdirSync(postDir, { recursive: true });
  run("ffmpeg", ["-v", "error", "-y", "-ss", "1.2", "-i", raw, "-frames:v", "1", "-q:v", "4", join(postDir, "thumb.jpg")]);
  const every = Math.max(1, Math.floor(p.total / 6));
  run("ffmpeg", ["-v", "error", "-y", "-i", raw, "-vf", `fps=1/${every},scale=270:-1,tile=6x1`, "-frames:v", "1", "-q:v", "5", join(postDir, "contact.jpg")]);
  return { video: `${SITE}/reels/${file}`, probe: `${SITE}/reels/${file}`, preview: `${SITE}/posts/${d.slug}/contact.jpg` };
}

function readLoudness(stdoutText, raw) {
  // ffmpeg prints the measurement on stderr, so run again capturing it when stdout is empty
  let text = stdoutText;
  if (!text.includes("input_i")) {
    const res = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${raw}" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1`], { encoding: "utf8" });
    text = res;
  }
  return JSON.parse(text.slice(text.lastIndexOf("{"), text.lastIndexOf("}") + 1));
}

async function waitLive(url, ms = 8 * 60e3) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    const res = await fetch(url, { method: "HEAD" }).catch(() => null);
    if (res?.ok) return true;
    await new Promise((r) => setTimeout(r, 20e3));
  }
  return false;
}

// ---- Git ---------------------------------------------------------------------------------------
function commit(message) {
  run("git", ["add", "public/posts", "public/reels", "lib/blueprints.json", "automation/carousel/logos"]);
  if (!out("git", ["diff", "--cached", "--name-only"]).trim()) return false;
  run("git", ["-c", "user.name=ZeeBuild Engine", "-c", "user.email=hello@zeebuild.com", "commit", "-m", message]);
  run("git", ["pull", "--rebase", "origin", "HEAD"]);
  run("git", ["push", "origin", "HEAD"]);
  return true;
}

// ---- Approval email ----------------------------------------------------------------------------
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
function approvalEmail(row, meta) {
  const btn = (a, label, bg) => `<a href="${APPROVE_URL}?id=${encodeURIComponent(row.id)}&t=${row.token}&a=${a}" style="background:${bg};color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block">${label}</a>`;
  const block = (title, text) => text ? `<h3 style="margin:22px 0 6px">${title}</h3><div style="white-space:pre-wrap;border-left:3px solid #E0302A;padding-left:12px">${esc(text)}</div>` : "";
  const notes = meta.notes.length ? `<div style="background:#FFF4D6;border:1px solid #E9C46A;padding:12px 16px;border-radius:6px;margin:16px 0"><b>Check before approving</b><ul style="margin:8px 0 0;padding-left:20px">${meta.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>` : "";
  const when = isSlot(row.slot) ? `Goes out ${row.slot} Dubai time once you approve.` : "Approving gives it the next free slot.";
  return `<div style="font-family:system-ui,Segoe UI,sans-serif;max-width:680px;color:#151010">
<p style="color:#6b6258;margin:0 0 6px">${row.visual === "reel" ? "REEL" : "CAROUSEL"} · ${esc(row.source)} · ${when}</p>
<h2 style="margin:0 0 14px">${esc(meta.title)}</h2>
<p>${btn("approve", "Approve", "#E0302A")} &nbsp; ${btn("reject", "Reject", "#151010")}</p>
${notes}
<a href="${meta.video || meta.preview}"><img src="${meta.preview}" alt="Preview" style="width:100%;border-radius:6px;display:block"></a>
${meta.video ? `<p><a href="${meta.video}"><b>Watch the reel</b></a></p>` : ""}
${block("Instagram", row.ig)}${block("LinkedIn", row.platforms.includes("li") ? row.li : "")}${block("X", row.platforms.includes("x") ? row.x : "")}
<h3 style="margin:22px 0 6px">Blueprint page</h3><p><a href="${row.resource}">${esc(row.resource)}</a></p>
<p style="color:#6b6258;font-size:12px">Caption edits in the sheet are what gets published, so edit first and then press Approve. Replying to this email adds a new idea; it doesn't change this draft.</p></div>`;
}

// ---- Calendar ----------------------------------------------------------------------------------
const CAL = "calendars/ziyanalibusiness%40gmail.com/events";
async function upsertEvent(row, title, status) {
  const day = row.slot.slice(0, 10), t = row.slot.slice(11, 16);
  const [h, m] = t.split(":").map(Number);
  const endT = `${String(h + (m + 30 >= 60 ? 1 : 0)).padStart(2, "0")}:${String((m + 30) % 60).padStart(2, "0")}`;
  const isReel = row.visual === "reel";
  const body = {
    summary: `${status} ${isReel ? "Reel" : "Carousel"}: ${title}`,
    description: [`Publishes automatically from the content calendar (row ${row.id}).`, row.resource && `Blueprint: ${row.resource}`, isReel && "After it posts, turn on Instagram's AI info label: the API can't set it."].filter(Boolean).join("\n"),
    start: { dateTime: `${day}T${t}:00`, timeZone: "Asia/Dubai" },
    end: { dateTime: `${day}T${endT}:00`, timeZone: "Asia/Dubai" },
  };
  // A calendar hiccup must never stop a post from being scheduled
  try {
    const res = await api("calendar", row.event ? { method: "PATCH", path: `${CAL}/${row.event}`, body: JSON.stringify(body) } : { method: "POST", path: CAL, body: JSON.stringify(body) });
    if (res?.id) setCell(row, "event", res.id);
  } catch (e) {
    console.error("Calendar update failed for", row.id, e.message);
  }
}

// ---- Steps -------------------------------------------------------------------------------------
function promotePlanned(rows) {
  const horizon = new Date(dubaiNow().getTime() + PROMOTE_DAYS * 86400e3);
  for (const r of rows) if (r.status === "planned" && isSlot(r.slot) && slotDate(r.slot) <= horizon) setCell(r, "status", "idea");
}

async function currentStyle() {
  const styles = JSON.parse(readFileSync(join(AUTO, "styles.json"), "utf8"));
  const res = await api("read", { range: "Style!B2" }).catch(() => ({}));
  const key = res.values?.[0]?.[0] ?? "signal-red";
  return styles[key] ?? styles["signal-red"];
}

async function renderDrafted(rows) {
  const left = { ...MAX_RENDERS };
  const style = await currentStyle();
  const done = [];
  for (const r of rows.filter((x) => x.status === "drafted" && (!ONLY || x.id === ONLY))) {
    try {
      const d = parseDraft(r);
      if (left[d.format] <= 0) continue;
      left[d.format]--;
      const notes = [...d.to_verify];
      const media = d.format === "reel" ? await renderReel(d, style, notes) : await renderCarousel(d, style, notes);
      const bp = readBlueprints();
      bp.push({ slug: d.slug, title: d.blueprint.title || d.title, kicker: d.blueprint.kicker || "BLUEPRINT", summary: d.blueprint.summary, thumb: `/posts/${d.slug}/thumb.jpg`, sections: d.blueprint.sections });
      writeBlueprints(bp);
      done.push({ r, d, media, notes });
    } catch (e) {
      console.error(r.id, e);
      setCell(r, "status", "draft-failed");
      setCell(r, "feedback", String(e.message).slice(0, 400));
      await email(`ZB · Draft failed: ${r.id}`, `<p>The engine couldn't build this draft and has set it aside.</p><p><b>Idea:</b> ${esc(r.idea)}</p><p><b>Reason:</b> ${esc(e.message)}</p><p>To try again, set its status back to <code>idea</code> on the Calendar tab.</p>`);
    }
  }
  if (!done.length) return;
  commit(`Render ${done.length} draft${done.length > 1 ? "s" : ""}: ${done.map((x) => x.d.slug).join(", ")}`);
  for (const { r, d, media, notes } of done) {
    setCell(r, "visual", d.format);
    if (d.pillar) setCell(r, "pillar", d.pillar);
    setCell(r, "li", d.li_draft ?? "");
    setCell(r, "ig", d.ig_caption);
    setCell(r, "x", d.x_post ?? "");
    setCell(r, "resource", `${SITE}/r/${d.slug}`);
    if (media.video) setCell(r, "video", media.video);
    if (media.carousel) setCell(r, "carousel", media.carousel);
    setCell(r, "feedback", JSON.stringify({ title: d.title, notes, probe: media.probe, preview: media.preview, video: media.video }));
    setCell(r, "draft", "");
    setCell(r, "status", "rendered");
  }
  await flush();
}

async function sendReviews(rows) {
  for (const r of rows.filter((x) => x.status === "rendered")) {
    const meta = JSON.parse(r.feedback);
    if (!(await waitLive(meta.probe))) continue; // the site is still deploying, so the next run picks this up
    await email(`ZB · Approve: ${meta.title}`, approvalEmail(r, meta));
    setCell(r, "status", "review");
    await flush();
  }
}

function nextFreeSlot(rows, format, self) {
  const time = SLOT_TIME[format];
  const soonest = new Date(dubaiNow().getTime() + 2 * 3600e3);
  const holder = (s) => rows.find((x) => x !== self && x.slot === s && x.status !== "rejected");
  for (let i = 0; i < 365; i++) {
    const slot = `${fmtDay(new Date(dubaiNow().getTime() + i * 86400e3))} ${time}`;
    if (slotDate(slot) < soonest) continue;
    const h = holder(slot);
    if (!h || h.status === "planned") return { slot, bump: h };
  }
  throw new Error("No free slot in the next year");
}

async function assignSlots(rows) {
  let changed = false;
  const bp = readBlueprints();
  const ready = [];
  for (const r of rows.filter((x) => x.status === "slotting")) {
    const engineMade = r.resource && (r.video || r.carousel);
    if (!engineMade) { // an older text-only draft: Buffer has it, and there's no Instagram media to schedule
      setCell(r, "status", "scheduled");
      setCell(r, "slot", `${dubaiNow().toISOString().slice(0, 16).replace("T", " ")} (queued)`);
      continue;
    }
    const format = r.video ? "reel" : "carousel";
    r.visual = format;
    if (!isSlot(r.slot) || slotDate(r.slot) < new Date(dubaiNow().getTime() + 30 * 60e3)) {
      const { slot, bump } = nextFreeSlot(rows, format, r);
      if (bump) { // your approved post goes first; the planned post waiting there moves to the end of the queue
        bump.slot = "";
        const tail = rows.filter((x) => isSlot(x.slot) && x.slot.endsWith(SLOT_TIME[format])).map((x) => x.slot).sort().pop();
        const nextDay = fmtDay(new Date(slotDate(tail).getTime() + 86400e3));
        setCell(bump, "slot", `${nextDay} ${SLOT_TIME[format]}`);
        if (bump.event) ready.push({ row: bump, title: bump.idea, mark: "⚪" });
      }
      setCell(r, "slot", slot);
    }
    const slug = slugOf(r.resource);
    const entry = bp.find((b) => b.slug === slug);
    if (entry) { entry.posted = r.slot.replace(" ", "T"); changed = true; }
    ready.push({ row: r, title: entry?.title || r.idea, mark: "🟢", status: format === "reel" ? "reel-ready" : "carousel-ready" });
  }
  if (changed) { writeBlueprints(bp); commit("Schedule approved posts"); }
  for (const { row, title, mark, status } of ready) {
    if (status) setCell(row, "status", status);
    await upsertEvent(row, title, mark);
  }
  await flush();
}

function cleanRejected(rows) {
  const bp = readBlueprints();
  let kept = bp;
  for (const r of rows.filter((x) => x.status === "rejected" && x.resource && (x.video || x.carousel))) {
    const slug = slugOf(r.resource);
    if (!kept.some((b) => b.slug === slug)) continue;
    kept = kept.filter((b) => b.slug !== slug);
    rmSync(join(ROOT, "public/posts", slug), { recursive: true, force: true });
    if (r.video) rmSync(join(ROOT, "public/reels", slugOf(r.video)), { force: true });
    setCell(r, "video", ""); setCell(r, "carousel", ""); setCell(r, "resource", "");
  }
  if (kept.length !== bp.length) writeBlueprints(kept);
}

// Instagram keeps its own copy once a reel posts, so old video files don't need to stay on the site
function cleanPostedReels(rows) {
  const cutoff = new Date(dubaiNow().getTime() - 3 * 86400e3);
  for (const r of rows) {
    if (r.status !== "posted" || !r.video || !isSlot(r.slot) || slotDate(r.slot) > cutoff) continue;
    const file = join(ROOT, "public/reels", slugOf(r.video));
    if (existsSync(file)) rmSync(file);
  }
}

// ---- Entry -------------------------------------------------------------------------------------
const rows = await readRows();
if (mode === "plan") {
  const drafted = rows.filter((r) => r.status === "drafted" && (!ONLY || r.id === ONLY));
  const reel = drafted.some((r) => /reel/i.test(r.visual) || /"format"\s*:\s*"reel"/.test(r.draft));
  const carousel = drafted.some((r) => !(/reel/i.test(r.visual) || /"format"\s*:\s*"reel"/.test(r.draft)));
  const lines = `carousel=${carousel}\nreel=${reel}\n`;
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, lines);
  console.log(lines);
} else {
  promotePlanned(rows);
  await flush();
  await renderDrafted(rows);
  await sendReviews(rows);
  await assignSlots(rows);
  cleanRejected(rows);
  cleanPostedReels(rows);
  commit("Tidy published and rejected media");
  await flush();
  console.log("Done");
}
