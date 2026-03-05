"use client"

import Link from "next/link";
import { Terminal } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-6 inset-x-0 z-[100] px-4 pointer-events-none">
      <div className="container mx-auto">
        <div className="flex justify-between items-center bg-background/40 backdrop-blur-xl border border-border rounded-full px-6 py-2 shadow-2xl pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Terminal size={14} className="text-primary" />
            </div>
            <span className="text-base font-bold tracking-tighter">zee.build</span>
          </Link>
          
          <div className="flex items-center">
            {/* Primary Nav Pill */}
            <div className="flex items-center gap-1 md:gap-4 bg-card/40 rounded-full p-1 border border-border backdrop-blur-md">
              <Link
                href="/builds"
                className="px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
              >
                Builds
              </Link>
              <Link
                href="/about"
                className="px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
              >
                About
              </Link>
              <div className="w-px h-3 bg-border mx-1 hidden md:block" />
              <div className="hidden md:flex items-center gap-3 px-4 text-[9px] font-mono group/status cursor-crosshair">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-lab-cyan animate-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-lab-cyan animate-ping opacity-40" />
                </div>
                <span className="text-muted-foreground/60 group-hover/status:text-lab-cyan transition-colors tracking-[0.2em]">LAB_SYNC: OK</span>
              </div>
            </div>
            
            {/* Theme Toggle - Offset with margin and glow */}
            <div className="ml-3 relative group/toggle">
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-500" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
