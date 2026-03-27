'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.25, 0, 0, 1] as const },
  }),
}

type Step2Data = {
  roomType: string[]
  area: string
}

type Props = {
  data: Step2Data
  onChange: (data: Step2Data) => void
  onNext: () => void
  onBack: () => void
  messages: {
    roomType: string; roomTypePlaceholder: string
    roomOptions: Record<string, string>; roomTypeError: string
    area: string; areaPlaceholder: string
  }
  nextLabel: string
  backLabel: string
}

export default function Step2Environment({ data, onChange, onNext, onBack, messages, nextLabel, backLabel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function toggleRoom(key: string) {
    const next = data.roomType.includes(key)
      ? data.roomType.filter(r => r !== key)
      : [...data.roomType, key]
    onChange({ ...data, roomType: next })
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (data.roomType.length === 0) e.roomType = messages.roomTypeError
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const inputClass = 'w-full border border-black/30 bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-black transition-colors duration-200'

  return (
    <div className="flex flex-col gap-6">
      {/* Room type chips */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.roomType} *</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(messages.roomOptions).map(([key, label]) => {
            const selected = data.roomType.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleRoom(key)}
                className={`border px-6 py-3 font-body text-sm uppercase tracking-widest transition-all duration-150 cursor-pointer shadow-sm ${
                  selected
                    ? 'border-walnut bg-walnut text-linen shadow-md'
                    : 'border-black/25 bg-linen text-black hover:border-walnut/60 hover:bg-sand/70 hover:shadow'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {errors.roomType && <p className="mt-2 font-body text-xs text-black/70">{errors.roomType}</p>}
      </motion.div>

      {/* Area */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-black">{messages.area}</label>
        <textarea
          value={data.area}
          onChange={e => onChange({ ...data, area: e.target.value })}
          placeholder={messages.areaPlaceholder}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </motion.div>

      {/* Navigation */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="font-body text-sm text-black hover:text-black/60 transition-colors"
        >
          ← {backLabel}
        </button>
        <motion.button
          type="button"
          onClick={() => { if (validate()) onNext() }}
          className="group flex items-center justify-center gap-3 w-full sm:w-auto bg-walnut text-linen px-10 py-5 font-display italic text-xl border border-walnut/40 border-b-[4px] border-b-[#5c4a35] hover:bg-[#7a6752] active:translate-y-[3px] active:border-b active:border-b-[#5c4a35] transition-all duration-150 cursor-pointer"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
        >
          {nextLabel}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
