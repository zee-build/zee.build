// ZeeBuild · What If · EP03: "How they won the blackout". The payoff, plus the BACKUP comment keyword.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Grain, Vignette, torn, shadow } from "../Vox";
import { Cutout } from "../v2/Cutout";
import { Conveyor } from "../v3/Scenes3D";
import { RED, F } from "../v4/Style02";
import { useSpring, ease, Pop, Stamp, Tag, Label, Scene, Shop, Bar } from "../v5/Ep02";
import vo from "./vo.json";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- timing from the voiceover ----------
type Word = { word: string; start: number; end: number; line: string };
const s2f = (s: number) => Math.round(s * FPS);
const ls = (id: string) => s2f(vo.lines.find((l) => l.id === id)!.start);
const le = (id: string) => s2f(vo.lines.find((l) => l.id === id)!.end);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
// nth occurrence of a word inside a line ("paid" appears three times)
const wf = (id: string, word: string, nth = 0) => {
  const w = (vo.words as Word[]).filter((x) => x.line === id && norm(x.word).startsWith(word))[nth];
  if (!w) throw new Error(`no word "${word}" #${nth} in line ${id}`);
  return s2f(w.start);
};
export const EP03_FRAMES = s2f(vo.total) + 18;

const S = {
  queue: ls("queue") - 6, crowd: ls("froze") - 6, trust: ls("msg") - 6, joke: ls("cafe") - 6,
  reveal: ls("what") - 6, line: ls("fancy") - 6, cta: ls("cta") - 6,
};

// ---------- persistent layers ----------
const Desk: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: RED.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 760px at 50% ${58 + Math.sin(frame / 60) * 3}%, rgba(224,48,42,.14), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 24%, transparent 76%, rgba(0,0,0,.45))" }} />
    </AbsoluteFill>
  );
};

const HourChip: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= S.crowd) return null;
  return (
    <div style={{ position: "absolute", top: 300, right: 80, zIndex: 12, transform: "rotate(2deg)", background: RED.red, color: RED.bone, fontFamily: F.mono,
      fontWeight: 700, fontSize: 40, padding: "8px 20px", borderRadius: 6, boxShadow: "0 12px 22px rgba(0,0,0,.6)" }}>
      <span style={{ fontSize: 22, letterSpacing: ".12em", marginRight: 10 }}>HOUR</span>24
    </div>
  );
};

const pages = (() => {
  const out: Word[][] = []; let cur: Word[] = [];
  for (const w of vo.words as Word[]) {
    cur.push(w);
    const weak = /^(a|an|the|for|on|in|of|to|is|are|just|your|one|that|and)$/i.test(w.word);
    if ((cur.length >= 2 && !weak) || cur.length === 3 || /[,.?:]$/.test(w.word)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
})();
const clean = (w: string) => w.replace(/\.\.\.$/, "").replace(/[,.?:]+$/, "");
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const i = pages.findIndex((pg, k) => t >= pg[0].start - 0.05 && (k === pages.length - 1 || t < pages[k + 1][0].start - 0.05));
  if (i < 0) return null;
  const pg = pages[i];
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

// ---------- 1. cold open: the best day ever ----------
const Open: React.FC = () => {
  const frame = useCurrentFrame();
  const bestAt = wf("o3", "best");
  const bars = [0.32, 0.28, 0.35, 0.3, 0.33, 0.95];
  return (
    <>
      <div style={{ position: "absolute", top: 390, left: 80, right: 80, color: RED.text, zIndex: 5 }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".3em", color: RED.muted }}>PREVIOUSLY · EP 02</div>
        <div style={{ fontFamily: F.display, fontSize: 100, lineHeight: 0.98, marginTop: 14 }}>
          One business had its <span style={{ background: RED.red, color: RED.bone, padding: "0 14px", display: "inline-block", transform: "rotate(-2deg)" }}>best day ever.</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 820, left: 90, width: 900, height: 500, background: RED.bone, clipPath: torn, filter: shadow, padding: "34px 46px",
        transform: "rotate(-1deg)" }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".2em", color: RED.muted }}>THE SHOP · SALES THIS WEEK</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26, height: 330, marginTop: 22, borderBottom: `4px solid ${RED.ink}` }}>
          {bars.map((b, i) => {
            const last = i === bars.length - 1;
            const h = last ? ease(frame, [bestAt - 4, bestAt + 14], [0.3, b]) : b;
            return <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: last ? RED.red : RED.ink, opacity: last ? 1 : 0.8 }} />;
          })}
        </div>
        <div style={{ display: "flex", gap: 26, fontFamily: F.mono, fontSize: 20, marginTop: 10, color: RED.muted }}>
          {["MON", "TUE", "WED", "THU", "FRI", "BANKS BACK"].map((d) => <div key={d} style={{ flex: 1, textAlign: "center" }}>{d}</div>)}
        </div>
      </div>
      <Tag at={ls("promise")} style={{ top: 760, left: 580, transform: "rotate(6deg)" }} size={48}>here's exactly how.</Tag>
    </>
  );
};

