// EP01 v2 style frames: the 3D globe hook and "meet Zee" with a faceless cutout.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Desk, Grade, Grain, Vignette, Tape, SeriesBar, torn, shadow } from "../Vox";
import { Globe } from "./Globe";
import { Cutout } from "./Cutout";

const C = theme.colors, F = theme.fonts;

const Caption: React.FC<{ words: string[]; active: number }> = ({ words, active }) => (
  <div style={{ position: "absolute", top: 1395, left: 70, right: 70, textAlign: "center", zIndex: 9, fontFamily: F.sans, fontWeight: 900,
    fontSize: 88, letterSpacing: "-.03em", textTransform: "uppercase" }}>
    {words.map((w, i) => (
      <React.Fragment key={i}>
        <span style={{ color: i === active ? C.primary : i < active ? C.text : "rgba(242,240,236,.35)", WebkitTextStroke: "3px #000",
          paintOrder: "stroke", textShadow: "0 8px 24px rgba(0,0,0,.8)" }}>{w}</span>{" "}
      </React.Fragment>
    ))}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; style: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", background: C.ink, color: C.text, fontFamily: F.mono, fontWeight: 700, fontSize: 56, padding: "10px 26px",
    borderRadius: 8, boxShadow: "0 14px 24px rgba(0,0,0,.5)", letterSpacing: ".04em", zIndex: 7, ...style }}>{children}</div>
);

const Layers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Desk />
    {children}
    <SeriesBar />
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);

export const StyleHook: React.FC = () => (
  <Layers>
    <div style={{ position: "absolute", top: 600, left: 0 }}><Globe width={1080} height={820} lightsOffAt={20} /></div>
    <div style={{ position: "absolute", top: 320, left: 80, width: 920, filter: shadow, transform: "rotate(-2deg)" }}>
      <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "40px 46px 46px" }}>
        <div style={{ fontFamily: F.news, fontSize: 24, letterSpacing: ".32em", borderBottom: `3px double ${C.ink}`, paddingBottom: 10, marginBottom: 16,
          display: "flex", justifyContent: "space-between" }}><span>THE LEDGER</span><span>BREAKING</span></div>
        <div style={{ fontFamily: F.news, fontWeight: 700, fontSize: 100, lineHeight: 0.93 }}>Every bank on Earth just went dark.</div>
      </div>
      <Tape x={60} y={-22} r={-16} at={-30} />
    </div>
    <Chip style={{ top: 1270, left: 80, transform: "rotate(-3deg)" }}><span style={{ color: C.textDim, fontSize: 30, marginRight: 14 }}>T−</span>00:60</Chip>
    <div style={{ position: "absolute", top: 690, right: 70, fontFamily: F.hand, fontSize: 58, color: C.primary, transform: "rotate(-5deg)", textAlign: "right", lineHeight: 1.05 }}>
      lights out,<br />city by city
    </div>
    <Caption words={["just", "went", "dark"]} active={2} />
  </Layers>
);

const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 820, left: 585, width: 290, height: 400, background: "#1f1d1b", borderRadius: 28, padding: 22,
      boxShadow: "0 24px 34px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.06)", transform: "rotate(4deg)", zIndex: 4 }}>
      <div style={{ background: "#d9e0d0", borderRadius: 10, height: 210, padding: 18, fontFamily: F.mono, color: C.ink, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 22, letterSpacing: ".1em" }}>FLAT WHITE</div>
        <div style={{ fontSize: 46, fontWeight: 700 }}>£3.40</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 700 }}>
          <svg width="30" height="30" viewBox="0 0 30 30" style={{ transform: `rotate(${frame * 12}deg)` }}>
            <circle cx="15" cy="15" r="11" fill="none" stroke={C.ink} strokeWidth="4" strokeDasharray="40 30" strokeLinecap="round" />
          </svg>
          PROCESSING…
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 18 }}>
        {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 34, borderRadius: 8, background: "#34302c" }} />)}
      </div>
    </div>
  );
};

export const StyleZee: React.FC = () => (
  <Layers>
    {/* halftone café window behind */}
    <div style={{ position: "absolute", top: 330, left: 60, width: 960, height: 760, filter: shadow, transform: "rotate(1.2deg)" }}>
      <div style={{ width: "100%", height: "100%", background: C.paper2, clipPath: torn, overflow: "hidden" }}>
        <svg viewBox="0 0 960 760" width="960" height="760">
          <defs><pattern id="cafe" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2.2" fill={C.ink} /></pattern></defs>
          <rect width="960" height="760" fill="url(#cafe)" opacity=".28" />
          <rect x="60" y="150" width="380" height="300" fill="url(#cafe)" opacity=".9" />
          <rect x="520" y="150" width="380" height="300" fill="url(#cafe)" opacity=".9" />
          <text x="480" y="105" textAnchor="middle" fontFamily={F.news} fontWeight={700} fontSize="64" fill={C.ink} letterSpacing="6">THE CORNER CAFÉ</text>
        </svg>
      </div>
    </div>
    <div style={{ position: "absolute", top: 560, left: 90, zIndex: 3 }}><Cutout pose="reach" width={540} id="zee" /></div>
    <Terminal />
    {/* counter strip hides the legs */}
    <div style={{ position: "absolute", top: 1180, left: -20, width: 1120, height: 300, filter: shadow, zIndex: 5 }}>
      <div style={{ width: "100%", height: "100%", background: "#c9b48f", clipPath: torn,
        backgroundImage: "repeating-linear-gradient(90deg, rgba(26,23,20,.18) 0 3px, transparent 3px 46px)" }} />
    </div>
    <Chip style={{ top: 1225, left: 90, transform: "rotate(-3deg)", fontSize: 46 }}><span style={{ color: C.textDim, fontSize: 28, marginRight: 14 }}>T−</span>00:59 · 08:59 AM</Chip>
    <div style={{ position: "absolute", top: 520, left: 600, fontFamily: F.hand, fontSize: 64, color: C.primary, transform: "rotate(-6deg)", zIndex: 6 }}>
      meet Zee.
    </div>
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none" }}>
      <path d="M 640 610 C 590 640, 540 650, 470 640" fill="none" stroke={C.primary} strokeWidth="7" strokeLinecap="round" />
      <path d="M 494 626 L 466 640 L 488 660" fill="none" stroke={C.primary} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Caption words={["taps", "a", "card"]} active={2} />
  </Layers>
);
