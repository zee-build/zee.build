import { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "NutriNest - Toddler Nutrition Planner | zee.build",
  description: "Netflix-style meal discovery + pantry mode + weekly meal plans for busy parents. Age-appropriate nutrition for toddlers 6-36 months. UAE-first, budget-friendly, allergy-aware.",
  keywords: ["toddler nutrition", "meal planner", "UAE", "parenting app", "baby food", "nutrition tracking"],
  authors: [{ name: "zee.build" }],
  openGraph: {
    title: "NutriNest - Toddler Nutrition Planner",
    description: "Netflix-style meal discovery for toddlers. Join the waitlist for early access.",
    url: "https://zee.build/builds/nutrinest",
    siteName: "zee.build",
    images: [
      {
        url: "/builds/nutrinest/nutrinest-stitch-collage.png",
        width: 1200,
        height: 630,
        alt: "NutriNest App Screens",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriNest - Toddler Nutrition Planner",
    description: "Netflix-style meal discovery for toddlers. Join the waitlist for early access.",
    images: ["/builds/nutrinest/nutrinest-stitch-collage.png"],
  },
}

export default function NutriNestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
