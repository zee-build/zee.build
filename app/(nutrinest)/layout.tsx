import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NutriNest - AI-Powered Toddler Nutrition Planner",
  description: "Stop guessing what to feed your toddler. Get balanced meal plans, pantry-based suggestions, and nutrition guidance for ages 6-36 months.",
};

export default function NutriNestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
