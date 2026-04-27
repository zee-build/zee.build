"use client";

import { useRef, useState, ReactNode } from "react";

interface WindowProps {
  id: string;
  title: string;
  meta: string;
  x: number;
  y: number;
  w: number;
  h: number;
  focused: boolean;
  unfocused: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
  children: ReactNode;
}

export default function Window({
  title, meta, x, y, w, h,
  focused, unfocused, onFocus, onClose, onMin, children,
}: WindowProps) {
  const [pos, setPos] = useState({ x, y });
  const [size, setSize] = useState({ w, h });
  const [maxed, setMaxed] = useState(false);
  const [pre, setPre] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const onDragStart = (e: React.MouseEvent) => {
    if (maxed) return;
    onFocus();
    const startX = e.clientX, startY = e.clientY;
    const sx = pos.x, sy = pos.y;
    const onMove = (ev: MouseEvent) => {
      setPos({ x: sx + (ev.clientX - startX), y: Math.max(30, sy + (ev.clientY - startY)) });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocus();
    const startX = e.clientX, startY = e.clientY;
    const sw = size.w, sh = size.h;
    const onMove = (ev: MouseEvent) => {
      setSize({
        w: Math.max(380, sw + (ev.clientX - startX)),
        h: Math.max(240, sh + (ev.clientY - startY)),
      });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const toggleMax = () => {
    if (maxed) {
      setMaxed(false);
      if (pre) { setPos({ x: pre.x, y: pre.y }); setSize({ w: pre.w, h: pre.h }); }
    } else {
      setPre({ x: pos.x, y: pos.y, w: size.w, h: size.h });
      setMaxed(true);
    }
  };

  const style: React.CSSProperties = maxed
    ? { left: 0, top: 30, width: "100vw", height: "calc(100vh - 30px)" }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h };

  return (
    <div
      className={"win" + (focused ? " focused" : "") + (unfocused ? " unfocused" : "")}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="win-titlebar" onMouseDown={onDragStart} onDoubleClick={toggleMax}>
        <div className="win-controls">
          <button
            className="win-ctrl close"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >×</button>
          <button
            className="win-ctrl min"
            onClick={(e) => { e.stopPropagation(); onMin(); }}
          >−</button>
          <button
            className="win-ctrl max"
            onClick={(e) => { e.stopPropagation(); toggleMax(); }}
          >+</button>
        </div>
        <div className="win-title">
          <span className="accent">[</span>
          <b>{title}</b>
          <span className="accent">]</span>
        </div>
        <div className="win-meta">{meta}</div>
      </div>
      <div className="win-body">{children}</div>
      {!maxed && <div className="win-resize" onMouseDown={onResizeStart} />}
    </div>
  );
}
