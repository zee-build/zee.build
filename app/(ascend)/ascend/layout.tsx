import type { Metadata } from "next";
import "@/components/ascend/ascend.css";

export const metadata: Metadata = {
  title: "ASCEND OS — Zee",
  description: "Personal AI Operating System",
  robots: { index: false, follow: false },
};

export default function AscendLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
