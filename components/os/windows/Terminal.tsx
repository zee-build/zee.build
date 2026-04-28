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
  { type: "out", text: "// Fetching live activity from github.com/zee-build...", cls: "dim" },
  { type: "spacer" },
];

export default function TerminalWindow() {
  const D = ZB_DATA;
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Fetch live GitHub commits on mount
  useEffect(() => {
    fetch("/api/github/events")
      .then((r) => r.json())
      .then((data) => {
        const commits = (data.events || []).slice(0, 5);
        if (commits.length > 0) {
          const items: HistoryItem[] = [
            { type: "out", text: "// Live activity from github.com/zee-build:", cls: "dim" },
            ...commits.map((c: any) => ({
              type: "commit" as const,
              c: { hash: c.hash, repo: c.repo, msg: c.msg, t: c.ago },
            })),
            { type: "spacer" },
          ];
          setHistory((prev) => {
            // Replace the "Fetching..." line
            const filtered = prev.filter(
              (h) => !(h.type === "out" && h.text?.includes("Fetching live"))
            );
            return [...filtered, ...items];
          });
        }
      })
      .catch(() => {
        // Fallback to static commits
        setHistory((prev) => [
          ...prev,
          { type: "out", text: "// Using cached activity:", cls: "dim" },
          ...FAKE_COMMITS.slice(0, 5).map((c) => ({ type: "commit" as const, c })),
          { type: "spacer" },
        ]);
      });
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const run = (cmd: string) => {
    const c = cmd.trim();
    const out: HistoryItem[] = [{ type: "cmd", text: c }];

    if (c.startsWith("admin")) {
      const parts = c.split(" ");
      const pass = parts[1] || "";
      const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "zeebuild2026";
      if (pass === adminPass) {
        out.push({ type: "out", text: "[auth] Access granted. Opening admin portal...", cls: "ok" });
        setTimeout(() => { window.open("/admin", "_self"); }, 600);
      } else if (!pass) {
        out.push({ type: "out", text: "Usage: admin <password>", cls: "dim" });
        out.push({ type: "out", text: "Hint: authorized personnel only.", cls: "dim" });
      } else {
        out.push({ type: "out", text: "[auth] Access denied. Invalid credentials.", cls: "err" });
      }
    } else if (c === "help") {
      out.push({ type: "out", text: "Available commands:" });
      out.push({ type: "out", text: "  whoami       · who am I" });
      out.push({ type: "out", text: "  ls builds    · list all builds" });
      out.push({ type: "out", text: "  cat about    · show bio" });
      out.push({ type: "out", text: "  sudo hire me · attempt elevated access" });
      out.push({ type: "out", text: "  admin <pass> · admin portal (restricted)" });
      out.push({ type: "out", text: "  notepad      · open private notepad (requires admin)" });
      out.push({ type: "out", text: "  clear        · clear the terminal" });
    } else if (c === "notepad") {
      const isAdmin = typeof window !== "undefined" && sessionStorage.getItem("zb-admin") === "1";
      if (isAdmin) {
        out.push({ type: "out", text: "Opening notepad...", cls: "ok" });
        // Dispatch custom event to open notepad window
        setTimeout(() => window.dispatchEvent(new CustomEvent("os-open-app", { detail: "notepad" })), 200);
      } else {
        out.push({ type: "out", text: "[auth] Access denied. Run 'admin <pass>' first.", cls: "err" });
      }
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
