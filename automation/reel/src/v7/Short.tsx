// Reusable short reel (20–40 s) in the Signal Red theme. Everything comes from props built by build_short.py.
// Outlier lesson #1: the title banner stays on screen for the whole reel.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, type CalculateMetadataFunction } from "remotion";
import { theme } from "../theme";
import { Grain, Vignette, torn, shadow } from "../Vox";
import { RED, F } from "../v4/Style02";
import { useSpring, ease, Pop, Stamp, Tag, Bar } from "../v5/Ep02";
import { Cutout } from "../v2/Cutout";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type Word = { word: string; start: number; end: number; line: string };
type Line = { id: string; start: number; end: number };
type Scene = {
  id: string; say: string; kind: "hook" | "card" | "tier" | "list" | "cta";
  text?: string; sub?: string; illo?: string; item?: string; verdict?: string; good?: boolean; items?: string[]; link?: string; tag?: string;
};
export type ShortProps = { slug: string; banner: string; kicker: string; ep?: string; series?: string; scenes: Scene[]; lines: Line[]; words: Word[]; total: number };

export const shortMetadata: CalculateMetadataFunction<ShortProps> = ({ props }) => ({ durationInFrames: Math.round(props.total * FPS) + 18 });

const s2f = (s: number) => Math.round(s * FPS);
// [[word]] gets the red block
const hl = (s: string) => s.split(/(\[\[.+?\]\][.,?!]?)/).map((p, i) => {
  const m = p.match(/^\[\[(.+?)\]\]([.,?!]?)$/);
  return m ? <span key={i} style={{ whiteSpace: "nowrap" }}><span style={{ background: RED.red, color: RED.bone, padding: "0 12px", display: "inline-block", transform: "rotate(-2deg)" }}>{m[1]}</span>{m[2]}</span> : p;
});

const Banner: React.FC<{ text: string; kicker: string }> = ({ text, kicker }) => {
  const p = useSpring(0, theme.spring.slam);
  return (
    <div style={{ position: "absolute", top: 300, left: 60, right: 60, zIndex: 12, transform: `rotate(-1.5deg) scale(${interpolate(p, [0, 1], [1.08, 1])})`, filter: shadow }}>
      <div style={{ background: RED.bone, color: RED.ink, clipPath: torn, padding: "20px 30px 24px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: ".24em", color: RED.red }}>{kicker}</div>
        <div style={{ fontFamily: F.display, fontSize: 66, lineHeight: 1.02 }}>{hl(text)}</div>
      </div>
    </div>
  );
};

const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const pages: Word[][] = []; let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const weak = /^(a|an|the|for|on|in|of|to|is|are|your|one|that|and|it)$/i.test(w.word);
    if ((cur.length >= 2 && !weak) || cur.length === 3 || /[,.?:!]$/.test(w.word)) { pages.push(cur); cur = []; }
  }
  if (cur.length) pages.push(cur);
  const i = pages.findIndex((pg, k) => t >= pg[0].start - 0.05 && (k === pages.length - 1 || t < pages[k + 1][0].start - 0.05));
  if (i < 0) return null;
  const pg = pages[i];
  if (t > pg[pg.length - 1].end + 0.45) return null;
  const pop = interpolate(frame - s2f(pg[0].start), [0, 5], [0.86, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", top: 1395, left: 60, right: 60, textAlign: "center", zIndex: 11, transform: `scale(${pop})`, fontFamily: F.sans,
      fontWeight: 900, fontSize: 84, letterSpacing: "-.03em", textTransform: "uppercase", lineHeight: 1.15 }}>
      {pg.map((w, k) => {
        const next = pg[k + 1];
        const active = t >= w.start && t < (next ? next.start : w.end + 0.3);
        return (
          <React.Fragment key={w.start}>
            <span style={active
              ? { background: RED.red, color: RED.bone, padding: "0 14px", borderRadius: 6, display: "inline-block", transform: "rotate(-2deg)" }
              : { color: t >= w.start ? RED.text : "rgba(243,238,231,.4)", WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 8px 24px rgba(0,0,0,.8)" }}>
              {w.word.replace(/[,.?:!]+$/, "")}
            </span>{" "}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// One scene's visuals, alive from its line start until the next scene starts
const SceneView: React.FC<{ sc: Scene; from: number; to: number; idx: number; tierIndex: number; tierScenes: Scene[] }> = ({ sc, from, to, idx, tierIndex, tierScenes }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 10) return null;
  const enter = interpolate(frame, [from, from + 10], [1, 0], { ...clamp, easing: theme.ease.out });
  const exit = sc.kind === "tier" ? 0 : ease(frame, [to, to + 9], [0, 1], theme.ease.in);
  const style: React.CSSProperties = { position: "absolute", inset: 0, transform: `translateY(${enter * 600 - exit * 1600}px)`, opacity: 1 - enter * 0.6 };
  if (sc.kind === "tier") return null; // tiers render on the shared board below
  return (
    <div style={style}>
      {sc.illo && (
        <Img src={staticFile(`illo/${sc.illo}.png`)} style={{ position: "absolute", top: 600, right: 30, width: 440, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.5))",
          transform: `rotate(${Math.sin((frame + idx * 20) / 40) * 2}deg) translateY(${Math.sin(frame / 25) * 8}px)` }} />
      )}
      {sc.kind === "hook" && <Pop at={from + 2} style={{ top: 600, left: 560 }} from={260}><Cutout pose="phone" width={400} id={`h${idx}`} /></Pop>}
      <div style={{ position: "absolute", left: 80, right: sc.illo || sc.kind === "hook" ? 500 : 80, top: 660, color: RED.text }}>
        {sc.sub && <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".24em", color: RED.muted, marginBottom: 14 }}>{sc.sub}</div>}
        {sc.text && <div style={{ fontFamily: F.display, fontSize: sc.kind === "cta" ? 84 : 94, lineHeight: 1.02 }}>{hl(sc.text)}</div>}
        {sc.items && (
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
            {sc.items.map((it, j) => (
              <Pop key={it} at={from + 8 + j * 9} style={{ position: "relative" }} from={40}>
                <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: RED.bone }}><span style={{ color: RED.red, fontFamily: F.mono, marginRight: 16 }}>{String(j + 1).padStart(2, "0")}</span>{it}</div>
              </Pop>
            ))}
          </div>
        )}
        {sc.link && (
          <Pop at={from + 10} style={{ position: "relative", marginTop: 34 }} from={40}>
            <div style={{ display: "inline-flex", flexDirection: "column", gap: 6, background: RED.bone, color: RED.ink, padding: "18px 26px", transform: "rotate(-1.5deg)", boxShadow: "0 16px 30px rgba(0,0,0,.5)" }}>
              <span style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: ".18em", color: RED.muted }}>FREE · LINK IN BIO</span>
              {/* Long blueprint links break after the /r/ and shrink to stay on the card */}
              {sc.link.replace(/\/r\//, "/r/\n").split("\n").map((part) => (
                <span key={part} style={{ fontFamily: F.mono, fontWeight: 700, fontSize: Math.min(38, 720 / part.length), color: RED.red, whiteSpace: "nowrap" }}>{part}</span>
              ))}
            </div>
          </Pop>
        )}
      </div>
      {sc.tag && <Tag at={from + 16} style={{ top: 1180, left: 90, transform: "rotate(-4deg)" }} size={44}>{sc.tag}</Tag>}
    </div>
  );
};

