"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const screens = [
  { 
    name: "Intelligent Home Feed", 
    description: "Personalized meal recommendations based on developmental stages and nutritional needs.",
    image: "/builds/nutrinest/screen.png"
  },
  { 
    name: "AI Pantry Search", 
    description: "Scan your kitchen and get instant, budget-friendly meal ideas with what you already have.",
    image: "/builds/nutrinest/screen1.png"
  },
  { 
    name: "Child Nutrition Profile", 
    description: "Track growth benchmarks, texture expansion, and specific nutritional focus areas.",
    image: "/builds/nutrinest/screen2.png"
  },
  { 
    name: "The NutriNest Ecosystem", 
    description: "A complete orchestration layer for toddler nutrition, from discovery to grocery planning.",
    image: "/builds/nutrinest/collage.png"
  },
]

const features = [
  { name: "Smart Discovery", description: "Netflix-style feed for toddler meal ideas" },
  { name: "Precision Nutrition", description: "Age-appropriate developmental benchmarks" },
  { name: "Pantry Mode", description: "Zero-waste cooking based on your inventory" },
  { name: "Weekly Planning", description: "Automated meal schedules & grocery lists" },
  { name: "Allergy Protocols", description: "Hard-coded restriction filters for safety" },
  { name: "Budget Logic", description: "Minimized overhead with smart ingredient reuse" },
]

export function ScreensGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screens.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screens.length) % screens.length)
  }

  return (
    <section id="screens" className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[1px] bg-primary/40" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary font-bold">
              Interface_Preview
            </span>
            <div className="w-10 h-[1px] bg-primary/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Screens Gallery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the NutriNest interface. Click any image to view in full screen.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {screens.slice(0, 3).map((screen, i) => (
            <motion.div
              key={screen.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] cursor-pointer group"
              onClick={() => openModal(i)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
              
              <Image
                src={screen.image}
                alt={screen.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h4 className="text-sm font-bold mb-1">{screen.name}</h4>
                <p className="text-xs text-muted-foreground">{screen.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Captions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">{feature.name}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Zoom Modal with Navigation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 z-50"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/10 z-50"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
            
            {/* Image Container */}
            <motion.div
              key={currentImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full aspect-[9/16] rounded-2xl overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={screens[currentImageIndex].image}
                alt={screens[currentImageIndex].name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-bold mb-1">{screens[currentImageIndex].name}</h3>
                <p className="text-sm text-muted-foreground">{screens[currentImageIndex].description}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  {currentImageIndex + 1} / {screens.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
