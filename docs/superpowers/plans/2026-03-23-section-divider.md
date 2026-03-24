# Section Divider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `<SectionDivider />` component — a 176px walnut gradient-fade line with a Framer Motion entrance animation — and place it between sections on all pages of the site.

**Architecture:** A single client component (`src/components/SectionDivider.tsx`) is imported and placed manually between sections in each page file. It replaces existing `border-t border-stone` separators where they appear at the section level. The blog page filter bar's `mb-16` is removed to avoid double-spacing when the divider is inserted.

**Tech Stack:** React, Next.js App Router, Framer Motion (already installed), Tailwind CSS v4, Jest + Testing Library.

---

## File Map

| Action | File | What changes |
|--------|------|--------------|
| Create | `src/components/SectionDivider.tsx` | New component |
| Create | `src/components/__tests__/SectionDivider.test.tsx` | Component tests |
| Modify | `src/app/[locale]/page.tsx` | Add 2 dividers, remove `border-t border-stone` from Blog Teaser (line 165) |
| Modify | `src/app/[locale]/projetos/page.tsx` | Add 2 dividers, remove `border-t border-stone` from CTA (line 108) |
| Modify | `src/app/[locale]/residencial/page.tsx` | Add 2 dividers, remove `border-t border-stone` from CTA (line 107) |
| Modify | `src/app/[locale]/comercial/page.tsx` | Add 2 dividers, remove `border-t border-stone` from CTA (line 107) |
| Modify | `src/app/[locale]/design-de-interiores/page.tsx` | Add 2 dividers, remove `border-t border-stone` from CTA (line 118) |
| Modify | `src/app/[locale]/servicos/page.tsx` | Add 1 divider between h1 and services grid |
| Modify | `src/app/[locale]/blog/page.tsx` | Add 1 divider between filter bar and grid, remove `mb-16` from filter bar (line 51) |

---

## Task 1: Create the SectionDivider component (TDD)

**Files:**
- Create: `src/components/__tests__/SectionDivider.test.tsx`
- Create: `src/components/SectionDivider.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/SectionDivider.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { SectionDivider } from '../SectionDivider'

// Framer Motion uses browser APIs not available in jsdom — mock it
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}))

describe('SectionDivider', () => {
  it('renders a decorative span element', () => {
    const { container } = render(<SectionDivider />)
    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
  })

  it('applies the walnut gradient classes to the span', () => {
    const { container } = render(<SectionDivider />)
    const span = container.querySelector('span')
    expect(span?.className).toContain('via-walnut')
    expect(span?.className).toContain('bg-gradient-to-r')
  })

  it('accepts and applies a custom className to the wrapper', () => {
    const { container } = render(<SectionDivider className="my-custom" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper?.className).toContain('my-custom')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx jest src/components/__tests__/SectionDivider.test.tsx --no-coverage
```

Expected: FAIL — `Cannot find module '../SectionDivider'`

- [ ] **Step 3: Create the component**

Create `src/components/SectionDivider.tsx`:

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

- [ ] **Step 4: Run test to confirm it passes**

```bash
npx jest src/components/__tests__/SectionDivider.test.tsx --no-coverage
```

Expected: PASS — 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionDivider.tsx src/components/__tests__/SectionDivider.test.tsx
git commit -m "feat(ui): add SectionDivider component with Framer Motion entrance animation"
```

---

## Task 2: Update homepage

**File:** `src/app/[locale]/page.tsx`

Three changes:
1. Import `SectionDivider`
2. Add divider between Specialties section (ends line 144) and About Teaser (line 147)
3. Add divider between About Teaser (ends line 162) and Blog Teaser (line 165), removing `border-t border-stone` from the Blog Teaser section

- [ ] **Step 1: Add the import**

At the top of `src/app/[locale]/page.tsx`, after the existing imports, add:

```tsx
import { SectionDivider } from '@/components/SectionDivider'
```

- [ ] **Step 2: Add first divider — between Specialties and About Teaser**

After the closing `</section>` of the Specialties section (line 144), before `{/* About Teaser */}`, insert:

```tsx
      <SectionDivider />
```

- [ ] **Step 3: Add second divider and fix Blog Teaser border**

After the closing `</section>` of the About Teaser (line 162), before `{/* Blog Teaser */}`, insert:

```tsx
      <SectionDivider />
```

Then change the Blog Teaser section opening from:

```tsx
      <section className="border-t border-stone py-20">
```

to:

```tsx
      <section className="py-20">
```

- [ ] **Step 4: Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:3000/pt` and scroll through. Confirm two gradient lines appear with the expand+fade animation between the three sections.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(home): add SectionDivider between Specialties, About, and Blog sections"
```

---

## Task 3: Update projetos page

**File:** `src/app/[locale]/projetos/page.tsx`

Three changes:
1. Import `SectionDivider`
2. Add divider between Hero (ends line 48) and Section 1 (line 51)
3. Add divider between Section 2 (ends line 105) and CTA (line 108), removing `border-t border-stone` from CTA

- [ ] **Step 1: Add the import**

```tsx
import { SectionDivider } from '@/components/SectionDivider'
```

- [ ] **Step 2: Add divider after hero**

After the closing `</section>` of the Hero (line 48), before `{/* ── Seção 1 */}`, insert:

```tsx
      <SectionDivider />
