"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useReducedMotion as useInternalReducedMotion } from "framer-motion"

type MotionContextType = {
  shouldReduceMotion: boolean
}

const MotionContext = createContext<MotionContextType>({
  shouldReduceMotion: false,
})

export const useMotionSettings = () => useContext(MotionContext)

export const MotionProvider = ({ children }: { children: React.ReactNode }) => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const prefersReduced = useInternalReducedMotion()

  useEffect(() => {
    setShouldReduceMotion(!!prefersReduced)
  }, [prefersReduced])

  return (
    <MotionContext.Provider value={{ shouldReduceMotion }}>
      {children}
    </MotionContext.Provider>
  )
}

export const MotionBox = ({ 
  children, 
  animate = true,
  className 
}: { 
  children: React.ReactNode, 
  animate?: boolean,
  className?: string
}) => {
  const { shouldReduceMotion } = useMotionSettings()
  
  if (shouldReduceMotion || !animate) {
    return <div className={className}>{children}</div>
  }

  return <>{children}</>
}
