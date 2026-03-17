'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedHeroProps {
  words?: string[]
}

export function AnimatedHero({ words: customWords }: AnimatedHeroProps) {
  const [index, setIndex] = useState(0)
  const words = useMemo(
    () => customWords ?? ['sonhos', 'espaços', 'desenhos', 'histórias', 'ambientes'],
    [customWords]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((i) => (i + 1) % words.length)
    }, 2600)
    return () => clearTimeout(timeout)
  }, [index, words])

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-body text-sm uppercase tracking-[0.35em] text-sage mb-8">
        Design de Interiores
      </p>

      <h1 className="font-display text-6xl md:text-8xl text-text-primary leading-tight tracking-tight">
        Vamos criar
      </h1>

      <div className="relative h-[4.5em] flex items-center justify-center overflow-hidden w-full">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute font-display text-6xl md:text-8xl italic text-primary tracking-tight"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>

      <h1 className="font-display text-6xl md:text-8xl text-text-primary leading-tight tracking-tight">
        juntas
      </h1>
    </div>
  )
}
