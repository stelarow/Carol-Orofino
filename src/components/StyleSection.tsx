'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Color {
  hex: string
  name: string
}

interface Props {
  img: string
  title: string
  text: string
  colors: Color[]
  reversed?: boolean
}

function labelColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#1A1A1A' : '#FFFFFF'
}

export function StyleSection({ img, title, text, colors, reversed = false }: Props) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      {/* ── Mobile ────────────────────────────────────────────────────── */}
      <section className="md:hidden flex flex-col w-full">
        <div className="flex flex-col items-center text-center px-8 py-8">
          <h2 className="font-display text-4xl text-text-primary tracking-wide leading-tight mb-4">
            {title}
          </h2>
          <p className="font-body text-sm text-dark leading-relaxed">
            {text}
          </p>
        </div>

        <div className="relative w-full aspect-square">
          <Image src={img} alt={title} fill sizes="100vw" className="object-cover object-center" />
        </div>

        <div className="flex flex-row w-full h-20 overflow-hidden">
          {colors.map(({ hex, name }, i) => (
            <motion.div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className="relative h-full cursor-pointer overflow-hidden"
              animate={{ flexGrow: active === i ? 3 : 1 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: hex, flexShrink: 0 }}
            >
              <motion.span
                className="absolute bottom-2 left-0 right-0 text-center font-body text-xs tracking-widest uppercase"
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: labelColor(hex) }}
              >
                {name}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Desktop ───────────────────────────────────────────────────── */}
      <section
        className="hidden md:grid w-full overflow-hidden"
        style={{ gridTemplateColumns: reversed ? '3fr 5fr 4fr' : '4fr 5fr 3fr' }}
      >
        {/* Texto */}
        <div className={`flex flex-col justify-center items-center text-center px-16 ${reversed ? 'order-3' : ''}`}>
          <h2 className="font-display text-4xl text-text-primary tracking-wide leading-tight mb-6">
            {title}
          </h2>
          <p className="font-body text-base text-dark leading-relaxed max-w-xs">
            {text}
          </p>
        </div>

        {/* Imagem */}
        <div className={`relative aspect-square ${reversed ? 'order-2' : ''}`}>
          <Image src={img} alt={title} fill sizes="45vw" className="object-cover object-center" />
        </div>

        {/* Strips animadas */}
        <div className={`flex flex-row overflow-hidden ${reversed ? 'order-1' : ''}`}>
          {colors.map(({ hex, name }, i) => (
            <motion.div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className="relative h-full cursor-pointer overflow-hidden"
              animate={{ flexGrow: active === i ? 3 : 1 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: hex, flexShrink: 0 }}
            >
              <motion.span
                className="absolute inset-0 flex items-center justify-center font-body text-xl tracking-widest uppercase"
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: labelColor(hex), writingMode: 'vertical-lr' }}
              >
                {name}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