// ---------- 2. the queue fires ----------
const Queue: React.FC = () => {
  const paidAt = [0, 1, 2].map((n) => wf("paid", "paid", n));
  return (
    <>
      <Label at={ls("queue")} sub="HOUR 24 · BANKS WAKE UP" text="The queue fires." />
      <div style={{ position: "absolute", top: 560, left: 0 }}><Conveyor width={1080} height={440} accent={RED.red} /></div>
      {[0, 1, 2, 3].map((i) => {
        const at = i < 3 ? paidAt[i] : paidAt[2] + 10;
        return (
          <Pop key={i} at={at - 2} style={{ top: 990 + i * 62, left: 150 + i * 22, zIndex: 6, transform: `rotate(${-4 + i * 2.5}deg)` }} from={60}>
            <div style={{ width: 430, background: RED.bone, color: RED.ink, fontFamily: F.mono, fontSize: 25, padding: "14px 22px", clipPath: torn, filter: shadow,
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>ORDER #{2201 + i}</span>
              <b style={{ color: RED.bone, background: RED.red, padding: "2px 12px", transform: "rotate(-4deg)", display: "inline-block" }}>PAID</b>
            </div>
          </Pop>
        );
      })}
      <Tag at={paidAt[2] + 8} style={{ top: 1050, left: 640, transform: "rotate(6deg)" }} size={46}>ding.<br />ding.<br />ding.</Tag>
    </>
  );
};

// ---------- 3. the frozen shops' customers walk ----------
const Crowd: React.FC = () => {
  const frame = useCurrentFrame();
  const walkAt = wf("open", "looking");
  const walk = ease(frame, [walkAt - 10, walkAt + 40], [0, 1], theme.ease.inOut);
  return (
    <>
      <Label at={ls("froze")} sub="MEANWHILE" text="The frozen shops." />
      <div style={{ position: "absolute", top: 600, left: 80, width: 900, height: 440 }}>
        {["BAKERY", "FLORIST", "CAFÉ", "THE SHOP"].map((n, i) => (
          <Shop key={n} name={n} x={i * 228} shutAt={i < 3 ? -100 : undefined} glowAt={i === 3 ? ls("froze") + 6 : undefined} />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <Pop key={i} at={ls("froze") + 18 + i * 5} style={{ top: 960, left: 40 + i * 120 + walk * 420, zIndex: 4 }} from={200}>
          <div style={{ transform: `translateY(${Math.abs(Math.sin((frame + i * 9) / 5)) * -10 * (walk > 0 && walk < 1 ? 1 : 0)}px)` }}>
            <Cutout pose="reach" width={200} id={`w${i}`} tint={i === 0 ? RED.ink : "#3a3030"} />
          </div>
        </Pop>
      ))}
      <div style={{ position: "absolute", top: 1270, left: -20, width: 1120, height: 400, background: "#1d1717", clipPath: torn, zIndex: 5 }} />
      <Tag at={walkAt + 20} style={{ top: 1110, left: 560, transform: "rotate(5deg)" }} size={42}>"you're open?!"</Tag>
    </>
  );
};

// ---------- 4. trust: the message, and they bring friends ----------
const Trust: React.FC = () => {
  const backAt = wf("back", "came"), friendsAt = wf("friends", "friends");
  return (
    <>
      <Pop at={wf("msg", "your") - 3} style={{ top: 420, left: 120, zIndex: 6, transform: "rotate(-2deg)" }} from={40}>
        <div style={{ width: 840, background: RED.bone, color: RED.ink, borderRadius: 26, padding: "24px 30px", boxShadow: "0 16px 28px rgba(0,0,0,.6)", fontFamily: F.sans }}>
          <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".14em", color: RED.muted }}>THE SHOP · YESTERDAY</div>
          <div style={{ fontWeight: 900, fontSize: 52, marginTop: 6 }}>Your order is safe ✓</div>
        </div>
      </Pop>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const at = i < 2 ? backAt + i * 5 : friendsAt + (i - 2) * 4;
        return (
          <Pop key={i} at={at} style={{ top: 760 + (i % 2) * 40, left: 20 + i * 118, zIndex: 3 }} from={300}>
            <Cutout pose={i % 3 === 1 ? "phone" : "reach"} width={i < 2 ? 220 : 180} id={`t${i}`} tint={i < 2 ? RED.ink : "#3a3030"} />
          </Pop>
        );
      })}
      <div style={{ position: "absolute", top: 1180, left: -20, width: 1120, height: 460, background: "#1d1717", clipPath: torn, zIndex: 5 }} />
      <Tag at={friendsAt + 14} style={{ top: 1090, left: 520, transform: "rotate(-4deg)" }} size={42}>+ their mates</Tag>
    </>
  );
};

