'use client'

import { useState } from 'react'

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

  const inputClass = 'w-full border border-gray-300 px-4 py-3 font-body text-sm focus:outline-none focus:border-text-primary'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 font-body text-sm uppercase tracking-widest">{messages.roomType} *</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(messages.roomOptions).map(([key, label]) => {
            const selected = data.roomType.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleRoom(key)}
                className={`border px-6 py-3 font-body text-sm uppercase tracking-widest transition-colors ${
                  selected
                    ? 'border-text-primary bg-text-primary text-background'
                    : 'border-gray-300 hover:border-text-primary'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {errors.roomType && <p className="mt-1 font-body text-xs text-red-600">{errors.roomType}</p>}
      </div>

      <div>
        <label className="mb-1 block font-body text-sm uppercase tracking-widest">{messages.area}</label>
        <input
          type="number"
          min={1}
          max={10000}
          step={1}
          value={data.area ?? ''}
          onChange={e => onChange({ ...data, area: e.target.value ? parseInt(e.target.value) : null })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block font-body text-sm uppercase tracking-widest">{messages.floorPlan}</label>
        <label className={`flex items-center gap-3 cursor-pointer border px-4 py-3 transition-colors ${data.floorPlanFile ? 'border-text-primary bg-text-primary/5' : 'border-gray-300 hover:border-text-primary'}`}>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFloorPlan} className="sr-only" />
          <span className="shrink-0 font-body text-xs uppercase tracking-widest border border-current px-3 py-1">
            {data.floorPlanFile ? '✓ Trocar' : '↑ Escolher'}
          </span>
          <span className={`font-body text-sm truncate ${data.floorPlanFile ? 'text-text-primary' : 'text-gray-400'}`}>
            {data.floorPlanFile ? data.floorPlanFile.name : messages.floorPlanHint}
          </span>
        </label>
        {errors.floorPlan && <p className="mt-1 font-body text-xs text-red-600">{errors.floorPlan}</p>}
      </div>

      <div>
        <label className="mb-1 block font-body text-sm uppercase tracking-widest">{messages.photos}</label>
        <label className={`flex items-center gap-3 cursor-pointer border px-4 py-3 transition-colors ${data.photoFiles.length > 0 ? 'border-text-primary bg-text-primary/5' : 'border-gray-300 hover:border-text-primary'}`}>
          <input type="file" accept=".png,.jpg,.jpeg,.webp,.mp4,.mov" multiple onChange={handlePhotos} className="sr-only" />
          <span className="shrink-0 font-body text-xs uppercase tracking-widest border border-current px-3 py-1">
            {data.photoFiles.length > 0 ? '✓ Trocar' : '↑ Escolher'}
          </span>
          <span className={`font-body text-sm truncate ${data.photoFiles.length > 0 ? 'text-text-primary' : 'text-gray-400'}`}>
            {data.photoFiles.length > 0
              ? `${data.photoFiles.length} arquivo${data.photoFiles.length > 1 ? 's' : ''} selecionado${data.photoFiles.length > 1 ? 's' : ''}`
              : messages.photosHint}
          </span>
        </label>
        {errors.photos && <p className="mt-1 font-body text-xs text-red-600">{errors.photos}</p>}
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="border border-gray-300 px-8 py-4 font-body text-sm uppercase tracking-widest transition-colors hover:bg-gray-100">
          {backLabel}
        </button>
        <button type="button" onClick={() => { if (validate()) onNext() }} className="bg-slate border border-white/60 px-10 py-4 font-display font-light italic text-white transition-opacity hover:opacity-80">
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
