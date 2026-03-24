# Questionnaire Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar visualmente os 6 componentes do questionário aplicando a paleta 60-30-10, eliminando classes Tailwind genéricas (`gray-*`, `red-*`, `bg-slate`) e adicionando animações Framer Motion entre steps e na entrada de campos.

**Architecture:** Substituição de classes CSS + adição de wrappers `motion.*` do Framer Motion. Nenhuma lógica de negócio, validação, props ou estrutura de dados é alterada. `QuestionnaireWizard` recebe estado `direction` e `AnimatePresence` para transições direcionais. Cada step component envolve seus campos em `motion.div` com stagger de entrada.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4 (tokens: `linen`, `sand`, `stone`, `slate`, `latte`, `walnut`), Framer Motion v12, Jest + Testing Library

**Spec:** `docs/superpowers/specs/2026-03-24-questionnaire-redesign.md`

---

## Mapa de Arquivos

| Arquivo | O que muda |
|---|---|
| `jest.setup.ts` | Adicionar mock de Framer Motion para testes |
| `src/components/questionnaire/QuestionnaireWizard.tsx` | `direction` state, `AnimatePresence`, progress bar animada, título `font-display` |
| `src/components/questionnaire/Step1Identity.tsx` | Paleta, `motion.div` por campo, `motion.button` |
| `src/components/questionnaire/Step2Environment.tsx` | Paleta, chips redesenhados, upload, `motion.div` por campo, `motion.button` |
| `src/components/questionnaire/Step3Style.tsx` | Paleta, chips redesenhados, `motion.div` por campo, `motion.button` |
| `src/components/questionnaire/Step4Scope.tsx` | Paleta, radios visuais, select, `motion.div` por grupo, `motion.button` |
| `src/components/questionnaire/SuccessScreen.tsx` | Ícone animado, paleta |

---

## Task 1: Mock do Framer Motion nos testes

**Por quê:** O `QuestionnaireWizard` vai usar `AnimatePresence mode="wait"`. Em jsdom, animações de saída pendentes podem manter conteúdo antigo no DOM, quebrando assertions dos testes existentes. O mock renderiza filhos diretamente, eliminando esse risco.

**Files:**
- Modify: `jest.setup.ts`

- [ ] **Step 1.1: Adicionar mock do framer-motion ao jest.setup.ts**

Abrir `jest.setup.ts` e substituir o conteúdo por:

```ts
import '@testing-library/jest-dom'

// Nota: jest.setup.ts é .ts (não .tsx), então JSX não é válido aqui.
// AnimatePresence usa createElement em vez de fragment JSX.
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const { createElement, Fragment } = require('react') as any
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: unknown }) =>
      createElement(Fragment, null, children),
    motion: new Proxy(
      {},
      {
        get: (_: unknown, tag: string) => {
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
          const { forwardRef } = require('react') as any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return forwardRef(({ children, ...props }: any, ref: any) => {
            // Strip framer-motion-only props before passing to DOM element
            const {
              initial, animate, exit, variants, custom, whileHover, whileTap,
              transition, layout, layoutId, onAnimationComplete,
              ...domProps
            } = props
            return createElement(tag, { ...domProps, ref }, children)
          })
        },
      }
    ),
  }
})
```

- [ ] **Step 1.2: Rodar os testes existentes para confirmar que passam**

```bash
cd C:/Carol-Orofino && npx jest --testPathPattern="QuestionnaireWizard|Step1Identity" --no-coverage
```

Resultado esperado: todos os testes passam (sem erros de `matchMedia` ou animação).

- [ ] **Step 1.3: Commitar**

```bash
git add jest.setup.ts
git commit -m "test: mock framer-motion in jest setup for animation-safe tests"
```

---

## Task 2: Refatorar QuestionnaireWizard

**O que muda:** Adicionar `direction` state, reestruturar render em `AnimatePresence` + `motion.div` com variants direcionais, animar barra de progresso com `motion.div scaleX`, corrigir título de `font-heading` para `font-display`.

**Files:**
- Modify: `src/components/questionnaire/QuestionnaireWizard.tsx`

- [ ] **Step 2.1: Rodar testes para ter baseline verde**

```bash
npx jest --testPathPattern="QuestionnaireWizard" --no-coverage
```

Esperado: PASS.

- [ ] **Step 2.2: Reescrever QuestionnaireWizard.tsx**

