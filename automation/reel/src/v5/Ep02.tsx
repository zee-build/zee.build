// ZeeBuild · What If · EP02: "The banks don't come back". Signal Red theme; every beat keyed to a narration word.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Grain, Vignette, torn, shadow } from "../Vox";
import { Globe } from "../v2/Globe";
import { Cutout } from "../v2/Cutout";
import { Conveyor } from "../v3/Scenes3D";
import { RED, F, RED_GLOBE } from "../v4/Style02";
import vo from "./vo.json";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- timing from the voiceover ----------
type Word = { word: string; start: number; end: number; line: string };
const s2f = (s: number) => Math.round(s * FPS);
const ls = (id: string) => s2f(vo.lines.find((l) => l.id === id)!.start);
const le = (id: string) => s2f(vo.lines.find((l) => l.id === id)!.end);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const wf = (id: string, word: string) => {
  const w = (vo.words as Word[]).find((x) => x.line === id && norm(x.word).startsWith(word));
  if (!w) throw new Error(`no word "${word}" in line ${id}`);
  return s2f(w.start);
};
export const EP02_FRAMES = s2f(vo.total) + 18;

const S = {
  hook: ls("hook") - 6, h1: ls("h1a") - 6, h3: ls("h3a") - 6, h6: ls("h6a") - 6, h12: ls("h12a") - 6,
  rev: ls("rev") - 6, safe: ls("safe") - 6, lesson: ls("diff") - 6, h24: ls("h24") - 6, end: ls("how") - 6,
};

// ---------- helpers ----------
export const useSpring = (at: number, config: object = theme.spring.smooth) => {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config });
};
export const ease = (frame: number, r: [number, number], o: [number, number], e = theme.ease.out) => interpolate(frame, r, o, { ...clamp, easing: e });

export const Pop: React.FC<{ at: number; style: React.CSSProperties; children: React.ReactNode; from?: number }> = ({ at, style, children, from = 140 }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, theme.spring.snappy);
  if (frame < at - 1) return null;
  return <div style={{ position: "absolute", ...style, opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
    transform: `${style.transform ?? ""} translateY(${(1 - p) * from}px) scale(${interpolate(p, [0, 1], [0.85, 1])})` }}>{children}</div>;
};

