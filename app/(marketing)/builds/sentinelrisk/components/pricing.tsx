"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: "499",
    period: "month",
    description: "For small teams getting started with risk intelligence",
    features: [
      "Up to 10 entities",
      "Basic risk scoring",
      "Email alerts",
      "Monthly reports",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "1,499",
    period: "month",
    description: "For growing organizations with complex portfolios",
    features: [
      "Up to 100 entities",
      "Advanced AI risk analysis",
      "Real-time alerts",
      "Custom reports",
      "API access",
      "Priority support",
      "Compliance tracking",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large institutions with enterprise needs",
    features: [
      "Unlimited entities",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "On-premise deployment",
      "24/7 phone support",
    ],
  },
]

export function Pricing() {
  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-primary/20" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Pricing_Model
            </span>
            <div className="w-10 h-[1px] bg-primary/20" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Flexible Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your organization. All plans include 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border-2 bg-card/40 backdrop-blur-sm ${
                tier.popular
                  ? "border-primary/40 shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-xs font-bold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{tier.price === "Custom" ? tier.price : `$${tier.price}`}</span>
                  {tier.period && <span className="text-muted-foreground">/{tier.period}</span>}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const waitlistSection = document.getElementById('waitlist')
                  if (waitlistSection) {
                    waitlistSection.scrollIntoView({ behavior: 'smooth' })
                    console.log('[Analytics] click_waitlist_cta', { source: 'pricing', tier: tier.name, product: 'sentinelrisk' })
                  }
                }}
                className={`w-full h-12 rounded-full font-bold transition-transform hover:scale-105 ${
                  tier.popular
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border border-border bg-card/60"
                }`}
              >
                {tier.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Not Live Yet Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-card/60 border border-border text-center"
        >
          <p className="text-sm font-mono uppercase tracking-widest text-primary mb-2">
            Coming Soon
          </p>
          <p className="text-muted-foreground">
            SentinelRisk is currently in development. Join the waitlist for early access and exclusive launch pricing.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
