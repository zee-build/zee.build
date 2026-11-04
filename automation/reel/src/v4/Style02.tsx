import { getInputProps } from "remotion";
// EP02 style frames in the "Signal Red" theme: near-black desk, bone paper, one signal red.
// Readability rules: handwriting only on solid bone tags (never on halftone), the active caption
// word sits on a red block, and red is never text-on-red or small text on black.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as serif } from "@remotion/google-fonts/DMSerifDisplay";
import { theme } from "../theme";
import { Grain, Vignette, torn, shadow } from "../Vox";
import { Globe } from "../v2/Globe";
import { Cutout } from "../v2/Cutout";

export const RED = {
  bg: "#0E0A0A", bone: "#EFE7DA", bone2: "#E2D6C2", ink: "#151010", red: "#E0302A", redDeep: "#9E1B17",
  muted: "#8C8580", text: "#F3EEE7",
};
export const F = { ...theme.fonts, display: serif("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily };
export const RED_GLOBE = { land: "#E7DDCB", land2: "#c9bca6", sea: "#241c1c", on: RED.red, off: "#2e2323", rim: RED.red };

const Desk: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: RED.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 760px at 50% ${58 + Math.sin(frame / 60) * 3}%, rgba(224,48,42,.13), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 24%, transparent 76%, rgba(0,0,0,.45))" }} />
    </AbsoluteFill>
  );
};

const Bar: React.FC = () => (
  <div style={{ position: "absolute", top: 240, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontFamily: F.mono, fontSize: 26,
    letterSpacing: ".08em", color: RED.muted, zIndex: 9 }}>
    <span><span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 7, background: RED.red, marginRight: 14, boxShadow: `0 0 16px ${RED.red}` }} />
      <b style={{ color: RED.text, fontWeight: 500 }}>ZEEBUILD OS</b> · WHAT IF</span>
    <span>EP 02</span>
  </div>
);

const Hour: React.FC<{ h: string }> = ({ h }) => (
  <div style={{ position: "absolute", top: 300, right: 80, zIndex: 10, transform: "rotate(2deg)", background: RED.bone, color: RED.ink, fontFamily: F.mono,
    fontWeight: 700, fontSize: 40, padding: "8px 20px", borderRadius: 6, boxShadow: "0 12px 22px rgba(0,0,0,.6)" }}>
    <span style={{ fontSize: 22, letterSpacing: ".12em", marginRight: 10, color: RED.muted }}>HOUR</span><span style={{ color: RED.red }}>{h}</span>
  </div>
);

// Active word on a red block: readable on any background
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

// Handwritten note on a solid bone tag, red ink: always readable
const Tag: React.FC<{ children: React.ReactNode; style: React.CSSProperties; size?: number }> = ({ children, style, size = 46 }) => (
  <div style={{ position: "absolute", zIndex: 8, background: RED.bone, color: RED.redDeep, fontFamily: F.hand, fontSize: size, lineHeight: 1.05,
    padding: "12px 22px 14px", clipPath: torn, filter: shadow, ...style }}>{children}</div>
);

const Layers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: RED.bg }}>
    <Desk />
    {children}
    <Bar />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);

export const Style02Open: React.FC = () => (
  <Layers>
    <div style={{ position: "absolute", top: 700, left: 0 }}><Globe width={1080} height={780} lightsOffAt={-1000} pal={RED_GLOBE} /></div>
    <div style={{ position: "absolute", top: 400, left: 80, right: 80, color: RED.text, zIndex: 5 }}>
      <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".3em", color: RED.muted }}>LAST TIME: 60 SECONDS</div>
      <div style={{ fontFamily: F.display, fontSize: 132, lineHeight: 0.95, marginTop: 18, letterSpacing: "-.01em" }}>
        This time, they <span style={{ background: RED.red, color: RED.bone, padding: "0 16px", display: "inline-block", transform: "rotate(-2deg)" }}>don't</span> come back.
      </div>
    </div>
    <div style={{ position: "absolute", top: 1130, left: 110, zIndex: 6, transform: "rotate(-10deg)", border: `7px solid ${RED.red}`, color: RED.red,
      fontFamily: F.sans, fontWeight: 900, fontSize: 72, padding: "2px 22px", background: "rgba(14,10,10,.55)", letterSpacing: ".06em" }}>DAY 1</div>
    <Hour h="00" />
    <Caption words={["don't", "come", "back"]} active={2} />
  </Layers>
);

const ATM: React.FC = () => (
  <div style={{ position: "absolute", top: 640, left: 560, width: 350, height: 560, background: "#221b1b", borderRadius: 18, padding: 24, zIndex: 4,
    boxShadow: "0 26px 36px rgba(0,0,0,.65), inset 0 0 0 2px rgba(255,255,255,.05)" }}>
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

export const Style02Cash: React.FC = () => (
  <Layers>
    <div style={{ position: "absolute", top: 390, left: 80, zIndex: 6, transform: "rotate(-2deg)", filter: shadow }}>
      <div style={{ background: RED.bone, color: RED.ink, clipPath: torn, padding: "22px 34px 26px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: ".22em", color: RED.muted }}>HOUR 03</div>
        <div style={{ fontFamily: F.display, fontSize: 68, lineHeight: 1 }}>Cash runs dry.</div>
      </div>
    </div>
    <ATM />
    <div style={{ position: "absolute", top: 650, left: 50, zIndex: 3 }}><Cutout pose="reach" width={520} id="zee02" /></div>
    {/* pavement hides the legs and holds the captions */}
    <div style={{ position: "absolute", top: 1210, left: -20, width: 1120, height: 420, background: "#1d1717", clipPath: torn, zIndex: 5,
      backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 3px, transparent 3px 140px)" }} />
    <div style={{ position: "absolute", top: 1010, left: 290, zIndex: 7, transform: "rotate(-6deg)", filter: shadow }}>
      <div style={{ width: 4, height: 70, background: RED.muted, margin: "0 0 -6px 60px" }} />
      <div style={{ background: RED.bone, color: RED.ink, padding: "18px 24px", borderRadius: "10px 30px 10px 10px", fontFamily: F.mono, minWidth: 300 }}>
        <div style={{ fontSize: 20, letterSpacing: ".16em", color: RED.muted }}>ZEE'S NET WORTH</div>
        <div style={{ fontSize: 58, fontWeight: 700, color: RED.red }}>£11.00</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>+ ½ MEAL DEAL</div>
      </div>
    </div>
    <Tag style={{ top: 515, left: 610, transform: "rotate(4deg)" }} size={42}>send help<br />(and a sandwich)</Tag>
    <Hour h="03" />
    <Caption words={["half", "a", "meal deal"]} active={2} />
  </Layers>
);
