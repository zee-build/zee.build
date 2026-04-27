"use client";

import { useEffect, useRef, useState } from "react";
import { ZB_DATA, FAKE_COMMITS, ASCII_LOGO } from "@/lib/os-data";

type HistoryItem =
  | { type: "ascii" }
  | { type: "spacer" }
  | { type: "out"; text: string; cls?: string }
  | { type: "cmd"; text: string }
  | { type: "commit"; c: (typeof FAKE_COMMITS)[0] };

const INITIAL: HistoryItem[] = [
  { type: "ascii" },
  { type: "out", text: "ZeeBuild OS Terminal · zsh 5.9 (arm64-apple-darwin)" },
  { type: "out", text: 'Type "help" for available commands.' },
  { type: "spacer" },
  { type: "out", text: "// Recent activity from github.com/zee-build:", cls: "dim" },
  ...FAKE_COMMITS.map((c) => ({ type: "commit" as const, c })),
  { type: "spacer" },
];

export default function TerminalWindow() {
  const D = ZB_DATA;
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const run = (cmd: string) => {
    const c = cmd.trim();
    const out: HistoryItem[] = [{ type: "cmd", text: c }];

    if (c === "help") {
      out.push({ type: "out", text: "Available commands:" });
      out.push({ type: "out", text: "  whoami       · who am I" });
      out.push({ type: "out", text: "  ls builds    · list all builds" });
      out.push({ type: "out", text: "  cat about    · show bio" });
      out.push({ type: "out", text: "  sudo hire me · attempt elevated access" });
      out.push({ type: "out", text: "  clear        · clear the terminal" });
    } else if (c === "whoami") {
      out.push({ type: "out", text: `${D.identity.name}, Builder.`, cls: "ok" });
    } else if (c === "ls builds" || c === "ls /builds") {
      D.builds.forEach((b) => {
        out.push({ type: "out", text: `  ${b.name.padEnd(18)} ${b.status.toLowerCase()}` });
      });
    } else if (c === "cat about" || c === "cat /about") {
      out.push({ type: "out", text: D.bio });
    } else if (c.startsWith("sudo hire")) {
      out.push({ type: "out", text: "[sudo] password for ziyan: ********", cls: "dim" });
      out.push({ type: "out", text: "Access granted. Mailto opening...", cls: "ok" });
      setTimeout(() => { window.location.href = `mailto:${D.identity.email}`; }, 500);
    } else if (c === "clear") {
      setHistory([]);
      return;
    } else if (c === "") {
      // pass
    } else {
      out.push({ type: "out", text: `zsh: command not found: ${c}`, cls: "err" });
    }

    setHistory((prev) => [...prev, ...out]);
  };

  return (
    <div
      className="terminal"
      ref={bodyRef}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((h, i) => {
        if (h.type === "ascii") return <pre key={i} className="ascii">{ASCII_LOGO}</pre>;
        if (h.type === "spacer") return <div key={i} style={{ height: 8 }} />;
        if (h.type === "commit") return (
          <div key={i} className="line">
            <span className="commit-hash">{h.c.hash}</span>{"  "}
            <span className="dim">{h.c.repo}</span>{"  "}
            {h.c.msg}{"  "}
            <span className="dim">({h.c.t} ago)</span>
          </div>
        );
        if (h.type === "cmd") return (
          <div key={i} className="line">
            <span className="prompt">ziyan@zeebuild</span>
            <span className="dim">:</span>
            <span className="user">~</span>
            <span className="dim">$ </span>
            {h.text}
          </div>
        );
        return (
          <div key={i} className={`line ${h.cls ?? ""}`}>{h.text}</div>
        );
      })}

      <div className="input-line">
        <span className="prompt">ziyan@zeebuild</span>
        <span className="dim">:</span>
        <span className="user">~</span>
        <span className="dim">$&nbsp;</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { run(input); setInput(""); }
          }}
        />
      </div>
    </div>
  );
}
