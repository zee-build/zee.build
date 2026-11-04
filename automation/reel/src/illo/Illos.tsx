// Low-poly 3D illustrations for carousels, rendered as transparent PNG stills.
// Same language as the reels: bone paper, near-black ink, one signal red, flat shading.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill } from "remotion";

const BONE = "#EFE7DA", BONE2 = "#D9CDB6", INK = "#2a2222", RED = "#E0302A", GOLD = "#c9a227";
const M: React.FC<{ c: string; metal?: number }> = ({ c, metal = 0 }) => <meshStandardMaterial color={c} flatShading roughness={0.75} metalness={metal} />;

const Envelope: React.FC<{ p: [number, number, number]; r?: [number, number, number]; red?: boolean }> = ({ p, r = [0, 0, 0], red }) => (
  <group position={p} rotation={r}>
    <mesh><boxGeometry args={[1.1, 0.7, 0.05]} /><M c={red ? RED : BONE} /></mesh>
    <mesh position={[0, 0.12, 0.03]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.55, 0.55, 0.01]} /><M c={red ? "#b8241f" : BONE2} /></mesh>
  </group>
);

// Inbox tray overflowing with envelopes, behind prison bars
const CageInbox: React.FC = () => (
  <group rotation={[0.35, -0.55, 0]} scale={0.82} position={[0.25, 0, 0]}>
    <mesh position={[0, -0.55, 0]}><boxGeometry args={[2.6, 0.25, 1.8]} /><M c={INK} /></mesh>
    {[...Array(9)].map((_, i) => (
      <Envelope key={i} p={[-0.8 + (i % 3) * 0.8, -0.3 + Math.floor(i / 3) * 0.28, -0.2 + ((i * 7) % 3) * 0.2]}
        r={[-1.2 + (i % 2) * 0.3, 0, ((i * 13) % 7) / 10 - 0.3]} red={i === 4} />
    ))}
    {[...Array(7)].map((_, i) => (
      <mesh key={i} position={[-1.35 + i * 0.45, 0.6, 1.0]}><cylinderGeometry args={[0.05, 0.05, 2.6, 8]} /><M c={INK} metal={0.6} /></mesh>
    ))}
    <mesh position={[0, 1.9, 1.0]}><boxGeometry args={[3.0, 0.12, 0.12]} /><M c={INK} metal={0.6} /></mesh>
    <mesh position={[0, -0.6, 1.0]}><boxGeometry args={[3.0, 0.12, 0.12]} /><M c={INK} metal={0.6} /></mesh>
    {/* padlock */}
    <group position={[0.2, 0.55, 1.12]}>
      <mesh><boxGeometry args={[0.55, 0.45, 0.2]} /><M c={RED} /></mesh>
      <mesh position={[0, 0.33, 0]}><torusGeometry args={[0.18, 0.05, 8, 16, Math.PI]} /><M c={INK} metal={0.7} /></mesh>
    </group>
  </group>
);

// Invoice sheet with a stack of coins and a red "OVERDUE" tab
const InvoiceCoins: React.FC = () => (
  <group rotation={[0.55, -0.5, 0.05]}>
    <mesh><boxGeometry args={[1.8, 2.4, 0.04]} /><M c={BONE} /></mesh>
    {[...Array(6)].map((_, i) => (
      <mesh key={i} position={[-0.15 + (i % 2 ? 0.2 : 0), 0.75 - i * 0.28, 0.03]}><boxGeometry args={[i % 2 ? 0.9 : 1.3, 0.07, 0.01]} /><M c={BONE2} /></mesh>
    ))}
    <mesh position={[0.45, -0.85, 0.04]}><boxGeometry args={[0.7, 0.28, 0.02]} /><M c={RED} /></mesh>
    {[...Array(7)].map((_, i) => (
      <mesh key={i} position={[1.4, -1.1 + i * 0.13, 0.55]}><cylinderGeometry args={[0.42, 0.42, 0.11, 18]} /><M c={GOLD} metal={0.7} /></mesh>
    ))}
    {[...Array(4)].map((_, i) => (
      <mesh key={`b${i}`} position={[0.55, -1.1 + i * 0.13, 0.95]}><cylinderGeometry args={[0.42, 0.42, 0.11, 18]} /><M c={GOLD} metal={0.7} /></mesh>
    ))}
  </group>
);

