import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/ui/motion-wrapper";
import { InteractiveGrid } from "@/components/ui/interactive-grid";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "zee.build - Systems That Ship",
  description: "Automation. SaaS. Experiments. Built in public by Ziyan Bin Anoos Hilal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-black text-foreground selection:bg-primary/30`}>
        <MotionProvider>
          <InteractiveGrid />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
