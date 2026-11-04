// ZeeBuild · What If · EP01 v3: "60 seconds without banks". Every beat is keyed to a narration word in vo.json.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Desk, Grade, Grain, Vignette, Tape, SeriesBar, Mark, torn, shadow } from "../Vox";
import { Globe } from "../v2/Globe";
import { Cutout } from "../v2/Cutout";
import { FrozenCards, Conveyor } from "./Scenes3D";
import vo from "./vo.json";

const C = theme.colors, F = theme.fonts, FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- timing from the voiceover ----------
type Word = { word: string; start: number; end: number; line: string };
const s2f = (s: number) => Math.round(s * FPS);
const line = (id: string) => vo.lines.find((l) => l.id === id)!;
const ls = (id: string) => s2f(line(id).start);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const wf = (id: string, word: string) => {
  const w = (vo.words as Word[]).find((x) => x.line === id && norm(x.word).startsWith(word));
  if (!w) throw new Error(`no word "${word}" in line ${id}`);
  return s2f(w.start);
};
export const EP01_FRAMES = s2f(vo.total) + 18;

const S = {
  zee: ls("time") - 6, cards: ls("s10") - 6, payroll: ls("s30") - 6, napkin: ls("s45") - 6,
  back: ls("s60") - 6, inside: ls("orders") - 6, end: ls("who") - 6,
};

// ---------- small helpers ----------
const useSpring = (at: number, config: object = theme.spring.smooth) => {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config });
};
const ease = (frame: number, r: [number, number], o: [number, number], e = theme.ease.out) => interpolate(frame, r, o, { ...clamp, easing: e });

const Paper: React.FC<{ style: React.CSSProperties; bg?: string; pad?: string; children?: React.ReactNode; rot?: number }> = ({ style, bg = C.paper, pad = "40px 46px", children, rot = 0 }) => (
  <div style={{ position: "absolute", filter: shadow, transform: `rotate(${rot}deg)`, ...style }}>
    <div style={{ background: bg, color: C.ink, clipPath: torn, padding: pad, height: "100%" }}>{children}</div>
  </div>
);

const Stamp: React.FC<{ at: number; text: string; color: string; style: React.CSSProperties; size?: number; onDark?: boolean }> = ({ at, text, color, style, size = 62, onDark }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, theme.spring.slam);
  if (frame < at) return null;
  return <div style={{ position: "absolute", zIndex: 8, ...style, transform: `rotate(-12deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
    opacity: interpolate(p, [0, 0.4], [0, 0.92], clamp), border: `7px solid ${color}`, color, fontFamily: F.sans, fontWeight: 900,
    fontSize: size, letterSpacing: ".06em", padding: "4px 18px", mixBlendMode: onDark ? "normal" : "multiply", background: onDark ? "rgba(20,20,20,.6)" : undefined, whiteSpace: "nowrap" }}>{text}</div>;
};

const Pop: React.FC<{ at: number; style: React.CSSProperties; children: React.ReactNode; from?: number }> = ({ at, style, children, from = 140 }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, theme.spring.snappy);
  if (frame < at - 1) return null;
  return <div style={{ position: "absolute", ...style, opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
    transform: `${style.transform ?? ""} translateY(${(1 - p) * from}px) scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>{children}</div>;
};

// Marker handwriting that "writes" left to right
const Marker: React.FC<{ at: number; style: React.CSSProperties; children: React.ReactNode; size?: number }> = ({ at, style, children, size = 60 }) => {
  const frame = useCurrentFrame();
  const w = ease(frame, [at, at + 14], [100, 0], theme.ease.inOut);
  return <div style={{ position: "absolute", fontFamily: F.hand, fontSize: size, color: C.primary, lineHeight: 1.05, zIndex: 7,
    clipPath: `inset(-20px ${w}% -20px -20px)`, ...style }}>{children}</div>;
};

const Label: React.FC<{ text: string; sub?: string; at: number; top?: number }> = ({ text, sub, at, top = 390 }) => (
  <Pop at={at} style={{ top, left: 80, transform: "rotate(-2deg)", zIndex: 6 }} from={60}>
    <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "22px 34px 26px", filter: shadow }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".22em", color: "#6b6258" }}>{sub}</div>
      <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 64, lineHeight: 1 }}>{text}</div>
    </div>
  </Pop>
);

