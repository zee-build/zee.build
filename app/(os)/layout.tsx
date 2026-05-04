import type { Metadata } from "next";
import "./os.css";

export const metadata: Metadata = {
  title: "ZeeBuild OS — Ziyan Bin Anoos",
  description: "Builder. Researcher. FinTech Engineer. Personal OS by Ziyan Bin Anoos.",
};

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
