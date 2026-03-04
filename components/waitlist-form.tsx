"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface WaitlistFormProps {
  className?: string
  title?: string
  description?: string
  compact?: boolean
}

export function WaitlistForm({ 
  className, 
  title = "Join the Waitlist",
  description = "Be the first to know when we launch. No spam, just updates.",
  compact = false
}: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [childAgeMonths, setChildAgeMonths] = useState<string>("")
  const [location, setLocation] = useState("UAE")
  const [company, setCompany] = useState("") // honeypot
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const startedAtRef = useRef<number>(Date.now())

  // Reset startedAt when component mounts
  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  // Generate age options (6-36 months)
  const ageOptions = Array.from({ length: 31 }, (_, i) => i + 6)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Analytics event
    console.log('[ANALYTICS] click_waitlist_cta', { email, location, childAgeMonths })

    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          childAgeMonths: childAgeMonths ? parseInt(childAgeMonths) : undefined,
          location,
          startedAt: startedAtRef.current,
          company, // honeypot
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Success!
      setSuccess(true)
      setShowConfetti(true)
      
      // Analytics event
      console.log('[ANALYTICS] submit_waitlist_success', { email, location, childAgeMonths })

      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)

      // Clear form (except email to show confirmation)
      setChildAgeMonths("")
      setLocation("UAE")

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(errorMessage)
      
      // Analytics event
      console.log('[ANALYTICS] submit_waitlist_error', { error: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        {showConfetti && <Confetti />}
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">You're on the list! ✅</h3>
            <p className="text-muted-foreground mb-4">
              We'll notify you at <span className="font-medium text-foreground">{email}</span> when we launch.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false)
                setEmail("")
                startedAtRef.current = Date.now()
              }}
              className="mt-4"
            >
              Submit Another
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="h-12 px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </div>

        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childAge">Child Age (months)</Label>
            <select
              id="childAge"
              value={childAgeMonths}
              onChange={(e) => setChildAgeMonths(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select age (optional)</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age} months
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="UAE">UAE</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  )
}

// Simple confetti animation
function Confetti() {
  const particles = Array.from({ length: 30 }, (_, i) => i)

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          initial={{
            x: "50%",
            y: "50%",
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            opacity: 0,
            scale: 1,
          }}
          transition={{
            duration: 1 + Math.random(),
            ease: "easeOut",
          }}
          className="absolute"
        >
          <Sparkles
            className="text-primary"
            style={{
              width: 12 + Math.random() * 12,
              height: 12 + Math.random() * 12,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
