# Upload Zones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two minimal upload rows in `Step2Environment` with drag-and-drop drop zones — a preview box for planta baixa and a thumbnail grid for photos/vídeos.

**Architecture:** All changes are inline in `Step2Environment.tsx`. Zone 1 uses a `floorPlanPreviewUrl` local state for image preview. Zone 2 uses a `photoPreviewUrls` state array for rendering and a synced `photoPreviewUrlsRef` for safe unmount cleanup. Each zone has its own `isDragging` state. No new components or files.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind CSS v4, Lucide React, `@testing-library/react` + Jest for tests.

**Spec:** `docs/superpowers/specs/2026-03-25-upload-zones-design.md`

---

## Files

| Action | Path |
|--------|------|
| Modify | `src/components/questionnaire/Step2Environment.tsx` |
| Create | `src/components/__tests__/Step2Environment.test.tsx` |

---

## Task 1: Write tests for Zone 1 (planta baixa drop zone)

**Files:**
- Create: `src/components/__tests__/Step2Environment.test.tsx`

> Tests come first. The component already exists but these scenarios are new.

- [ ] **Step 1: Create test file with boilerplate**

```tsx
// src/components/__tests__/Step2Environment.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Step2Environment from '../questionnaire/Step2Environment'

// Mock URL APIs (not available in jsdom)
beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
  global.URL.revokeObjectURL = jest.fn()
})

const messages = {
  roomType: 'Ambiente', roomTypePlaceholder: '', roomOptions: { sala: 'Sala' },
  roomTypeError: 'Selecione um ambiente', area: 'Medidas', areaPlaceholder: '',
  floorPlan: 'Planta baixa', floorPlanHint: 'PDF, PNG ou JPG — máx. 10MB',
  photos: 'Fotos ou vídeos', photosHint: 'Múltiplos arquivos — máx. 50MB no total',
  fileTooLarge: 'Arquivo muito grande', fileInvalidType: 'Tipo inválido',
}

const defaultData = {
  roomType: [], area: '', floorPlanFile: null, photoFiles: [],
}

function renderStep(overrides = {}) {
  const onChange = jest.fn()
  const onNext = jest.fn()
  const onBack = jest.fn()
  render(
    <Step2Environment
      data={{ ...defaultData, ...overrides }}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      messages={messages}
      nextLabel="Próximo"
      backLabel="Voltar"
    />
  )
  return { onChange, onNext, onBack }
}
```

- [ ] **Step 2: Add Zone 1 — empty state renders hint text**

```tsx
it('zone 1: shows hint text when no file is selected', () => {
  renderStep()
  expect(screen.getByText('PDF, PNG ou JPG — máx. 10MB')).toBeInTheDocument()
})
```

- [ ] **Step 3: Add Zone 1 — file input accepts click trigger**

```tsx
it('zone 1: hidden file input is present in the DOM', () => {
  renderStep()
  const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
  expect(input).toBeInTheDocument()
})
```

- [ ] **Step 4: Add Zone 1 — invalid type shows error, onChange not called**

```tsx
it('zone 1: shows error for invalid file type', () => {
  const { onChange } = renderStep()
  const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
  const file = new File(['x'], 'doc.gif', { type: 'image/gif' })
  fireEvent.change(input, { target: { files: [file] } })
  expect(screen.getByText('Tipo inválido')).toBeInTheDocument()
  expect(onChange).not.toHaveBeenCalled()
})
```

- [ ] **Step 5: Add Zone 1 — file too large shows error, onChange not called**

```tsx
it('zone 1: shows error for file exceeding 10 MB', () => {
  const { onChange } = renderStep()
  const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
  const bigFile = new File(['x'], 'big.png', { type: 'image/png' })
  // jsdom ignores File content size — must override the property
  Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })
  fireEvent.change(input, { target: { files: [bigFile] } })
  expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
  expect(onChange).not.toHaveBeenCalled()
})
```

- [ ] **Step 6: Add Zone 1 — valid PNG calls onChange and creates one blob URL**

```tsx
it('zone 1: valid PNG calls onChange with the file and creates a blob URL', () => {
  const { onChange } = renderStep()
  const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
  const file = new File(['x'], 'photo.png', { type: 'image/png' })
  fireEvent.change(input, { target: { files: [file] } })
  expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
  expect(URL.createObjectURL).toHaveBeenCalledWith(file)
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ floorPlanFile: file }))
})
```

- [ ] **Step 7: Add Zone 1 — cancelling file picker (files = null) does not wipe existing file**

