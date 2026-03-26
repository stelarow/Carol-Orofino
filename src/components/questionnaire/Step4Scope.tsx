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

type Step4Data = { scopeType: string; urgency: string; budget: string }

type Props = {
  data: Step4Data
  onChange: (data: Step4Data) => void
  onSubmit: () => void | Promise<void>
  onBack: () => void
  isSubmitting: boolean
  error: string | null
  messages: {
    scopeType: string; scopeOptions: Record<string, string>; scopeTypeError: string
    urgency: string; urgencyOptions: Record<string, string>
    budget: string; budgetOptions: Record<string, string>
    errorGeneric: string
  }
  submitLabel: string
  submittingLabel: string
  backLabel: string
}

export default function Step4Scope({ data, onChange, onSubmit, onBack, isSubmitting, error, messages, submitLabel, submittingLabel, backLabel }: Props) {
  const [scopeError, setScopeError] = useState('')

  function handleSubmit() {
    if (!data.scopeType) { setScopeError(messages.scopeTypeError); return }
    setScopeError('')
    onSubmit()
  }

  const radioClass = (selected: boolean) =>
    `flex cursor-pointer items-center gap-3 border px-4 py-3 font-body text-sm transition-all duration-150 shadow-sm ${
      selected
        ? 'border-walnut bg-walnut text-linen shadow-md'
        : 'border-black/25 bg-linen text-black hover:border-walnut/60 hover:bg-sand/70 hover:shadow'
    }`

  return (
    <div className="flex flex-col gap-6">
      {/* Scope type */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.scopeType} *</p>
        <div className="flex flex-col gap-2">
          {Object.entries(messages.scopeOptions).map(([key, label]) => (
            <label key={key} className={radioClass(data.scopeType === key)}>
              <input type="radio" name="scopeType" value={key} checked={data.scopeType === key} onChange={() => onChange({ ...data, scopeType: key })} className="sr-only" />
              <span className={`text-xs ${data.scopeType === key ? 'text-linen' : 'text-transparent'}`}>●</span>
              {label}
            </label>
          ))}
        </div>
        {scopeError && <p className="mt-1 font-body text-xs text-black/70">{scopeError}</p>}
      </motion.div>

      {/* Urgency */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.urgency}</p>
        <div className="flex flex-col gap-2">
          {Object.entries(messages.urgencyOptions).map(([key, label]) => (
            <label key={key} className={radioClass(data.urgency === key)}>
              <input type="radio" name="urgency" value={key} checked={data.urgency === key} onChange={() => onChange({ ...data, urgency: key })} className="sr-only" />
              <span className={`text-xs ${data.urgency === key ? 'text-linen' : 'text-transparent'}`}>●</span>
              {label}
            </label>
          ))}
        </div>
      </motion.div>

      {/* Budget select */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-black">{messages.budget}</label>
        <select
          value={data.budget}
          onChange={e => onChange({ ...data, budget: e.target.value })}
          className="w-full border border-black/30 bg-linen/60 px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors duration-200"
        >
          <option value="">—</option>
          {Object.entries(messages.budgetOptions).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </motion.div>

      {error && (
        <p className="font-body text-sm text-black/70">{messages.errorGeneric}</p>
      )}

      {/* Navigation */}
      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="font-body text-sm text-black hover:text-black/60 transition-colors disabled:opacity-50"
        >
          ← {backLabel}
        </button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group flex items-center justify-center gap-3 w-full sm:w-auto bg-walnut text-linen px-10 py-5 font-display italic text-xl border border-walnut/40 border-b-[4px] border-b-[#5c4a35] hover:bg-[#7a6752] active:translate-y-[3px] active:border-b active:border-b-[#5c4a35] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-[4px]"
          whileTap={isSubmitting ? {} : { scale: 0.97 }}
          transition={{ duration: 0.1 }}
        >
          {isSubmitting ? submittingLabel : submitLabel}
          {!isSubmitting && <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">→</span>}
        </motion.button>
      </motion.div>
    </div>
  )
}
