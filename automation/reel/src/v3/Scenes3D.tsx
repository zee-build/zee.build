// 3D props for EP01: payment cards frozen in mid-air, and an order conveyor that never stops.
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, interpolate } from "remotion";

const CARD_COLORS = ["#EDE6D6", "#2b2825", "#FF8A33", "#cfc3a9", "#3a3631"];
const CARDS = [
  { p: [-1.1, 0.9, 0], r: [0.4, 0.6, 0.2] }, { p: [1.0, 1.2, -0.6], r: [-0.3, -0.5, 0.4] },
  { p: [-0.3, -0.1, 0.4], r: [0.2, 0.3, -0.25] }, { p: [1.2, -0.7, -0.2], r: [0.5, -0.2, 0.1] },
  { p: [-1.2, -1.0, -0.5], r: [-0.4, 0.4, -0.3] },
] as const;

// Cards spin until `freezeAt`, then lock in place with a small overshoot jolt
export const FrozenCards: React.FC<{ width: number; height: number; freezeAt: number }> = ({ width, height, freezeAt }) => {
  const frame = useCurrentFrame();
  const t = Math.min(frame, freezeAt);
  const jolt = frame >= freezeAt ? Math.exp(-(frame - freezeAt) / 4) * Math.sin((frame - freezeAt) * 1.8) * 0.06 : 0;
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 4.4], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 4, 5]} intensity={2} color="#fff3e0" />
      <directionalLight position={[3, -2, 2]} intensity={0.7} color="#FF8A33" />
      {CARDS.map((c, i) => (
        <group key={i} position={[c.p[0], c.p[1] + Math.sin(t / 20 + i) * 0.08, c.p[2]]}
          rotation={[c.r[0] * 0.5 + Math.sin(t / 25 + i) * 0.25 + jolt, c.r[1] * 0.5 + Math.sin(t / 32 + i * 2) * 0.35, c.r[2]]}>
          <mesh>
            <boxGeometry args={[1.6, 1.0, 0.04]} />
            <meshStandardMaterial color={CARD_COLORS[i]} roughness={0.5} metalness={0.15} />
          </mesh>
          {/* chip */}
          <mesh position={[-0.48, 0.12, 0.025]}>
            <boxGeometry args={[0.26, 0.2, 0.01]} />
            <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* stripe */}
          <mesh position={[0, -0.28, 0.025]}>
            <boxGeometry args={[1.3, 0.08, 0.01]} />
            <meshStandardMaterial color={i === 1 ? "#5a544d" : "#1A1714"} />
          </mesh>
        </group>
      ))}
    </ThreeCanvas>
  );
};

// Parcels ride a belt left to right forever; the business keeps shipping with nobody there
export const Conveyor: React.FC<{ width: number; height: number; accent?: string }> = ({ width, height, accent = "#FF8A33" }) => {
  const frame = useCurrentFrame();
  const boxes = Array.from({ length: 6 }, (_, i) => {
    const x = ((frame * 0.035 + i * 0.9) % 5.4) - 2.7;
    const s = interpolate(Math.abs(x), [2.2, 2.7], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, s, i };
  });
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, 1.7, 3.8], fov: 40 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 5, 4]} intensity={2.1} color="#fff3e0" />
      <pointLight position={[0, 1.5, 1]} intensity={6} color={accent} />
      <group rotation={[0, -0.25, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[5.6, 0.18, 1.1]} />
          <meshStandardMaterial color="#2b2825" roughness={0.8} />
        </mesh>
        {Array.from({ length: 14 }, (_, k) => (
          <mesh key={k} position={[((k * 0.4 - frame * 0.035) % 5.6 + 5.6) % 5.6 - 2.8, -0.02, 0]}>
            <boxGeometry args={[0.04, 0.02, 1.05]} />
            <meshStandardMaterial color="#4a443d" />
          </mesh>
        ))}
        {boxes.map(({ x, s, i }) => (
          <group key={i} position={[x, 0.25 * s, 0]} scale={s}>
            <mesh>
              <boxGeometry args={[0.55, 0.45, 0.55]} />
              <meshStandardMaterial color="#cfb58a" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.226, 0]}>
              <boxGeometry args={[0.56, 0.01, 0.12]} />
              <meshStandardMaterial color={accent} />
            </mesh>
          </group>
        ))}
      </group>
    </ThreeCanvas>
  );
};
