# Subcategory Pages with Image Zoom — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dedicated subcategory pages (`/[locale]/projetos/[categoria]`) reachable from homepage category cards, each showing 2 images side-by-side with a CSS zoom-on-click effect.

**Architecture:** Create a `categories.ts` data file with placeholder image paths, a `CategoryGallery` client component for the 2-column zoom grid, and a `[categoria]/page.tsx` dynamic route. Only after the route exists, update the 4 homepage card links. No changes to existing `/projetos` or `/projetos/[slug]` pages.

**Tech Stack:** Next.js 15 (App Router), next-intl, Tailwind CSS v3, TypeScript

**Note on route conflict:** The existing `src/app/[locale]/projetos/[slug]/page.tsx` handles individual project detail pages. The new `[categoria]/page.tsx` adds a parallel dynamic segment for category pages. Next.js resolves this correctly since both are `[locale]/projetos/[param]` — the new page handles the 4 known category slugs (validated by `KNOWN_SLUGS`) and returns `notFound()` for all others.

---

## Chunk 1: Data and CategoryGallery component

### Task 1: Create `categories.ts` data file

**Files:**
- Create: `src/data/categories.ts`

- [ ] **Step 1: Create the file**

```ts
// src/data/categories.ts

export type CategorySlug =
  | 'residencial'
  | 'comercial'
  | 'reforma'
  | 'design-de-interiores'

export interface CategoryImage {
  src: string
  alt: { pt: string; en: string; es: string }
}

// Typed as readonly CategorySlug[] so it can be used directly in generateStaticParams
export const KNOWN_SLUGS: readonly CategorySlug[] = [
  'residencial',
  'comercial',
  'reforma',
  'design-de-interiores',
]

// Each entry has EXACTLY 2 images — enforced by the tuple type [CategoryImage, CategoryImage].
// Replace placeholder paths and alt texts with real content when provided by client.
export const categoryImages: Record<CategorySlug, [CategoryImage, CategoryImage]> = {
  residencial: [
    {
      src: '/images/categories/residencial-01.jpg',
      alt: {
        pt: 'Projeto residencial 1',
        en: 'Residential project 1',
        es: 'Proyecto residencial 1',
      },
    },
    {
      src: '/images/categories/residencial-02.jpg',
      alt: {
        pt: 'Projeto residencial 2',
        en: 'Residential project 2',
        es: 'Proyecto residencial 2',
      },
    },
  ],
  comercial: [
    {
      src: '/images/categories/comercial-01.jpg',
      alt: {
        pt: 'Projeto comercial 1',
        en: 'Commercial project 1',
        es: 'Proyecto comercial 1',
      },
    },
    {
      src: '/images/categories/comercial-02.jpg',
      alt: {
        pt: 'Projeto comercial 2',
        en: 'Commercial project 2',
        es: 'Proyecto comercial 2',
      },
    },
  ],
  reforma: [
    {
      src: '/images/categories/reforma-01.jpg',
      alt: {
        pt: 'Reforma 1',
        en: 'Renovation 1',
        es: 'Reforma 1',
      },
    },
    {
      src: '/images/categories/reforma-02.jpg',
      alt: {
        pt: 'Reforma 2',
        en: 'Renovation 2',
        es: 'Reforma 2',
      },
    },
  ],
  'design-de-interiores': [
    {
      src: '/images/categories/design-interiores-01.jpg',
      alt: {
        pt: 'Design de interiores 1',
        en: 'Interior design 1',
        es: 'Diseño de interiores 1',
      },
    },
    {
      src: '/images/categories/design-interiores-02.jpg',
      alt: {
        pt: 'Design de interiores 2',
        en: 'Interior design 2',
        es: 'Diseño de interiores 2',
      },
    },
  ],
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Site carol\carol-orofino" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/categories.ts
git commit -m "feat: add categories data file with placeholder image paths"
```

---

### Task 2: Create `CategoryGallery` client component

