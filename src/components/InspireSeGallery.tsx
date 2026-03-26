'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const COLORS = [
  { hex: '#D9D9D9', text: '#1A1A1A' },
  { hex: '#F5F5DC', text: '#1A1A1A' },
  { hex: '#2B2B2B', text: '#FFFFFF' },
  { hex: '#FFFFFF', text: '#1A1A1A' },
  { hex: '#1C2A44', text: '#FFFFFF' },
  { hex: '#EAE0D5', text: '#1A1A1A' },
]

export function InspireSeGallery() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <>
      {/* ── Mobile: texto → imagem → strips animadas ───────────────────── */}
      <section className="md:hidden flex flex-col w-full">
        {/* Texto */}
        <div className="flex flex-col items-center text-center px-8 py-8">
          <h2 className="font-display text-4xl text-text-primary tracking-wide leading-tight mb-4">
            Clássicos
          </h2>
          <p className="font-body text-base text-dark leading-relaxed">
            O estilo clássico valoriza a elegância atemporal, a sofisticação e a harmonia. Baseia-se em peças estruturadas, cortes impecáveis e design equilibrado, sem depender de tendências passageiras. É um estilo que transmite segurança, autoridade e refinamento, priorizando qualidade, durabilidade e versatilidade tanto na moda quanto na decoração.
          </p>
        </div>

        {/* Imagem */}
        <div className="relative w-full h-[280px]">
          <Image
            src="/images/inspire-se/gallery-featured.png"
            alt="Design de Interiores — Carol Orofino"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Strips animadas */}
        <div className="flex flex-row w-full h-20 overflow-hidden">
          {COLORS.map(({ hex, text }, i) => (
            <motion.div
              key={hex}
              onClick={() => setActive(active === i ? null : i)}
              className="relative h-full cursor-pointer overflow-hidden"
              animate={{ flexGrow: active === i ? 3 : 1 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: hex, flexShrink: 0 }}
            >
              <motion.span
                className="absolute bottom-2 left-0 right-0 text-center font-body text-[10px] tracking-widest uppercase"
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: text }}
              >
                {hex}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Desktop: texto | imagem | strips ──────────────────────────── */}
      <section className="hidden md:flex flex-row w-full h-[380px] overflow-hidden">
        {/* Texto */}
        <div className="flex flex-col justify-center items-center text-center px-16 flex-[4] shrink-0">
          <h2 className="font-display text-4xl text-text-primary tracking-wide leading-tight mb-6">
            Clássicos
          </h2>
          <p className="font-body text-base text-dark leading-relaxed max-w-xs">
            O estilo clássico valoriza a elegância atemporal, a sofisticação e a harmonia. Baseia-se em peças estruturadas, cortes impecáveis e design equilibrado, sem depender de tendências passageiras. É um estilo que transmite segurança, autoridade e refinamento, priorizando qualidade, durabilidade e versatilidade tanto na moda quanto na decoração.
          </p>
        </div>

        {/* Imagem */}
        <div className="relative h-full flex-[5]">
          <Image
            src="/images/inspire-se/gallery-featured.png"
            alt="Design de Interiores — Carol Orofino"
            fill
            sizes="45vw"
            className="object-cover object-center"
          />
        </div>

        {/* Strips verticais animadas */}
        <div className="flex flex-row h-full flex-[3] overflow-hidden">
          {COLORS.map(({ hex, text }, i) => (
            <motion.div
              key={hex}
              onClick={() => setActive(active === i ? null : i)}
              className="relative h-full cursor-pointer overflow-hidden"
              animate={{ flexGrow: active === i ? 3 : 1 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              style={{ backgroundColor: hex, flexShrink: 0 }}
            >
              <motion.span
                className="absolute bottom-3 left-0 right-0 text-center font-body text-[10px] tracking-widest uppercase"
                animate={{ opacity: active === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: text }}
              >
                {hex}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
