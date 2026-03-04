"use client";

import * as React from "react";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export function GooeyTextDemo() {
  return (
    <div className="h-[200px] flex items-center justify-center bg-black/50 rounded-3xl border border-white/5">
      <GooeyText
        texts={["Design", "Engineering", "Is", "Awesome"]}
        morphTime={1}
        cooldownTime={0.25}
        className="font-bold font-mono"
        textClassName="text-4xl md:text-5xl lg:text-6xl text-primary"
      />
    </div>
  );
}
