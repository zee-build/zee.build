// Low-poly paper-craft globe whose city lights go out one region at a time.
import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Seeded random so the planet looks the same on every render
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

type Palette = { land: string; land2: string; sea: string; on: string; off: string; rim: string };
export const ORANGE_GLOBE: Palette = { land: "#E3D9C3", land2: "#cfc3a9", sea: "#3a3631", on: "#FF8A33", off: "#3a3530", rim: "#FF8A33" };

const Planet: React.FC<{ lightsOffAt: number; lightsOnAt?: number; pal: Palette }> = ({ lightsOffAt, lightsOnAt, pal }) => {
  const frame = useCurrentFrame();
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 4).toNonIndexed();
    const pos = g.attributes.position, colors: number[] = [];
    const sea = new THREE.Color(pal.sea), land = new THREE.Color(pal.land), land2 = new THREE.Color(pal.land2);
    for (let i = 0; i < pos.count; i += 3) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      // Cheap "continents": layered sine noise on the face direction
      const n = Math.sin(x * 4.3 + 1.3) * Math.cos(y * 3.9 + z) + Math.sin(z * 5.1 + x * 2.6) * 0.7 + Math.sin(y * 7.3 + z * 3.1) * 0.4;
      const c = n > 0.45 ? land : n > 0.2 ? land2 : sea;
      for (let k = 0; k < 3; k++) colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [pal]);
  const cities = useMemo(() => {
    const r = rng(42), out: { p: THREE.Vector3; order: number }[] = [];
    while (out.length < 90) {
      const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize();
      const n = Math.sin(v.x * 4.3 + 1.3) * Math.cos(v.y * 3.9 + v.z) + Math.sin(v.z * 5.1 + v.x * 2.6) * 0.7 + Math.sin(v.y * 7.3 + v.z * 3.1) * 0.4;
      if (n > 0.3) out.push({ p: v.multiplyScalar(1.015), order: (Math.atan2(v.z, v.x) + Math.PI) / (2 * Math.PI) });
    }
    return out;
  }, []);
  const spin = frame * 0.006 + 0.6;
  // Lights die in a sweep around the planet over ~1.2 s
  const sweep = (frame - lightsOffAt) / 36;
  return (
    <group rotation={[0.35, spin, 0.08]}>
      <mesh geometry={geo}>
        <meshStandardMaterial vertexColors flatShading roughness={0.9} metalness={0} />
      </mesh>
      {cities.map((c, i) => {
        // Lights return as a faster sweep when lightsOnAt is set
        const on = sweep < c.order || (lightsOnAt !== undefined && (frame - lightsOnAt) / 20 > c.order);
        return (
          <mesh key={i} position={c.p}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshBasicMaterial color={on ? pal.on : pal.off} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Globe: React.FC<{ width: number; height: number; lightsOffAt: number; lightsOnAt?: number; pal?: Palette }> = ({ width, height, lightsOffAt, lightsOnAt, pal = ORANGE_GLOBE }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bob = Math.sin(frame / fps) * 0.03;
  return (
    <ThreeCanvas width={width} height={height} camera={{ position: [0, bob, 3.9], fov: 40 }} gl={{ antialias: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[-3, 3, 4]} intensity={2.2} color="#fff3e0" />
      <directionalLight position={[3, -1, -2]} intensity={0.6} color={pal.rim} />
      <Planet lightsOffAt={lightsOffAt} lightsOnAt={lightsOnAt} pal={pal} />
    </ThreeCanvas>
  );
};
