// Faceless paper-cutout people: halftone print, white sticker border, no facial features.
import React from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

const C = theme.colors;

type Pose = "reach" | "phone" | "sleep";

const parts: Record<Pose, string[]> = {
  reach: [
    "M140 330 C 160 290, 360 290, 380 330 L 410 760 L 110 760 Z", // coat
    "M350 322 C 420 340, 470 372, 540 392 L 552 434 C 470 430, 400 404, 345 392 Z", // reaching arm
    "M150 330 C 120 420, 112 520, 124 600 L 162 600 C 160 520, 170 430, 192 360 Z", // arm down
    "M150 760 L 245 760 L 238 1000 L 160 1000 Z M 275 760 L 370 760 L 362 1000 L 284 1000 Z", // legs
  ],
  phone: [
    "M140 330 C 160 290, 360 290, 380 330 L 410 760 L 110 760 Z",
    "M330 330 C 380 380, 360 430, 300 440 L 292 405 C 330 400, 335 380, 312 352 Z", // arm up to phone
    "M150 330 C 120 420, 112 520, 124 600 L 162 600 C 160 520, 170 430, 192 360 Z",
    "M150 760 L 245 760 L 238 1000 L 160 1000 Z M 275 760 L 370 760 L 362 1000 L 284 1000 Z",
  ],
  // slumped over a desk, head on folded arms
  sleep: [
    "M110 1000 C 100 760, 150 560, 270 500 L 330 560 C 250 610, 220 760, 240 1000 Z", // back
    "M200 540 C 300 520, 460 520, 560 540 L 560 600 C 460 590, 300 590, 200 600 Z", // folded arms
  ],
};

export const Cutout: React.FC<{ pose?: Pose; width: number; id: string; tint?: string; hair?: boolean }> = ({ pose = "reach", width, id, tint = C.ink, hair = true }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 18) * 3;
  const shapes = (
    <>
      {pose === "sleep"
        ? <ellipse cx="380" cy={470 + breathe * 0.5} rx="92" ry="74" />
        : <><ellipse cx="262" cy={170 + breathe * 0.3} rx="78" ry="92" /><rect x="236" y="246" width="52" height="56" /></>}
      {parts[pose].map((d, i) => <path key={i} d={d} />)}
      {pose === "phone" && <rect x="262" y="372" width="56" height="92" rx="8" />}
    </>
  );
  return (
    <svg viewBox="0 0 600 1000" width={width} height={(width * 1000) / 600} style={{ overflow: "visible", filter: "drop-shadow(0 18px 20px rgba(0,0,0,.55))" }}>
      <defs>
        <pattern id={`ht-${id}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="4" cy="4" r="2.9" fill={tint} />
        </pattern>
      </defs>
      <g transform={`translate(0 ${breathe})`}>
        {/* sticker border, then paper, then halftone print */}
        <g fill={C.paper} stroke={C.paper} strokeWidth={26} strokeLinejoin="round">{shapes}</g>
        <g fill={`url(#ht-${id})`}>{shapes}</g>
        {hair && pose !== "sleep" && <path d="M182 168 C 176 70, 348 64, 342 166 C 322 118, 214 112, 182 168 Z" fill={tint} transform={`translate(0 ${breathe * 0.3})`} />}
      </g>
    </svg>
  );
};
