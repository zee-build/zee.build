"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LabCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  metadata?: string[]
  href?: string
}

export const LabCard = ({
  children,
  className,
  title,
  subtitle,
  metadata = [],
  href,
}: LabCardProps) => {
  const CardWrapper = href ? "a" : "div"

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "group relative flex flex-col p-6 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden",
        href && "cursor-pointer",
        className
      )}
    >
      {/* Decorative scanline effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Internal metadata HUD */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          {title && (
            <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {metadata.length > 0 && (
          <div className="flex flex-col items-end gap-1">
            {metadata.map((meta, i) => (
              <span key={i} className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
                {meta}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 flex-grow text-muted-foreground/80 leading-relaxed">
        {children}
      </div>

      {href && (
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between group-hover:border-primary/20 transition-colors">
          <span className="text-xs font-mono uppercase tracking-widest group-hover:text-primary">
            Initialize Access
          </span>
          <div className="w-8 h-px bg-white/20 group-hover:bg-primary transition-colors" />
        </div>
      )}

      {/* Bottom corner accent */}
      <div className="absolute bottom-[-10px] right-[-10px] w-5 h-5 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}
