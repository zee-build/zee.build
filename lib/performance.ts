/**
 * Performance monitoring utilities for production
 * Tracks Web Vitals and provides debugging info
 */

export const reportWebVitals = (metric: any) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }

  // In production, send to analytics
  // Example: sendToAnalytics(metric)
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Adaptive particle count based on device performance
 */
export const getOptimalParticleCount = (): number => {
  if (typeof window === 'undefined') return 20

  const isMobile = window.innerWidth < 768
  const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false
  
  if (isMobile) return 10
  if (isLowEnd) return 15
  return 20
}

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Request animation frame with fallback
 */
export const requestAnimFrame = (() => {
  if (typeof window === 'undefined') return (callback: FrameRequestCallback) => setTimeout(callback, 16)
  
  return (
    window.requestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      return window.setTimeout(callback, 1000 / 60)
    }
  )
})()

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimFrame = (() => {
  if (typeof window === 'undefined') return (id: number) => clearTimeout(id)
  
  return (
    window.cancelAnimationFrame ||
    function (id: number) {
      clearTimeout(id)
    }
  )
})()