// Scenes whip in from below and out the top, with motion blur on the move
const Scene: React.FC<{ from: number; to: number; first?: boolean; children: React.ReactNode }> = ({ from, to, first, children }) => {
  const frame = useCurrentFrame();
  const enter = useSpring(from, theme.spring.smooth);
  if (frame < from - 1 || frame > to + 10) return null;
  const inY = first ? 0 : (1 - enter) * 1900;
  const outY = ease(frame, [to, to + 9], [0, -1900], theme.ease.in);
  const moving = (!first && frame < from + 8) || frame >= to;
  return <AbsoluteFill style={{ transform: `translateY(${inY + outY}px)`, filter: moving ? "blur(6px)" : undefined }}>{children}</AbsoluteFill>;
};

// ---------- persistent: countdown, blackout, captions ----------
const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const at60 = wf("hook2", "60");
  if (frame < at60 - 2 || frame >= S.end) return null;
  const keys = [ls("time"), ls("s10"), ls("s30"), ls("s45"), wf("s60", "60")];
  const secs = Math.round(interpolate(frame, keys, [59, 50, 30, 15, 0], clamp));
  const shown = frame < keys[0] ? 60 : secs;
  const p = useSpringless(frame, at60);
  const done = shown === 0;
  return (
    <div style={{ position: "absolute", top: 300, right: 80, zIndex: 10, transform: `rotate(2deg) scale(${p})`, background: done ? C.primary : C.ink,
      color: done ? C.bg : C.text, fontFamily: F.mono, fontWeight: 700, fontSize: 44, padding: "8px 20px", borderRadius: 8,
      boxShadow: "0 12px 22px rgba(0,0,0,.55)" }}>
      <span style={{ opacity: 0.6, fontSize: 24, marginRight: 10 }}>T−</span>00:{String(shown).padStart(2, "0")}
    </div>
  );
};
const useSpringless = (frame: number, at: number) => interpolate(frame, [at - 2, at + 4, at + 8], [1.6, 0.95, 1], { ...clamp, easing: theme.ease.out });

const Blackout: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - wf("hook1", "dark");
  const flick = [0, 0.92, 0.92, 0.88, 0.9, 0.6, 0.85, 0.3, 0.7, 0.15, 0];
  return <AbsoluteFill style={{ background: "#050505", opacity: t >= 0 && t < flick.length ? flick[t] : 0, zIndex: 9 }} />;
};

const pages = (() => {
  const words = (vo.words as Word[]).flatMap((w, i, all) => {
    // "8:59 a.m." is one caption, however Whisper split it
    if (w.line === "time") return i === all.findIndex((x) => x.line === "time")
      ? [{ ...w, word: "8:59 AM", end: all.filter((x) => x.line === "time").slice(-1)[0].end }] : [];
    return [w];
  });
  const out: Word[][] = []; let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const weak = /^(a|an|the|for|on|in|of|to)$/i.test(w.word);
    if ((cur.length >= 2 && !weak) || cur.length === 3 || /[,.?:]$/.test(w.word) || w.word === "8:59 AM") { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = pages.findIndex((pg, k) => t >= pg[0].start - 0.05 && (k === pages.length - 1 || t < pages[k + 1][0].start - 0.05));
  if (i < 0 || t > pages[pages.length - 1].slice(-1)[0].end + 0.5) return null;
  const pg = pages[i];
  const pop = interpolate(frame - s2f(pg[0].start), [0, 5], [0.86, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", top: 1395, left: 70, right: 70, textAlign: "center", zIndex: 11, transform: `scale(${pop})`,
      fontFamily: F.sans, fontWeight: 900, fontSize: 88, lineHeight: 1.05, letterSpacing: "-.03em", textTransform: "uppercase" }}>
      {pg.map((w) => (
        <React.Fragment key={w.start}>
          <span style={{ color: t >= w.start ? (t < w.end + 0.08 ? C.primary : C.text) : "rgba(242,240,236,.35)",
            WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 8px 24px rgba(0,0,0,.8)" }}>
            {w.word === "8:59 AM" ? w.word : w.word.replace(/[,.?:]+$/, "").replace(/\.\.\.$/, "")}
          </span>{" "}
        </React.Fragment>
      ))}
    </div>
  );
};

// ---------- 1. hook: the globe goes dark ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(0, theme.spring.slam);
  const dark = wf("hook1", "dark");
  return (
    <>
      <div style={{ position: "absolute", top: 640, left: 0 }}><Globe width={1080} height={820} lightsOffAt={dark} /></div>
      <div style={{ position: "absolute", top: 390, left: 80, width: 920, filter: shadow,
        transform: `rotate(${interpolate(p, [0, 1], [-5, -2])}deg) scale(${interpolate(p, [0, 1], [1.08, 1])})` }}>
        <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "36px 44px 42px" }}>
          <div style={{ fontFamily: F.news, fontSize: 24, letterSpacing: ".32em", borderBottom: `3px double ${C.ink}`, paddingBottom: 10, marginBottom: 14,
            display: "flex", justifyContent: "space-between" }}><span>THE LEDGER</span><span>BREAKING</span></div>
          <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 92, lineHeight: 0.93 }}>Every bank on Earth just went dark.</div>
        </div>
        <Tape x={60} y={-22} r={-16} at={3} />
      </div>
      <Marker at={dark + 14} style={{ top: 1200, right: 80, transform: "rotate(-5deg)", textAlign: "right" }}>lights out,<br />city by city</Marker>
    </>
  );
};

