import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, beats } from "./theme";
import words from "./words.json";

const C = theme.colors, F = theme.fonts;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const torn = "polygon(0 4%,3% 0,9% 3%,15% 0,22% 2%,30% 0,37% 3%,45% 1%,52% 3%,60% 0,68% 2%,75% 0,83% 3%,90% 1%,97% 3%,100% 0,100% 96%,96% 100%,89% 97%,82% 100%,74% 98%,66% 100%,58% 97%,50% 100%,42% 98%,34% 100%,26% 97%,18% 100%,10% 98%,3% 100%,0 97%)";
export const shadow = "drop-shadow(0 18px 22px rgba(0,0,0,.55))";

const useSpring = (at: number, config: object = theme.spring.smooth) => {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config });
};
const ease = (frame: number, range: [number, number], out: [number, number], e = theme.ease.out) =>
  interpolate(frame, range, out, { ...clamp, easing: e });

// ---------- layers: bg, grade, grain, vignette ----------
export const Desk: React.FC = () => {
  const frame = useCurrentFrame();
  const glowX = 50 + Math.sin(frame / 55) * 6, glowY = 55 + Math.cos(frame / 70) * 5;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 800px at ${glowX}% ${glowY}%, rgba(255,138,51,.08), transparent 70%)` }} />
    </AbsoluteFill>
  );
};
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: C.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.25), transparent 22%, transparent 78%, rgba(0,0,0,.35))" }} />
  </AbsoluteFill>
);
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
    backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.22, mixBlendMode: "overlay" }} />;
};
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.45) 100%)" }} />
);

// ---------- collage pieces ----------
export const Tape: React.FC<{ x: number; y: number; r: number; at: number; w?: number }> = ({ x, y, r, at, w = 170 }) => {
  const p = useSpring(at, theme.spring.snappy);
  return <div style={{ position: "absolute", left: x, top: y, width: w * p, height: 54, transformOrigin: "left center",
    transform: `rotate(${r}deg)`, background: "rgba(255,138,51,.78)", mixBlendMode: "screen", zIndex: 5 }} />;
};

const Stamp: React.FC<{ at: number; text: string; color: string; style: React.CSSProperties }> = ({ at, text, color, style }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, theme.spring.slam);
  if (frame < at) return null;
  return <div style={{ position: "absolute", ...style, transform: `rotate(-14deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
    opacity: interpolate(p, [0, 0.4], [0, 0.9], clamp), border: `7px solid ${color}`, color, fontFamily: F.sans, fontWeight: 900,
    fontSize: 62, letterSpacing: ".06em", padding: "4px 18px", mixBlendMode: "multiply" }}>{text}</div>;
};

const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  // Already readable on frame 0 so the first frame doubles as the grid cover
  const p = useSpring(0, theme.spring.slam);
  const draw = ease(frame, [beats.sixty, beats.sixty + 14], [1, 0]);
  const float = Math.sin(frame / 30) * 3;
  return (
    <div style={{ position: "absolute", top: 330, left: 70, width: 900, filter: shadow,
      transform: `translateY(${float}px) rotate(${interpolate(p, [0, 1], [-5, -2.2])}deg) scale(${interpolate(p, [0, 1], [1.08, 1])})` }}>
      <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "46px 48px 52px" }}>
        <div style={{ fontFamily: F.news, fontSize: 26, letterSpacing: ".32em", borderBottom: `3px double ${C.ink}`,
          paddingBottom: 12, marginBottom: 18, display: "flex", justifyContent: "space-between" }}>
          <span>THE LEDGER</span><span>SPECIAL EDITION</span>
        </div>
        <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 108, lineHeight: 0.93 }}>
          Every bank on Earth goes dark for{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            60
            <svg viewBox="0 0 200 140" style={{ position: "absolute", left: -38, top: -14, width: 200, height: 140, overflow: "visible" }}>
              <path d="M 120 18 C 170 14, 192 50, 180 80 C 168 112, 90 126, 44 108 C 4 92, 8 36, 70 20 C 100 12, 130 14, 150 24"
                fill="none" stroke={C.primary} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} />
            </svg>
          </span>{" "}seconds
        </div>
        <div style={{ fontFamily: F.newsItalic, fontSize: 34, marginTop: 16, color: "#4a443d" }}>What breaks first, and who keeps working.</div>
      </div>
      <Tape x={40} y={-22} r={-18} at={4} />
      <Tape x={740} y={-6} r={14} at={7} />
    </div>
  );
};

