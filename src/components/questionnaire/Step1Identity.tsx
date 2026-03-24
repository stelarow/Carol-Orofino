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

type Step1Data = { name: string; whatsapp: string; email: string }

type Props = {
  data: Step1Data
  onChange: (data: Step1Data) => void
  onNext: () => void
  messages: {
    name: string; whatsapp: string; email: string
    namePlaceholder: string; whatsappPlaceholder: string; emailPlaceholder: string
    nameError: string; whatsappError: string; emailError: string
  }
  nextLabel: string
}

export default function Step1Identity({ data, onChange, onNext, messages, nextLabel }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({})

  function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits.length ? `(${digits}` : ''
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    return value
  }

  function validate(): boolean {
    const e: typeof errors = {}
    if (data.name.trim().length < 2) e.name = messages.nameError
    const digits = data.whatsapp.replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 13) e.whatsapp = messages.whatsappError
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = messages.emailError
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validate()) onNext()
  }

  const inputClass = 'w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-walnut transition-colors duration-200'

  const fields = [
    {
      label: messages.name,
      error: errors.name,
      input: (
        <input
          type="text"
          value={data.name}
          onChange={e => onChange({ ...data, name: e.target.value })}
          placeholder={messages.namePlaceholder}
          className={inputClass}
        />
      ),
    },
    {
      label: messages.whatsapp,
      error: errors.whatsapp,
      input: (
        <input
          type="text"
          value={data.whatsapp}
          onChange={e => onChange({ ...data, whatsapp: maskPhone(e.target.value) })}
          placeholder={messages.whatsappPlaceholder}
          className={inputClass}
        />
      ),
    },
    {
      label: messages.email,
      error: errors.email,
      input: (
        <input
          type="email"
          value={data.email}
          onChange={e => onChange({ ...data, email: e.target.value })}
          placeholder={messages.emailPlaceholder}
          className={inputClass}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field, i) => (
        <motion.div key={i} custom={i} variants={fieldVariants} initial="hidden" animate="visible">
          <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{field.label} *</label>
          {field.input}
          {field.error && <p className="mt-1 font-body text-xs text-walnut/80">{field.error}</p>}
        </motion.div>
      ))}

      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
        <motion.button
          type="button"
          onClick={handleNext}
          className="mt-2 bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {nextLabel}
        </motion.button>
      </motion.div>
    </div>
  )
}
