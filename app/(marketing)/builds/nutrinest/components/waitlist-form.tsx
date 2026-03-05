"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Loader2, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [childAgeMonths, setChildAgeMonths] = useState("")
  const [location, setLocation] = useState("UAE")
  const [company, setCompany] = useState("") // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [startedAt] = useState(Date.now())

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to API route
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          childAgeMonths: childAgeMonths ? parseInt(childAgeMonths) : undefined,
          location,
          startedAt,
          company, // honeypot
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      // Success
      setIsSuccess(true)
      console.log('[Analytics] submit_waitlist_success', { email, childAgeMonths, location })
      
      // Reset form
      setEmail("")
      setChildAgeMonths("")
      setLocation("UAE")
    } catch (err) {
      console.error('[Waitlist] Submission error:', err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="waitlist" className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-primary/20" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Early_Access
            </span>
            <div className="w-10 h-[1px] bg-primary/20" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Join the Waitlist
          </h2>
          <p className="text-muted-foreground">
            Be the first to know when NutriNest launches. Get exclusive early access and a special launch discount.
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="p-8 md:p-12 rounded-3xl border border-border bg-card/40 backdrop-blur-sm"
        >
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">You're on the list!</h3>
              <p className="text-muted-foreground mb-6">
                We'll notify you as soon as NutriNest is ready for early access.
              </p>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                <Mail className="w-3 h-3 mr-2" />
                Check your email for confirmation
              </Badge>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full h-12 px-4 rounded-xl bg-card/60 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              {/* Child Age Field */}
              <div>
                <label htmlFor="childAgeMonths" className="block text-sm font-medium mb-2">
                  Child Age in Months (Optional)
                </label>
                <select
                  id="childAgeMonths"
                  value={childAgeMonths}
                  onChange={(e) => setChildAgeMonths(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-card/60 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="" className="bg-background">Select age</option>
                  {Array.from({ length: 31 }, (_, i) => i + 6).map((age) => (
                    <option key={age} value={age} className="bg-background">
                      {age} months
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Field */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-card/60 border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="UAE" className="bg-background">UAE</option>
                  <option value="Other" className="bg-background">Other</option>
                </select>
              </div>

              {/* Honeypot (hidden) */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. No spam, just product updates.
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