const BankPrint: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(beats.printIn);
  const out = ease(frame, [beats.printOut, beats.printOut + 10], [0, -1300], theme.ease.in);
  const kb = interpolate(frame, [0, beats.printOut], [1, 1.05], clamp);
  return (
    <div style={{ position: "absolute", top: 900, left: 100, width: 480, height: 450, filter: shadow,
      transform: `translateX(${interpolate(p, [0, 1], [-700, 0]) + out}px) rotate(${interpolate(p, [0, 1], [10, 3])}deg)` }}>
      <div style={{ width: "100%", height: "100%", background: C.paper2, clipPath: torn, padding: 22, overflow: "hidden" }}>
        <svg viewBox="0 0 520 480" style={{ width: "100%", height: "100%", transform: `scale(${kb})` }}>
          <defs>
            <pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="3.3" fill={C.ink} /></pattern>
            <pattern id="ht2" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.8" fill={C.ink} /></pattern>
          </defs>
          <rect width="520" height="480" fill="url(#ht2)" opacity=".35" />
          <polygon points="60,170 260,70 460,170" fill="url(#ht)" />
          <rect x="70" y="170" width="380" height="26" fill="url(#ht)" />
          <g fill="url(#ht)"><rect x="95" y="205" width="34" height="190" /><rect x="175" y="205" width="34" height="190" />
            <rect x="311" y="205" width="34" height="190" /><rect x="391" y="205" width="34" height="190" /></g>
          <rect x="236" y="300" width="48" height="95" fill={C.ink} />
          <rect x="50" y="395" width="420" height="22" fill="url(#ht)" /><rect x="30" y="417" width="460" height="22" fill="url(#ht)" />
        </svg>
      </div>
    </div>
  );
};

const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(beats.second1 - 2, theme.spring.slam);
  if (frame < beats.second1 - 2) return null;
  const sec = Math.round(ease(frame, [beats.second10, beats.second10 + 14], [1, 10], theme.ease.inOut));
  return (
    <div style={{ position: "absolute", top: 860, right: 80, transform: `rotate(-3deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`,
      opacity: interpolate(p, [0, 0.3], [0, 1], clamp), background: C.ink, color: C.text, fontFamily: F.mono, fontWeight: 700,
      fontSize: 58, padding: "10px 26px", borderRadius: 8, boxShadow: "0 14px 24px rgba(0,0,0,.5)", letterSpacing: ".04em", zIndex: 7 }}>
      <span style={{ color: C.textDim, fontSize: 30, marginRight: 14 }}>T+</span>00:{String(sec).padStart(2, "0")}
    </div>
  );
};

const Receipt: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(beats.receiptIn);
  const rows: [string, string][] = [["FLAT WHITE", "£4.20"], ["TIME", "08:59:01"], ["AUTH", "— — —"], ["STATUS", "?"]];
  return (
    <div style={{ position: "absolute", top: 990, left: 545, width: 350, filter: shadow,
      transform: `translateY(${interpolate(p, [0, 1], [1100, 0])}px) rotate(${interpolate(p, [0, 1], [4, -6])}deg)` }}>
      <div style={{ background: C.receipt, color: C.ink, padding: "30px 28px 40px", fontFamily: F.mono, fontSize: 23, lineHeight: 1.7, clipPath: torn }}>
        <div style={{ fontWeight: 700, fontSize: 25, textAlign: "center", letterSpacing: ".1em", borderBottom: "2px dashed #b7ad9c", paddingBottom: 10, marginBottom: 10 }}>CARD PAYMENT</div>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", opacity: frame >= beats.receiptIn + 10 + i * 5 ? 1 : 0 }}>
            <span>{k}</span><span>{v}</span>
          </div>
        ))}
      </div>
      <Stamp at={beats.declined} text="DECLINED" color={C.red} style={{ left: 30, top: 150 }} />
    </div>
  );
};