```tsx
it('zone 1: cancelling the picker does not clear existing floorPlanFile', () => {
  const existingFile = new File(['x'], 'existing.png', { type: 'image/png' })
  const { onChange } = renderStep({ floorPlanFile: existingFile })
  const input = document.querySelector('input[accept=".pdf,.png,.jpg,.jpeg"]') as HTMLInputElement
  // Simulate cancel: files is empty/null
  fireEvent.change(input, { target: { files: [] } })
  // onChange must NOT be called with floorPlanFile: null
  expect(onChange).not.toHaveBeenCalled()
})
```

- [ ] **Step 8: Add Zone 1 — drag-over sets data-dragging attribute**

```tsx
it('zone 1: dragEnter sets data-dragging to true on the drop zone', () => {
  renderStep()
  const zone = screen.getByText('PDF, PNG ou JPG — máx. 10MB')
    .closest('[data-testid="floor-plan-zone"]') as HTMLElement
  fireEvent.dragEnter(zone, { relatedTarget: null })
  expect(zone).toHaveAttribute('data-dragging', 'true')
})
```

- [ ] **Step 9: Run tests — all should fail (component not yet updated)**

```bash
cd "C:/Site carol/carol-orofino" && npx jest src/components/__tests__/Step2Environment.test.tsx --no-coverage 2>&1 | tail -20
```

Expected: test file compiles, tests fail because `data-testid="floor-plan-zone"` and new behavior don't exist yet.

- [ ] **Step 10: Commit test file**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/__tests__/Step2Environment.test.tsx && git commit -m "test: add Step2Environment Zone 1 upload tests (failing)"
```

---

## Task 2: Write tests for Zone 2 (photos/vídeos drop zone)

**Files:**
- Modify: `src/components/__tests__/Step2Environment.test.tsx`

- [ ] **Step 1: Add Zone 2 — empty state renders hint text**

```tsx
it('zone 2: shows hint text when no files are selected', () => {
  renderStep()
  expect(screen.getByText('Múltiplos arquivos — máx. 50MB no total')).toBeInTheDocument()
})
```

- [ ] **Step 2: Add Zone 2 — invalid type shows error**

```tsx
it('zone 2: shows error for invalid file type', () => {
  const { onChange } = renderStep()
  const input = document.querySelector('input[data-testid="photos-input"]') as HTMLInputElement
  const file = new File(['x'], 'audio.mp3', { type: 'audio/mp3' })
  fireEvent.change(input, { target: { files: [file] } })
  expect(screen.getByText('Tipo inválido')).toBeInTheDocument()
  expect(onChange).not.toHaveBeenCalled()
})
```

- [ ] **Step 3: Add Zone 2 — total size exceeded shows error**

```tsx
it('zone 2: shows error when total size exceeds 50 MB', () => {
  const { onChange } = renderStep()
  const input = document.querySelector('input[data-testid="photos-input"]') as HTMLInputElement
  const bigFile = new File(['x'], 'big.jpg', { type: 'image/jpeg' })
  // jsdom ignores content size — override the property
  Object.defineProperty(bigFile, 'size', { value: 51 * 1024 * 1024 })
  fireEvent.change(input, { target: { files: [bigFile] } })
  expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
  expect(onChange).not.toHaveBeenCalled()
})
```

- [ ] **Step 4: Add Zone 2 — valid files call onChange and create blob URLs**

```tsx
it('zone 2: valid files call onChange and create blob URLs for images', () => {
  const { onChange } = renderStep()
  const input = document.querySelector('input[data-testid="photos-input"]') as HTMLInputElement
  const file1 = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
  const file2 = new File(['x'], 'b.png', { type: 'image/png' })
  fireEvent.change(input, { target: { files: [file1, file2] } })
  expect(URL.createObjectURL).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ photoFiles: [file1, file2] }))
})
```

- [ ] **Step 5: Add Zone 2 — append merges existing + new files**

```tsx
it('zone 2: add-more input appends new files to existing selection', () => {
  const existingFile = new File(['x'], 'existing.jpg', { type: 'image/jpeg' })
  const { onChange } = renderStep({ photoFiles: [existingFile] })
  const addMoreInput = document.querySelector('input[data-testid="add-more-input"]') as HTMLInputElement
  const newFile = new File(['x'], 'new.png', { type: 'image/png' })
  fireEvent.change(addMoreInput, { target: { files: [newFile] } })
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ photoFiles: [existingFile, newFile] })
  )
})
```

- [ ] **Step 6: Add Zone 2 — cumulative size check blocks append that exceeds 50 MB**

```tsx
it('zone 2: cumulative size check blocks append exceeding 50 MB', () => {
  const existingFile = new File(['x'], 'existing.jpg', { type: 'image/jpeg' })
  // jsdom ignores content size — override the property
  Object.defineProperty(existingFile, 'size', { value: 40 * 1024 * 1024 })
  const { onChange } = renderStep({ photoFiles: [existingFile] })
  const addMoreInput = document.querySelector('input[data-testid="add-more-input"]') as HTMLInputElement
  const newFile = new File(['x'], 'new.jpg', { type: 'image/jpeg' })
  Object.defineProperty(newFile, 'size', { value: 15 * 1024 * 1024 })
  fireEvent.change(addMoreInput, { target: { files: [newFile] } })
  expect(screen.getByText('Arquivo muito grande')).toBeInTheDocument()
  expect(onChange).not.toHaveBeenCalled()
})
```

- [ ] **Step 7: Run tests — Zone 2 tests should fail**

```bash
cd "C:/Site carol/carol-orofino" && npx jest src/components/__tests__/Step2Environment.test.tsx --no-coverage 2>&1 | tail -20
```

Expected: Zone 2 tests fail (`photos-input` and `add-more-input` data-testids don't exist yet).

- [ ] **Step 8: Commit updated test file**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/__tests__/Step2Environment.test.tsx && git commit -m "test: add Zone 2 photos upload tests (failing)"
```

