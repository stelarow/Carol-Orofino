// src/components/VideoSection.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
        <motion.span
          animate={{ opacity: ended ? 0 : 1 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-0 right-0 bg-slate px-1.5 py-0.5 rounded-sm font-display italic text-white text-sm sm:text-base md:px-6 md:py-3 md:text-5xl pointer-events-none select-none"
        >
          Carol Orofino
        </motion.span>
        {ended && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center px-8"
            style={{
              backgroundImage: 'url(/images/video-end-bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <p className="relative font-display text-5xl md:text-7xl font-light italic text-white text-center drop-shadow-lg">
              Sua essência, em cada detalhe.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