// ---------- 5. the joke: the IOU gets paid ----------
const Joke: React.FC = () => {
  const paidAt = wf("cafe", "paid"), interestAt = wf("interest", "interest");
  return (
    <>
      <Label at={ls("cafe")} sub="MEANWHILE, AT THE CAFÉ" text="Debts settled." />
      <Pop at={ls("cafe") + 6} style={{ top: 600, left: 130, zIndex: 4, transform: "rotate(-3deg)" }} from={300}>
        <div style={{ width: 820, height: 600, background: "#f6f3ec", clipPath: torn, filter: shadow, position: "relative",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(26,23,20,.05) 0 2px, transparent 2px 22px), repeating-linear-gradient(-45deg, rgba(26,23,20,.05) 0 2px, transparent 2px 22px)" }}>
          <div style={{ position: "absolute", top: 60, left: 70, fontFamily: F.hand, fontSize: 120, color: RED.ink, transform: "rotate(-4deg)" }}>I.O.U.</div>
          <div style={{ position: "absolute", top: 250, left: 70, fontFamily: F.hand, fontSize: 62, color: RED.ink, transform: "rotate(-3deg)", lineHeight: 1.05 }}>ZEE OWES<br />1 FLAT WHITE</div>
          <Stamp at={paidAt + 2} text="PAID" style={{ top: 150, left: 440 }} size={96} bg="rgba(246,243,236,.85)" />
        </div>
      </Pop>
      <Tag at={interestAt} style={{ top: 1100, left: 520, transform: "rotate(5deg)" }} size={50}>+ 1 biscuit</Tag>
    </>
  );
};

// ---------- 6. the reveal: three boring things ----------
const CARDS: [string, string, string][] = [
  ["one", "01", "Orders that wait, instead of vanishing."],
  ["two", "02", "Customers told before they ask."],
  ["threeb", "03", "Invoices that send themselves."],
];
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const threeAt = wf("three", "three");
  return (
    <>
      <Pop at={ls("what")} style={{ top: 390, left: 80, right: 80, zIndex: 6 }} from={40}>
        <div style={{ fontFamily: F.display, fontSize: 84, lineHeight: 1, color: RED.text }}>
          So what did they build? <span style={{ opacity: frame >= threeAt ? 1 : 0, background: RED.red, color: RED.bone, padding: "0 12px", display: "inline-block",
            transform: "rotate(-2deg)" }}>Three boring things.</span>
        </div>
      </Pop>
      {CARDS.map(([line, n, text], i) => {
        const at = ls(line);
        return (
          <Pop key={line} at={at - 2} style={{ top: 680 + i * 220, left: 90 + (i % 2) * 30, zIndex: 5 + i, transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }} from={500}>
            <div style={{ width: 860, background: RED.bone, color: RED.ink, clipPath: torn, filter: shadow, padding: "30px 40px", display: "flex", gap: 30, alignItems: "center" }}>
              <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 56, color: RED.red }}>{n}</div>
              <div style={{ fontFamily: F.display, fontSize: 52, lineHeight: 1.05 }}>{text}</div>
            </div>
          </Pop>
        );
      })}
    </>
  );
};

