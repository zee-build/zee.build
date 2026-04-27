"use client";

import { ReactNode } from "react";
import { WallpaperType } from "@/components/os/ShaderWallpaper";

interface TweaksPanelProps {
  accentMode: string;
  setAccent: (v: string) => void;
  wallpaperType: WallpaperType;
  setWallpaperType: (v: WallpaperType) => void;
  particleDensity: number;
  setParticleDensity: (v: number) => void;
  showCursor: boolean;
  setShowCursor: (v: boolean) => void;
  onReplayBoot: () => void;
  onOpenAll: () => void;
  onCloseAll: () => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{label}</span>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 999, border: "none",
        background: value ? "var(--accent)" : "var(--panel-3)",
        position: "relative", transition: "background 0.2s", cursor: "none",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: value ? 18 : 3, width: 14, height: 14,
        borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

function Seg({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", background: "var(--panel-3)", borderRadius: 999, padding: 3, gap: 2 }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "4px 12px", borderRadius: 999, border: "none",
            fontSize: 11, cursor: "none",
            background: value === o.value ? "var(--panel-2)" : "transparent",
            color: value === o.value ? "var(--text)" : "var(--text-dim)",
            transition: "all 0.15s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", padding: "8px 14px",
        background: "var(--panel-3)", border: "1px solid var(--hairline)",
        borderRadius: 999, color: "var(--text)", fontSize: 11.5,
        textAlign: "left", cursor: "none",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--panel-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--panel-3)")}
    >
      {label}
    </button>
  );
}

const WALLPAPER_OPTIONS: { value: WallpaperType; label: string }[] = [
  { value: "aurora",    label: "Aurora" },
  { value: "chrome",   label: "Chrome" },
  { value: "grid",     label: "Grid" },
  { value: "mesh",     label: "Mesh" },
  { value: "cells",    label: "Cells" },
  { value: "particles",label: "Particles" },
];

export default function TweaksPanel({
  accentMode, setAccent,
  wallpaperType, setWallpaperType,
  particleDensity, setParticleDensity,
  showCursor, setShowCursor,
  onReplayBoot, onOpenAll, onCloseAll,
}: TweaksPanelProps) {
  return (
    <div style={{
      position: "fixed", right: 16, bottom: 16, zIndex: 200,
      width: 296, padding: "14px 18px",
      background: "rgba(13,13,16,0.92)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--r-md)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
    }}>
      <div style={{
        fontFamily: "var(--display)", fontStyle: "italic",
        fontSize: 16, color: "var(--text)", marginBottom: 14,
        paddingBottom: 10, borderBottom: "1px solid var(--hairline)",
      }}>
        ZeeBuild OS · Tweaks
      </div>

      <Section label="ACCENT" />
      <Row label="Accent">
        <Seg
          value={accentMode}
          options={[{ value: "orange", label: "Orange" }, { value: "cyan", label: "Cyan" }]}
          onChange={setAccent}
        />
      </Row>

      <Section label="WALLPAPER" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 4 }}>
        {WALLPAPER_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => setWallpaperType(o.value)}
            style={{
              padding: "6px 4px", borderRadius: 8, border: "none",
              fontSize: 10.5, cursor: "none", letterSpacing: "0.04em",
              background: wallpaperType === o.value ? "var(--accent-soft)" : "var(--panel-3)",
              color: wallpaperType === o.value ? "var(--accent)" : "var(--text-dim)",
              outline: wallpaperType === o.value ? "1px solid var(--accent)" : "none",
              transition: "all 0.15s",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      {wallpaperType === "particles" && (
        <Row label={`Density  ${particleDensity}`}>
          <input
            type="range" min={10} max={120} step={10} value={particleDensity}
            onChange={(e) => setParticleDensity(Number(e.target.value))}
            style={{ accentColor: "var(--accent)", width: 120, cursor: "none" }}
          />
        </Row>
      )}

      <Section label="CURSOR" />
      <Row label="Custom cursor">
        <Toggle value={showCursor} onChange={setShowCursor} />
      </Row>

      <Section label="SYSTEM" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        <ActionBtn label="Replay boot sequence" onClick={onReplayBoot} />
        <ActionBtn label="Open all windows" onClick={onOpenAll} />
        <ActionBtn label="Close all" onClick={onCloseAll} />
      </div>
    </div>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div style={{
      fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.18em",
      color: "var(--text-faint)", textTransform: "uppercase",
      padding: "12px 0 6px", borderBottom: "1px solid var(--hairline)", marginBottom: 4,
    }}>
      {label}
    </div>
  );
}
