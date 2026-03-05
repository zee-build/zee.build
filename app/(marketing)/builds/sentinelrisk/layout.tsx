import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SentinelRisk - Corporate Risk Intelligence | zee.build",
  description: "AI-assisted corporate risk intelligence platform. Analyze corporate risk across portfolios, identify compliance exposure, and monitor financial threats in real time.",
  keywords: ["fintech", "risk analysis", "corporate risk", "compliance", "financial intelligence", "portfolio monitoring"],
  authors: [{ name: "zee.build" }],
  openGraph: {
    title: "SentinelRisk - Corporate Risk Intelligence",
    description: "AI-assisted corporate risk intelligence platform. Join the waitlist for early access.",
    url: "https://zee.build/builds/sentinelrisk",
    siteName: "zee.build",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SentinelRisk - Corporate Risk Intelligence",
    description: "AI-assisted corporate risk intelligence platform. Join the waitlist for early access.",
  },
}

export default function SentinelRiskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
