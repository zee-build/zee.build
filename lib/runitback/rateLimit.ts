// 5 minutes is enough to prevent spam without blocking legitimate re-attempts.
// Admin requests bypass this entirely (checked in the route before calling here).
const WINDOW_MS = 5 * 60 * 1000

const lastSubmission = new Map<string, number>()

/** Returns true if `ip` is allowed to submit (last submission was > WINDOW_MS ago). */
export function checkRateLimit(ip: string): boolean {
  const last = lastSubmission.get(ip)
  const now = Date.now()
  if (last && now - last < WINDOW_MS) return false
  lastSubmission.set(ip, now)
  return true
}