// A gear with a big red "approve" button: automation does the routine, a human presses for exceptions
const GearButton: React.FC = () => (
  <group rotation={[0.5, -0.4, 0]}>
    <group position={[-0.6, 0.2, 0]}>
      <mesh><cylinderGeometry args={[1.0, 1.0, 0.3, 10]} /><M c={INK} metal={0.4} /></mesh>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 10) * Math.PI * 2) * 1.1, 0, Math.sin((i / 10) * Math.PI * 2) * 1.1]} rotation={[0, -(i / 10) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.32, 0.3, 0.3]} /><M c={INK} metal={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.35, 0.35, 0.05, 16]} /><M c={BONE2} /></mesh>
    </group>
    <group position={[1.3, -0.4, 0.6]}>
      <mesh><boxGeometry args={[1.0, 0.35, 1.0]} /><M c={BONE} /></mesh>
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.32, 0.36, 0.22, 20]} /><M c={RED} /></mesh>
    </group>
  </group>
);

// A bell (the one alert) on top of an open log book
const BellLog: React.FC = () => (
  <group rotation={[0.55, -0.45, 0]}>
    <group position={[0, -0.6, 0]}>
      <mesh position={[-0.62, 0, 0]} rotation={[0, 0, 0.08]}><boxGeometry args={[1.2, 0.08, 1.6]} /><M c={BONE} /></mesh>
      <mesh position={[0.62, 0, 0]} rotation={[0, 0, -0.08]}><boxGeometry args={[1.2, 0.08, 1.6]} /><M c={BONE} /></mesh>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0.62, 0.06, -0.55 + i * 0.26]}><boxGeometry args={[0.9, 0.01, 0.06]} /><M c={i === 2 ? RED : BONE2} /></mesh>
      ))}
      <mesh position={[0, -0.05, 0]}><boxGeometry args={[2.6, 0.06, 1.75]} /><M c={INK} /></mesh>
    </group>
    <group position={[-0.5, 0.45, 0.1]}>
      <mesh><cylinderGeometry args={[0.28, 0.66, 0.85, 20]} /><M c={RED} /></mesh>
      <mesh position={[0, 0.42, 0]}><sphereGeometry args={[0.28, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><M c={RED} /></mesh>
      <mesh position={[0, -0.5, 0]}><torusGeometry args={[0.62, 0.07, 8, 20]} /><M c={RED} /></mesh>
      <mesh position={[0, -0.62, 0]}><sphereGeometry args={[0.13, 10, 10]} /><M c={GOLD} metal={0.7} /></mesh>
      <mesh position={[0, 0.75, 0]}><sphereGeometry args={[0.11, 10, 10]} /><M c={INK} /></mesh>
    </group>
  </group>
);

// A rolled blueprint with the sheet half open
const Blueprint: React.FC = () => (
  <group rotation={[0.6, -0.35, 0.05]}>
    <mesh position={[0.2, 0, 0]}><boxGeometry args={[2.4, 0.03, 1.7]} /><M c="#1f3d73" /></mesh>
    {[...Array(5)].map((_, i) => (
      <mesh key={i} position={[-0.3 + i * 0.3, 0.025, -0.4 + (i % 3) * 0.35]}><boxGeometry args={[0.5, 0.01, 0.04]} /><M c={BONE} /></mesh>
    ))}
    <mesh position={[0.6, 0.025, 0.2]}><boxGeometry args={[0.05, 0.01, 0.9]} /><M c={BONE} /></mesh>
    <mesh position={[0.4, 0.025, 0.45]}><boxGeometry args={[0.6, 0.012, 0.05]} /><M c={RED} /></mesh>
    <mesh position={[-1.15, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 1.75, 18]} /><M c="#1f3d73" /></mesh>
    <mesh position={[-1.15, 0.18, 0.9]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.12, 10]} /><M c={RED} /></mesh>
  </group>
);