// ---------- 2. meet Zee ----------
const Terminal: React.FC<{ loadingAt: number }> = ({ loadingAt }) => {
  const frame = useCurrentFrame();
  const loading = frame >= loadingAt;
  const pct = Math.min(3, Math.floor((frame - loadingAt) / 12) + 1);
  return (
    <div style={{ position: "absolute", top: 860, left: 585, width: 300, height: 410, background: "#1f1d1b", borderRadius: 28, padding: 22,
      boxShadow: "0 24px 34px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.06)", transform: "rotate(4deg)", zIndex: 4 }}>
      <div style={{ background: "#d9e0d0", borderRadius: 10, height: 220, padding: 18, fontFamily: F.mono, color: C.ink, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 22, letterSpacing: ".1em" }}>FLAT WHITE</div>
        <div style={{ fontSize: 46, fontWeight: 700 }}>£3.40</div>
        {loading ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 700 }}>LOADING… {pct}%</div>
            <div style={{ height: 22, border: `3px solid ${C.ink}`, padding: 2, display: "flex", gap: 3 }}>
              {Array.from({ length: pct }).map((_, i) => <div key={i} style={{ width: 10, background: C.ink }} />)}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}>
            <svg width="30" height="30" viewBox="0 0 30 30" style={{ transform: `rotate(${frame * 12}deg)` }}>
              <circle cx="15" cy="15" r="11" fill="none" stroke={C.ink} strokeWidth="4" strokeDasharray="40 30" strokeLinecap="round" />
            </svg>
            PROCESSING…
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 18 }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 34, borderRadius: 8, background: "#34302c" }} />)}
      </div>
    </div>
  );
};