// ---------- 7. the line: runs while you sleep ----------
const Line: React.FC = () => {
  const frame = useCurrentFrame();
  const sleepAt = wf("sleep", "sleep");
  return (
    <>
      <div style={{ position: "absolute", top: 400, left: 80, right: 80, color: RED.text, zIndex: 6, fontFamily: F.display, fontSize: 100, lineHeight: 1 }}>
        <Pop at={ls("fancy")} style={{ position: "relative" }} from={40}><div>None of it is fancy.</div></Pop>
        <Pop at={ls("sleep")} style={{ position: "relative", marginTop: 20 }} from={40}>
          <div>All of it runs while you <span style={{ background: frame >= sleepAt ? RED.red : "transparent", color: RED.bone, padding: "0 12px", display: "inline-block",
            transform: "rotate(-2deg)" }}>sleep.</span></div>
        </Pop>
      </div>
      <Pop at={ls("fancy") + 6} style={{ top: 960, left: 120, zIndex: 4, height: 300, overflow: "hidden", width: 380 }} from={300}>
        <div style={{ marginTop: -180 }}><Cutout pose="sleep" width={360} id="owner3" /></div>
      </Pop>
      <div style={{ position: "absolute", top: 1250, left: 80, width: 520, height: 70, background: RED.bone2, clipPath: torn, zIndex: 5, filter: shadow }} />
      {["Z", "z", "z"].map((z, i) => {
        const at = sleepAt + i * 8, y = ease(frame, [at, at + 40], [0, -60]);
        return frame >= at ? <div key={i} style={{ position: "absolute", top: 980 - i * 55 + y, left: 380 + i * 50, fontFamily: F.hand, fontSize: 70 - i * 10,
          color: RED.red, opacity: ease(frame, [at, at + 6], [0, 1]), zIndex: 7 }}>{z}</div> : null;
      })}
      <Pop at={ls("fancy") + 12} style={{ top: 960, left: 600, zIndex: 4, transform: "rotate(4deg)" }} from={80}>
        <div style={{ width: 300, background: RED.bone, color: RED.ink, fontFamily: F.mono, fontSize: 24, padding: "16px 20px", clipPath: torn, filter: shadow, lineHeight: 1.5 }}>
          ORDERS · <b style={{ color: RED.red }}>{240 + Math.max(0, Math.floor((frame - ls("fancy")) / 6))}</b><br />INVOICES · <b style={{ color: RED.red }}>SENT ✓</b>
        </div>
      </Pop>
    </>
  );
};

// ---------- 8. CTA: comment BACKUP ----------
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const typeAt = wf("cta", "comment"), sendAt = wf("check", "send"), nextAt = ls("next");
  const word = "BACKUP";
  const typed = word.slice(0, Math.max(0, Math.min(word.length, Math.floor((frame - typeAt) / 3))));
  const posted = frame >= wf("cta", "backup") + 14;
  const caret = Math.floor(frame / 15) % 2 === 0;
  const sticker = useSpring(nextAt, theme.spring.slam);
  return (
    <>
      <div style={{ position: "absolute", top: 390, left: 80, right: 80, color: RED.text, zIndex: 5 }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".3em", color: RED.muted }}>FREE · 60-SECOND CHECK</div>
        <div style={{ fontFamily: F.display, fontSize: 100, lineHeight: 0.98, marginTop: 14 }}>
          Would your business <span style={{ background: RED.red, color: RED.bone, padding: "0 14px", display: "inline-block", transform: "rotate(-2deg)" }}>survive</span> the blackout?
        </div>
      </div>
      <Pop at={typeAt - 8} style={{ top: 860, left: 90, zIndex: 6 }} from={60}>
        <div style={{ width: 820, background: "#1b1515", border: "2px solid #3a3030", borderRadius: 26, padding: "22px 26px", display: "flex", alignItems: "center", gap: 18, filter: shadow }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: RED.bone2, flexShrink: 0 }} />
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 54, color: RED.bone, letterSpacing: ".02em", flex: 1 }}>
            {typed}<span style={{ opacity: !posted && caret ? 1 : 0, color: RED.red }}>|</span>
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: posted ? "#2bb673" : RED.red }}>{posted ? "Posted ✓" : "Post"}</div>
        </div>
      </Pop>
      <Pop at={sendAt} style={{ top: 1030, left: 260, zIndex: 7, transform: "rotate(-2deg)" }} from={40}>
        <div style={{ width: 600 }}>
          <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: ".16em", color: RED.muted, marginBottom: 8 }}>ZEEBUILD · DM · NOW</div>
          <div style={{ background: RED.bone, color: RED.ink, borderRadius: 24, borderBottomLeftRadius: 6, padding: "18px 24px", fontFamily: F.sans, fontWeight: 700,
            fontSize: 30, lineHeight: 1.3, boxShadow: "0 16px 28px rgba(0,0,0,.6)" }}>
            Here's your free blackout check →<br /><span style={{ color: RED.red }}>zeebuild.com/whatif</span>
          </div>
        </div>
      </Pop>
      <Tag at={posted ? wf("cta", "backup") + 16 : 1e9} style={{ top: 1240, left: 90, transform: "rotate(-5deg)" }} size={44}>one word. that's it.</Tag>
      <div style={{ position: "absolute", top: 790, right: 90, zIndex: 9, transform: `rotate(7deg) scale(${frame >= nextAt ? sticker : 0})`, background: RED.red, color: RED.bone,
        fontFamily: F.sans, fontWeight: 900, fontSize: 40, padding: "12px 26px", borderRadius: 999, boxShadow: "0 14px 30px rgba(0,0,0,.5)" }}>NEXT WEEK: NEW WHAT IF</div>
    </>
  );
};