const Payroll: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(beats.payrollIn);
  if (frame < beats.payrollIn - 1) return null;
  return (
    <div style={{ position: "absolute", top: 1000, left: 60, width: 460, filter: shadow,
      transform: `translateX(${interpolate(p, [0, 1], [-800, 0])}px) rotate(${interpolate(p, [0, 1], [-8, 2.5])}deg)` }}>
      <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "34px 36px 44px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".18em", color: "#6b6258" }}>PAYROLL RUN · 09:00</div>
        <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 70, lineHeight: 1, margin: "12px 0" }}>1,240,000 staff</div>
        <div style={{ fontFamily: F.mono, fontSize: 26, display: "flex", justifyContent: "space-between" }}><span>TOTAL</span><span>£2.1bn</span></div>
        <div style={{ fontFamily: F.mono, fontSize: 26, display: "flex", justifyContent: "space-between" }}><span>SENT</span><span>£0</span></div>
      </div>
      <Tape x={180} y={-24} r={-6} at={beats.payrollIn + 12} w={150} />
      <Stamp at={beats.freezes} text="FROZEN" color="#0aa9b8" style={{ left: 150, top: 120 }} />
    </div>
  );
};

const Note: React.FC = () => {
  const frame = useCurrentFrame();
  const at = beats.declined + 8;
  const o = ease(frame, [at, at + 8], [0, 1]);
  return <div style={{ position: "absolute", top: 820, left: 90, fontFamily: F.hand, fontSize: 60, color: C.primary,
    transform: `rotate(-4deg) translateY(${(1 - o) * 20}px)`, opacity: o, lineHeight: 1.05, zIndex: 6 }}>
    second 1:<br />cards stop.</div>;
};

// Lights cut on "dark": a hard blackout that flickers back
const Blackout: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - beats.dark;
  const flick = [0, 0.92, 0.92, 0.88, 0.9, 0.6, 0.85, 0.3, 0.7, 0.15, 0];
  const o = t >= 0 && t < flick.length ? flick[t] : 0;
  return <AbsoluteFill style={{ background: "#050505", opacity: o, zIndex: 8 }} />;
};

// ---------- captions: 2–3 word pages, active word in orange ----------
type W = { word: string; start: number; end: number };
const pages = (() => {
  const out: W[][] = []; let cur: W[] = [];
  for (const w of words as W[]) {
    cur.push(w);
    if (cur.length === 2 || /[,.?:]$/.test(w.word)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const Captions: React.FC = () => {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const t = frame / fps;
  const i = pages.findIndex((pg, k) => t >= pg[0].start - 0.05 && (k === pages.length - 1 || t < pages[k + 1][0].start - 0.05));
  if (i < 0 || t > pages[pages.length - 1].slice(-1)[0].end + 0.4) return null;
  const pg = pages[i], since = frame - Math.round(pg[0].start * fps);
  const pop = interpolate(since, [0, 5], [0.86, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", top: 1395, left: 70, right: 70, textAlign: "center", zIndex: 9, transform: `scale(${pop})`,
      fontFamily: F.sans, fontWeight: 900, fontSize: 88, lineHeight: 1.05, letterSpacing: "-.03em", textTransform: "uppercase" }}>
      {pg.map((w) => (
        <React.Fragment key={w.start}>
          <span style={{ color: t >= w.start ? (t < w.end + 0.08 ? C.primary : C.text) : "rgba(242,240,236,.35)",
            WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 8px 24px rgba(0,0,0,.8)", marginRight: 4 }}>
            {w.word.replace(/[,.?:]$/, "")}
          </span>{" "}
        </React.Fragment>
      ))}
    </div>
  );
};

// ---------- persistent chrome ----------
export const SeriesBar: React.FC = () => (
  <div style={{ position: "absolute", top: 240, left: 80, right: 80, display: "flex", justifyContent: "space-between",
    fontFamily: F.mono, fontSize: 26, letterSpacing: ".06em", color: C.textDim, zIndex: 9 }}>
    <span><span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: C.primary, marginRight: 14,
      boxShadow: `0 0 16px ${C.primary}` }} /><b style={{ color: C.text, fontWeight: 500 }}>ZEEBUILD OS</b> · WHAT IF</span>
    <span>EP 01</span>
  </div>
);
export const Mark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.text, fontFamily: F.sans, fontWeight: 800, fontSize: size, letterSpacing: "-.02em" }}>
    <div style={{ width: size * 1.35, height: size * 1.35, borderRadius: 10, background: C.primary, color: C.bg, display: "grid", placeItems: "center",
      fontSize: size * 0.7, fontWeight: 900 }}>zb</div>
    ZeeBuild <span style={{ fontFamily: F.mono, fontWeight: 500, fontSize: size * 0.6, color: C.primary, letterSpacing: ".1em" }}>OS</span>
  </div>
);