const MeetZee: React.FC = () => {
  const frame = useCurrentFrame();
  const zeeAt = wf("taps", "zee"), cardAt = wf("taps", "card");
  const cardP = useSpring(cardAt, theme.spring.snappy);
  return (
    <>
      <Paper style={{ top: 400, left: 60, width: 960, height: 720 }} bg={C.paper2} pad="0" rot={1.2}>
        <svg viewBox="0 0 960 720" width="960" height="720">
          <defs><pattern id="cafe3" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2.2" fill={C.ink} /></pattern></defs>
          <rect width="960" height="720" fill="url(#cafe3)" opacity=".28" />
          <rect x="60" y="150" width="380" height="300" fill="url(#cafe3)" opacity=".9" />
          <rect x="520" y="150" width="380" height="300" fill="url(#cafe3)" opacity=".9" />
          <text x="480" y="105" textAnchor="middle" fontFamily={F.news} fontWeight={700} fontSize="64" fill={C.ink} letterSpacing="6">THE CORNER CAFÉ</text>
        </svg>
      </Paper>
      <Pop at={zeeAt - 4} style={{ top: 640, left: 90, zIndex: 3 }} from={260}><Cutout pose="reach" width={540} id="zee3" /></Pop>
      {/* the card travels from Zee's hand to the terminal on "card" */}
      <div style={{ position: "absolute", zIndex: 5, width: 96, height: 60, borderRadius: 8, background: C.primary, boxShadow: "0 8px 14px rgba(0,0,0,.45)",
        left: interpolate(cardP, [0, 1], [548, 680]), top: interpolate(cardP, [0, 1], [1010, 1150]), transform: `rotate(${interpolate(cardP, [0, 1], [-14, 4])}deg)`,
        opacity: frame >= zeeAt ? 1 : 0 }} />
      <Terminal loadingAt={wf("loading", "starts")} />
      <div style={{ position: "absolute", top: 1220, left: -20, width: 1120, height: 420, filter: shadow, zIndex: 6 }}>
        <div style={{ width: "100%", height: "100%", background: "#c9b48f", clipPath: torn,
          backgroundImage: "repeating-linear-gradient(90deg, rgba(26,23,20,.18) 0 3px, transparent 3px 46px)" }} />
      </div>
      <Marker at={zeeAt} style={{ top: 560, left: 600, transform: "rotate(-6deg)" }} size={64}>meet Zee.</Marker>
      <Marker at={wf("loading", "like") + 6} style={{ top: 700, left: 640, transform: "rotate(-4deg)" }} size={44}>(it's buffering<br />on dial-up)</Marker>
    </>
  );
};

// ---------- 3. second 10: cards freeze, the gym card ----------
const Cards: React.FC = () => {
  const freezeAt = wf("s10", "freeze"), gymAt = wf("gym", "someone"), declineAt = wf("gym", "card");
  return (
    <>
      <Label at={ls("s10")} sub="SECOND 10" text="Payments: stuck." />
      <div style={{ position: "absolute", top: 520, left: 0 }}><FrozenCards width={1080} height={760} freezeAt={freezeAt} /></div>
      <Stamp at={freezeAt + 2} text="PENDING" color={C.primary} style={{ top: 560, right: 140 }} size={56} onDark />
      <Pop at={gymAt} style={{ top: 930, left: 230, zIndex: 7, transform: "rotate(-7deg)" }} from={500}>
        <div style={{ width: 520, height: 320, borderRadius: 24, background: "#f4f1ea", color: C.ink, padding: "30px 34px", filter: shadow, position: "relative",
          backgroundImage: "repeating-linear-gradient(135deg, rgba(26,23,20,.06) 0 6px, transparent 6px 14px)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".2em", color: "#6b6258" }}>MEMBER SINCE JAN · VISITS: 2</div>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 64, lineHeight: 1, marginTop: 14 }}>IRON TEMPLE<br />GYM</div>
          <div style={{ fontFamily: F.mono, fontSize: 26, marginTop: 18 }}>MEMBERSHIP CARD</div>
          <Stamp at={declineAt} text="DECLINED" color={C.red} style={{ left: 170, top: 215 }} size={54} />
        </div>
      </Pop>
    </>
  );
};

// ---------- 4. second 30: payroll tears, group chats ----------
const Payroll: React.FC = () => {
  const frame = useCurrentFrame();
  const tearAt = wf("s30", "door");
  const t = ease(frame, [tearAt, tearAt + 10], [0, 1]);
  const chatAt = ls("chat");
  const lift = ease(frame, [chatAt - 6, chatAt + 8], [0, -40]);
  const half = (side: "l" | "r") => (
    <div style={{ position: "absolute", inset: 0, clipPath: side === "l" ? "polygon(0 0,52% 0,47% 30%,53% 55%,48% 78%,52% 100%,0 100%)" : "polygon(52% 0,100% 0,100% 100%,52% 100%,48% 78%,53% 55%,47% 30%)",
      transform: `translateX(${(side === "l" ? -1 : 1) * t * 30}px) rotate(${(side === "l" ? -1 : 1) * t * 6}deg)`, transformOrigin: side === "l" ? "left bottom" : "right bottom" }}>
      <div style={{ background: C.paper, color: C.ink, padding: "36px 42px 44px", height: "100%" }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".18em", color: "#6b6258" }}>PAYROLL RUN · FRIDAY 09:00</div>
        <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 84, lineHeight: 1, margin: "14px 0" }}>Salaries: sending…</div>
        <div style={{ fontFamily: F.mono, fontSize: 28, display: "flex", justifyContent: "space-between" }}><span>STATUS</span><span>HALFWAY OUT THE DOOR</span></div>
      </div>
    </div>
  );
  const bubbles: [string, string][] = [["did", "did u get paid??"], ["you", "mine says PENDING lol"], ["get", "my landlord is typing…"], ["paid", "DID ANYONE GET PAID"]];
  return (
    <>
      <Label at={ls("s30")} sub="SECOND 30" text="Payroll: frozen." />
      <div style={{ position: "absolute", top: 600 + lift, left: 100, width: 840, height: 300, filter: shadow, transform: "rotate(-1.5deg)" }}>
        {half("l")}{half("r")}
        <Stamp at={tearAt + 6} text="FROZEN" color="#0aa9b8" style={{ left: 300, top: 90 }} />
      </div>
      <Pop at={chatAt - 2} style={{ top: 880, left: 20, zIndex: 3 }} from={400}><Cutout pose="phone" width={310} id="p1" /></Pop>
      <Pop at={chatAt + 3} style={{ top: 930, left: 280, zIndex: 3 }} from={400}><Cutout pose="phone" width={290} id="p2" tint="#3a3631" /></Pop>
      {bubbles.map(([w, text], i) => (
        <Pop key={w} at={wf("paid", w)} style={{ top: 900 + i * 92, left: 520, zIndex: 6 }} from={30}>
          <div style={{ background: i % 2 ? "#2b2825" : C.paper, color: i % 2 ? C.text : C.ink, fontFamily: F.sans, fontWeight: 800, fontSize: 34,
            padding: "14px 24px", borderRadius: 26, borderBottomLeftRadius: 6, boxShadow: "0 10px 18px rgba(0,0,0,.45)", maxWidth: 400, whiteSpace: "nowrap" }}>{text}</div>
        </Pop>
      ))}
    </>
  );
};

