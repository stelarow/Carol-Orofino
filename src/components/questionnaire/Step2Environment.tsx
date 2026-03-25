'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useImageUpload } from '@/components/hooks/use-image-upload'
import { ArrowUp, FileText, Film, ImagePlus, X } from 'lucide-react'

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
  area: string
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
    area: string; areaPlaceholder: string; floorPlan: string; floorPlanHint: string
    photos: string; photosHint: string
    fileTooLarge: string; fileInvalidType: string
    substituir: string; remover: string
  }
  nextLabel: string
  backLabel: string
}

export default function Step2Environment({ data, onChange, onNext, onBack, messages, nextLabel, backLabel }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const floorPlanUpload = useImageUpload({
    onUpload: () => {},
  })

  const [floorPlanPreviewUrl, setFloorPlanPreviewUrl] = useState<string | null>(null)
  // Ref kept in sync with state so the unmount cleanup reads the latest URL (same pattern as Zone 2)
  const floorPlanPreviewUrlRef = useRef<string | null>(null)
  const [isFloorPlanDragging, setIsFloorPlanDragging] = useState(false)
  // Direct DOM ref for the drop zone — lets us set data-dragging synchronously (avoiding React's
  // deferred scheduling for ContinuousEventPriority events like dragenter in React 19).
  const floorPlanZoneRef = useRef<HTMLDivElement | null>(null)

  function setFloorPlanUrl(url: string | null) {
    setFloorPlanPreviewUrl(url)
    floorPlanPreviewUrlRef.current = url
  }

  // Sets dragging state both in React (for className re-render) and directly on the DOM node
  // (synchronously) so that tests observing data-dragging don't depend on React's async flush.
  function setDragging(value: boolean) {
    setIsFloorPlanDragging(value)
    if (floorPlanZoneRef.current) {
      floorPlanZoneRef.current.dataset.dragging = value ? 'true' : 'false'
    }
  }

  useEffect(() => {
    return () => {
      if (floorPlanPreviewUrlRef.current) URL.revokeObjectURL(floorPlanPreviewUrlRef.current)
    }
  }, []) // empty deps: runs only on unmount; reads from ref (always fresh)

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
    if (!file) return   // cancelled picker — do not touch existing state
    processFloorPlanFile(file)
  }

  function removeFloorPlan() {
    if (floorPlanPreviewUrlRef.current) URL.revokeObjectURL(floorPlanPreviewUrlRef.current)
    setFloorPlanUrl(null)
    if (floorPlanUpload.fileInputRef.current) floorPlanUpload.fileInputRef.current.value = ''
    setErrors(prev => { const n = { ...prev }; delete n.floorPlan; return n })
    onChange({ ...data, floorPlanFile: null })
  }

  function processFloorPlanFile(file: File) {
    if (!FLOOR_PLAN_TYPES.includes(file.type)) {
      setErrors(prev => ({ ...prev, floorPlan: messages.fileInvalidType }))
      return
    }
    if (file.size > FLOOR_PLAN_MAX) {
      setErrors(prev => ({ ...prev, floorPlan: messages.fileTooLarge }))
      return
    }
    setErrors(prev => { const n = { ...prev }; delete n.floorPlan; return n })
    if (floorPlanPreviewUrlRef.current) URL.revokeObjectURL(floorPlanPreviewUrlRef.current)
    if (file.type.startsWith('image/')) {
      setFloorPlanUrl(URL.createObjectURL(file))
    } else {
      setFloorPlanUrl(null)
    }
    onChange({ ...data, floorPlanFile: file })
  }

  function handleFloorPlanDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    processFloorPlanFile(file)
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
        <textarea
          value={data.area}
          onChange={e => onChange({ ...data, area: e.target.value })}
          placeholder={messages.areaPlaceholder}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </motion.div>

      {/* Floor plan upload */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.floorPlan}</p>

        {/* Hidden input — opened via hook's handleThumbnailClick */}
        <input
          ref={floorPlanUpload.fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="sr-only"
          onChange={handleFloorPlan}
        />

        {!data.floorPlanFile ? (
          <div
            ref={floorPlanZoneRef}
            data-testid="floor-plan-zone"
            data-dragging={isFloorPlanDragging ? 'true' : 'false'}
            onClick={floorPlanUpload.handleThumbnailClick}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
            onDragLeave={(e) => {
              e.preventDefault()
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
            }}
            onDrop={handleFloorPlanDrop}
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors duration-150 ${
              isFloorPlanDragging
                ? 'border-walnut bg-walnut/5'
                : 'border-stone hover:border-latte'
            }`}
          >
            <ArrowUp className="w-5 h-5 text-slate" strokeWidth={1.5} />
            <span className="font-body text-xs text-slate/60">{messages.floorPlanHint}</span>
          </div>
        ) : floorPlanPreviewUrl ? (
          <div className="group relative h-40 w-full overflow-hidden border border-walnut">
            <img
              src={floorPlanPreviewUrl}
              alt={data.floorPlanFile.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => {
                  if (floorPlanUpload.fileInputRef.current) floorPlanUpload.fileInputRef.current.value = ''
                  floorPlanUpload.handleThumbnailClick()
                }}
                className="border border-linen px-4 py-2 font-body text-xs uppercase tracking-widest text-linen hover:bg-linen/10 transition-colors"
              >
                {messages.substituir}
              </button>
              <button
                type="button"
                onClick={removeFloorPlan}
                className="border border-linen px-4 py-2 font-body text-xs uppercase tracking-widest text-linen hover:bg-linen/10 transition-colors"
              >
                {messages.remover}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-40 w-full items-center gap-4 border border-walnut bg-walnut/5 px-4">
            <FileText className="w-5 h-5 shrink-0 text-walnut" strokeWidth={1.5} />
            <span className="font-body text-sm text-walnut truncate flex-1">{data.floorPlanFile.name}</span>
            <button
              type="button"
              onClick={removeFloorPlan}
              className="shrink-0 p-1 hover:bg-walnut/10 transition-colors"
            >
              <X className="w-4 h-4 text-walnut" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {errors.floorPlan && <p className="mt-1 font-body text-xs text-walnut/80">{errors.floorPlan}</p>}
      </motion.div>

      {/* Photos upload */}
      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.photos}</p>
        <label className={`flex items-center gap-4 cursor-pointer border px-4 py-3 transition-colors duration-150 ${
          data.photoFiles.length > 0 ? 'border-walnut bg-walnut/5' : 'border-stone hover:border-latte group'
        }`}>
          <input type="file" accept=".png,.jpg,.jpeg,.webp,.mp4,.mov" multiple onChange={handlePhotos} className="sr-only" />
          <span className={`shrink-0 flex items-center justify-center w-9 h-9 border transition-colors duration-150 ${
            data.photoFiles.length > 0 ? 'border-walnut' : 'border-stone group-hover:border-latte'
          }`}>
            <ArrowUp className={`w-4 h-4 ${data.photoFiles.length > 0 ? 'text-walnut' : 'text-slate'}`} strokeWidth={1.5} />
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
