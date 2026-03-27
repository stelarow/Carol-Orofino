'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { upload } from '@vercel/blob/client'
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
  success: { title: string; message: string; backToHome: string }
}

type UploadStatus = 'idle' | 'uploading' | 'done' | 'failed'
type UploadEntry = { file: File; url: string | null; status: UploadStatus }

type Props = { messages: WizardMessages; locale: string }

export default function QuestionnaireWizard({ messages, locale }: Props) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [step1, setStep1] = useState({ name: '', whatsapp: '', email: '' })
  const [step2, setStep2] = useState({ roomType: [] as string[], area: '' as string, floorPlanFile: null as File | null, photoFiles: [] as File[] })
  const [step3, setStep3] = useState({ styles: [] as string[], mustHave: '' })
  const [step4, setStep4] = useState({ scopeType: '', urgency: '', budget: '' })

  // Tracks upload state per file (keyed by index in the uploads array)
  // Index 0 = floor plan, 1+ = photos
  const uploadsRef = useRef<UploadEntry[]>([])

  const TOTAL = 4

  function goTo(n: number) {
    setDirection(n > step ? 1 : -1)
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function uploadFile(file: File, pathname: string): Promise<string | null> {
    try {
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      return blob.url
    } catch (err) {
      console.error('[QuestionnaireWizard] falha no upload de', pathname, err)
      return null
    }
  }

  function startUploads() {
    const timestamp = Date.now()
    const entries: UploadEntry[] = []

    if (step2.floorPlanFile) {
      const safeName = step2.floorPlanFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      entries.push({ file: step2.floorPlanFile, url: null, status: 'uploading' })
      uploadFile(step2.floorPlanFile, `questionnaire/${timestamp}-${safeName}`).then(url => {
        entries[0].url = url
        entries[0].status = url ? 'done' : 'failed'
      })
    }

    step2.photoFiles.forEach((file, i) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const idx = entries.length
      entries.push({ file, url: null, status: 'uploading' })
      uploadFile(file, `questionnaire/${timestamp}-${i}-${safeName}`).then(url => {
        entries[idx].url = url
        entries[idx].status = url ? 'done' : 'failed'
      })
    })

    uploadsRef.current = entries
  }

  async function retryFailed(): Promise<void> {
    const timestamp = Date.now()
    const retries = uploadsRef.current
      .filter(e => e.status === 'failed' || e.status === 'idle')
      .map(async (entry) => {
        entry.status = 'uploading'
        const safeName = entry.file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const url = await uploadFile(entry.file, `questionnaire/${timestamp}-retry-${safeName}`)
        entry.url = url
        entry.status = url ? 'done' : 'failed'
      })
    await Promise.all(retries)
  }

  const progressLabel = messages.progress
    .replace('{current}', String(step))
    .replace('{total}', String(TOTAL))

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // Retry any uploads that didn't finish or failed
      const hasPending = uploadsRef.current.some(e => e.status !== 'done')
      if (hasPending) {
        await retryFailed()
      }

      const entries = uploadsRef.current
      const hasFloorPlan = step2.floorPlanFile !== null
      const floorPlanUrl = hasFloorPlan ? (entries[0]?.url ?? null) : null
      const photoEntries = hasFloorPlan ? entries.slice(1) : entries
      const photoUrls = photoEntries.map(e => e.url).filter((u): u is string => u !== null)

      const result = await submitQuestionnaire(
        { ...step1, roomType: step2.roomType, area: step2.area, floorPlanUrl, photoUrls, ...step3, ...step4 },
        locale
      )
      setIsSubmitting(false)
      if (result.success) {
        setSubmitted(true)
      } else {
        setSubmitError(result.error)
      }
    } catch {
      setIsSubmitting(false)
      setSubmitError('generic')
    }
  }

  if (submitted) {
    return <SuccessScreen title={messages.success.title} message={messages.success.message} backToHome={messages.success.backToHome} homeHref={`/${locale}`} />
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress — barra contínua com overlay animado (deliberadamente mais simples que
          os 4 traços do spec para permitir a animação spring do scaleX) */}
      <div className="mb-10">
        <p className="font-display italic text-sm text-black mb-3">{progressLabel}</p>
        <div className="relative h-px bg-black/20">
          <motion.div
            className="absolute inset-y-0 left-0 bg-slate origin-left"
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
              onNext={() => { startUploads(); goTo(3) }}
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