// ---------- 5. second 45: the napkin IOU ----------
const Napkin: React.FC = () => {
  const iouAt = wf("s45", "ious"), zeeAt = wf("debtor", "zee"), debtorAt = wf("debtor", "debtor");
  return (
    <>
      <Label at={ls("s45")} sub="SECOND 45" text="Cash? IOUs." />
      <Pop at={ls("s45") + 8} style={{ top: 600, left: 130, zIndex: 4, transform: "rotate(-3deg)" }} from={300}>
        <div style={{ width: 820, height: 680, background: "#f6f3ec", clipPath: torn, filter: shadow, position: "relative",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(26,23,20,.05) 0 2px, transparent 2px 22px), repeating-linear-gradient(-45deg, rgba(26,23,20,.05) 0 2px, transparent 2px 22px)" }}>
          <Marker at={iouAt} style={{ top: 60, left: 70, color: C.ink, transform: "rotate(-4deg)" }} size={130}>I.O.U.</Marker>
          <Marker at={zeeAt} style={{ top: 260, left: 70, color: C.ink, transform: "rotate(-3deg)" }} size={66}>ZEE OWES<br />1 FLAT WHITE</Marker>
          <Marker at={zeeAt + 16} style={{ top: 410, left: 470, color: C.ink, transform: "rotate(-6deg)" }} size={44}>— the café</Marker>
          <Stamp at={debtorAt} text="DEBTOR" color={C.red} style={{ top: 500, left: 90 }} size={76} />
        </div>
      </Pop>
    </>
  );
};

// ---------- 6. second 60: lights back, one shop that never noticed ----------
const Shopfront: React.FC<{ name: string; glowAt?: number; x: number }> = ({ name, glowAt, x }) => {
  const frame = useCurrentFrame();
  const g = glowAt === undefined ? 0 : ease(frame, [glowAt, glowAt + 8], [0, 1]);
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 220, height: 420 }}>
      <div style={{ position: "absolute", inset: 0, background: C.paper2, clipPath: torn, filter: `brightness(${0.45 + g * 0.6})` }}>
        <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 26, textAlign: "center", padding: "22px 10px 0", color: C.ink }}>{name}</div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 90, height: 200, background: g > 0 ? C.primary : "#2b2825", opacity: 0.3 + g * 0.7,
          boxShadow: g > 0 ? `0 0 ${60 * g}px ${C.primary}` : undefined }} />
        <div style={{ position: "absolute", left: 80, right: 80, top: 310, bottom: 0, background: "#2b2825" }} />
      </div>
    </div>
  );
};

