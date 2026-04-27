"use client";

import { useEffect, useRef } from "react";

export type WallpaperType = "particles" | "aurora" | "chrome" | "grid" | "mesh" | "cells";

// ── Vertex shader (shared) ────────────────────────────────────────────────────
const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// ── Fragment shaders ──────────────────────────────────────────────────────────

const AURORA = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec2  u_resolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = p * 2.1 + vec2(1.7 + float(i), 9.2 - float(i));
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t  = u_time * 0.12;
    vec2 m   = vec2(u_mouse.x, u_mouse.y);

    // Domain-warp two levels deep
    float q = fbm(uv * 2.5 + t);
    float r = fbm(uv * 2.5 + q + t * 0.7 + vec2(1.7, 9.2));
    float f = fbm(uv * 1.8 + r + m * 0.3);

    // Dark space base
    vec3 col = vec3(0.01, 0.02, 0.06);

    // Deep blue nebula
    col = mix(col, vec3(0.04, 0.08, 0.28), smoothstep(0.05, 0.7, f));
    // Teal wisps
    col = mix(col, vec3(0.04, 0.35, 0.45), smoothstep(0.35, 0.85, f * q));
    // Magenta hot zone
    col = mix(col, vec3(0.75, 0.08, 0.35), smoothstep(0.55, 0.95, f * r));
    // Orange-yellow peak
    col = mix(col, vec3(0.95, 0.55, 0.10), smoothstep(0.72, 1.0, f * q * r));

    // Sparse stars
    float star = hash(floor(uv * 500.0));
    col += pow(star, 220.0) * 1.5;

    // Mouse glow
    float md = length(uv - m);
    col += vec3(1.0, 0.55, 0.1) * exp(-md * 7.0) * 0.35;

    col = pow(clamp(col, 0.0, 1.0), vec3(0.88));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const CHROME = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec2  u_resolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), f.x),
               mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }

  void main() {
    vec2 uv  = gl_FragCoord.xy / u_resolution;
    vec2 asp = vec2(u_resolution.x / u_resolution.y, 1.0);
    float t  = u_time * 0.3;
    vec2 m   = u_mouse;

    // Ripple from mouse
    float d = length((uv - m) * asp);
    float ripple = sin(d * 18.0 - t * 4.0) * exp(-d * 3.5) * 0.08;

    vec2 distorted = uv + ripple;

    // Flowing metal bands
    float band = noise(distorted * vec2(3.0, 1.2) + t * 0.4);
    float band2 = noise(distorted * vec2(1.5, 3.0) + t * 0.25 + vec2(4.3, 1.1));
    float b = band * 0.6 + band2 * 0.4;

    // Silver-blue base
    vec3 silver = vec3(0.55, 0.60, 0.72);
    vec3 dark   = vec3(0.03, 0.04, 0.08);
    vec3 accent = vec3(1.0, 0.55, 0.1);

    vec3 col = mix(dark, silver, b);
    // Orange highlight at mouse
    col = mix(col, accent, exp(-d * 5.0) * 0.6);
    // Specular glint
    float spec = pow(max(0.0, 1.0 - abs(b - 0.65) * 4.0), 8.0);
    col += spec * 0.4;

    col = pow(clamp(col, 0.0, 1.0), vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const GRID = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec2  u_resolution;

  void main() {
    vec2 uv  = gl_FragCoord.xy / u_resolution;
    vec2 asp = vec2(u_resolution.x / u_resolution.y, 1.0);
    float t  = u_time * 0.5;
    vec2 m   = u_mouse;

    // Grid spacing
    float gs = 0.045;

    // Gravity warp: each grid point displaced toward mouse
    vec2 toMouse = (m - uv) * asp;
    float dist   = length(toMouse);
    float pull   = 0.07 / (dist * dist + 0.04);
    vec2 warped  = uv + normalize(toMouse + 0.001) * pull * gs;

    // Breathing offset
    warped += sin(warped * 6.28 + t) * 0.004;

    // Grid lines
    vec2 grid = abs(fract(warped / gs) - 0.5);
    float lineW = 0.04;
    float gx = smoothstep(lineW, 0.0, grid.x);
    float gy = smoothstep(lineW, 0.0, grid.y);
    float line = max(gx, gy);

    // Intersection dots
    float dot_ = gx * gy * 5.0;

    // Color
    vec3 bg   = vec3(0.01, 0.01, 0.03);
    vec3 gridC = mix(vec3(0.7, 0.3, 0.05), vec3(0.0, 0.78, 1.0), smoothstep(0.3, 0.0, dist));
    vec3 col  = bg + gridC * (line * 0.5 + dot_ * 0.4);

    // Cursor halo
    col += vec3(1.0, 0.55, 0.1) * exp(-dist * 4.0) * 0.25;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

const MESH = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec2  u_resolution;

  vec3 blob(vec2 uv, vec2 pos, vec3 color, float radius) {
    float d = length(uv - pos);
    return color * smoothstep(radius, 0.0, d);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.4;
    vec2 m  = u_mouse;

    // 5 animated color nodes
    vec2 p0 = vec2(0.25 + sin(t * 0.7) * 0.15,  0.3 + cos(t * 0.5) * 0.2);
    vec2 p1 = vec2(0.75 + cos(t * 0.6) * 0.15,  0.7 + sin(t * 0.4) * 0.15);
    vec2 p2 = vec2(0.5  + sin(t * 0.5) * 0.2,   0.5 + cos(t * 0.8) * 0.15);
    vec2 p3 = vec2(0.15 + cos(t * 0.9) * 0.12,  0.75 + sin(t * 0.6) * 0.12);
    vec2 p4 = m; // mouse controls one blob

    vec3 col = vec3(0.02, 0.02, 0.05);
    col += blob(uv, p0, vec3(1.0, 0.42, 0.08), 0.38); // orange
    col += blob(uv, p1, vec3(0.0, 0.72, 1.0),  0.35); // cyan
    col += blob(uv, p2, vec3(0.55, 0.1, 0.85), 0.32); // purple
    col += blob(uv, p3, vec3(0.85, 0.1, 0.45), 0.28); // magenta
    col += blob(uv, p4, vec3(0.9, 0.8, 0.2),   0.22); // yellow (mouse)

    // Subtle noise texture
    float n = fract(sin(dot(uv * 200.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += n * 0.015;

    col = pow(clamp(col, 0.0, 1.0), vec3(0.75));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const CELLS = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform vec2  u_resolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  vec2 hash2(vec2 p) {
    return vec2(hash(p), hash(p + vec2(31.4, 71.1)));
  }

  void main() {
    vec2 uv  = gl_FragCoord.xy / u_resolution;
    vec2 asp = vec2(u_resolution.x / u_resolution.y, 1.0);
    float t  = u_time * 0.35;
    vec2 m   = u_mouse;

    // Scale up for voronoi
    vec2 scaled = uv * asp * 6.0;
    vec2 ip = floor(scaled);
    vec2 fp = fract(scaled);

    float minDist  = 10.0;
    float minDist2 = 10.0;
    vec2  minCell  = vec2(0.0);

    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 h2 = hash2(ip + neighbor);
        // Animate cell centers
        vec2 point = neighbor + 0.5 + 0.45 * sin(6.28 * h2 + t * (0.4 + h2.x * 0.3));
        float d = length(point - fp);
        if (d < minDist) {
          minDist2 = minDist;
          minDist  = d;
          minCell  = ip + neighbor;
        } else if (d < minDist2) {
          minDist2 = d;
        }
      }
    }

    // Edge distance
    float edge = minDist2 - minDist;

    // Cell color from hash
    float cellHash = hash(minCell);
    vec3 cellCol = mix(
      vec3(0.8, 0.35, 0.05),
      vec3(0.0, 0.7, 0.9),
      cellHash
    );

    // Dark interior, glowing edges
    vec3 col = cellCol * 0.04; // very dark interior
    col += cellCol * smoothstep(0.08, 0.0, edge) * 1.2; // bright edges
    col += vec3(1.0, 0.8, 0.5) * smoothstep(0.04, 0.0, edge) * 0.6; // white-hot rim

    // Mouse glow
    float md = length(uv - m);
    col += cellCol * exp(-md * 5.0) * 0.4;

    // Pulse on beat
    col *= 0.85 + 0.15 * sin(t * 2.0 + cellHash * 6.28);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

const SHADERS: Record<string, string> = { aurora: AURORA, chrome: CHROME, grid: GRID, mesh: MESH, cells: CELLS };

// ── WebGL helpers ─────────────────────────────────────────────────────────────
function buildProgram(gl: WebGLRenderingContext, fragSrc: string): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Shader link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ShaderWallpaper({ type }: { type: Exclude<WallpaperType, "particles"> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!gl) { console.warn("WebGL not available"); return; }

    const prog = buildProgram(gl, SHADERS[type]);
    if (!prog) return;

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(prog);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRes = gl.getUniformLocation(prog, "u_resolution");

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      gl.viewport(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse: normalized, y-flipped for WebGL
    let mx = 0.5, my = 0.5;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    const start = performance.now();
    let raf: number;
    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (paused) return;
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform2f(uRes, w, h);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [type]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        width: "100vw", height: "100vh",
        display: "block",
      }}
    />
  );
}