**Files:**
- Create: `src/components/CategoryGallery.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/CategoryGallery.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type Locale } from '@/lib/i18n'
import { type CategoryImage } from '@/data/categories'

interface Props {
  images: [CategoryImage, CategoryImage]
  locale: Locale
}

export default function CategoryGallery({ images, locale }: Props) {
  const [zoomed0, setZoomed0] = useState(false)
  const [zoomed1, setZoomed1] = useState(false)

  const zoomedStates = [zoomed0, zoomed1]
  const setters = [setZoomed0, setZoomed1]

  return (
    <div className="grid grid-cols-2 w-full h-[60vh]">
      {images.map((image, i) => {
        const zoomed = zoomedStates[i]
        const setZoomed = setters[i]
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
              sizes="50vw"
              className={`object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`}
            />
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Site carol\carol-orofino" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CategoryGallery.tsx
git commit -m "feat: add CategoryGallery component with per-image CSS zoom"
```

---

## Chunk 2: Subcategory page route and homepage links

### Task 3: Create `[categoria]/page.tsx`

**Files:**
- Create: `src/app/[locale]/projetos/[categoria]/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
// src/app/[locale]/projetos/[categoria]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { routing, type Locale } from '@/lib/i18n'
import { categoryImages, KNOWN_SLUGS, type CategorySlug } from '@/data/categories'
import CategoryGallery from '@/components/CategoryGallery'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    KNOWN_SLUGS.map((categoria) => ({ locale, categoria }))
  )
}

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoria: string }>
}) {
  const { locale, categoria } = await params

  if (!KNOWN_SLUGS.includes(categoria as CategorySlug)) notFound()

  const t = await getTranslations({ locale, namespace: 'home' })
  const images = categoryImages[categoria as CategorySlug]

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="text-center mb-10 px-6">
        <Link
          href={`/${locale}`}
          className="font-body text-xs uppercase tracking-widest text-text-primary/50 hover:text-primary transition-colors"
        >
          ← Início
        </Link>
        <h1 className="font-display text-4xl md:text-5xl tracking-[0.15em] uppercase text-text-primary mt-4">
          {t(categoria)}
        </h1>
        <div className="mx-auto mt-3 h-px w-10 bg-primary" />
      </div>

      {/* Gallery */}
      <CategoryGallery images={images} locale={locale as Locale} />
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Site carol\carol-orofino" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/projetos/[categoria]/page.tsx
git commit -m "feat: add subcategory page route with image gallery"
```

---

### Task 4: Update homepage card links

**Files:**
- Modify: `src/app/[locale]/page.tsx`

This task runs AFTER Task 3 — the subcategory route must exist before the links are updated, otherwise the links lead to the existing `[slug]` handler which returns 404 for category names.

- [ ] **Step 1: Update the 4 Link hrefs**

In `src/app/[locale]/page.tsx`, find and replace the `href` on each of the 4 category `<Link>` elements:

| Find (exact string) | Replace with |
|---|---|
| `` `/${locale}/projetos?categoria=residencial` `` | `` `/${locale}/projetos/residencial` `` |
| `` `/${locale}/projetos?categoria=comercial` `` | `` `/${locale}/projetos/comercial` `` |
| `` `/${locale}/projetos?categoria=reforma` `` | `` `/${locale}/projetos/reforma` `` |
| `` `/${locale}/projetos?categoria=design-de-interiores` `` | `` `/${locale}/projetos/design-de-interiores` `` |

No other changes to `page.tsx`.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Site carol\carol-orofino" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Start dev server and manually test end-to-end**

```bash
cd "C:\Site carol\carol-orofino" && npm run dev
```

Visit in browser and verify each item:

- `http://localhost:3000/pt` — homepage cards click through to subcategory pages (not the old projects list)
- `http://localhost:3000/pt/projetos/residencial` — shows title "Residencial" + 2 images side by side
- `http://localhost:3000/pt/projetos/comercial` — shows title "Comercial" + 2 images
- `http://localhost:3000/pt/projetos/reforma` — shows title "Reforma" + 2 images
- `http://localhost:3000/pt/projetos/design-de-interiores` — shows title "Design de Interiores" + 2 images
- `http://localhost:3000/pt/projetos/inexistente` — shows 404 page
- `http://localhost:3000/pt/projetos/apartamento-jardins` — still works (existing project detail page unaffected)
- On any subcategory page: click an image → it zooms (`scale-150`); click again → it zooms out (`scale-100`)
- Both images on the same page can be zoomed at the same time

Note: Images will show broken until client provides real photos — that is expected.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: update homepage category cards to link to subcategory pages"
```

---

## After implementation

When the client provides the real images:

1. Copy image files to `public/images/categories/`
2. Update `src` and `alt` values in `src/data/categories.ts`
3. Commit: `git commit -m "content: add category images"`
