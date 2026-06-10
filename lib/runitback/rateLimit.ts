const HOUR_MS = 60 * 60 * 1000

// In-memory per-IP rate limit. Resets on cold start, which is acceptable for
// this low-traffic registration form.
const lastSubmission = new Map<string, number>()

/** Returns true if `ip` is allowed to submit again (i.e. last submission was over an hour ago). */
export function checkRateLimit(ip: string): boolean {
  const last = lastSubmission.get(ip)
  const now = Date.now()
  if (last && now - last < HOUR_MS) return false
  lastSubmission.set(ip, now)
  return true
}
