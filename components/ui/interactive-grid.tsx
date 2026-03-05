"use client"

import React, { useEffect, useRef } from "react"

export const InteractiveGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { clientX, clientY } = e
      containerRef.current.style.setProperty("--x", `${clientX}px`)
      containerRef.current.style.setProperty("--y", `${clientY}px`)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-40"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(var(--grid-color), var(--grid-opacity)) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(var(--grid-color), var(--grid-opacity)) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        maskImage: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), black, transparent)`,
        WebkitMaskImage: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), black, transparent)`,
      }}
    />
  )
}