export const Stamp: React.FC<{ at: number; text: string; style: React.CSSProperties; size?: number; color?: string; bg?: string }> = ({ at, text, style, size = 64, color = RED.red, bg = "rgba(14,10,10,.55)" }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, theme.spring.slam);
  if (frame < at) return null;
  return <div style={{ position: "absolute", zIndex: 8, ...style, transform: `rotate(-10deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
    opacity: interpolate(p, [0, 0.4], [0, 1], clamp), border: `7px solid ${color}`, color, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: ".06em", padding: "2px 20px", background: bg, whiteSpace: "nowrap" }}>{text}</div>;
};

// Handwriting only ever sits on a solid bone tag, in deep red ink
export const Tag: React.FC<{ at: number; children: React.ReactNode; style: React.CSSProperties; size?: number }> = ({ at, children, style, size = 46 }) => (
  <Pop at={at} style={{ zIndex: 8, ...style }} from={40}>
    <div style={{ background: RED.bone, color: RED.redDeep, fontFamily: F.hand, fontSize: size, lineHeight: 1.05, padding: "12px 22px 14px", clipPath: torn, filter: shadow }}>{children}</div>
  </Pop>
);

export const Label: React.FC<{ sub: string; text: string; at: number }> = ({ sub, text, at }) => (
  <Pop at={at} style={{ top: 390, left: 80, zIndex: 6, transform: "rotate(-2deg)" }} from={60}>
    <div style={{ background: RED.bone, color: RED.ink, clipPath: torn, padding: "22px 34px 26px", filter: shadow }}>
      <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".22em", color: RED.muted }}>{sub}</div>
      <div style={{ fontFamily: F.display, fontSize: 68, lineHeight: 1 }}>{text}</div>
    </div>
  </Pop>
);

export const Scene: React.FC<{ from: number; to: number; first?: boolean; children: React.ReactNode }> = ({ from, to, first, children }) => {
  const frame = useCurrentFrame();
  const enter = useSpring(from, theme.spring.smooth);
  if (frame < from - 1 || frame > to + 10) return null;
  const inY = first ? 0 : (1 - enter) * 1900;
  const outY = ease(frame, [to, to + 9], [0, -1900], theme.ease.in);
  const moving = (!first && frame < from + 8) || frame >= to;
  return <AbsoluteFill style={{ transform: `translateY(${inY + outY}px)`, filter: moving ? "blur(6px)" : undefined }}>{children}</AbsoluteFill>;
};

// ---------- persistent layers ----------
const Desk: React.FC = () => {
  const frame = useCurrentFrame();
  // The room gets darker as the day goes on, then warms at hour 24
  const dim = interpolate(frame, [S.h6, S.h12 + 20, S.h24, S.h24 + 40], [0, 0.35, 0.35, 0], clamp);
  return (
    <AbsoluteFill style={{ background: RED.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 760px at 50% ${58 + Math.sin(frame / 60) * 3}%, rgba(224,48,42,.13), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 24%, transparent 76%, rgba(0,0,0,.45))" }} />
      <AbsoluteFill style={{ background: "#000", opacity: dim }} />
    </AbsoluteFill>
  );
};

export const Bar: React.FC<{ ep?: string; series?: string }> = ({ ep = "EP 02", series = "WHAT IF" }) => (
  <div style={{ position: "absolute", top: 240, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 26,
    letterSpacing: ".08em", color: RED.muted, zIndex: 12 }}>
    <span><span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: RED.red, marginRight: 14, boxShadow: `0 0 16px ${RED.red}` }} />
      <b style={{ color: RED.text, fontWeight: 500 }}>ZEEBUILD OS</b> · {series}</span>
    <span>{ep}</span>
  </div>
);

const HOURS: [number, string][] = [[S.hook + 6, "00"], [ls("h1a"), "01"], [ls("h3a"), "03"], [ls("h6a"), "06"], [ls("h12a"), "12"], [ls("rev"), "13"], [ls("diff"), "18"], [ls("h24"), "24"]];
const HourChip: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < HOURS[0][0] || frame >= S.end) return null;
  const idx = HOURS.filter(([at]) => frame >= at).length - 1;
  const [at, h] = HOURS[idx];
  const flip = interpolate(frame, [at, at + 3, at + 8], [1.5, 0.95, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", top: 300, right: 80, zIndex: 12, transform: `rotate(2deg) scale(${flip})`, background: h === "24" ? RED.red : RED.bone,
      color: RED.ink, fontFamily: F.mono, fontWeight: 700, fontSize: 40, padding: "8px 20px", borderRadius: 6, boxShadow: "0 12px 22px rgba(0,0,0,.6)" }}>
      <span style={{ fontSize: 22, letterSpacing: ".12em", marginRight: 10, color: h === "24" ? RED.bone : RED.muted }}>HOUR</span>
      <span style={{ color: h === "24" ? RED.bone : RED.red }}>{h}</span>
    </div>
  );
};

const Blackout: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - wf("o1", "dark");
  const flick = [0, 0.9, 0.9, 0.85, 0.88, 0.5, 0.8, 0.25, 0.6, 0.1, 0];
  return <AbsoluteFill style={{ background: "#050303", opacity: t >= 0 && t < flick.length ? flick[t] : 0, zIndex: 10 }} />;
};

const pages = (() => {
  const out: Word[][] = []; let cur: Word[] = [];
  for (const w of vo.words as Word[]) {
    cur.push(w);
    const weak = /^(a|an|the|for|on|in|of|to|is|are|just|your|one)$/i.test(w.word);
    if ((cur.length >= 2 && !weak) || cur.length === 3 || /[,.?:]$/.test(w.word)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const clean = (w: string) => w.replace(/\.\.\.$/, "").replace(/[,.?:]+$/, "").replace(/^\W?11$/, "£11");
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = pages.findIndex((pg, k) => t >= pg[0].start - 0.05 && (k === pages.length - 1 || t < pages[k + 1][0].start - 0.05));
  if (i < 0) return null;
  const pg = pages[i];
  // Captions leave during long silences so the pause feels like a pause
  if (t > pg[pg.length - 1].end + 0.45) return null;
  const pop = interpolate(frame - s2f(pg[0].start), [0, 5], [0.86, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", top: 1395, left: 60, right: 60, textAlign: "center", zIndex: 11, transform: `scale(${pop})`, fontFamily: F.sans,
      fontWeight: 900, fontSize: 86, letterSpacing: "-.03em", textTransform: "uppercase", lineHeight: 1.15 }}>
      {pg.map((w, k) => {
        // Only one word lit at a time, even when Whisper's timings overlap
        const next = pg[k + 1];
        const active = t >= w.start && t < (next ? next.start : w.end + 0.3);
        return (
          <React.Fragment key={w.start}>
            <span style={active
              ? { background: RED.red, color: RED.bone, padding: "0 14px", borderRadius: 6, display: "inline-block", transform: "rotate(-2deg)", boxShadow: "0 10px 22px rgba(0,0,0,.5)" }
              : { color: t >= w.start ? RED.text : "rgba(243,238,231,.4)", WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 8px 24px rgba(0,0,0,.8)" }}>
              {clean(w.word)}
            </span>{" "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------- 1. cold open ----------
const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const strikeAt = ls("o2"), backAt = wf("o3", "back");
  const strike = ease(frame, [strikeAt, strikeAt + 10], [0, 100], theme.ease.inOut);
  const globeDim = ease(frame, [strikeAt, strikeAt + 20], [1, 0.75]);
  return (
    <>
      <div style={{ position: "absolute", top: 960, left: 0, opacity: globeDim }}><Globe width={1080} height={480} lightsOffAt={wf("o1", "dark")} pal={RED_GLOBE} /></div>
      <div style={{ position: "absolute", top: 400, left: 80, right: 80, color: RED.text, zIndex: 5 }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".3em", color: RED.muted }}>PREVIOUSLY · EP 01</div>
        <div style={{ fontFamily: F.display, fontSize: 104, lineHeight: 1, marginTop: 14, position: "relative", display: "inline-block", opacity: 1 - strike / 250 }}>
          Last time: 60 seconds.
          <div style={{ position: "absolute", left: -6, top: "54%", height: 10, width: `${strike}%`, background: RED.red, transform: "rotate(-2deg)" }} />
        </div>
        <Pop at={ls("o3") - 2} style={{ position: "relative", marginTop: 22 }} from={50}>
          <div style={{ fontFamily: F.display, fontSize: 124, lineHeight: 0.95 }}>
            This time, they <span style={{ background: RED.red, color: RED.bone, padding: "0 16px", display: "inline-block", transform: "rotate(-2deg)" }}>don't</span> come back.
          </div>
        </Pop>
      </div>
      <Stamp at={backAt + 6} text="DAY 1" style={{ top: 1150, left: 100 }} size={72} />
    </>
  );
};

// ---------- 2. the question ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const dayAt = wf("hook", "whole");
  const handA = ((frame - S.hook) / FPS) * 30; // one tick per second
  const tickA = Math.floor(handA / 30) * 30 + ease((frame - S.hook) % FPS, [0, 5], [0, 30]) ;
  return (
    <>
      <div style={{ position: "absolute", top: 400, left: 80, right: 80, color: RED.text, zIndex: 5, fontFamily: F.display, fontSize: 100, lineHeight: 1 }}>
        What happens when every bank on Earth shuts down for{" "}
        <span style={{ background: frame >= dayAt ? RED.red : "transparent", color: RED.bone, padding: "0 14px", display: "inline-block",
          transform: `rotate(-2deg) scale(${frame >= dayAt ? ease(frame, [dayAt, dayAt + 6], [1.25, 1]) : 1})` }}>a whole day?</span>
      </div>
      <svg viewBox="0 0 400 400" style={{ position: "absolute", top: 930, left: 340, width: 400, height: 400, filter: "drop-shadow(0 20px 26px rgba(0,0,0,.6))" }}>
        <circle cx="200" cy="200" r="180" fill={RED.bone} />
        <circle cx="200" cy="200" r="180" fill="none" stroke={RED.ink} strokeWidth="10" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="200" y1="36" x2="200" y2={i % 3 ? 58 : 76} stroke={RED.ink} strokeWidth={i % 3 ? 6 : 12} transform={`rotate(${i * 30} 200 200)`} />
        ))}
        <line x1="200" y1="200" x2="200" y2="110" stroke={RED.ink} strokeWidth="14" strokeLinecap="round" />
        <line x1="200" y1="210" x2="200" y2="60" stroke={RED.red} strokeWidth="6" strokeLinecap="round" transform={`rotate(${tickA} 200 200)`} />
        <circle cx="200" cy="200" r="14" fill={RED.red} />
      </svg>
    </>
  );
};

// ---------- 3. hour 1: try again ----------
const TerminalRed: React.FC<{ tryAt: number; style: React.CSSProperties; scale?: number }> = ({ tryAt, style, scale = 1 }) => {
  const frame = useCurrentFrame();
  const tryNow = frame >= tryAt;
  const blink = tryNow && Math.floor((frame - tryAt) / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", width: 300, height: 400, background: "#221b1b", borderRadius: 28, padding: 22, transformOrigin: "top left",
      boxShadow: "0 24px 34px rgba(0,0,0,.65)", transform: `rotate(4deg) scale(${scale})`, ...style }}>
      <div style={{ background: RED.bone, borderRadius: 10, height: 210, padding: 18, fontFamily: F.mono, color: RED.ink }}>
        <div style={{ fontSize: 22, letterSpacing: ".1em", color: RED.muted }}>CARD PAYMENT</div>
        <div style={{ fontSize: 40, fontWeight: 700, marginTop: 6 }}>£4.20</div>
        <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14, color: RED.red, opacity: tryNow ? (blink ? 1 : 0.35) : 1 }}>{tryNow ? "TRY AGAIN" : "WAIT…"}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 18 }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 34, borderRadius: 8, background: "#3a3030" }} />)}
      </div>
    </div>
  );
};

const Hour1: React.FC = () => {
  const tryAt = wf("h1a", "try"), everyoneAt = wf("h1b", "everyone"), triesAt = wf("h1b", "tries");
  return (
    <>
      <Label at={ls("h1a")} sub="HOUR 01" text="Nobody panics." />
      <TerminalRed tryAt={tryAt} style={{ top: 560, left: 600 }} />
      {[0, 1, 2, 3].map((i) => (
        <Pop key={i} at={i === 0 ? ls("h1a") + 4 : everyoneAt + (i - 1) * 5} style={{ top: 880, left: 30 + i * 215, zIndex: 3 }} from={300}>
          <Cutout pose="reach" width={240} id={`q${i}`} tint={i === 0 ? RED.ink : "#3a3030"} />
        </Pop>
      ))}
      <div style={{ position: "absolute", top: 1240, left: -20, width: 1120, height: 420, background: "#1d1717", clipPath: torn, zIndex: 5 }} />
      <Tag at={ls("h1a") + 10} style={{ top: 790, left: 60, transform: "rotate(-5deg)" }} size={38}>Zee</Tag>
      <Tag at={triesAt + 8} style={{ top: 660, left: 120, transform: "rotate(-4deg)" }} size={42}>everyone. again.<br />and again.</Tag>
    </>
  );
};

// ---------- 4. hour 3: cash runs dry ----------
const ATM: React.FC = () => (
  <div style={{ position: "absolute", top: 640, left: 560, width: 350, height: 560, background: "#221b1b", borderRadius: 18, padding: 24, zIndex: 4,
    boxShadow: "0 26px 36px rgba(0,0,0,.65)" }}>
    <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".3em", color: RED.muted, textAlign: "center" }}>CASH</div>
    <div style={{ background: RED.bone, borderRadius: 8, height: 230, marginTop: 14, padding: 20, fontFamily: F.mono, color: RED.ink }}>
      <div style={{ fontSize: 20, letterSpacing: ".12em", color: RED.muted }}>SORRY</div>
      <div style={{ fontSize: 46, fontWeight: 700, color: RED.red, lineHeight: 1.05, marginTop: 8 }}>OUT OF<br />CASH</div>
      <div style={{ fontSize: 20, marginTop: 10 }}>try again: never</div>
    </div>
    <div style={{ height: 18, background: "#0b0808", borderRadius: 9, margin: "26px 30px 0" }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 26 }}>
      {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 34, borderRadius: 6, background: "#3a3030" }} />)}
    </div>
  </div>
);

const Hour3: React.FC = () => {
  const frame = useCurrentFrame();
  const zeeAt = wf("h3b", "zee"), poundsAt = wf("h3b", "11"), mealAt = wf("h3c", "half");
  return (
    <>
      <Label at={ls("h3a")} sub="HOUR 03" text="Cash runs dry." />
      <Pop at={ls("h3a") + 6} style={{ top: 0, left: 0 }} from={600}><ATM /></Pop>
      <Pop at={zeeAt - 4} style={{ top: 650, left: 50, zIndex: 3 }} from={300}><Cutout pose="reach" width={520} id="zee3" /></Pop>
      <div style={{ position: "absolute", top: 1210, left: -20, width: 1120, height: 420, background: "#1d1717", clipPath: torn, zIndex: 5 }} />
      <Pop at={poundsAt - 2} style={{ top: 1010, left: 290, zIndex: 7, transform: "rotate(-6deg)" }} from={80}>
        <div style={{ filter: shadow }}>
          <div style={{ width: 4, height: 70, background: RED.muted, margin: "0 0 -6px 60px" }} />
          <div style={{ background: RED.bone, color: RED.ink, padding: "18px 24px", borderRadius: "10px 30px 10px 10px", fontFamily: F.mono, minWidth: 300 }}>
            <div style={{ fontSize: 20, letterSpacing: ".16em", color: RED.muted }}>ZEE'S NET WORTH</div>
            <div style={{ fontSize: 58, fontWeight: 700, color: RED.red }}>£11.00</div>
            <div style={{ fontSize: 24, fontWeight: 700, opacity: frame >= mealAt ? 1 : 0 }}>+ ½ MEAL DEAL</div>
          </div>
        </div>
      </Pop>
      <Tag at={le("h3c") + 4} style={{ top: 515, left: 610, transform: "rotate(4deg)" }} size={42}>send help<br />(and a sandwich)</Tag>
    </>
  );
};

// ---------- 5. hour 6: shutters ----------
export const Shop: React.FC<{ name: string; x: number; shutAt?: number; glowAt?: number; dimAt?: number; small?: boolean }> = ({ name, x, shutAt, glowAt, dimAt }) => {
  const frame = useCurrentFrame();
  const shut = shutAt === undefined ? 0 : ease(frame, [shutAt, shutAt + 7], [0, 1], theme.ease.in);
  const glow = glowAt === undefined ? 0 : ease(frame, [glowAt, glowAt + 8], [0, 1]);
  const dim = dimAt === undefined ? 0 : ease(frame, [dimAt, dimAt + 12], [0, 0.55]);
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 205, height: 440, filter: `brightness(${1 - dim + glow * 0.6})` }}>
      <div style={{ position: "absolute", inset: 0, background: RED.bone2, clipPath: torn }}>
        <div style={{ fontFamily: F.display, fontSize: 30, textAlign: "center", padding: "20px 8px 0", color: RED.ink }}>{name}</div>
        <div style={{ position: "absolute", left: 22, right: 22, top: 84, height: 210, background: glow > 0 ? RED.red : "#2b2323",
          boxShadow: glow > 0 ? `0 0 ${70 * glow}px ${RED.red}` : undefined }} />
        <div style={{ position: "absolute", left: 76, right: 76, top: 316, bottom: 0, background: "#2b2323" }} />
      </div>
      {/* corrugated shutter */}
      <div style={{ position: "absolute", left: 10, right: 10, top: 70, height: `${shut * 370}px`, background: "repeating-linear-gradient(180deg, #4a4040 0 14px, #2e2626 14px 18px)",
        boxShadow: "0 8px 12px rgba(0,0,0,.5)" }} />
    </div>
  );
};

const Hour6: React.FC = () => {
  const cardsAt = wf("h6a", "cards"), stopAt = wf("h6b", "stop");
  return (
    <>
      <Label at={ls("h6a")} sub="HOUR 06" text="Doors closing." />
      <div style={{ position: "absolute", top: 620, left: 80, width: 900, height: 440 }}>
        {["BAKERY", "FLORIST", "CAFÉ", "BARBER"].map((n, i) => <Shop key={n} name={n} x={i * 228} shutAt={stopAt + i * 7} />)}
      </div>
      <Tag at={cardsAt} style={{ top: 1110, left: 470, transform: "rotate(5deg)" }} size={44}>cards? no.<br />cash? also no.</Tag>
    </>
  );
};

// ---------- 6. hour 12: frozen, but a few aren't ----------
const Hour12: React.FC = () => {
  const frame = useCurrentFrame();
  const frozenAt = wf("h12b", "frozen"), arentAt = wf("h12d", "aren");
  const names = ["GYM", "SALON", "BOUTIQUE", "STUDIO", "THE SHOP", "GARAGE"];
  return (
    <>
      <Label at={ls("h12a")} sub="HOUR 12" text="Then it gets strange." />
      <div style={{ position: "absolute", top: 600, left: 90, width: 900 }}>
        {names.map((n, i) => {
          const lit = n === "THE SHOP" && frame >= arentAt;
          const g = lit ? ease(frame, [arentAt, arentAt + 8], [0, 1]) : 0;
          return (
            <div key={n} style={{ position: "absolute", left: (i % 3) * 300, top: Math.floor(i / 3) * 330, width: 270, height: 300, background: RED.bone2, clipPath: torn,
              filter: `brightness(${frame >= frozenAt && !lit ? 0.45 : 1 + g * 0.1})` }}>
              <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".18em", textAlign: "center", paddingTop: 18, color: RED.ink }}>{n}</div>
              <div style={{ position: "absolute", left: 20, right: 20, top: 62, bottom: 22, background: lit ? RED.red : "#2b2323", display: "grid", placeItems: "center",
                boxShadow: lit ? `0 0 ${60 * g}px ${RED.red}` : undefined }}>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: lit ? RED.bone : RED.muted }}>{lit ? "OPEN ✓" : frame >= frozenAt ? "REFRESHING…" : "WAITING…"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------- 7. the reveal: still taking orders ----------
const Reveal: React.FC = () => {
  const from = ls("rev");
  const rows: [string, string, string][] = [["logged", "ORDER #2201", "LOGGED"], ["queued", "ORDER #2202", "QUEUED ✓"], ["ready", "CHARGE WHEN", "BANKS WAKE"]];
  return (
    <>
      <Label at={from} sub="INSIDE THE SHOP" text="Orders: still coming." />
      <div style={{ position: "absolute", top: 560, left: 0 }}><Conveyor width={1080} height={460} accent={RED.red} /></div>
      {rows.map(([w, a, b], i) => (
        <Pop key={w} at={wf("rev", w)} style={{ top: 1010 + i * 70, left: 470 + i * 20, zIndex: 6, transform: `rotate(${-3 + i * 2}deg)` }} from={60}>
          <div style={{ width: 400, background: RED.bone, color: RED.ink, fontFamily: F.mono, fontSize: 24, padding: "14px 20px", clipPath: torn, filter: shadow,
            display: "flex", justifyContent: "space-between" }}><span>{a}</span><b style={{ color: RED.red }}>{b}</b></div>
        </Pop>
      ))}
    </>
  );
};

// ---------- 8. "your order is safe" ----------
const Safe: React.FC = () => {
  const safeAt = wf("safe", "safe"), calmAt = ls("calm");
  return (
    <>
      <Label at={ls("safe")} sub="THEIR CUSTOMERS" text="Get one message." />
      <Pop at={ls("safe") + 6} style={{ top: 600, left: 560, zIndex: 4, transform: "rotate(4deg)" }} from={500}>
        <div style={{ width: 360, height: 640, background: "#1b1515", borderRadius: 48, padding: 18, boxShadow: "0 26px 40px rgba(0,0,0,.7), inset 0 0 0 3px #3a3030" }}>
          <div style={{ height: "100%", borderRadius: 34, background: "linear-gradient(180deg,#2b2222,#151010)", padding: "70px 18px" }}>
            <div style={{ fontFamily: F.mono, color: RED.muted, textAlign: "center", fontSize: 64, fontWeight: 700 }}>14:02</div>
          </div>
        </div>
      </Pop>
      <Pop at={safeAt - 3} style={{ top: 820, left: 470, zIndex: 6, transform: "rotate(4deg)" }} from={30}>
        <div style={{ width: 420, background: RED.bone, color: RED.ink, borderRadius: 22, padding: "18px 22px", boxShadow: "0 16px 28px rgba(0,0,0,.6)", fontFamily: F.sans }}>
          <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: ".14em", color: RED.muted }}>THE SHOP · NOW</div>
          <div style={{ fontWeight: 900, fontSize: 36, marginTop: 6 }}>Your order is safe ✓</div>
          <div style={{ fontWeight: 600, fontSize: 22, marginTop: 6, color: "#4a4040" }}>We'll charge you when the banks are back.</div>
        </div>
      </Pop>
      <Pop at={ls("safe") + 12} style={{ top: 760, left: 40, zIndex: 3 }} from={300}><Cutout pose="phone" width={380} id="calm" /></Pop>
      <div style={{ position: "absolute", top: 1240, left: -20, width: 1120, height: 420, background: "#1d1717", clipPath: torn, zIndex: 5 }} />
      <Tag at={calmAt + 10} style={{ top: 640, left: 60, transform: "rotate(-4deg)" }} size={40}>blood pressure:<br />normal</Tag>
    </>
  );
};

// ---------- 9. the lesson ----------
const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const moneyAt = wf("diff", "money"), boringAt = wf("boring", "boring"), beforeAt = wf("boring", "before");
  const strike1 = ease(frame, [moneyAt + 4, moneyAt + 14], [0, 100], theme.ease.inOut);
  const strike2 = ease(frame, [beforeAt, beforeAt + 10], [0, 100], theme.ease.inOut);
  return (
    <Pop at={ls("diff")} style={{ top: 470, left: 80, zIndex: 5, transform: "rotate(-1.5deg)" }} from={300}>
      <div style={{ width: 920, background: RED.bone, color: RED.ink, clipPath: torn, padding: "54px 56px 70px", filter: shadow }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".22em", color: RED.muted }}>THE DIFFERENCE ISN'T</div>
        <div style={{ fontFamily: F.display, fontSize: 130, lineHeight: 1, position: "relative", display: "inline-block" }}>
          money.
          <div style={{ position: "absolute", left: -6, top: "55%", height: 12, width: `${strike1}%`, background: RED.red, transform: "rotate(-3deg)" }} />
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".22em", color: RED.muted, marginTop: 36, opacity: frame >= boringAt - 8 ? 1 : 0 }}>IT'S THAT THEY BUILT</div>
        <div style={{ fontFamily: F.display, fontSize: 112, lineHeight: 1, position: "relative", display: "inline-block", opacity: frame >= boringAt - 4 ? 1 : 0 }}>
          the boring stuff
          <div style={{ position: "absolute", left: -6, top: "55%", height: 12, width: `${strike2}%`, background: RED.red, transform: "rotate(-2deg)" }} />
        </div>
        <div style={{ height: 120 }} />
      </div>
      <Tag at={beforeAt + 8} style={{ top: 560, left: 300, transform: "rotate(-5deg)" }} size={74}>the backup plan.</Tag>
    </Pop>
  );
};

// ---------- 10. hour 24: best day ever ----------
const Hour24: React.FC = () => {
  const frame = useCurrentFrame();
  const backAt = wf("h24", "back"), bestAt = wf("best2", "best");
  const chartIn = useSpring(ls("best"), theme.spring.smooth);
  const bars = [0.32, 0.28, 0.35, 0.3, 0.33, 0.95];
  const globeOut = ease(frame, [ls("best") - 4, ls("best") + 10], [0, 1], theme.ease.in);
  return (
    <>
      <div style={{ position: "absolute", top: 520, left: 0, opacity: 1 - globeOut, transform: `scale(${1 - globeOut * 0.3})` }}>
        <Globe width={1080} height={820} lightsOffAt={-1000} lightsOnAt={backAt} pal={RED_GLOBE} />
      </div>
      <div style={{ position: "absolute", top: 560, left: 90, width: 900, height: 640, background: RED.bone, clipPath: torn, filter: shadow, padding: "40px 50px",
        transform: `translateY(${(1 - chartIn) * 1400}px) rotate(-1deg)` }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".2em", color: RED.muted }}>THE SHOP · SALES THIS WEEK</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28, height: 440, marginTop: 30, borderBottom: `4px solid ${RED.ink}` }}>
          {bars.map((b, i) => {
            const last = i === bars.length - 1;
            const h = last ? ease(frame, [bestAt, bestAt + 12], [0.3, b], theme.ease.out) : b;
            return <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: last ? RED.red : RED.ink, opacity: last ? 1 : 0.8 }} />;
          })}
        </div>
        <div style={{ display: "flex", gap: 28, fontFamily: F.mono, fontSize: 22, marginTop: 10, color: RED.muted }}>
          {["MON", "TUE", "WED", "THU", "FRI", "BANKS BACK"].map((d) => <div key={d} style={{ flex: 1, textAlign: "center" }}>{d}</div>)}
        </div>
      </div>
      <Tag at={bestAt + 10} style={{ top: 520, left: 560, transform: "rotate(6deg)" }} size={52}>best day. ever.</Tag>
    </>
  );
};

// ---------- 11. open loop ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const partAt = wf("how", "part"), followAt = wf("how", "follow");
  const sticker = useSpring(partAt, theme.spring.slam);
  return (
    <>
      <Pop at={S.end + 2} style={{ top: 470, left: 90, zIndex: 5, transform: "rotate(-1.5deg)" }} from={500}>
        <div style={{ width: 900, background: RED.bone, color: RED.ink, clipPath: torn, padding: "56px 54px 64px", filter: shadow }}>
          <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".24em", color: RED.muted }}>NEXT EPISODE</div>
          <div style={{ fontFamily: F.display, fontSize: 116, lineHeight: 0.95, marginTop: 14 }}>How did they win the blackout?</div>
        </div>
      </Pop>
      <div style={{ position: "absolute", top: 1000, right: 160, zIndex: 6, transform: `rotate(8deg) scale(${frame >= partAt ? sticker : 0})`, background: RED.red, color: RED.bone,
        fontFamily: F.sans, fontWeight: 900, fontSize: 56, padding: "14px 30px", borderRadius: 999, boxShadow: "0 14px 30px rgba(0,0,0,.5)" }}>PART 3 →</div>
      <Tag at={followAt} style={{ top: 1130, left: 120, transform: "rotate(-4deg)" }} size={52}>follow. you'll want this one.</Tag>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 6,
        opacity: ease(frame, [followAt + 10, followAt + 20], [0, 1]) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: RED.text, fontFamily: F.sans, fontWeight: 800, fontSize: 40 }}>
          <div style={{ width: 54, height: 54, borderRadius: 10, background: RED.red, color: RED.bone, display: "grid", placeItems: "center", fontSize: 28, fontWeight: 900 }}>zb</div>
          ZeeBuild <span style={{ fontFamily: F.mono, fontWeight: 500, fontSize: 24, color: RED.red, letterSpacing: ".1em" }}>OS</span>
        </div>
      </div>
    </>
  );
};

// ---------- sound: narration + SFX, never music ----------
const sfx: [number, string, number][] = [
  [0, "thud", 0.7], [wf("o1", "dark") - 2, "powerdown", 0.9], [ls("o2"), "marker", 0.5],
  [le("o2") + 8, "heartbeat", 0.9], [ls("o3") - 3, "paper", 0.5], [wf("o3", "back") + 4, "stamp", 1],
  [S.hook, "whoosh", 0.6], ...Array.from({ length: 4 }, (_, i) => [S.hook + 6 + i * FPS, "tock", 0.55] as [number, string, number]),
  [wf("hook", "whole") - 1, "stamp", 0.6], [le("hook") + 4, "tock", 0.6], [le("hook") + 4 + FPS / 2, "tock", 0.5],
  [S.h1, "whoosh", 0.6], [ls("h1a"), "tock", 0.6], [wf("h1a", "try") - 1, "buzz", 0.5], ...[0, 5, 10].map((d) => [wf("h1b", "everyone") + d, "pop", 0.35] as [number, string, number]),
  ...[0, 8, 16].map((d) => [wf("h1b", "tries") + d, "buzz", 0.3] as [number, string, number]),
  [S.h3, "whoosh", 0.6], [ls("h3a"), "tock", 0.6], [ls("h3a") + 4, "paper", 0.5], [wf("h3b", "11") - 2, "tick", 0.7], [wf("h3c", "half"), "pop", 0.5], [le("h3c") + 4, "paper", 0.5],
  [S.h6, "whoosh", 0.6], [ls("h6a"), "tock", 0.6], [wf("h6a", "cards") - 1, "paper", 0.5],
  ...[0, 7, 14, 21].map((d, i) => [wf("h6b", "stop") + d, "shutter", i === 0 ? 0.9 : 0.5] as [number, string, number]),
  [S.h12, "whoosh", 0.6], [ls("h12a"), "tock", 0.6], [le("h12a") + 6, "heartbeat", 0.9], [wf("h12b", "frozen") - 1, "powerdown", 0.4],
  [le("h12c") + 2, "heartbeat", 0.8], [wf("h12d", "aren") - 1, "powerup", 0.7],
  [S.rev, "whoosh", 0.6], [ls("rev"), "tock", 0.6], ...["logged", "queued", "ready"].map((w) => [wf("rev", w) - 1, "tick", 0.7] as [number, string, number]),
  [S.safe, "whoosh", 0.6], [wf("safe", "safe") - 3, "ping", 0.6],
  [S.lesson, "whoosh", 0.6], [ls("diff"), "tock", 0.6], [wf("diff", "money") + 4, "marker", 0.6], [wf("boring", "before"), "marker", 0.6], [wf("boring", "before") + 8, "paper", 0.5],
  [S.h24, "whoosh", 0.6], [ls("h24"), "tock", 0.7], [wf("h24", "back") - 3, "powerup", 0.8], [le("h24") + 6, "heartbeat", 0.7],
  [ls("best") - 2, "paper", 0.5], [wf("best2", "best") - 1, "chime", 0.7],
  [S.end, "whoosh", 0.7], [S.end + 6, "thud", 0.8], [wf("how", "part") - 2, "pop", 0.7],
];

export const Ep02: React.FC = () => (
  <AbsoluteFill style={{ background: RED.bg }}>
    <Desk />
    <Scene from={0} to={S.hook} first><Open /></Scene>
    <Scene from={S.hook} to={S.h1}><Hook /></Scene>
    <Scene from={S.h1} to={S.h3}><Hour1 /></Scene>
    <Scene from={S.h3} to={S.h6}><Hour3 /></Scene>
    <Scene from={S.h6} to={S.h12}><Hour6 /></Scene>
    <Scene from={S.h12} to={S.rev}><Hour12 /></Scene>
    <Scene from={S.rev} to={S.safe}><Reveal /></Scene>
    <Scene from={S.safe} to={S.lesson}><Safe /></Scene>
    <Scene from={S.lesson} to={S.h24}><Lesson /></Scene>
    <Scene from={S.h24} to={S.end}><Hour24 /></Scene>
    <Scene from={S.end} to={EP02_FRAMES + 20}><EndCard /></Scene>
    <Blackout />
    <Bar />
    <HourChip />
    <Captions />
    <Grain />
    <Vignette />
    <Audio src={staticFile("vo2.wav")} />
    {sfx.map(([at, name, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={45}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
