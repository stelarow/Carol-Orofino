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
    adicionarMais: string
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

  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  // Ref kept in sync with photoPreviewUrls so the unmount cleanup reads fresh values
  const photoPreviewUrlsRef = useRef<string[]>([])
  const [isPhotosDragging, setIsPhotosDragging] = useState(false)
  const photosInputRef = useRef<HTMLInputElement>(null)
  const addMoreRef = useRef<HTMLInputElement>(null)

  function setFloorPlanUrl(url: string | null) {
    setFloorPlanPreviewUrl(url)
    floorPlanPreviewUrlRef.current = url
  }

  function setPhotoUrls(updater: (prev: string[]) => string[]) {
    setPhotoPreviewUrls(prev => {
      const next = updater(prev)
      photoPreviewUrlsRef.current = next
      return next
    })
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

  useEffect(() => {
    return () => {
      photoPreviewUrlsRef.current.forEach(url => { if (url) URL.revokeObjectURL(url) })
    }
  }, []) // empty deps: runs cleanup only on unmount; reads from ref (always fresh)

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

  function processPhotoFiles(newFiles: File[], append: boolean) {
    if (newFiles.length === 0) return
    const invalidType = newFiles.find(f => !PHOTO_TYPES.includes(f.type))
    if (invalidType) {
      setErrors(prev => ({ ...prev, photos: messages.fileInvalidType }))
      return
    }
    const existing = append ? data.photoFiles : []
    const merged = [...existing, ...newFiles]
    const totalSize = merged.reduce((sum, f) => sum + f.size, 0)
    if (totalSize > PHOTOS_MAX_TOTAL) {
      setErrors(prev => ({ ...prev, photos: messages.fileTooLarge }))
      return
    }
    setErrors(prev => { const n = { ...prev }; delete n.photos; return n })
    const newUrls = newFiles.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : '')
    if (append) {
      setPhotoUrls(prev => [...prev, ...newUrls])
    } else {
      // Use ref to avoid stale closure when revoking old URLs
      photoPreviewUrlsRef.current.forEach(url => { if (url) URL.revokeObjectURL(url) })
      setPhotoUrls(() => newUrls)
    }
    onChange({ ...data, photoFiles: merged })
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>, append: boolean) {
    const newFiles = Array.from(e.target.files ?? [])
    processPhotoFiles(newFiles, append)
  }

  function removePhoto(index: number) {
    const url = photoPreviewUrls[index]
    if (url) URL.revokeObjectURL(url)
    setPhotoUrls(prev => prev.filter((_, i) => i !== index))
    onChange({ ...data, photoFiles: data.photoFiles.filter((_, i) => i !== index) })
  }

  function handlePhotosDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsPhotosDragging(false)
    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length === 0) return
    processPhotoFiles(files, false)
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
                className={`border px-6 py-3 font-body text-sm uppercase tracking-widest transition-colors duration-150 ${
                  selected
                    ? 'border-black bg-black/8 text-black'
                    : 'border-black/30 bg-transparent text-black hover:border-black/60'
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

      {/* Floor plan upload */}
      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.floorPlan}</p>

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
                ? 'border-black bg-black/5'
                : 'border-black/30 hover:border-black/60'
            }`}
          >
            <ArrowUp className="w-5 h-5 text-black/70" strokeWidth={1.5} />
            <span className="font-body text-xs text-black/50">{messages.floorPlanHint}</span>
          </div>
        ) : floorPlanPreviewUrl ? (
          <div className="group relative h-40 w-full overflow-hidden border border-black">
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
          <div className="flex h-40 w-full items-center gap-4 border border-black bg-black/5 px-4">
            <FileText className="w-5 h-5 shrink-0 text-black" strokeWidth={1.5} />
            <span className="font-body text-sm text-black truncate flex-1">{data.floorPlanFile.name}</span>
            <button
              type="button"
              onClick={removeFloorPlan}
              className="shrink-0 p-1 hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4 text-black" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {errors.floorPlan && <p className="mt-1 font-body text-xs text-black/70">{errors.floorPlan}</p>}
      </motion.div>

      {/* Photos upload */}
      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.photos}</p>

        {/* Primary hidden input */}
        <input
          ref={photosInputRef}
          data-testid="photos-input"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.mp4,.mov"
          multiple
          className="sr-only"
          onChange={(e) => handlePhotos(e, false)}
        />

        {/* Hidden "add more" input */}
        <input
          ref={addMoreRef}
          data-testid="add-more-input"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.mp4,.mov"
          multiple
          className="sr-only"
          onChange={(e) => handlePhotos(e, true)}
        />

        {data.photoFiles.length === 0 ? (
          <div
            data-testid="photos-zone"
            data-dragging={isPhotosDragging ? 'true' : 'false'}
            onClick={() => photosInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsPhotosDragging(true) }}
            onDragLeave={(e) => {
              e.preventDefault()
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsPhotosDragging(false)
            }}
            onDrop={handlePhotosDrop}
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors duration-150 ${
              isPhotosDragging
                ? 'border-black bg-black/5'
                : 'border-black/30 hover:border-black/60'
            }`}
          >
            <ImagePlus className="w-5 h-5 text-black/70" strokeWidth={1.5} />
            <span className="font-body text-xs text-black/50">{messages.photosHint}</span>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {data.photoFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden">
                  {photoPreviewUrls[index] ? (
                    <img
                      src={photoPreviewUrls[index]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-black/10">
                      <Film className="w-5 h-5 text-black/70" strokeWidth={1.5} />
                      <span className="w-full truncate px-1 text-center font-body text-[10px] text-black/70">{file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 transition-colors hover:bg-black/70"
                  >
                    <X className="h-3 w-3 text-white" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (addMoreRef.current) { addMoreRef.current.value = ''; addMoreRef.current.click() }
              }}
              className="mt-3 font-body text-xs text-black/50 underline underline-offset-2 hover:text-black transition-colors"
            >
              + {messages.adicionarMais}
            </button>
          </div>
        )}

        {errors.photos && <p className="mt-1 font-body text-xs text-black/70">{errors.photos}</p>}
      </motion.div>

      {/* Navigation */}
      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
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
          className="bg-slate text-linen px-10 py-4 font-display italic hover:bg-slate/80 transition-colors duration-150"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        >
          {nextLabel}
        </motion.button>
      </motion.div>
    </div>
  )
}
