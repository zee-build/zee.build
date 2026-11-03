import type { Metadata } from "next";
import { DM_Serif_Display, Permanent_Marker } from "next/font/google";

const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-serif" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker" });

export const metadata: Metadata = {
  title: "What If — ZeeBuild",
  description: "The backup plan behind the What If series: the boring automations that keep a business running when everything else stops.",
};

export default function WhatIfLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} ${marker.variable}`}>{children}</div>;
}
