"use client"

import { motion } from "framer-motion"
import { Shield, TrendingUp, FileCheck, AlertTriangle, BarChart3, Lock } from "lucide-react"

const capabilities = [
  {
    icon: Shield,
    title: "Multi-Layer Risk Scoring",
    description: "Proprietary algorithms assess risk across financial, operational, compliance, and reputational dimensions.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Machine learning models forecast risk trends and identify emerging threats before they materialize.",
  },
  {
    icon: FileCheck,
    title: "Compliance Automation",
    description: "Automated tracking of regulatory requirements across jurisdictions with real-time compliance status.",
  },
  {
    icon: AlertTriangle,
    title: "Threshold Monitoring",
    description: "Configurable risk thresholds with instant alerts when exposure levels exceed acceptable limits.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Aggregation",
    description: "Consolidated risk view across multiple entities, subsidiaries, and investment portfolios.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption, role-based access control, and comprehensive audit trails.",
  },
]

export function RiskEngine() {
  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-primary/20" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Core_Technology
            </span>
            <div className="w-10 h-[1px] bg-primary/20" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            The Risk Engine
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered risk intelligence built for modern financial institutions.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, i) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="mb-4 p-3 rounded-xl bg-primary/10 inline-flex group-hover:scale-110 transition-transform">
                <capability.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{capability.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {capability.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Technical Specs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold mb-6 text-center">Technical Specifications</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">&lt;100ms</div>
              <div className="text-sm text-muted-foreground">API Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">SOC 2</div>
              <div className="text-sm text-muted-foreground">Type II Certified</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