---

## Task 3: Implement Zone 1 — planta baixa drop zone

**Files:**
- Modify: `src/components/questionnaire/Step2Environment.tsx`

- [ ] **Step 1: Update React import to include `useEffect` and `useRef`**

Find line 3:
```tsx
import { useState } from 'react'
```
Replace with:
```tsx
import { useState, useEffect, useRef } from 'react'
```

- [ ] **Step 2: Add `FileText` to the lucide-react import**

Find the lucide-react import (currently `ArrowUp, X`) and add `FileText`:
```tsx
import { ArrowUp, FileText, Film, ImagePlus, X } from 'lucide-react'
```
(Add `Film` and `ImagePlus` here too — they are needed for Zone 2 in Task 4.)

- [ ] **Step 3: Add Zone 1 state variables after `floorPlanUpload` declaration**

Inside the component function, after the `floorPlanUpload` line, add:
```tsx
const [floorPlanPreviewUrl, setFloorPlanPreviewUrl] = useState<string | null>(null)
// Ref kept in sync with state so the unmount cleanup reads the latest URL (same pattern as Zone 2)
const floorPlanPreviewUrlRef = useRef<string | null>(null)
const [isFloorPlanDragging, setIsFloorPlanDragging] = useState(false)
```

Add a helper function right after:
```tsx
function setFloorPlanUrl(url: string | null) {
  setFloorPlanPreviewUrl(url)
  floorPlanPreviewUrlRef.current = url
}
```

Add an unmount-only cleanup effect:
```tsx
useEffect(() => {
  return () => {
    if (floorPlanPreviewUrlRef.current) URL.revokeObjectURL(floorPlanPreviewUrlRef.current)
  }
}, []) // empty deps: runs only on unmount; reads from ref (always fresh)
```

**Why ref + unmount-only, not `[floorPlanPreviewUrl]` dep effect:** A dep-based effect cleanup fires on every change AND the handler also manually revokes before setting a new URL — that causes a double-revoke. Use manual revoke in handlers + ref-based unmount cleanup instead.

- [ ] **Step 4: Replace the `handleFloorPlan` function**

Replace the existing `handleFloorPlan` function with:
```tsx
function handleFloorPlan(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null
  if (!file) return   // cancelled picker — do not touch existing state
  if (!FLOOR_PLAN_TYPES.includes(file.type)) {
    setErrors(prev => ({ ...prev, floorPlan: messages.fileInvalidType }))
    return
  }
  if (file.size > FLOOR_PLAN_MAX) {
    setErrors(prev => ({ ...prev, floorPlan: messages.fileTooLarge }))
    return
  }
  setErrors(prev => { const n = { ...prev }; delete n.floorPlan; return n })
  // Revoke old URL manually before setting a new one.
  // Do NOT use a dep-based useEffect cleanup alongside this manual revoke — that causes double-revoke.
  if (floorPlanPreviewUrlRef.current) URL.revokeObjectURL(floorPlanPreviewUrlRef.current)
  if (file.type.startsWith('image/')) {
    setFloorPlanUrl(URL.createObjectURL(file))
  } else {
    setFloorPlanUrl(null)
  }
  onChange({ ...data, floorPlanFile: file })
}
```

