// src/components/VideoSection.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-lines'

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!videoRef.current) return
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section aria-hidden="true">
      <div className="relative w-full overflow-hidden aspect-video">
        <video
          ref={videoRef}
          src="/videos/carol-reel.mp4"
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover"
          onEnded={() => setEnded(true)}
        />
        {!ended && (
          <span className="absolute bottom-4 right-4 bg-slate px-3 py-1 rounded-sm font-display italic text-white text-sm md:text-base pointer-events-none select-none">
            Carol Orofino
          </span>
        )}
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center px-8"
          >
            <ShaderAnimation />
            <p className="relative z-10 font-display text-5xl md:text-7xl font-light italic text-white text-center drop-shadow-lg">
              Ambientes que revelam quem você é.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
