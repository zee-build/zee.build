"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Heart, 
  Share2, 
  MessageCircle,
  AlertTriangle,
  ShieldCheck,
  Zap,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const mockListingData = {
  id: "1",
  title: "2021 Yamaha YZF-R6 - Race Ready (Low Miles)",
  price: "$11,500",
  location: "Los Angeles, CA",
  source: "Facebook" as const,
  timeAgo: "2 hours ago",
  seller: "Alex R.",
  sellerRating: "4.9/5",
  description: "Selling my 2021 Yamaha R6. Never dropped, garage kept its whole life. Has full Akrapovic exhaust system, dyno tuned, quickshifter, and fresh Diablo Supercorsa tires. Title in hand. Only 4,500 miles. Not looking for trades right now.",
  details: {
    Year: "2021",
    Make: "Yamaha",
    Model: "YZF-R6",
    Mileage: "4,500",
    Title: "Clean",
    Condition: "Excellent",
    Color: "Raven Black",
    Engine: "599cc Inline-4"
  },
  images: [
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1614165939020-f71f0bc0c32f?auto=format&fit=crop&q=80&w=1200"
  ]
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

  const nextImage = () => setCurrentImageIdx(prev => Math.min(prev + 1, mockListingData.images.length - 1))
  const prevImage = () => setCurrentImageIdx(prev => Math.max(prev - 1, 0))

  return (
    <div className="space-y-6 pb-20">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/motoscout/listings" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/40 border border-white/5 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back to Feed
        </Link>
        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-card/40 border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-3 rounded-xl bg-card/40 border border-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media & Primary Info */}
        <div className="lg:col-span-8 space-y-8">
          {/* Image Gallery */}
          <div className="rounded-[3rem] bg-card/40 border border-white/5 overflow-hidden relative group">
            <div className="aspect-[16/10] relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={mockListingData.images[currentImageIdx]}
                  alt="Listing image"
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Gallery Controls */}
              <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={prevImage}
                  disabled={currentImageIdx === 0}
                  className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/60 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  disabled={currentImageIdx === mockListingData.images.length - 1}
                  className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/60 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Source Badge */}
              <div className="absolute top-6 left-6">
                <div className={cn(
                  "px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border backdrop-blur-md shadow-2xl",
                  mockListingData.source === "Facebook" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  "bg-primary/10 border-primary/20 text-primary"
                )}>
                  <div className={cn("w-2 h-2 rounded-full", mockListingData.source === "Facebook" ? "bg-blue-400" : "bg-primary")} />
                  {mockListingData.source} Source
                </div>
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {mockListingData.images.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === currentImageIdx ? "w-6 bg-primary" : "w-2 bg-white/30"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="p-8 rounded-[3rem] bg-card/40 border border-white/5 backdrop-blur-md">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Seller's Notes</h3>
            <p className="text-muted-foreground leading-relaxed">
              {mockListingData.description}
            </p>
          </div>

          {/* AI Analysis (Mock feature) */}
          <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                <Zap size={32} className="text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase tracking-tight text-foreground flex items-center gap-2">
                  System Analysis <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-md">BETA</span>
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-foreground/80 font-medium">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-400 mt-0.5" /> 
                    Price is 12% below market average for this mileage.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-400 mt-0.5" /> 
                    Seller highly rated, 4 recent successful sales in California.
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-orange-400 mt-0.5" /> 
                    Aftermarket exhaust mentioned - verify if original is included.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[3rem] bg-card border border-white/5 shadow-2xl sticky top-24">
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tighter leading-tight mb-4">{mockListingData.title}</h1>
              <div className="text-4xl text-primary font-black tracking-tighter mb-6">{mockListingData.price}</div>
              
              <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary/70" /> {mockListingData.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary/70" /> Listed {mockListingData.timeAgo}
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full my-6" />

            {/* Seller Info */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  {mockListingData.seller[0]}
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">{mockListingData.seller}</div>
                  <div className="text-[10px] uppercase font-bold text-primary tracking-widest">{mockListingData.sellerRating} Rating</div>
                </div>
              </div>
              <ShieldCheck size={20} className="text-muted-foreground/30" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(180,255,255,0.2)]">
                View Original Post <ExternalLink size={16} />
              </button>
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-foreground font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                Message Seller <MessageCircle size={16} />
              </button>
            </div>

            <div className="h-px bg-white/5 w-full my-6" />

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(mockListingData.details).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{key}</div>
                  <div className="text-sm font-bold tracking-tight">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
