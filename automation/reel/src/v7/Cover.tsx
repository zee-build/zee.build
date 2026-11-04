// Reel cover / thumbnail, 1080x1920. Everything important sits in the centre 1080x1350 (the profile-grid crop).
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { Grain, Vignette, torn } from "../Vox";
import { Globe, ORANGE_GLOBE } from "../v2/Globe";

const C = theme.colors, F = theme.fonts;

export const CoverEp01: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ background: "radial-gradient(800px 700px at 50% 56%, rgba(255,138,51,.28), transparent 70%)" }} />
    {/* globe with most lights already out */}
    <div style={{ position: "absolute", top: 760, left: 0 }}><Globe width={1080} height={780} lightsOffAt={-28} pal={ORANGE_GLOBE} /></div>
    <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: F.mono, fontSize: 34, letterSpacing: ".3em", color: C.primary }}>
      WHAT IF · EP 01
    </div>
    <div style={{ position: "absolute", top: 400, left: 60, right: 60, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 150, lineHeight: 0.9,
      letterSpacing: "-.04em", color: C.text, textTransform: "uppercase", textShadow: "0 12px 40px rgba(0,0,0,.6)" }}>
      Every bank<br />goes <span style={{ background: C.primary, color: C.bg, padding: "0 18px", display: "inline-block", transform: "rotate(-2deg)" }}>dark</span>
    </div>
    {/* torn paper countdown */}
    <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.paper, color: C.ink, clipPath: torn, padding: "18px 44px 24px", transform: "rotate(-2deg)", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 132, letterSpacing: "-.02em" }}>00:<span style={{ color: "#D7332B" }}>60</span></div>
        <div style={{ fontFamily: F.mono, fontSize: 26, letterSpacing: ".3em", textAlign: "center", color: "#6b6258" }}>SECONDS. GO.</div>
      </div>
    </div>
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