Key: `return` early when `file` is null — prevents wiping existing selection on picker cancel.

- [ ] **Step 5: Add `removeFloorPlan` handler after `handleFloorPlan`**

```tsx
function removeFloorPlan() {
  if (floorPlanPreviewUrlRef.current) URL.revokeObjectURL(floorPlanPreviewUrlRef.current)
  setFloorPlanUrl(null)
  if (floorPlanUpload.fileInputRef.current) floorPlanUpload.fileInputRef.current.value = ''
  setErrors(prev => { const n = { ...prev }; delete n.floorPlan; return n })
  onChange({ ...data, floorPlanFile: null })
}
```

- [ ] **Step 6: Add `handleFloorPlanDrop` handler after `removeFloorPlan`**

```tsx
function handleFloorPlanDrop(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault()
  e.stopPropagation()
  setIsFloorPlanDragging(false)
  const file = e.dataTransfer.files?.[0]
  if (!file) return
  const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
  handleFloorPlan(fakeEvent)
}
```

- [ ] **Step 7: Replace the floor plan upload JSX block**

Find the `{/* Floor plan upload */}` comment and replace the entire `<motion.div>` block that contains it with:

```tsx
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
      data-testid="floor-plan-zone"
      data-dragging={isFloorPlanDragging ? 'true' : 'false'}
      onClick={floorPlanUpload.handleThumbnailClick}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
      onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsFloorPlanDragging(true) }}
      onDragLeave={(e) => {
        e.preventDefault()
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsFloorPlanDragging(false)
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
          Substituir
        </button>
        <button
          type="button"
          onClick={removeFloorPlan}
          className="border border-linen px-4 py-2 font-body text-xs uppercase tracking-widest text-linen hover:bg-linen/10 transition-colors"
        >
          Remover
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
        className="shrink-0 rounded-full p-1 hover:bg-walnut/10 transition-colors"
      >
        <X className="w-4 h-4 text-walnut" strokeWidth={1.5} />
      </button>
    </div>
  )}

  {errors.floorPlan && <p className="mt-1 font-body text-xs text-walnut/80">{errors.floorPlan}</p>}
</motion.div>
```

- [ ] **Step 8: Run Zone 1 tests**

```bash
cd "C:/Site carol/carol-orofino" && npx jest src/components/__tests__/Step2Environment.test.tsx --no-coverage -t "zone 1" 2>&1 | tail -25
```

Expected: all Zone 1 tests pass.

