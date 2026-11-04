// EP03 style frames (Signal Red): the queue firing, and the comment-keyword CTA.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grain, Vignette, torn, shadow } from "../Vox";
import { Conveyor } from "../v3/Scenes3D";
import { RED, F } from "../v4/Style02";

const Desk: React.FC = () => (
  <AbsoluteFill style={{ background: RED.bg }}>
    <AbsoluteFill style={{ background: "radial-gradient(900px 760px at 50% 58%, rgba(224,48,42,.14), transparent 70%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 24%, transparent 76%, rgba(0,0,0,.45))" }} />
  </AbsoluteFill>
);
const Bar: React.FC = () => (
  <div style={{ position: "absolute", top: 240, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 26,
    letterSpacing: ".08em", color: RED.muted, zIndex: 12 }}>
    <span><span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: RED.red, marginRight: 14, boxShadow: `0 0 16px ${RED.red}` }} />
      <b style={{ color: RED.text, fontWeight: 500 }}>ZEEBUILD OS</b> · WHAT IF</span>
    <span>EP 03</span>
  </div>
);
const Caption: React.FC<{ words: string[]; active: number }> = ({ words, active }) => (
  <div style={{ position: "absolute", top: 1395, left: 60, right: 60, textAlign: "center", zIndex: 11, fontFamily: F.sans, fontWeight: 900, fontSize: 86,
    letterSpacing: "-.03em", textTransform: "uppercase", lineHeight: 1.15 }}>
    {words.map((w, i) => (
      <React.Fragment key={i}>
        <span style={i === active
          ? { background: RED.red, color: RED.bone, padding: "0 14px", borderRadius: 6, display: "inline-block", transform: "rotate(-2deg)", boxShadow: "0 10px 22px rgba(0,0,0,.5)" }
          : { color: i < active ? RED.text : "rgba(243,238,231,.4)", WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 8px 24px rgba(0,0,0,.8)" }}>{w}</span>{" "}
      </React.Fragment>
    ))}
  </div>
);
const Tag: React.FC<{ children: React.ReactNode; style: React.CSSProperties; size?: number }> = ({ children, style, size = 46 }) => (
  <div style={{ position: "absolute", zIndex: 8, background: RED.bone, color: RED.redDeep, fontFamily: F.hand, fontSize: size, lineHeight: 1.05,
    padding: "12px 22px 14px", clipPath: torn, filter: shadow, ...style }}>{children}</div>
);
const Layers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: RED.bg }}><Desk />{children}<Bar /><Grain /><Vignette /></AbsoluteFill>
);

export const Style03Queue: React.FC = () => (
  <Layers>
    <div style={{ position: "absolute", top: 390, left: 80, zIndex: 6, transform: "rotate(-2deg)", filter: shadow }}>
      <div style={{ background: RED.bone, color: RED.ink, clipPath: torn, padding: "22px 34px 26px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".22em", color: RED.muted }}>HOUR 24 · BANKS WAKE UP</div>
        <div style={{ fontFamily: F.display, fontSize: 68, lineHeight: 1 }}>The queue fires.</div>
      </div>
    </div>
    <div style={{ position: "absolute", top: 300, right: 80, zIndex: 12, transform: "rotate(2deg)", background: RED.red, color: RED.bone, fontFamily: F.mono,
      fontWeight: 700, fontSize: 40, padding: "8px 20px", borderRadius: 6, boxShadow: "0 12px 22px rgba(0,0,0,.6)" }}>
      <span style={{ fontSize: 22, letterSpacing: ".12em", marginRight: 10 }}>HOUR</span>24
    </div>
    <div style={{ position: "absolute", top: 560, left: 0 }}><Conveyor width={1080} height={460} accent={RED.red} /></div>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: "absolute", top: 1000 + i * 62, left: 150 + i * 22, zIndex: 6, transform: `rotate(${-4 + i * 2.5}deg)`, filter: shadow }}>
        <div style={{ width: 430, background: RED.bone, color: RED.ink, fontFamily: F.mono, fontSize: 25, padding: "14px 22px", clipPath: torn,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>ORDER #{2201 + i}</span>
          <b style={{ color: RED.bone, background: RED.red, padding: "2px 12px", transform: "rotate(-4deg)", display: "inline-block" }}>PAID</b>
        </div>
      </div>
    ))}
    <Tag style={{ top: 1060, left: 640, transform: "rotate(6deg)" }} size={46}>ding.<br />ding.<br />ding.</Tag>
    <Caption words={["order", "paid"]} active={1} />
  </Layers>
);

export const Style03Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <Layers>
      <div style={{ position: "absolute", top: 390, left: 80, right: 80, color: RED.text, zIndex: 5 }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".3em", color: RED.muted }}>FREE · 60-SECOND CHECK</div>
        <div style={{ fontFamily: F.display, fontSize: 104, lineHeight: 0.98, marginTop: 14 }}>
          Would your business <span style={{ background: RED.red, color: RED.bone, padding: "0 14px", display: "inline-block", transform: "rotate(-2deg)" }}>survive</span> the blackout?
        </div>
      </div>
      {/* comment box */}
      <div style={{ position: "absolute", top: 860, left: 90, width: 820, zIndex: 6, filter: shadow }}>
        <div style={{ background: "#1b1515", border: "2px solid #3a3030", borderRadius: 26, padding: "22px 26px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: RED.bone2, flexShrink: 0 }} />
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 54, color: RED.bone, letterSpacing: ".02em", flex: 1 }}>
            BACKUP<span style={{ opacity: caret ? 1 : 0, color: RED.red }}>|</span>
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: RED.red }}>Post</div>
        </div>
      </div>
      {/* DM arriving */}
      <div style={{ position: "absolute", top: 1030, left: 260, width: 600, zIndex: 7, transform: "rotate(-2deg)" }}>
        <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: ".16em", color: RED.muted, marginBottom: 8 }}>ZEEBUILD · DM · NOW</div>
        <div style={{ background: RED.bone, color: RED.ink, borderRadius: 24, borderBottomLeftRadius: 6, padding: "18px 24px", fontFamily: F.sans, fontWeight: 700,
          fontSize: 30, lineHeight: 1.3, boxShadow: "0 16px 28px rgba(0,0,0,.6)" }}>
          Here's your free blackout check →<br /><span style={{ color: RED.red }}>zeebuild.com/whatif</span>
        </div>
      </div>
      <Tag style={{ top: 1240, left: 90, transform: "rotate(-5deg)" }} size={44}>one word. that's it.</Tag>
      <Caption words={["comment", "backup"]} active={1} />
    </Layers>
  );
};