const LightsBack: React.FC = () => {
  const frame = useCurrentFrame();
  const backAt = wf("s60", "back"), strangeAt = ls("strange"), noticeAt = wf("notice", "notice");
  const globeOut = ease(frame, [strangeAt - 4, strangeAt + 10], [0, 1], theme.ease.in);
  const shopsIn = useSpring(strangeAt + 4);
  return (
    <>
      <div style={{ position: "absolute", top: 520, left: 0, opacity: 1 - globeOut, transform: `scale(${1 - globeOut * 0.3})` }}>
        <Globe width={1080} height={820} lightsOffAt={-1000} lightsOnAt={backAt} />
      </div>
      <Marker at={backAt + 4} style={{ top: 1230, left: 90, transform: "rotate(-4deg)", opacity: 1 - globeOut }} size={58}>…and breathe.</Marker>
      <div style={{ position: "absolute", top: 640, left: 50, width: 980, height: 420, opacity: frame >= strangeAt ? 1 : 0, transform: `translateY(${(1 - shopsIn) * 1600}px)` }}>
        <Shopfront name="BAKERY" x={0} />
        <Shopfront name="FLORIST" x={250} />
        <Shopfront name="THE SHOP" x={500} glowAt={noticeAt} />
        <Shopfront name="BARBER" x={750} />
      </div>
      <Marker at={noticeAt + 6} style={{ top: 1100, left: 470, transform: "rotate(-5deg)" }} size={56}>this one? didn't blink.</Marker>
    </>
  );
};

// ---------- 7. inside: orders still moving, owner asleep ----------
const Inside: React.FC = () => {
  const frame = useCurrentFrame();
  const from = ls("orders"), invAt = wf("orders", "invoices"), asleepAt = wf("asleep", "asleep");
  const orders = 212 + Math.max(0, Math.floor((frame - from) / 7));
  return (
    <>
      <Label at={from} sub="INSIDE THE SHOP" text="Nobody's working." />
      <div style={{ position: "absolute", top: 540, left: 0 }}><Conveyor width={1080} height={480} /></div>
      <Pop at={from + 6} style={{ top: 560, right: 150, zIndex: 6, transform: "rotate(3deg)" }} from={40}>
        <div style={{ background: C.ink, color: C.text, fontFamily: F.mono, fontWeight: 700, fontSize: 40, padding: "10px 22px", borderRadius: 8, boxShadow: "0 12px 22px rgba(0,0,0,.5)" }}>
          <span style={{ color: C.textDim, fontSize: 22, marginRight: 10 }}>ORDERS</span>{orders}
        </div>
      </Pop>
      {[0, 1, 2].map((i) => (
        <Pop key={i} at={invAt + i * 6} style={{ top: 1010 + i * 34, left: 560 + i * 18, zIndex: 5, transform: `rotate(${-4 + i * 3}deg)` }} from={60}>
          <div style={{ width: 330, background: C.receipt, color: C.ink, fontFamily: F.mono, fontSize: 22, padding: "16px 20px", clipPath: torn, filter: shadow }}>
            INVOICE #{1042 + i} · <b style={{ color: "#1f8a4c" }}>SENT ✓</b>
          </div>
        </Pop>
      ))}
      <Pop at={from + 10} style={{ top: 980, left: 40, zIndex: 4, height: 300, overflow: "hidden", width: 380 }} from={300}><div style={{ marginTop: -180 }}><Cutout pose="sleep" width={360} id="owner" /></div></Pop>
      <div style={{ position: "absolute", top: 1270, left: 10, width: 470, height: 70, background: "#c9b48f", clipPath: torn, zIndex: 5, filter: shadow }} />
      {["Z", "z", "z"].map((z, i) => {
        const at = asleepAt + i * 8, y = ease(frame, [at, at + 40], [0, -60]);
        return frame >= at ? <div key={i} style={{ position: "absolute", top: 1000 - i * 55 + y, left: 300 + i * 50, fontFamily: F.hand, fontSize: 70 - i * 10,
          color: C.primary, opacity: ease(frame, [at, at + 6], [0, 1]), zIndex: 7 }}>{z}</div> : null;
      })}
    </>
  );
};

