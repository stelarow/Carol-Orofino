# Section Divider — Design Spec

**Date:** 2026-03-23
**Status:** Approved

---

## Context

The site currently lacks visual separation between page sections. The only existing divider is a plain `border-t border-stone` used sporadically (blog teaser on homepage, blog sidebar). This leaves most section transitions feeling abrupt and inconsistent, especially on a luxury brand site that should feel deliberate and refined.

The goal is to introduce a single elegant separator element used consistently across all pages — inspired by luxury editorial design, aligned with the site's Scandinavian warm palette.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Style | Gradient fade line | Soft, organic — appears and disappears at edges. More refined than a hard line. |
| Color | `--color-walnut` (`#86725a`) | Direct palette token — safer than semantic alias in Tailwind v4 gradients. Same visual result. |
| Width | 176px (`w-44`) | Long enough to be intentional, short enough to feel elegant and centered. |
| Thickness | 1px | Hairline — present but never loud. |
| Spacing | `py-8` (32px top + bottom) | Balanced breathing room around the line. Not too tight, not editorial-sparse. |
| Animation | Framer Motion `whileInView` — expand from center + fade in | Subtle entrance that draws the eye gently. Fires once per page load. `transform-origin` is Framer Motion's default (center), which produces the correct expand-from-center behavior. |
| Approach | Single reusable component | Simplest path. Explicit control over placement. No magic or auto-injection. |

---

## Component Spec

**File:** `src/components/SectionDivider.tsx`

```tsx
'use client'

import { motion } from 'framer-motion'

interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.15 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}
      className={`flex justify-center py-8 ${className ?? ''}`}
    >
      <span className="block h-px w-44 bg-gradient-to-r from-transparent via-walnut to-transparent" />
    </motion.div>
  )
}
```

**Notes:**
- Uses `via-walnut` (direct `@theme` palette token) rather than `via-primary` (semantic alias) to ensure reliable gradient resolution in Tailwind v4.
- `'use client'` is required — Framer Motion cannot run in RSC.
- `viewport={{ once: true }}` prevents the animation re-firing on scroll-back.
- `className` prop allows spacing overrides for specific contexts.

---

## Placement — All Pages

### Homepage (`src/app/[locale]/page.tsx`)
- Between **Collections** section and **About Teaser** section
- Between **About Teaser** section and **Blog Teaser** section
- Remove existing `border-t border-stone` from Blog Teaser (replace with component)

### Blog listing (`src/app/[locale]/blog/page.tsx`)
- Between the **category filter bar** and the **post grid**
- Remove `mb-16` from the filter bar `div` when adding the divider (the `py-8` from the component provides the spacing — stacking both would create ~96px gap)

### Projetos (`src/app/[locale]/projetos/page.tsx`)
- Between the **hero** and the **alternating sections**
- Between the last content block and the **CTA**
- Remove existing `border-t border-stone` on the CTA section if present

### Serviços (`src/app/[locale]/servicos/page.tsx`)
- Between the **page header** and the **services grid**
- The grid's internal `gap-px` separators between items remain untouched

### Residencial (`src/app/[locale]/residencial/page.tsx`)
- Between the **hero/intro** and the **main content**
- Between the last content block and the **CTA** (replaces existing `border-t border-stone`)

### Comercial (`src/app/[locale]/comercial/page.tsx`)
- Between the **hero/intro** and the **main content**
- Between the last content block and the **CTA** (replaces existing `border-t border-stone`)

### Design de Interiores (`src/app/[locale]/design-de-interiores/page.tsx`)
- Between the **hero/intro** and the **main content**
- Between the last content block and the **CTA** (replaces existing `border-t border-stone`)

### Sobre (`src/app/[locale]/sobre/page.tsx`)
- **No divider for now.** Current content is a single cohesive block with no meaningful section break. Revisit if a timeline, credentials section, or second major block is added.

---

## What Changes

**New file:**
- `src/components/SectionDivider.tsx`

**Modified files:**
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/blog/page.tsx`
- `src/app/[locale]/projetos/page.tsx`
- `src/app/[locale]/servicos/page.tsx`
- `src/app/[locale]/residencial/page.tsx`
- `src/app/[locale]/comercial/page.tsx`
- `src/app/[locale]/design-de-interiores/page.tsx`

**No changes to:** `globals.css`, Tailwind config, Navbar, Footer, `sobre/page.tsx`.

---

## Verification

1. Run `npm run dev` and visit each modified page
2. Scroll through to confirm separators appear with the expand+fade animation
3. Confirm animation fires once and does not repeat on scroll-back
4. Check mobile — line should be centered and not overflow horizontally on small screens
5. Confirm the blog filter bar spacing feels right after removing `mb-16`
6. Run `npm run build` to confirm no TypeScript errors
7. Run `npm run lint` to confirm no lint warnings
