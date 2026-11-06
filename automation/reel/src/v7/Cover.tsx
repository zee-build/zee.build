// Reel cover / thumbnail, 1080x1920. Everything important sits in the centre 1080x1350 (the profile-grid crop).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { theme } from "../theme";
import { Grain, Vignette, torn } from "../Vox";
import { Globe, ORANGE_GLOBE } from "../v2/Globe";
import { Cutout } from "../v2/Cutout";
import { RED, F as RF } from "../v4/Style02";

const C = theme.colors, F = { ...RF, ...theme.fonts };

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

// The thumbnail every reel gets. Bold enough to read small on the profile grid.
// Everything important sits in the centre 1080x1350, the part the grid shows.
export type ReelCoverProps = { headline: string; label: string; illo?: string; zee?: boolean; palette?: Partial<typeof RED> };

export const ReelCover: React.FC<ReelCoverProps> = ({ headline, label, illo, zee, palette }) => {
  const P = { ...RED, ...palette };
  const words = headline.replace(/\[\[|\]\]/g, "").split(/\s+/);
  const longest = Math.max(...words.map((w) => w.length));
  const size = Math.min(longest <= 8 ? 172 : Math.round(1250 / longest), words.length > 7 ? 124 : 172); // long words must stay inside the grid crop
  return (
    <AbsoluteFill style={{ background: P.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(900px 800px at 50% 72%, ${P.red}40, transparent 70%)` }} />
      <div style={{ position: "absolute", top: 320, left: 70, display: "flex", alignItems: "center", gap: 18, fontFamily: F.mono, fontWeight: 700, fontSize: 36, letterSpacing: ".22em", color: P.text }}>
        <span style={{ width: 22, height: 22, borderRadius: 11, background: P.red }} />{label}
      </div>
      <div style={{ position: "absolute", top: 395, left: 66, right: 50, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: "-.04em", textTransform: "uppercase", color: P.text, textShadow: "0 12px 40px rgba(0,0,0,.6)" }}>
        {headline.split(/(\[\[.+?\]\])/).map((part, i) => {
          const m = part.match(/^\[\[(.+)\]\]$/);
          // A short highlight gets the tilted block; a long one wraps line by line so it never becomes one big slab
          if (!m) return part;
          return m[1].length <= 12
            ? <span key={i} style={{ background: P.red, color: P.bone, padding: "0 18px", display: "inline-block", transform: "rotate(-2deg)" }}>{m[1]}</span>
            : <span key={i} style={{ background: P.red, color: P.bone, padding: "0 18px", WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>{m[1]}</span>;
        })}
      </div>
      {illo && <Img src={staticFile(`illo/${illo}.png`)} style={{ position: "absolute", bottom: 300, right: 40, width: 560, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.55))" }} />}
      {zee && <div style={{ position: "absolute", bottom: 285, left: 50 }}><Cutout pose="phone" width={400} id="cover" /></div>}
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