Substituir o conteúdo do arquivo por:

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitQuestionnaire } from '@/actions/submitQuestionnaire'
import Step1Identity from './Step1Identity'
import Step2Environment from './Step2Environment'
import Step3Style from './Step3Style'
import Step4Scope from './Step4Scope'
import SuccessScreen from './SuccessScreen'

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.30, ease: [0.25, 0, 0, 1] as const } },
  exit: (dir: number) => ({ x: dir * -32, opacity: 0, transition: { duration: 0.20, ease: [0.25, 0, 0, 1] as const } }),
}

type WizardMessages = {
  title: string
  progress: string
  next: string; back: string; submit: string; submitting: string
  errorGeneric: string
  step1: React.ComponentProps<typeof Step1Identity>['messages'] & { title: string }
  step2: React.ComponentProps<typeof Step2Environment>['messages'] & { title: string }
  step3: React.ComponentProps<typeof Step3Style>['messages'] & { title: string }
  step4: React.ComponentProps<typeof Step4Scope>['messages'] & { title: string }
  success: { title: string; message: string }
}

type Props = { messages: WizardMessages }

export default function QuestionnaireWizard({ messages }: Props) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [step1, setStep1] = useState({ name: '', whatsapp: '', email: '' })
  const [step2, setStep2] = useState({ roomType: [] as string[], area: null as number | null, floorPlanFile: null as File | null, photoFiles: [] as File[] })
  const [step3, setStep3] = useState({ styles: [] as string[], mustHave: '' })
  const [step4, setStep4] = useState({ scopeType: '', urgency: '', budget: '' })

  const TOTAL = 4

  function goTo(n: number) {
    setDirection(n > step ? 1 : -1)
    setStep(n)
  }

  const progressLabel = messages.progress
    .replace('{current}', String(step))
    .replace('{total}', String(TOTAL))

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError(null)
    const result = await submitQuestionnaire({ ...step1, ...step2, ...step3, ...step4 })
    setIsSubmitting(false)
    if (result.success) {
      setSubmitted(true)
    } else {
      setSubmitError(result.error)
    }
  }

  if (submitted) {
    return <SuccessScreen title={messages.success.title} message={messages.success.message} />
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress — barra contínua com overlay animado (deliberadamente mais simples que
          os 4 traços do spec para permitir a animação spring do scaleX) */}
      <div className="mb-10">
        <p className="font-display italic text-sm text-walnut mb-3">{progressLabel}</p>
        <div className="relative h-px bg-stone">
          <motion.div
            className="absolute inset-y-0 left-0 bg-walnut origin-left"
            animate={{ scaleX: step / TOTAL }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </div>

      {/* Steps with directional transition — título dentro do motion.div para
          animar junto com o conteúdo do step */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <h2 className="font-display text-4xl font-light tracking-tight mb-10">
            {step === 1 && messages.step1.title}
            {step === 2 && messages.step2.title}
            {step === 3 && messages.step3.title}
            {step === 4 && messages.step4.title}
          </h2>

          {step === 1 && (
            <Step1Identity
              data={step1}
              onChange={setStep1}
              onNext={() => goTo(2)}
              messages={messages.step1}
              nextLabel={messages.next}
            />
          )}
          {step === 2 && (
            <Step2Environment
              data={step2}
              onChange={setStep2}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
              messages={messages.step2}
              nextLabel={messages.next}
              backLabel={messages.back}
            />
          )}
          {step === 3 && (
            <Step3Style
              data={step3}
              onChange={setStep3}
              onNext={() => goTo(4)}
              onBack={() => goTo(2)}
              messages={messages.step3}
              nextLabel={messages.next}
              backLabel={messages.back}
            />
          )}
          {step === 4 && (
            <Step4Scope
              data={step4}
              onChange={setStep4}
              onSubmit={handleSubmit}
              onBack={() => goTo(3)}
              isSubmitting={isSubmitting}
              error={submitError}
              messages={{ ...messages.step4, errorGeneric: messages.errorGeneric }}
              submitLabel={messages.submit}
              submittingLabel={messages.submitting}
              backLabel={messages.back}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2.3: Rodar testes**

```bash
npx jest --testPathPattern="QuestionnaireWizard" --no-coverage
```

Esperado: PASS. O mock do Framer Motion renderiza `AnimatePresence` e `motion.div` como elementos normais.

- [ ] **Step 2.4: Commitar**

```bash
git add src/components/questionnaire/QuestionnaireWizard.tsx
git commit -m "feat(questionnaire): add directional step transitions and animated progress bar"
```

---

## Task 3: Redesign Step1Identity

**O que muda:** Substituir classes `gray-*`, usar paleta (`stone`, `slate`, `walnut`, `linen`), envolver cada campo em `motion.div` com stagger, converter botão em `motion.button`.

**Files:**
- Modify: `src/components/questionnaire/Step1Identity.tsx`

- [ ] **Step 3.1: Rodar testes para baseline**

```bash
npx jest --testPathPattern="Step1Identity" --no-coverage
```

Esperado: PASS.

- [ ] **Step 3.2: Reescrever Step1Identity.tsx**

```tsx
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
```

- [ ] **Step 3.3: Rodar testes**

```bash
npx jest --testPathPattern="Step1Identity" --no-coverage
```

Esperado: PASS. A lógica de validação não foi alterada.

- [ ] **Step 3.4: Commitar**

```bash
git add src/components/questionnaire/Step1Identity.tsx
git commit -m "feat(questionnaire): redesign Step1 with brand palette and staggered field animation"
```

---

## Task 4: Redesign Step2Environment

**O que muda:** Chips de seleção com `border-walnut bg-walnut/8`, upload com `border-walnut bg-walnut/5`, inputs com paleta, `motion.div` stagger, botões redesenhados.

**Files:**
- Modify: `src/components/questionnaire/Step2Environment.tsx`

- [ ] **Step 4.1: Reescrever Step2Environment.tsx**

```tsx
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

const FLOOR_PLAN_TYPES = ['application/pdf', 'image/png', 'image/jpeg']
const PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/quicktime']
const FLOOR_PLAN_MAX = 10 * 1024 * 1024
const PHOTOS_MAX_TOTAL = 50 * 1024 * 1024

type Step2Data = {
  roomType: string[]
  area: number | null
  floorPlanFile: File | null
  photoFiles: File[]
}

type Props = {
  data: Step2Data
  onChange: (data: Step2Data) => void
  onNext: () => void
  onBack: () => void
  messages: {
    roomType: string; roomTypePlaceholder: string
    roomOptions: Record<string, string>; roomTypeError: string
    area: string; floorPlan: string; floorPlanHint: string
    photos: string; photosHint: string
    fileTooLarge: string; fileInvalidType: string
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

  function handleFloorPlan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file) {
      if (!FLOOR_PLAN_TYPES.includes(file.type)) {
        setErrors(prev => ({ ...prev, floorPlan: messages.fileInvalidType }))
        return
      }
      if (file.size > FLOOR_PLAN_MAX) {
        setErrors(prev => ({ ...prev, floorPlan: messages.fileTooLarge }))
        return
      }
      setErrors(prev => { const n = { ...prev }; delete n.floorPlan; return n })
    }
    onChange({ ...data, floorPlanFile: file })
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const invalidType = files.find(f => !PHOTO_TYPES.includes(f.type))
    if (invalidType) {
      setErrors(prev => ({ ...prev, photos: messages.fileInvalidType }))
      return
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0)
    if (totalSize > PHOTOS_MAX_TOTAL) {
      setErrors(prev => ({ ...prev, photos: messages.fileTooLarge }))
      return
    }
    setErrors(prev => { const n = { ...prev }; delete n.photos; return n })
    onChange({ ...data, photoFiles: files })
  }

  const inputClass = 'w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-walnut transition-colors duration-200'

  return (
    <div className="flex flex-col gap-6">
      {/* Room type chips */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.roomType} *</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(messages.roomOptions).map(([key, label]) => {
            const selected = data.roomType.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleRoom(key)}
                className={`border px-6 py-3 font-body text-sm uppercase tracking-widest transition-colors duration-150 ${
                  selected
                    ? 'border-walnut bg-walnut/8 text-walnut'
                    : 'border-stone bg-transparent text-text-primary hover:border-latte'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {errors.roomType && <p className="mt-2 font-body text-xs text-walnut/80">{errors.roomType}</p>}
      </motion.div>

      {/* Area */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.area}</label>
        <input
          type="number"
          min={1}
          max={10000}
          step={1}
          value={data.area ?? ''}
          onChange={e => onChange({ ...data, area: e.target.value ? parseInt(e.target.value) : null })}
          className={inputClass}
        />
      </motion.div>

      {/* Floor plan upload */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.floorPlan}</label>
        <label className={`flex items-center gap-3 cursor-pointer border px-4 py-3 transition-colors duration-150 ${
          data.floorPlanFile ? 'border-walnut bg-walnut/5' : 'border-stone hover:border-latte'
        }`}>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFloorPlan} className="sr-only" />
          <span className={`shrink-0 font-body text-xs uppercase tracking-widest border border-current px-3 py-1 ${data.floorPlanFile ? 'text-walnut' : 'text-slate'}`}>
            {data.floorPlanFile ? '✓' : '↑'}
          </span>
          <span className={`font-body text-sm truncate ${data.floorPlanFile ? 'text-walnut' : 'text-slate/60'}`}>
            {data.floorPlanFile ? data.floorPlanFile.name : messages.floorPlanHint}
          </span>
        </label>
        {errors.floorPlan && <p className="mt-1 font-body text-xs text-walnut/80">{errors.floorPlan}</p>}
      </motion.div>

      {/* Photos upload */}
      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.photos}</label>
        <label className={`flex items-center gap-3 cursor-pointer border px-4 py-3 transition-colors duration-150 ${
          data.photoFiles.length > 0 ? 'border-walnut bg-walnut/5' : 'border-stone hover:border-latte'
        }`}>
          <input type="file" accept=".png,.jpg,.jpeg,.webp,.mp4,.mov" multiple onChange={handlePhotos} className="sr-only" />
          <span className={`shrink-0 font-body text-xs uppercase tracking-widest border border-current px-3 py-1 ${data.photoFiles.length > 0 ? 'text-walnut' : 'text-slate'}`}>
            {data.photoFiles.length > 0 ? '✓' : '↑'}
          </span>
          <span className={`font-body text-sm truncate ${data.photoFiles.length > 0 ? 'text-walnut' : 'text-slate/60'}`}>
            {data.photoFiles.length > 0
              ? `${data.photoFiles.length} arquivo${data.photoFiles.length > 1 ? 's' : ''} selecionado${data.photoFiles.length > 1 ? 's' : ''}`
              : messages.photosHint}
          </span>
        </label>
        {errors.photos && <p className="mt-1 font-body text-xs text-walnut/80">{errors.photos}</p>}
      </motion.div>

      {/* Navigation */}
      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          className="font-body text-sm text-slate hover:text-walnut transition-colors"
        >
          ← {backLabel}
        </button>
        <motion.button
          type="button"
          onClick={() => { if (validate()) onNext() }}
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
```

- [ ] **Step 4.2: Rodar todos os testes**

```bash
npx jest --no-coverage
```

Esperado: PASS em todos os arquivos.

- [ ] **Step 4.3: Commitar**

```bash
git add src/components/questionnaire/Step2Environment.tsx
git commit -m "feat(questionnaire): redesign Step2 with brand chips and file upload style"
```

---

## Task 5: Redesign Step3Style

**Files:**
- Modify: `src/components/questionnaire/Step3Style.tsx`

- [ ] **Step 5.1: Reescrever Step3Style.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.25, 0, 0, 1] as const },
  }),
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
      {/* Style chips */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.styles}</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(messages.styleOptions).map(([key, label]) => {
            const selected = data.styles.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleStyle(key)}
                className={`border px-6 py-3 font-body text-sm uppercase tracking-widest transition-colors duration-150 ${
                  selected
                    ? 'border-walnut bg-walnut/8 text-walnut'
                    : 'border-stone bg-transparent text-text-primary hover:border-latte'
                }`}
              >
                {label}
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
```

- [ ] **Step 5.2: Rodar testes**

```bash
npx jest --no-coverage
```

Esperado: PASS.

- [ ] **Step 5.3: Commitar**

```bash
git add src/components/questionnaire/Step3Style.tsx
git commit -m "feat(questionnaire): redesign Step3 with brand chips and staggered animation"
```

---

## Task 6: Redesign Step4Scope

**O que muda:** Radio groups com indicador visual `●` em `text-walnut`, select com paleta, `motion.div` stagger por grupo, botões redesenhados.

**Files:**
- Modify: `src/components/questionnaire/Step4Scope.tsx`

- [ ] **Step 6.1: Reescrever Step4Scope.tsx**

```tsx
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
  onSubmit: () => void
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
    `flex cursor-pointer items-center gap-3 border px-4 py-3 font-body text-sm transition-colors duration-150 ${
      selected
        ? 'border-walnut bg-walnut/8 text-walnut'
        : 'border-stone bg-transparent text-text-primary hover:border-latte'
    }`

  return (
    <div className="flex flex-col gap-6">
      {/* Scope type */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.scopeType} *</p>
        <div className="flex flex-col gap-2">
          {Object.entries(messages.scopeOptions).map(([key, label]) => (
            <label key={key} className={radioClass(data.scopeType === key)}>
              <input type="radio" name="scopeType" value={key} checked={data.scopeType === key} onChange={() => onChange({ ...data, scopeType: key })} className="sr-only" />
              <span className={`text-xs ${data.scopeType === key ? 'text-walnut' : 'text-transparent'}`}>●</span>
              {label}
            </label>
          ))}
        </div>
        {scopeError && <p className="mt-1 font-body text-xs text-walnut/80">{scopeError}</p>}
      </motion.div>

      {/* Urgency */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.urgency}</p>
        <div className="flex flex-col gap-2">
          {Object.entries(messages.urgencyOptions).map(([key, label]) => (
            <label key={key} className={radioClass(data.urgency === key)}>
              <input type="radio" name="urgency" value={key} checked={data.urgency === key} onChange={() => onChange({ ...data, urgency: key })} className="sr-only" />
              <span className={`text-xs ${data.urgency === key ? 'text-walnut' : 'text-transparent'}`}>●</span>
              {label}
            </label>
          ))}
        </div>
      </motion.div>

      {/* Budget select */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.budget}</label>
        <select
          value={data.budget}
          onChange={e => onChange({ ...data, budget: e.target.value })}
          className="w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm focus:outline-none focus:border-walnut transition-colors duration-200"
        >
          <option value="">—</option>
          {Object.entries(messages.budgetOptions).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </motion.div>

      {error && (
        <p className="font-body text-sm text-walnut/80">{messages.errorGeneric}</p>
      )}

      {/* Navigation */}
      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="font-body text-sm text-slate hover:text-walnut transition-colors disabled:opacity-50"
        >
          ← {backLabel}
        </button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150 disabled:opacity-50"
          whileHover={isSubmitting ? {} : { scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </motion.button>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 6.2: Rodar testes**

```bash
npx jest --no-coverage
```

Esperado: PASS.

- [ ] **Step 6.3: Commitar**

```bash
git add src/components/questionnaire/Step4Scope.tsx
git commit -m "feat(questionnaire): redesign Step4 with visual radio indicator and brand palette"
```

---

## Task 7: Redesign SuccessScreen

**Files:**
- Modify: `src/components/questionnaire/SuccessScreen.tsx`

- [ ] **Step 7.1: Reescrever SuccessScreen.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'

// Transitions extraídas como constantes para evitar erro TypeScript com ease array
// (arrays inline inferidos como number[], não tuple [n,n,n,n] como Framer Motion exige)
const titleTransition = { delay: 0.15, duration: 0.35, ease: [0.25, 0, 0, 1] as const }
const messageTransition = { delay: 0.25, duration: 0.35, ease: [0.25, 0, 0, 1] as const }

type Props = { title: string; message: string }

export default function SuccessScreen({ title, message }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
        className="text-4xl text-walnut"
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
        className="font-body text-sm text-slate"
      >
        {message}
      </motion.p>
    </div>
  )
}
```

- [ ] **Step 7.2: Rodar todos os testes**

```bash
npx jest --no-coverage
```

Esperado: PASS em todos os arquivos.

- [ ] **Step 7.3: Verificar build**

```bash
npm run build 2>&1 | tail -20
```

Esperado: sem erros TypeScript ou de compilação.

- [ ] **Step 7.4: Commitar**

```bash
git add src/components/questionnaire/SuccessScreen.tsx
git commit -m "feat(questionnaire): redesign SuccessScreen with animated icon and brand palette"
```

---

## Verificação Final

- [ ] **Step 8.1: Rodar todos os testes**

```bash
npx jest --no-coverage
```

Esperado: todos passam.

- [ ] **Step 8.2: Verificar ausência de classes genéricas**

```bash
grep -r "border-gray\|bg-gray\|text-gray\|hover:bg-gray\|bg-slate\|text-red-\|font-heading\|text-background" src/components/questionnaire/
```

Esperado: nenhuma saída (zero matches).

- [ ] **Step 8.3: Build final**

```bash
npm run build
```

Esperado: compilação sem erros.
