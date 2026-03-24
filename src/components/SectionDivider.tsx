'use client'

import { motion } from 'framer-motion'

interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.15 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}
      className={`flex justify-center py-8 ${className ?? ''}`}
    >
      <span className="block h-px w-44 bg-gradient-to-r from-transparent via-walnut to-transparent" />
    </motion.div>
  )
}