// ---------- CTA end card ----------
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = useSpring(beats.follow + 4, theme.spring.slam);
  const sticker = useSpring(beats.part2, theme.spring.slam);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 520, left: 90, width: 900, filter: shadow,
        transform: `translateY(${interpolate(p, [0, 1], [900, 0])}px) rotate(${interpolate(p, [0, 1], [6, -1.5])}deg)` }}>
        <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "56px 54px 64px" }}>
          <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".24em", color: "#6b6258" }}>NEXT EPISODE</div>
          <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 132, lineHeight: 0.92, marginTop: 14 }}>Who survives the blackout?</div>
        </div>
        <Tape x={330} y={-26} r={-4} at={beats.follow + 14} />
      </div>
      <div style={{ position: "absolute", top: 1010, right: 160, transform: `rotate(8deg) scale(${sticker})`, background: C.primary, color: C.bg,
        fontFamily: F.sans, fontWeight: 900, fontSize: 56, padding: "14px 30px", borderRadius: 999, boxShadow: "0 14px 30px rgba(0,0,0,.5)" }}>
        PART 2 →
      </div>
      <div style={{ position: "absolute", top: 1150, left: 90, right: 90, textAlign: "center", fontFamily: F.hand, fontSize: 58, color: C.primary, transform: "rotate(-4deg)",
        opacity: ease(frame, [beats.part2 + 6, beats.part2 + 14], [0, 1]) }}>follow so you don't miss it</div>
      <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", justifyContent: "center",
        opacity: ease(frame, [beats.part2 + 12, beats.part2 + 22], [0, 1]) }}><Mark size={40} /></div>
    </AbsoluteFill>
  );
};

// ---------- sound: narration + SFX only, never music ----------
const sfx: [number, string, number][] = [
  [0, "thud", 0.9], [3, "tape", 0.5], [6, "tape", 0.4], [beats.printIn - 2, "paper", 0.6],
  [beats.dark - 2, "powerdown", 0.9], [beats.sixty - 2, "marker", 0.55],
  [beats.second1 - 3, "stamp", 0.5], [beats.receiptIn - 3, "paper", 0.6],
  ...[0, 1, 2, 3].map((i) => [beats.receiptIn + 10 + i * 5, "tick", 0.45] as [number, string, number]),
  [beats.declined - 2, "stamp", 1], [beats.printOut - 3, "whoosh", 0.6],
  ...[0, 2, 4, 6, 8, 10, 12, 14].map((i) => [beats.second10 + i, "tick", 0.35] as [number, string, number]),
  [beats.payrollIn - 3, "paper", 0.6], [beats.payrollIn + 10, "tape", 0.5],
  [beats.freezes - 2, "stamp", 1], [beats.follow - 3, "whoosh", 0.8], [beats.follow + 6, "thud", 0.8],
  [beats.part2 - 2, "pop", 0.7],
];

export const Vox: React.FC = () => {
  const frame = useCurrentFrame();
  // Screen shake on each stamp
  const shakeAt = [beats.declined, beats.freezes].find((s) => frame >= s && frame < s + 8);
  const shake = shakeAt === undefined ? 0 : Math.sin((frame - shakeAt) * 2.6) * 14 * (1 - (frame - shakeAt) / 8);
  // Everything whips up and out on "Follow"
  const whip = ease(frame, [beats.follow, beats.follow + 9], [0, -1700], theme.ease.in);
  const blur = frame >= beats.follow && frame < beats.follow + 9 ? 8 : 0;
  const kb = interpolate(frame, [0, beats.follow], [1, 1.04], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Desk />
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${whip}px) scale(${kb})`, filter: blur ? `blur(${blur}px)` : undefined }}>
        <Headline />
        <BankPrint />
        <Note />
        <Receipt />
        <Payroll />
        <Clock />
      </AbsoluteFill>
      {frame >= beats.follow && <EndCard />}
      <Blackout />
      <SeriesBar />
      <Captions />
      <Grade />
      <Grain />
      <Vignette />
      <Audio src={staticFile("narration.wav")} />
      {sfx.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={40}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
