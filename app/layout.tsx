import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/ui/motion-wrapper";
import { InteractiveGrid } from "@/components/ui/interactive-grid";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "zee.build - Systems That Ship",
  description: "Automation. SaaS. Experiments. Built in public by Ziyan Bin Anoos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('zee-build-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased selection:bg-primary/30`}>
        <ThemeProvider>
          <MotionProvider>
            <InteractiveGrid />
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