// ---------- 8. open loop ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const partAt = wf("part2", "part"), followAt = wf("part2", "follow");
  const sticker = useSpring(partAt, theme.spring.slam);
  return (
    <>
      <Paper style={{ top: 480, left: 90, width: 900 }} pad="56px 54px 64px" rot={-1.5}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".24em", color: "#6b6258" }}>NEXT EPISODE</div>
        <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 112, lineHeight: 0.93, marginTop: 14 }}>The businesses that slept through it.</div>
      </Paper>
      <div style={{ position: "absolute", top: 990, right: 160, zIndex: 6, transform: `rotate(8deg) scale(${sticker})`, background: C.primary, color: C.bg,
        fontFamily: F.sans, fontWeight: 900, fontSize: 56, padding: "14px 30px", borderRadius: 999, boxShadow: "0 14px 30px rgba(0,0,0,.5)" }}>PART 2 →</div>
      <Marker at={followAt} style={{ top: 1170, left: 90, right: 90, textAlign: "center", transform: "rotate(-4deg)" }} size={58}>follow so you don't miss it</Marker>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: ease(frame, [followAt + 10, followAt + 20], [0, 1]) }}>
        <Mark size={40} />
      </div>
    </>
  );
};

// ---------- sound: narration + SFX, never music ----------
const sfx: [number, string, number][] = [
  [0, "thud", 0.9], [3, "tape", 0.5],
  [wf("hook1", "dark") - 2, "powerdown", 0.9], [wf("hook2", "60") - 2, "stamp", 0.45],
  [S.zee, "whoosh", 0.6], [wf("taps", "zee") - 4, "paper", 0.6], [wf("taps", "zee"), "marker", 0.45], [wf("taps", "card") - 1, "tick", 0.6],
  ...[0, 12, 24].map((d) => [wf("loading", "starts") + d, "blip", 0.5] as [number, string, number]),
  [S.cards, "whoosh", 0.6], [wf("s10", "freeze") - 1, "stamp", 0.8], [wf("gym", "someone") - 2, "paper", 0.6], [wf("gym", "card") - 2, "buzz", 0.55], [wf("gym", "card"), "stamp", 0.9],
  [S.payroll, "whoosh", 0.6], [wf("s30", "door") - 1, "tear", 0.9], [wf("s30", "door") + 5, "stamp", 0.8],
  ...["did", "you", "get", "paid"].map((w) => [wf("paid", w) - 1, "ping", 0.45] as [number, string, number]),
  [S.napkin, "whoosh", 0.6], [ls("s45") + 6, "paper", 0.6], [wf("s45", "ious") - 1, "marker", 0.55], [wf("debtor", "zee") - 1, "marker", 0.5], [wf("debtor", "debtor") - 2, "stamp", 1],
  [S.back, "whoosh", 0.6], [wf("s60", "back") - 3, "powerup", 0.8], [ls("strange") + 2, "paper", 0.6], [wf("notice", "notice") - 1, "pop", 0.6],
  [S.inside, "whoosh", 0.6], [wf("orders", "invoices") - 1, "tick", 0.6], [wf("orders", "invoices") + 5, "tick", 0.6], [wf("orders", "invoices") + 11, "tick", 0.6],
  [wf("asleep", "asleep") - 2, "zzz", 0.7],
  [S.end, "whoosh", 0.7], [S.end + 6, "thud", 0.8], [wf("part2", "part") - 2, "pop", 0.7],
];

export const Ep01: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Desk />
    <Scene from={0} to={S.zee} first><Hook /></Scene>
    <Scene from={S.zee} to={S.cards}><MeetZee /></Scene>
    <Scene from={S.cards} to={S.payroll}><Cards /></Scene>
    <Scene from={S.payroll} to={S.napkin}><Payroll /></Scene>
    <Scene from={S.napkin} to={S.back}><Napkin /></Scene>
    <Scene from={S.back} to={S.inside}><LightsBack /></Scene>
    <Scene from={S.inside} to={S.end}><Inside /></Scene>
    <Scene from={S.end} to={EP01_FRAMES + 20}><EndCard /></Scene>
    <Blackout />
    <SeriesBar />
    <Countdown />
    <Captions />
    <Grade />
    <Grain />
    <Vignette />
    <Audio src={staticFile("vo.wav")} />
    {sfx.map(([at, name, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={45}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