- [ ] **Step 9: Commit Zone 1 implementation**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/questionnaire/Step2Environment.tsx && git commit -m "feat: replace floor plan upload with drag-and-drop preview zone"
```

---

## Task 4: Implement Zone 2 — photos/vídeos drop zone

**Files:**
- Modify: `src/components/questionnaire/Step2Environment.tsx`

- [ ] **Step 1: Add Zone 2 state, refs, and cleanup**

After the Zone 1 state declarations, add:

```tsx
const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
// Ref kept in sync with photoPreviewUrls so the unmount cleanup reads fresh values
const photoPreviewUrlsRef = useRef<string[]>([])
const [isPhotosDragging, setIsPhotosDragging] = useState(false)
const photosInputRef = useRef<HTMLInputElement>(null)
const addMoreRef = useRef<HTMLInputElement>(null)
```

Add a helper that updates both state and ref together. Place it as a regular function inside the component (not a hook):

```tsx
function setPhotoUrls(updater: (prev: string[]) => string[]) {
  setPhotoPreviewUrls(prev => {
    const next = updater(prev)
    photoPreviewUrlsRef.current = next
    return next
  })
}
```

Add unmount cleanup effect:

```tsx
useEffect(() => {
  return () => {
    photoPreviewUrlsRef.current.forEach(url => { if (url) URL.revokeObjectURL(url) })
  }
}, []) // empty deps: runs cleanup only on unmount; reads from ref (always fresh)
```

- [ ] **Step 2: Replace the `handlePhotos` function**

Note: `data.photoFiles` is read from the prop directly. This is safe here because `handlePhotos` is only ever triggered by user file-picker interactions (never programmatically), so the prop will always reflect the latest committed state from the previous `onChange` call. No ref needed.

```tsx
function handlePhotos(e: React.ChangeEvent<HTMLInputElement>, append = false) {
  const newFiles = Array.from(e.target.files ?? [])
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
    // Revoke old URLs before replacing
    photoPreviewUrls.forEach(url => { if (url) URL.revokeObjectURL(url) })
    setPhotoUrls(() => newUrls)
  }
  onChange({ ...data, photoFiles: merged })
}
```

- [ ] **Step 3: Add `removePhoto` handler after `handlePhotos`**

```tsx
function removePhoto(index: number) {
  const url = photoPreviewUrls[index]
  if (url) URL.revokeObjectURL(url)
  setPhotoUrls(prev => prev.filter((_, i) => i !== index))
  onChange({ ...data, photoFiles: data.photoFiles.filter((_, i) => i !== index) })
}
```

- [ ] **Step 4: Add `handlePhotosDrop` handler after `removePhoto`**

```tsx
function handlePhotosDrop(e: React.DragEvent<HTMLDivElement>) {
  e.preventDefault()
  e.stopPropagation()
  setIsPhotosDragging(false)
  const files = Array.from(e.dataTransfer.files ?? [])
  if (files.length === 0) return
  const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>
  handlePhotos(fakeEvent, false)
}
```

- [ ] **Step 5: Replace the photos upload JSX block**

Find the `{/* Photos upload */}` comment and replace the entire `<motion.div>` block with:

```tsx
{/* Photos upload */}
<motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
  <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.photos}</p>

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
          ? 'border-walnut bg-walnut/5'
          : 'border-stone hover:border-latte'
      }`}
    >
      <ImagePlus className="w-5 h-5 text-slate" strokeWidth={1.5} />
      <span className="font-body text-xs text-slate/60">{messages.photosHint}</span>
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
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-stone/30">
                <Film className="w-5 h-5 text-slate" strokeWidth={1.5} />
                <span className="w-full truncate px-1 text-center font-body text-[10px] text-slate">{file.name}</span>
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
        className="mt-3 font-body text-xs text-slate/70 underline underline-offset-2 hover:text-walnut transition-colors"
      >
        + Adicionar mais
      </button>
    </div>
  )}

  {errors.photos && <p className="mt-1 font-body text-xs text-walnut/80">{errors.photos}</p>}
</motion.div>
```

- [ ] **Step 6: Run all Step2Environment tests**

```bash
cd "C:/Site carol/carol-orofino" && npx jest src/components/__tests__/Step2Environment.test.tsx --no-coverage 2>&1 | tail -30
```

Expected: all tests pass.

- [ ] **Step 7: Run full test suite to check for regressions**

```bash
cd "C:/Site carol/carol-orofino" && npx jest --no-coverage 2>&1 | tail -20
```

Expected: all existing tests still pass.

- [ ] **Step 8: Commit Zone 2 implementation**

```bash
cd "C:/Site carol/carol-orofino" && git add src/components/questionnaire/Step2Environment.tsx && git commit -m "feat: replace photos upload with drag-and-drop zone and thumbnail grid"
```

---

## Task 5: Manual smoke test

- [ ] **Step 1: Start dev server**

```bash
cd "C:/Site carol/carol-orofino" && npm run dev
```

- [ ] **Step 2: Navigate to Step 2 of the questionnaire**

Open `http://localhost:3000/pt`, go to the questionnaire, advance to Step 2 (Ambiente).

- [ ] **Step 3: Zone 1 — click upload PNG**

Click the planta baixa drop zone. Select a PNG. Confirm the image preview fills the box. Hover — confirm "Substituir" and "Remover" buttons appear.

- [ ] **Step 4: Zone 1 — drag and drop JPG**

Drag a JPG onto the planta baixa zone. Confirm drag-over border turns walnut. Drop — confirm preview appears.

- [ ] **Step 5: Zone 1 — upload PDF**

Clear and upload a PDF. Confirm `FileText` icon + filename appear. Click X to remove.

- [ ] **Step 6: Zone 2 — multiple images**

Click the fotos zone. Select 3 images. Confirm 3-column thumbnail grid appears with "Adicionar mais" below.

- [ ] **Step 7: Zone 2 — append**

With 3 images selected, click "+ Adicionar mais". Select 2 more. Confirm grid shows 5 thumbnails.

- [ ] **Step 8: Zone 2 — remove individual**

Click X on one thumbnail. Confirm it is removed without affecting others.

- [ ] **Step 9: Zone 2 — drag and drop**

Clear all, then drag 2 images onto the fotos zone. Confirm they appear in the grid.

- [ ] **Step 10: Validate error states**

Upload a GIF to Zone 1 (expect "Tipo inválido"). Upload a >10 MB file to Zone 1 (expect "Arquivo muito grande"). Confirm errors clear after a valid file is selected.
