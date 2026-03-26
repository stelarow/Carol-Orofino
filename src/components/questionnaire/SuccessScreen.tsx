'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const titleTransition = { delay: 0.15, duration: 0.35, ease: [0.25, 0, 0, 1] as const }
const messageTransition = { delay: 0.25, duration: 0.35, ease: [0.25, 0, 0, 1] as const }
const buttonTransition = { delay: 0.4, duration: 0.35, ease: [0.25, 0, 0, 1] as const }

type Props = { title: string; message: string; backToHome: string; homeHref: string }

export default function SuccessScreen({ title, message, backToHome, homeHref }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
        className="text-4xl text-black"
      >
        ✦
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={titleTransition}
        className="font-display text-3xl font-light"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={messageTransition}
        className="font-body text-sm text-black/70"
      >
        {message}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={buttonTransition}
        className="mt-4 w-full sm:w-auto"
      >
        <Link
          href={homeHref}
          className="group inline-flex items-center gap-2 font-display italic text-base text-black/50 hover:text-black/80 transition-colors duration-200"
        >
          {backToHome}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </div>
  )
}