// Tier podium: S on top in red, A and B lower
const Podium: React.FC = () => (
  <group rotation={[0.35, -0.5, 0]}>
    {([["S", 0, 1.5, RED], ["A", -1.15, 1.0, BONE], ["B", 1.15, 0.6, BONE2]] as const).map(([k, x, h, c]) => (
      <group key={k} position={[x, -1.2 + h / 2, 0]}>
        <mesh><boxGeometry args={[1.1, h, 1.1]} /><M c={c} /></mesh>
        <mesh position={[0, h / 2 + 0.28, 0]}><octahedronGeometry args={[0.28, 0]} /><M c={k === "S" ? GOLD : INK} metal={k === "S" ? 0.7 : 0.2} /></mesh>
      </group>
    ))}
  </group>
);

// A card flowing through three boxes (you → network → bank), coins dropping off at each
const CardFlow: React.FC = () => (
  <group rotation={[0.45, -0.35, 0]}>
    {[-1.5, 0, 1.5].map((x, i) => (
      <group key={i} position={[x, -0.5, 0]}>
        <mesh><boxGeometry args={[0.9, 0.7, 0.9]} /><M c={i === 1 ? INK : BONE} /></mesh>
        <mesh position={[0, -0.25, 0.75]}><cylinderGeometry args={[0.18, 0.18, 0.06, 14]} /><M c={GOLD} metal={0.7} /></mesh>
      </group>
    ))}
    <group position={[-0.2, 0.55, 0.2]} rotation={[0.2, 0.3, -0.12]}>
      <mesh><boxGeometry args={[1.3, 0.82, 0.04]} /><M c={RED} /></mesh>
      <mesh position={[-0.36, 0.1, 0.03]}><boxGeometry args={[0.22, 0.17, 0.01]} /><M c={GOLD} metal={0.8} /></mesh>
    </group>
    {[-0.75, 0.75].map((x) => <mesh key={x} position={[x, -0.5, 0]}><boxGeometry args={[0.6, 0.06, 0.06]} /><M c={INK} /></mesh>)}
  </group>
);

// Clipboard checklist: four rows, three ticked
const Clipboard: React.FC = () => (
  <group rotation={[0.5, -0.45, 0.05]}>
    <mesh><boxGeometry args={[1.9, 2.5, 0.08]} /><M c={INK} /></mesh>
    <mesh position={[0, 0, 0.05]}><boxGeometry args={[1.7, 2.3, 0.02]} /><M c={BONE} /></mesh>
    <mesh position={[0, 1.22, 0.1]}><boxGeometry args={[0.8, 0.22, 0.12]} /><M c={INK} metal={0.6} /></mesh>
    {[0, 1, 2, 3].map((i) => (
      <group key={i} position={[0, 0.65 - i * 0.48, 0.07]}>
        <mesh position={[-0.55, 0, 0]}><boxGeometry args={[0.26, 0.26, 0.03]} /><M c={i < 3 ? RED : BONE2} /></mesh>
        <mesh position={[0.25, 0, 0]}><boxGeometry args={[1.0, 0.07, 0.01]} /><M c={BONE2} /></mesh>
      </group>
    ))}
  </group>
);

const KINDS = { podium: Podium, "card-flow": CardFlow, clipboard: Clipboard, "cage-inbox": CageInbox, "invoice-coins": InvoiceCoins, "gear-button": GearButton, "bell-log": BellLog, blueprint: Blueprint };
export type IlloKind = keyof typeof KINDS;

export const Illo: React.FC<{ kind: IlloKind }> = ({ kind }) => {
  const Scene = KINDS[kind] ?? CageInbox;
  return (
    <AbsoluteFill>
      <ThreeCanvas width={900} height={900} camera={{ position: [0, 0.4, 6], fov: 38 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[-3, 5, 4]} intensity={2.2} color="#fff3e0" />
        <directionalLight position={[4, -1, -3]} intensity={0.8} color={RED} />
        <Scene />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
