# Upload Zones — Design Spec
**Date:** 2026-03-25
**File:** `src/components/questionnaire/Step2Environment.tsx`
**Approach:** Inline update (no new components)

---

## Goal

Replace the two minimal upload rows in Step 2 of the questionnaire with drag-and-drop drop zones that include visual feedback and file previews.

---

## Styling tokens
All styling uses the site's existing tokens: `walnut`, `linen`, `stone`, `slate`, `latte`. `latte` (`#c0af9b`) is a valid CSS custom property defined in the theme — it appears in `globals.css` and is used elsewhere in the questionnaire. No rounded corners on **zone containers or labels** (`rounded-lg` not used). Small circular icon buttons (X, remove) may retain `rounded-full` — this is acceptable for pill-shaped icon buttons. Typography: `font-body text-xs uppercase tracking-[0.2em]` for labels.

---

## Zone 1 — Planta Baixa (single file: PDF/PNG/JPG, max 10 MB)

### Empty state
- Square box (~h-40), dashed border `border-stone`, centered `ArrowUp` icon + hint text.
- Hover: border transitions to `border-latte`.
- Drag-over (`isFloorPlanDragging === true`): border `border-walnut`, background `bg-walnut/5`.

### Selected — image (PNG/JPG)
- Box fills with a regular `<img>` tag using `object-cover`.
- **Preview URL management:** Use a `floorPlanPreviewUrl` local state (`string | null`). The hook's own `previewUrl` return value is **not used** for rendering.
  - On file selected (click path or drag path): `setFloorPlanPreviewUrl(URL.createObjectURL(file))`.
  - On remove: `URL.revokeObjectURL(floorPlanPreviewUrl)`, `setFloorPlanPreviewUrl(null)`, `fileInputRef.current.value = ""`, `onChange({ ...data, floorPlanFile: null })`.
  - `useEffect` cleanup: revoke `floorPlanPreviewUrl` on unmount.
- **Hook usage is reduced to `fileInputRef` and `handleThumbnailClick` only.** Do NOT call `floorPlanUpload.handleFileChange` from the input `onChange` — this avoids a double `URL.createObjectURL` call. Remove the existing `floorPlanUpload.handleFileChange(e)` line in the input's onChange.
- On hover: Tailwind `group`/`group-hover:` classes on the container div control the overlay visibility — no React hover state needed.
  - Overlay: `group-hover:opacity-100` dark overlay (`bg-black/40`).
  - Two centered buttons:
    - "Substituir": resets `fileInputRef.current.value = ""` then calls `handleThumbnailClick()`. Resetting the value first ensures the `onChange` fires even if the same file is selected again.
    - "Remover": runs the remove sequence above.

### Selected — PDF
- Box background `bg-walnut/5`, border `border-walnut`.
- `FileText` icon (Lucide) + truncated filename, X button to remove.

### Validation (unchanged)
- Accepted types: `application/pdf`, `image/png`, `image/jpeg`.
- Max size: 10 MB. Error shown below the zone.
- Drag-and-drop path uses the same type/size checks and sets the same error messages as the existing `handleFloorPlan` onChange path.

---

## Zone 2 — Fotos/Vídeos (multiple files: PNG/JPG/WEBP/MP4/MOV, max 50 MB total)

### Empty state
- Same box style as Zone 1, with `ImagePlus` icon.
- Supports drag-and-drop of multiple files.

### Files selected — layout
- The drop zone is **replaced** by a 3-column thumbnail grid once files are selected.
- Below the grid: "+ Adicionar mais" text button that opens the file picker and **appends** new files to the existing selection.

### Thumbnail grid
- Images: square `object-cover` thumbnail using a blob URL created via `URL.createObjectURL(file)`.
- Videos: gray placeholder square with `Film` icon (Lucide) + truncated filename.
- Each thumbnail has an X button in the top-right corner to remove that file individually from the array.

### Blob URL cleanup (Zone 2)
Blob URLs for thumbnails must be explicitly revoked to prevent memory leaks:
- On individual file removal (X button): call `URL.revokeObjectURL(thumbnailUrl)` for that file before updating the array.
- On component unmount: a `useEffect` cleanup must revoke all current thumbnail blob URLs. The engineer should maintain a parallel array of blob URLs (e.g., `photoPreviewUrls: string[]`) alongside `data.photoFiles` so the cleanup effect has access to them.

### Append behavior
- Merge logic lives at the UI layer, before calling `onChange`. When the file picker returns new files (via the "+ Adicionar mais" input's `onChange`), merge: `const merged = [...data.photoFiles, ...newFiles]`.
- Type validation runs on **new files only** (`newFiles.find(f => !PHOTO_TYPES.includes(f.type))`). Existing files already passed validation — no need to re-check them.
- The 50 MB cap is checked against the **cumulative** merged total: `merged.reduce((sum, f) => sum + f.size, 0) > PHOTOS_MAX_TOTAL`.
- If validation passes, call `onChange({ ...data, photoFiles: merged })`.

### Validation
- Accepted types: `image/png`, `image/jpeg`, `image/webp`, `video/mp4`, `video/quicktime`.
- Max **cumulative** total size: 50 MB. Error shown below the grid.
- Drag-and-drop path uses the same type/size checks and error messages as the input-change path.

---

## Drag-and-drop implementation

Each zone has its own independent dragging state variable:
- `isFloorPlanDragging` — controls Zone 1 visual feedback.
- `isPhotosDragging` — controls Zone 2 visual feedback.

Both zones handle `onDragOver`, `onDragEnter`, `onDragLeave`, `onDrop`.

`onDragLeave` must guard against child-element bubbling:
```ts
onDragLeave={(e) => {
  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
    setIsFloorPlanDragging(false)
  }
}}
```
Apply the same pattern for Zone 2 with `setIsPhotosDragging`.

---

## Out of scope
- Loading/processing state while files are being added (no spinner or skeleton).
- Image thumbnail generation progress indicators.

---

## No changes to
- `useImageUpload` hook — only `fileInputRef` and `handleThumbnailClick` are used; `handleFileChange`, `handleRemove`, and `previewUrl` from the hook are no longer called or read
- `Step2Data` type
- Navigation buttons
- Other fields (room type chips, area textarea)