```

- [ ] **Step 3: Add divider before CTA and remove the border**

After the closing `</section>` of Section 2 (line 105), before `{/* ── CTA */}`, insert:

```tsx
      <SectionDivider />
```

Then change the CTA section opening from:

```tsx
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center border-t border-stone">
```

to:

```tsx
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
```

- [ ] **Step 4: Verify**

Open `http://localhost:3000/pt/projetos` and confirm two dividers appear.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/projetos/page.tsx
git commit -m "feat(projetos): add SectionDivider between hero, content sections, and CTA"
```

---

## Task 4: Update residencial, comercial, and design-de-interiores pages

These three pages share an identical structure (Hero → Section 1 → Section 2 → CTA with `border-t border-stone`). Apply the same three-step change to each.

**Files:**
- `src/app/[locale]/residencial/page.tsx`
- `src/app/[locale]/comercial/page.tsx`
- `src/app/[locale]/design-de-interiores/page.tsx`

- [ ] **Step 1: residencial — add import, two dividers, remove border**

In `src/app/[locale]/residencial/page.tsx`:

Add import:
```tsx
import { SectionDivider } from '@/components/SectionDivider'
```

After Hero `</section>` (line 48), insert `<SectionDivider />`.

After Section 2 `</section>` (line 104), insert `<SectionDivider />`.

Change CTA section (line 107) from:
```tsx
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center border-t border-stone">
```
to:
```tsx
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
```

- [ ] **Step 2: comercial — same changes**

In `src/app/[locale]/comercial/page.tsx`:

Add import, insert `<SectionDivider />` after Hero (line 48), insert `<SectionDivider />` after Section 2 (line 104), remove `border-t border-stone` from CTA (line 107).

- [ ] **Step 3: design-de-interiores — same changes**

In `src/app/[locale]/design-de-interiores/page.tsx`:

Add import, insert `<SectionDivider />` after Hero (line 51), insert `<SectionDivider />` after Section 2 (line 115), remove `border-t border-stone` from CTA (line 118).

- [ ] **Step 4: Verify all three pages**

Open and scroll:
- `http://localhost:3000/pt/residencial`
- `http://localhost:3000/pt/comercial`
- `http://localhost:3000/pt/design-de-interiores`

Confirm two dividers appear on each, no leftover hard border on the CTA.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/residencial/page.tsx src/app/[locale]/comercial/page.tsx src/app/[locale]/design-de-interiores/page.tsx
git commit -m "feat(pages): add SectionDivider to residencial, comercial, and design-de-interiores"
```

---

## Task 5: Update serviços page

**File:** `src/app/[locale]/servicos/page.tsx`

One divider between the `h1` heading and the services grid.

- [ ] **Step 1: Add import**

```tsx
import { SectionDivider } from '@/components/SectionDivider'
```

- [ ] **Step 2: Insert divider**

The current structure inside the `return` is:

```tsx
    <div className="mx-auto max-w-5xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
        {t('title')}
      </h1>
      <div className="grid grid-cols-1 gap-px bg-sage md:grid-cols-2">
```

Change to:

```tsx
    <div className="mx-auto max-w-5xl px-6 py-32">
      <h1 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
        {t('title')}
      </h1>
      <SectionDivider />
      <div className="grid grid-cols-1 gap-px bg-sage md:grid-cols-2">
```

- [ ] **Step 3: Verify**

Open `http://localhost:3000/pt/servicos`. Confirm the divider appears between the heading and the grid.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/servicos/page.tsx
git commit -m "feat(servicos): add SectionDivider between page heading and services grid"
```

---

## Task 6: Update blog listing page

**File:** `src/app/[locale]/blog/page.tsx`

One divider between the category filter bar and the post grid. The filter bar's `mb-16` (line 51) must be removed to avoid double-spacing.

- [ ] **Step 1: Add import**

```tsx
import { SectionDivider } from '@/components/SectionDivider'
```

- [ ] **Step 2: Remove mb-16 from filter bar and insert divider**

Change the filter bar div opening (line 51) from:

```tsx
      <div className="flex flex-wrap gap-3 mb-16">
```

to:

```tsx
      <div className="flex flex-wrap gap-3">
```

Then after the closing `</div>` of the filter bar (line 75) and before the grid `<div className="grid ...">` (line 78), insert:

```tsx
      <SectionDivider />
```

- [ ] **Step 3: Verify**

Open `http://localhost:3000/pt/blog`. Confirm the divider appears between the filter buttons and the post list, and the spacing looks balanced (not too wide, not too tight).

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/blog/page.tsx
git commit -m "feat(blog): add SectionDivider between category filter and post grid"
```

---

## Task 7: Full verification and cleanup

- [ ] **Step 1: Run all tests**

```bash
npm run test
```

Expected: All tests pass including the new `SectionDivider.test.tsx`.

- [ ] **Step 2: Run the linter**

```bash
npm run lint
```

Expected: No warnings or errors.

- [ ] **Step 3: Run a production build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Cross-page visual check**

With dev server running, visit every modified page and confirm:
- The gradient line appears with the expand+fade animation on scroll
- Animation fires only once — scrolling back up and down does not re-trigger it
- On a narrow mobile viewport (375px), the line is centered and not overflowing
- No page has an orphaned `border-t border-stone` where it was supposed to be replaced

- [ ] **Step 5: Final commit (if any cleanup was needed)**

```bash
git add -p   # stage only intentional changes
git commit -m "chore: final cleanup after SectionDivider rollout"
```
