# Design: Subcategory Pages with Image Zoom

**Date:** 2026-03-16
**Project:** Carol Orofino — Interior Design Site (Next.js + next-intl)

---

## Overview

When a user clicks a category card on the homepage, they are taken to a dedicated subcategory page (e.g., `/pt/projetos/residencial`). The page displays exactly 2 manually chosen images in a 2-column grid. Clicking an image zooms it in-place with a CSS scale transition, clipped to its grid cell.

---

## Architecture

### New Files

| File | Type | Purpose |
|---|---|---|
| `src/app/[locale]/projetos/[categoria]/page.tsx` | Server Component | Subcategory page route |
| `src/components/CategoryGallery.tsx` | Client Component | 2-column grid with per-image zoom state |
| `src/data/categories.ts` | Data | Maps each category slug to exactly 2 chosen images |

### Modified Files

| File | Change |
|---|---|
| `src/app/[locale]/page.tsx` | Update 4 card `href` values from `?categoria=` query params to `/projetos/[categoria]` path segments |

---

## Data Structure (`categories.ts`)

Every entry in `categoryImages` must have **exactly 2** images — enforced by the tuple type:

```ts
export type CategorySlug = 'residencial' | 'comercial' | 'reforma' | 'design-de-interiores'

export interface CategoryImage {
  src: string
  alt: { pt: string; en: string; es: string }
}

// Tuple type guarantees exactly 2 images per category — TypeScript will error otherwise
export const categoryImages: Record<CategorySlug, [CategoryImage, CategoryImage]> = {
  residencial: [
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
  ],
  comercial: [
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
  ],
  reforma: [
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
  ],
  'design-de-interiores': [
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
    { src: '/images/...', alt: { pt: '...', en: '...', es: '...' } },
  ],
}
```

Image paths and alt texts to be filled by the client before implementation.

---

## Subcategory Page (`[categoria]/page.tsx`)

### `params` are a Promise (Next.js 15)
In Next.js 15, `params` is always a `Promise`. Both `generateMetadata` and the page component must `await params` before use:
```ts
const { locale, categoria } = await params
```

### `generateStaticParams`
Follows the exact same pattern as the existing `/projetos/[slug]/page.tsx`. Returns both `locale` and `categoria` — this is the correct pattern for nested dynamic routes where the parent `[locale]` segment does not own static params:
```ts
const KNOWN_SLUGS: CategorySlug[] = ['residencial', 'comercial', 'reforma', 'design-de-interiores']

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    KNOWN_SLUGS.map((categoria) => ({ locale, categoria }))
  )
}
```

### `generateMetadata`
```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categoria: string }>
}): Promise<Metadata> {
  const { locale, categoria } = await params
  if (!KNOWN_SLUGS.includes(categoria as CategorySlug)) return {}
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: `${t(categoria)} — Carol Orofino` }
}
```

### Page component
```ts
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoria: string }>
}) {
  const { locale, categoria } = await params
  if (!KNOWN_SLUGS.includes(categoria as CategorySlug)) notFound()
  const t = await getTranslations({ locale, namespace: 'home' })
  const images = categoryImages[categoria as CategorySlug]
  // render...
}
```

Renders:
1. Category title — `t(categoria)` from `home` namespace, uppercase, `font-display`, centered
2. Back link `← Início` to `/${locale}` (homepage), hardcoded label
3. `<CategoryGallery images={images} locale={locale as Locale} />`

---

## CategoryGallery Component

```ts
'use client'
import { useState } from 'react'
import Image from 'next/image'
import { type Locale } from '@/lib/i18n'
import { type CategoryImage } from '@/data/categories'

interface Props {
  images: [CategoryImage, CategoryImage]
  locale: Locale
}
```

- Two independent `useState<boolean>` hooks: `zoomed0` and `zoomed1`
- Both images can be zoomed simultaneously
- Alt text: `image.alt[locale] ?? image.alt.pt`

### Layout and Zoom
```tsx
<div className="grid grid-cols-2 w-full h-[60vh]">
  {[image0, image1].map((image, i) => {
    const zoomed = i === 0 ? zoomed0 : zoomed1
    const setZoomed = i === 0 ? setZoomed0 : setZoomed1
    return (
      <div
        key={i}
        className={`relative overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={image.src}
          alt={image.alt[locale] ?? image.alt.pt}
          fill
          className={`object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`}
        />
      </div>
    )
  })}
</div>
```

**Cursor classes:** `cursor-zoom-in` and `cursor-zoom-out` are first-class Tailwind v3 utility classes (not arbitrary values). Do NOT use `cursor-[zoom-in]` syntax.

**Scale classes:** `scale-100` and `scale-150` written as full literal strings in the ternary — Tailwind's JIT detects both branches as-written.

**`overflow-hidden`** on each cell intentionally clips the scaled image at the cell boundary — this is the desired "zoom in place" visual.

---

## Homepage Card Links

Change the 4 `<Link href>` values in `src/app/[locale]/page.tsx`:

| Before | After |
|---|---|
| `` `/${locale}/projetos?categoria=residencial` `` | `` `/${locale}/projetos/residencial` `` |
| `` `/${locale}/projetos?categoria=comercial` `` | `` `/${locale}/projetos/comercial` `` |
| `` `/${locale}/projetos?categoria=reforma` `` | `` `/${locale}/projetos/reforma` `` |
| `` `/${locale}/projetos?categoria=design-de-interiores` `` | `` `/${locale}/projetos/design-de-interiores` `` |

Same `next/link` `<Link>` component and template literal pattern — no import changes needed.

---

## Out of Scope

- No changes to the existing `/projetos` or `/projetos/[slug]` pages
- No lightbox, modal, or navigation triggered by zoom
- No new npm dependencies
