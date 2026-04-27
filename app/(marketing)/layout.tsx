import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/ui/motion-wrapper";
import { InteractiveGrid } from "@/components/ui/interactive-grid";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <InteractiveGrid />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </MotionProvider>
    </ThemeProvider>
  );
}
