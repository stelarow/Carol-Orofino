'use client'

import { motion } from 'framer-motion'

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.25, 0, 0, 1] as const },
  }),
}

const STYLE_PHOTOS: Record<string, string> = {
  minimalista:   'photo-1741394546743-2d64519ba0d3',
  industrial:    'photo-1759264244827-1dde5bee00a5',
  escandinavo:   'photo-1631679706909-1844bbd07221',
  classico:      'photo-1638284457192-27d3d0ec51aa',
  moderno:       'photo-1704040686428-7534b262d0d8',
  boho:          'photo-1633505899118-4ca6bd143043',
  japandi:       'photo-1604578762246-41134e37f9cc',
  rustico:       'photo-1726090401458-7abb00f7450c',
  contemporaneo: 'photo-1594873604892-b599f847e859',
  provencal:     'photo-1756358789192-c55b1ca45bb9',
}

function stylePhotoUrl(key: string): string | undefined {
  const id = STYLE_PHOTOS[key]
  return id ? `https://images.unsplash.com/${id}?w=400&h=400&fit=contain&q=80` : undefined
}

type Step3Data = { styles: string[]; mustHave: string }

type Props = {
  data: Step3Data
  onChange: (data: Step3Data) => void
  onNext: () => void
  onBack: () => void
  messages: {
    styles: string
    styleOptions: Record<string, string>
    mustHave: string; mustHavePlaceholder: string; mustHaveHint: string
  }
  nextLabel: string
  backLabel: string
}

export default function Step3Style({ data, onChange, onNext, onBack, messages, nextLabel, backLabel }: Props) {
  function toggleStyle(key: string) {
    const next = data.styles.includes(key)
      ? data.styles.filter(s => s !== key)
      : [...data.styles, key]
    onChange({ ...data, styles: next })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Style image cards */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.styles}</p>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(messages.styleOptions).map(([key, label]) => {
            const selected = data.styles.includes(key)
            const photoUrl = stylePhotoUrl(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleStyle(key)}
                className={`relative aspect-square overflow-hidden border-2 transition-all duration-150 ${
                  selected ? 'border-walnut' : 'border-transparent hover:border-latte'
                }`}
                style={{
                  background: '#e8e0d6',
                  boxShadow: selected ? '0 0 0 1px var(--color-walnut)' : undefined,
                }}
              >
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt={label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                )}
                <span
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 font-body text-[0.6rem] uppercase tracking-[0.12em] font-bold text-white"
                  style={{ background: selected ? 'rgba(139,111,94,0.85)' : 'rgba(0,0,0,0.50)' }}
                >
                  {label}
                </span>
                {selected && (
                  <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-walnut text-linen text-[0.6rem] font-bold">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Must have textarea */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.mustHave}</label>
        <textarea
          value={data.mustHave}
          onChange={e => onChange({ ...data, mustHave: e.target.value.slice(0, 500) })}
          placeholder={messages.mustHavePlaceholder}
          rows={4}
          className="w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-walnut transition-colors duration-200 resize-none"
        />
        <p className="mt-1 font-body text-xs text-slate">{data.mustHave.length}/500 — {messages.mustHaveHint}</p>
      </motion.div>

      {/* Navigation */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="font-body text-sm text-slate hover:text-walnut transition-colors"
        >
          ← {backLabel}
        </button>
        <motion.button
          type="button"
          onClick={onNext}
          className="bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {nextLabel}
        </motion.button>
      </motion.div>
    </div>
  )
}