// ---------- sound: narration + SFX, never music ----------
const sfx: [number, string, number][] = [
  [0, "thud", 0.7], [wf("o3", "best") - 2, "chime", 0.6], [le("o2") + 4, "heartbeat", 0.8], [ls("promise"), "paper", 0.5],
  [S.queue, "whoosh", 0.6], [ls("queue") + 4, "powerup", 0.6],
  ...[0, 1, 2].map((n) => [wf("paid", "paid", n) - 1, "chime", 0.45] as [number, string, number]),
  ...[0, 1, 2].map((n) => [wf("paid", "order", n) - 1, "tick", 0.5] as [number, string, number]),
  [S.crowd, "whoosh", 0.6], [ls("froze") + 6, "powerup", 0.4], [wf("open", "looking") - 6, "paper", 0.5],
  [S.trust, "whoosh", 0.6], [wf("msg", "your") - 3, "ping", 0.6], [wf("back", "came"), "pop", 0.45], ...[0, 4, 8, 12, 16].map((d) => [wf("friends", "friends") + d, "pop", 0.3] as [number, string, number]),
  [S.joke, "whoosh", 0.6], [ls("cafe") + 4, "paper", 0.5], [wf("cafe", "paid") + 1, "stamp", 1], [wf("interest", "interest") - 1, "marker", 0.5],
  [S.reveal, "whoosh", 0.6], [le("what") + 4, "heartbeat", 0.6], ...["one", "two", "threeb"].map((l) => [ls(l) - 3, "thud", 0.8] as [number, string, number]),
  [S.line, "whoosh", 0.6], [wf("sleep", "sleep") - 2, "zzz", 0.7],
  [S.cta, "whoosh", 0.7], ...[0, 3, 6, 9, 12, 15].map((d) => [wf("cta", "comment") + d, "tick", 0.45] as [number, string, number]),
  [wf("cta", "backup") + 14, "pop", 0.6], [wf("check", "send") - 2, "ping", 0.7], [ls("next") - 2, "stamp", 0.6],
];

export const Ep03: React.FC = () => (
  <AbsoluteFill style={{ background: RED.bg }}>
    <Desk />
    <Scene from={0} to={S.queue} first><Open /></Scene>
    <Scene from={S.queue} to={S.crowd}><Queue /></Scene>
    <Scene from={S.crowd} to={S.trust}><Crowd /></Scene>
    <Scene from={S.trust} to={S.joke}><Trust /></Scene>
    <Scene from={S.joke} to={S.reveal}><Joke /></Scene>
    <Scene from={S.reveal} to={S.line}><Reveal /></Scene>
    <Scene from={S.line} to={S.cta}><Line /></Scene>
    <Scene from={S.cta} to={EP03_FRAMES + 20}><Cta /></Scene>
    <Bar ep="EP 03" />
    <HourChip />
    <Captions />
    <Grain />
    <Vignette />
    <Audio src={staticFile("vo3.wav")} />
    {sfx.map(([at, name, vol], i) => (
      <Sequence key={i} from={Math.max(0, at)} durationInFrames={45}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