// Tier list board: each tier scene adds a row with a verdict stamp; the board stays while it builds
const TierBoard: React.FC<{ props: ShortProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const tiers = props.scenes.map((sc, i) => ({ sc, line: props.lines[i] })).filter((x) => x.sc.kind === "tier");
  if (!tiers.length) return null;
  const first = s2f(tiers[0].line.start) - 6;
  const lastIdx = props.scenes.indexOf(tiers[tiers.length - 1].sc);
  const after = props.lines[lastIdx + 1];
  const end = after ? s2f(after.start) - 6 : 1e9;
  if (frame < first - 1 || frame > end + 10) return null;
  const exit = ease(frame, [end, end + 9], [0, 1], theme.ease.in);
  return (
    <div style={{ position: "absolute", top: 560, left: 60, right: 60, transform: `translateY(${-exit * 1600}px)` }}>
      {tiers.map(({ sc, line }, j) => {
        const at = s2f(line.start) - 2;
        if (frame < at) return null;
        const p = interpolate(frame - at, [0, 8], [0, 1], { ...clamp, easing: theme.ease.out });
        return (
          <div key={sc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "18px 26px", marginBottom: 14,
            background: "#1b1515", border: "2px solid #3a3030", borderRadius: 14, transform: `translateX(${(1 - p) * -200}px)`, opacity: p }}>
            <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: RED.bone }}>{sc.item}</span>
            <span style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 34, letterSpacing: ".06em", padding: "4px 16px",
              transform: `rotate(-6deg) scale(${interpolate(frame - at - 6, [0, 6], [1.8, 1], clamp)})`, opacity: frame >= at + 6 ? 1 : 0,
              border: `5px solid ${sc.good ? RED.red : RED.bone}`, color: sc.good ? RED.red : RED.bone }}>{sc.verdict}</span>
          </div>
        );
      })}
    </div>
  );
};

export const Short: React.FC<ShortProps> = (props) => {
  const { scenes, lines } = props;
  const starts = lines.map((l) => s2f(l.start) - 6);
  const sfx: [number, string, number][] = [[0, "thud", 0.7]];
  scenes.forEach((sc, i) => {
    sfx.push([Math.max(0, starts[i]), sc.kind === "tier" ? "paper" : "whoosh", 0.5]);
    if (sc.kind === "tier") sfx.push([s2f(lines[i].start) + 4, "stamp", sc.good ? 0.9 : 0.6]);
    if (sc.kind === "cta") sfx.push([s2f(lines[i].start) + 8, "pop", 0.6]);
  });
  return (
    <AbsoluteFill style={{ background: RED.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 760px at 50% 58%, ${RED.red}24, transparent 70%)` }} />
      {scenes.map((sc, i) => (
        <SceneView key={sc.id} sc={sc} idx={i} from={i === 0 ? 0 : starts[i]} to={i < scenes.length - 1 ? starts[i + 1] : 1e9} tierIndex={0} tierScenes={[]} />
      ))}
      <TierBoard props={props} />
      <Banner text={props.banner} kicker={props.kicker} />
      <Bar ep={props.ep ?? ""} series={props.series ?? "AUTOMATION"} />
      <Captions words={props.words} />
      <Grain />
      <Vignette />
      <Audio src={staticFile(`vo-${props.slug}.wav`)} />
      {sfx.map(([at, name, vol], i) => (
        <Sequence key={i} from={at} durationInFrames={45}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
