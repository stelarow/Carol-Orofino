# Design: Gallery Section — Inspire-se Page

**Date:** 2026-03-25
**Scope:** Replace Section 1 of `/inspire-se` with a feature gallery layout.

---

## Goal

Replace the current first content section ("Do conceito à entrega" — text + image side-by-side) in `src/app/[locale]/inspire-se/page.tsx` with an editorial gallery block. The hero and Section 2 remain untouched.

---

## Layout

### Desktop

```
┌──────────────────────┬──┬──┬──┬──┬──┬──┐
│                      │  │  │  │  │  │  │
│   Featured Image     │C1│C2│C3│C4│C5│C6│
│   (user's 1:1 photo) │  │  │  │  │  │  │
│  ┌──────────────────┐│  │  │  │  │  │  │
│  │ Label overlay    ││  │  │  │  │  │  │
│  └──────────────────┘└──┴──┴──┴──┴──┴──┘
└──────────────────────┘
```

- Container: full-width, no horizontal padding
- Featured image: ~60% width, fixed height (`h-[500px]` desktop), `object-cover`
- 6 color strips: remaining ~40% width, divided equally, full height of container
- Label overlay: absolute, bottom-left of featured image — semi-transparent dark background, Cormorant Garamond display font, white text

### Mobile

- Featured image: full width, `h-[280px]`
- 6 color strips: single horizontal row below the image, each `flex-1`, `h-20`

---

## Colors (strips, left to right)

| Strip | Hex |
|-------|-----|
| 1 | `#D9D9D9` |
| 2 | `#F5F5DC` |
| 3 | `#2B2B2B` |
| 4 | `#FFFFFF` |
| 5 | `#1C2A44` |
| 6 | `#EAE0D5` |

---

## Label Overlay

- Position: absolute bottom-left of featured image, `p-6`
- Background: `bg-black/40`
- Line 1: `font-body text-xs uppercase tracking-widest text-white/70` — "Carol Orofino"
- Line 2: `font-display text-2xl text-white tracking-wide` — "Design de Interiores"

---

## Image

- File to be provided by user (1:1 ratio photo)
- Final path: `public/images/inspire-se/gallery-featured.jpg`
- **Temporary placeholder while file is pending:** `/images/categories/design-interiores-01.jpg`
- Next.js `<Image>` with `fill` and `object-cover`
- `sizes="(max-width: 768px) 100vw, 60vw"`

---

## Container Structure

**Desktop (`md:`):**
- Outer section: `flex flex-row h-[500px] overflow-hidden w-full`
- Featured image wrapper: `relative flex-[6]` (≈60% width)
- Strips wrapper: `flex flex-row flex-[4]` (≈40% width)
- Each strip: `flex-1 h-full` with inline `backgroundColor`

**Mobile (default):**
- Outer section: `flex flex-col`
- Featured image wrapper: `relative w-full h-[280px]`
- Strips wrapper: `flex flex-row w-full`
- Each strip: `flex-1 h-20`

---

## SectionDivider

The `<SectionDivider />` currently between the Hero and Section 1 is **removed** — the gallery is edge-to-edge and the divider would visually conflict with the full-bleed layout.

---

## Implementation

- **File modified:** `src/app/[locale]/inspire-se/page.tsx`
- **No new component file needed** — the gallery block is self-contained within the page
- Section 1 (text + image) and the SectionDivider before it are removed entirely and replaced with the gallery block
- Section 2 and all other sections remain unchanged
- **Known locale gap:** label overlay text ("Carol Orofino" / "Design de Interiores") is hardcoded in PT for this test; i18n to be added later

---

## Out of Scope

- No interactivity (no hover effects on strips for now)
- No i18n changes (label text is static for this test)
- Section 2 ("Espaços que transformam") — untouched
